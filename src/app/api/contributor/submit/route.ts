import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ALERT_EMAIL = 'charlieclark@gmail.com'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────────
  const submittedPassword = request.headers.get('X-Contributor-Password')
  const correctPassword = process.env.CONTRIBUTOR_PASSWORD

  if (!correctPassword || submittedPassword !== correctPassword) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  // ── Parse form data ───────────────────────────────────────────────────────────
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ message: 'Invalid form data.' }, { status: 400 })
  }

  // ── Honeypot ──────────────────────────────────────────────────────────────────
  const honeypot = formData.get('website')
  if (honeypot) {
    // Silently accept — the bot thinks it worked
    return NextResponse.json({ ok: true })
  }

  // ── Timing check ─────────────────────────────────────────────────────────────
  const loadTime = Number(formData.get('loadTime') ?? 0)
  if (loadTime > 0 && Date.now() - loadTime < 2000) {
    return NextResponse.json({ message: 'Submission rejected.' }, { status: 429 })
  }

  // ── Extract fields ────────────────────────────────────────────────────────────
  const name    = String(formData.get('name')    ?? '').trim()
  const email   = String(formData.get('email')   ?? '').trim()
  const title   = String(formData.get('title')   ?? '').trim()
  const series  = String(formData.get('series')  ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const imageFile = formData.get('image') as File | null

  if (!name || !title || !content) {
    return NextResponse.json(
      { message: 'Name, title, and content are required.' },
      { status: 400 }
    )
  }

  if (content.length < 200) {
    return NextResponse.json(
      { message: 'Article content is too short.' },
      { status: 400 }
    )
  }

  // ── Sanity config ─────────────────────────────────────────────────────────────
  const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const writeToken = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !writeToken) {
    console.error('Sanity env vars missing.')
    return NextResponse.json({ message: 'Server not configured.' }, { status: 500 })
  }

  // ── Upload image ──────────────────────────────────────────────────────────────
  let imageAssetRef: string | null = null

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { message: 'Image must be under 10 MB.' },
        { status: 400 }
      )
    }

    const mimeType = imageFile.type
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { message: 'Image must be JPG, PNG, or WebP.' },
        { status: 400 }
      )
    }

    try {
      const uploadRes = await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${writeToken}`,
            'Content-Type': mimeType,
          },
          body: imageFile,
        }
      )

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        imageAssetRef = uploadData?.document?._id ?? null
      } else {
        const err = await uploadRes.text()
        console.error('Sanity image upload failed:', uploadRes.status, err)
        // Non-fatal — continue without image
      }
    } catch (err) {
      console.error('Image upload exception:', err)
      // Non-fatal
    }
  }

  // ── Build draft document ──────────────────────────────────────────────────────
  const draftId = `drafts.contributor-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: Record<string, any> = {
    _id: draftId,
    _type: 'contributorSubmission',
    contributorName: name,
    contactEmail: email || undefined,
    articleTitle: title,
    content,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  }

  if (series) doc.series = series

  if (imageAssetRef) {
    doc.image = {
      _type: 'image',
      asset: { _type: 'reference', _ref: imageAssetRef },
    }
  }

  // ── Create Sanity draft ───────────────────────────────────────────────────────
  const mutationRes = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${writeToken}`,
      },
      body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
    }
  )

  if (!mutationRes.ok) {
    const err = await mutationRes.text()
    console.error('Sanity mutation error:', mutationRes.status, err)
    return NextResponse.json(
      { message: 'Failed to save your submission. Please try again.' },
      { status: 500 }
    )
  }

  // ── Email alert via Resend ────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY

  if (resendKey) {
    const seriesLine = series
      ? `<tr style="border-bottom:1px solid #C8B89A;">
           <td style="padding:10px 0;color:#888078;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;width:130px;">Series</td>
           <td style="padding:10px 0;color:#0F0E0C;font-size:15px;">${series}</td>
         </tr>`
      : ''

    const preview = content.length > 400
      ? content.slice(0, 400).trimEnd() + '…'
      : content

    const emailHtml = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;color:#0F0E0C;background:#FFFFFF;">
        <div style="border-top:2px solid #0F0E0C;border-bottom:1px solid #C8B89A;padding:12px 0;margin-bottom:32px;">
          <p style="margin:0;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#888078;">Library of War — Contributor Queue</p>
        </div>

        <h1 style="font-size:26px;font-weight:900;line-height:1.2;margin:0 0 6px;">New Submission</h1>
        <p style="font-size:14px;color:#888078;margin:0 0 32px;">${new Date().toUTCString()}</p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
          <tr style="border-bottom:1px solid #C8B89A;">
            <td style="padding:10px 0;color:#888078;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;width:130px;">Contributor</td>
            <td style="padding:10px 0;font-size:16px;font-weight:bold;">${name}</td>
          </tr>
          ${email ? `<tr style="border-bottom:1px solid #C8B89A;">
            <td style="padding:10px 0;color:#888078;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Email</td>
            <td style="padding:10px 0;font-size:15px;"><a href="mailto:${email}" style="color:#8B1A1A;">${email}</a></td>
          </tr>` : ''}
          <tr style="border-bottom:1px solid #C8B89A;">
            <td style="padding:10px 0;color:#888078;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">Title</td>
            <td style="padding:10px 0;font-size:16px;font-weight:bold;">${title}</td>
          </tr>
          ${seriesLine}
          <tr>
            <td style="padding:10px 0;color:#888078;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;vertical-align:top;">Preview</td>
            <td style="padding:10px 0;font-size:14px;line-height:1.8;color:#333;">${preview.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>

        <div style="background:#F5F3F0;border-left:3px solid #8B1A1A;padding:16px 20px;">
          <p style="margin:0;font-size:13px;line-height:1.6;">
            Review the full submission in <a href="https://www.sanity.io/manage" style="color:#8B1A1A;text-decoration:none;font-weight:bold;">Sanity Studio</a>
            under <strong>Contributor Submissions</strong>.
            ${imageAssetRef ? '<br><br>⬛ An image was uploaded with this submission.' : ''}
          </p>
        </div>

        <p style="font-size:11px;color:#C8B89A;margin-top:32px;letter-spacing:0.12em;">
          LIBRARY OF WAR · libraryofwar.com
        </p>
      </div>
    `

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Library of War <onboarding@resend.dev>',
          to: ALERT_EMAIL,
          subject: `📬 New Submission: ${title}`,
          html: emailHtml,
        }),
      })

      if (!emailRes.ok) {
        const err = await emailRes.text()
        console.error('Resend email failed:', emailRes.status, err)
        // Non-fatal — submission is already saved
      }
    } catch (err) {
      console.error('Email send exception:', err)
      // Non-fatal
    }
  } else {
    console.warn('RESEND_API_KEY not set — email alert skipped.')
  }

  return NextResponse.json({ ok: true })
}
