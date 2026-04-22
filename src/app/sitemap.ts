import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const BASE = 'https://libraryofwar.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, seriesList] = await Promise.all([
    client.fetch<Array<{ slug: string; publishedAt?: string }>>(
      `*[_type == "article" && status == "published"] | order(publishedAt desc) {
        "slug": slug.current, publishedAt
      }`
    ).catch(() => []),
    client.fetch<Array<{ slug: string }>>(
      `*[_type == "series"] { "slug": slug.current }`
    ).catch(() => []),
  ])

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/browse`,         lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/series`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/id-drill`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/resources`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Era browse pages
    { url: `${BASE}/browse?era=world-war-i`,      changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/browse?era=world-war-ii`,     changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/browse?era=korean-war`,       changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/browse?era=vietnam-war`,      changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/browse?era=cold-war`,         changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/browse?era=modern-conflicts`, changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/browse?era=ancient-medieval`, changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/browse?era=napoleonic`,       changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/browse?era=civil-war`,        changeFrequency: 'weekly', priority: 0.65 },
  ]

  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const seriesPages: MetadataRoute.Sitemap = seriesList.map(s => ({
    url: `${BASE}/series/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...seriesPages]
}
