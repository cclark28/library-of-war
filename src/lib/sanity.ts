import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// CDN client — used for articles (near-instant cache invalidation on publish)
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

// Live client — bypasses CDN, used for siteSettings so section toggles
// and maintenance mode take effect within seconds of saving in Sanity Studio
export const liveClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── GROQ Queries ─────────────────────────────────────────────────────────────

export const articlesQuery = `
  *[_type == "article" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    voice,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    voice,
    excerpt,
    tags,
    mainImage { asset, alt, caption, sourceUrl, hotspot },
    body,
    sources,
    primarySources,
    difficulty,
    series->{ title, slug },
    categories[]->{ _id, title, slug, era },
    seo
  }
`

// Fetches up to 3 articles in the same era/category, excluding the current article
export const relatedArticlesQuery = `
  *[
    _type == "article" &&
    status == "published" &&
    _id != $id &&
    count(categories[@._ref in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    voice,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const seriesQuery = `
  *[_type == "series"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage { asset, alt, caption, hotspot }
  }
`

export const seriesBySlugQuery = `
  *[_type == "series" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    coverImage { asset, alt, caption, hotspot },
    "articles": *[_type == "article" && references(^._id) && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      voice,
      excerpt,
      mainImage { asset, alt, caption, hotspot }
    }
  }
`

export const articlesByEraQuery = `
  *[
    _type == "article" &&
    status == "published" &&
    $era in categories[]->slug.current
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    voice,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    title,
    tagline,
    description,
    logo,
    ogImage,
    social,
    contact,
    maintenanceMode,
    sections {
      showHero,
      showLatestDispatches,
      showFromArchive,
      showEraGrid,
      showFlagshipSeries
    }
  }
`
