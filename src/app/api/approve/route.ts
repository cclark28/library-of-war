import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

async function verifyToken(token: string): Promise<string | null> {
  const [draftId, signature] = token.split(':')
  if (!draftId || !signature) return null

  const secret = process.env.APPROVAL_TOKEN_SECRET || 'default-secret-change-me'
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(draftId))
  const expectedHex = Array.from(new Uint8Array(expectedSig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  if (signature === expectedHex) {
    return draftId
  }
  return null
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Approval Link Invalid</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
          .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; }
          h1 { margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Missing approval link</h1>
          <p>Please use the approval link from your email to publish this submission.</p>
        </div>
      </body>
      </html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  try {
    const draftId = await verifyToken(token)

    if (!draftId) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Approval Link Invalid</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
            .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Approval link invalid or expired</h1>
            <p>The approval link is invalid or has expired. Please use a fresh link from the submission email.</p>
          </div>
        </body>
        </html>`,
        { status: 403, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Sanity config
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    const writeToken = process.env.SANITY_WRITE_TOKEN

    if (!projectId || !writeToken) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Server Error</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
            .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>⚠️ Server not configured</h1>
            <p>Sanity environment variables are missing.</p>
          </div>
        </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Fetch the draft document
    const fetchRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/data/doc/${dataset}/${draftId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${writeToken}`,
        },
      }
    )

    if (!fetchRes.ok) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Submission Not Found</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
            .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Submission not found</h1>
            <p>The submission could not be found or has already been processed.</p>
          </div>
        </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const draftDoc = await fetchRes.json()

    // Publish by creating a public document (remove drafts. prefix)
    const publishedId = draftId.replace('drafts.', '')
    const publishedDoc = {
      ...draftDoc,
      _id: publishedId,
      status: 'approved',
      approvedAt: new Date().toISOString(),
    }

    const pubRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${writeToken}`,
        },
        body: JSON.stringify({
          mutations: [
            { createOrReplace: publishedDoc },
            { delete: { id: draftId } }, // Clean up draft
          ],
        }),
      }
    )

    if (!pubRes.ok) {
      const err = await pubRes.text()
      console.error('Publish failed:', pubRes.status, err)
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Publish Failed</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
            .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; }
            h1 { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>⚠️ Publish failed</h1>
            <p>The submission could not be published. Please try again or contact support.</p>
          </div>
        </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Success
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Submission Approved ✓</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
          .success { background: #F0F9F0; border-left: 4px solid #2d5016; padding: 20px; border-radius: 4px; }
          h1 { margin-top: 0; color: #2d5016; }
          p { line-height: 1.6; }
          a { color: #8B1A1A; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="success">
          <h1>✓ Submission approved & published</h1>
          <p>The submission has been published to UFOCosmos. It will appear on the site within a few minutes as the cache refreshes.</p>
          <p><a href="https://www.ufocosmos.com/">← Return to UFOCosmos</a></p>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    console.error('Approval error:', err)
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Georgia, serif; max-width: 600px; margin: 60px auto; padding: 20px; color: #0F0E0C; }
          .error { background: #FFF5F5; border-left: 4px solid #8B1A1A; padding: 20px; border-radius: 4px; }
          h1 { margin-top: 0; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>⚠️ An error occurred</h1>
          <p>Please try again later.</p>
        </div>
      </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}
