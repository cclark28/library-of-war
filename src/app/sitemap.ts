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
    // Dedicated era pages — canonical URLs, slugs match article `era` field exactly
    { url: `${BASE}/era/world-war-ii`,              changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE}/era/world-war-i`,               changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE}/era/cold-war`,                  changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/era/vietnam-war`,               changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/era/korean-war`,                changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/era/modern-conflicts`,          changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/era/napoleonic-wars`,           changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/era/american-civil-war`,        changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/era/ancient-medieval`,          changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE}/era/early-modern`,              changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/era/technology-weapons`,        changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/era/intelligence-special-ops`,  changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/era/black-projects`,            changeFrequency: 'weekly', priority: 0.65 },
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
