import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const INDEXNOW_KEY = 'a7f3b2e8c4d91f6a3e5b8c2d4f7a9b1e'
const SITE_URL     = 'https://libraryofwar.com'

// Sanity sends a secret header so only real Sanity webhooks are processed
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? ''

export async function POST(req: NextRequest) {
  // Verify the webhook secret
  const secret = req.headers.get('sanity-webhook-secret') ?? ''
  if (SANITY_WEBHOOK_SECRET && secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only index published articles and series pages
  const type  = body._type as string | undefined
  const slug  = (body.slug as { current?: string } | undefined)?.current
  const status = body.status as string | undefined

  if (!slug) {
    return NextResponse.json({ ok: true, skipped: 'no slug' })
  }
  if (type === 'article' && status !== 'published') {
    return NextResponse.json({ ok: true, skipped: 'not published' })
  }

  // Build the canonical URL for this document
  const pageUrl = type === 'series'
    ? `${SITE_URL}/series/${slug}/`
    : `${SITE_URL}/articles/${slug}/`

  const payload = {
    host:        'libraryofwar.com',
    key:         INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList:     [pageUrl],
  }

  // Submit to IndexNow — covers Bing, Yandex, Seznam, Naver simultaneously
  const results = await Promise.allSettled([
    fetch('https://api.indexnow.org/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify(payload),
    }),
    fetch('https://www.bing.com/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify(payload),
    }),
  ])

  const statuses = results.map(r =>
    r.status === 'fulfilled' ? r.value.status : `error: ${r.reason}`
  )

  return NextResponse.json({ ok: true, url: pageUrl, indexnow: statuses })
}

// Serve the key file for ownership verification
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
