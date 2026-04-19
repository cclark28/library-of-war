import { client, articlesQuery } from '@/lib/sanity'

export const revalidate = 3600 // revalidate every hour

const SITE_URL = 'https://libraryofwar.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
}

export async function GET() {
  const articles: Article[] = await client.fetch(articlesQuery).catch(() => [])

  const items = articles
    .filter((a) => a.publishedAt)
    .map((a) => {
      const url = `${SITE_URL}/articles/${a.slug.current}`
      const title = escapeXml(a.title ?? '')
      const description = escapeXml(a.excerpt ?? '')
      const pubDate = new Date(a.publishedAt!).toUTCString()
      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join('')

  const latestDate = articles.find((a) => a.publishedAt)?.publishedAt
    ? new Date(articles.find((a) => a.publishedAt)!.publishedAt!).toUTCString()
    : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Library of War</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml" />
    <description>Editorial military history archive. Every claim cited. Every fact verifiable.</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <ttl>60</ttl>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
