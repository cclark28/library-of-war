export const runtime = 'edge'

const ALLOWED_ORIGINS = [
  'https://upload.wikimedia.org/',
  'https://commons.wikimedia.org/',
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl || !ALLOWED_ORIGINS.some(o => imageUrl.startsWith(o))) {
    return new Response('Bad request', { status: 400 })
  }

  let response: Response
  try {
    response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'LibraryOfWar/1.0 (https://libraryofwar.com; educational use, public domain images)',
        'Accept': 'image/webp,image/jpeg,image/png,image/*',
      },
    })
  } catch {
    return new Response('Upstream fetch failed', { status: 502 })
  }

  if (!response.ok) {
    return new Response(`Upstream error: ${response.status}`, { status: response.status })
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const body = await response.arrayBuffer()

  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
