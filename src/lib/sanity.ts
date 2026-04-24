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
  *[_type == "article" && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    era,
    voice,
    mainImage { asset, alt, caption, hotspot },
    author->{ name, slug, role, photo },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug && status != "archived" && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    mainImage { asset, alt, caption, sourceUrl, hotspot },
    body,
    sources,
    primarySources,
    difficulty,
    author->{ name, slug, role, photo },
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
    !(_id in path("drafts.**")) &&
    _id != $id &&
    count(categories[@._ref in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    author->{ name, slug, role, photo },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const seriesQuery = `
  *[_type == "series" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage { asset, alt, caption, hotspot }
  }
`

export const seriesBySlugQuery = `
  *[_type == "series" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    coverImage { asset, alt, caption, hotspot },
    "articles": *[_type == "article" && references(^._id) && status == "published" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { asset, alt, caption, hotspot },
      author->{ name, slug, role, photo }
    }
  }
`

// Full-text search across title, excerpt, tags, and categories
// Used by browse page when ?q= param is present
export const searchArticlesQuery = `
  *[
    _type == "article" &&
    status == "published" &&
    !(_id in path("drafts.**")) &&
    (
      title match $q + "*" ||
      excerpt match $q + "*" ||
      $q in tags[] ||
      count(categories[]->[title match $q + "*"]) > 0
    )
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    author->{ name, slug, role, photo },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const articlesByEraQuery = `
  *[
    _type == "article" &&
    status == "published" &&
    !(_id in path("drafts.**")) &&
    (era == $era || $era in categories[]->slug.current)
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    mainImage { asset, alt, caption, hotspot },
    author->{ name, slug, role, photo },
    series->{ title, slug },
    categories[]->{ title, slug }
  }
`

export const navigationQuery = `
  *[_type == "navigation"][0] {
    homeLabel,
    browseLabel,
    seriesLabel,
    resourcesLabel,
    missionLabel,
    searchLabel,
    searchPlaceholder,
    eraItems[] { label, years, href, visible },
    seriesItems[] { label, href, visible },
    socialLinks[] { label, href }
  }
`

export const footerQuery = `
  *[_type == "footer"][0] {
    tagline,
    contactEmail,
    copyrightText,
    domainLabel,
    socialLinks[] { label, href },
    columns[] {
      heading,
      links[] { label, href }
    }
  }
`

export const homepageContentQuery = `
  *[_type == "homepageContent"][0] {
    latestDispatchesLabel,
    fromArchiveLabel,
    flagshipSeriesLabel,
    seeAllLabel,
    comingSoonLabel,
    filterLabel,
    showAllLabel,
    sortLabel,
    mastTagline
  }
`

export const notFoundPageQuery = `
  *[_type == "notFoundPage"][0] {
    headline,
    message,
    ctaLabel,
    ctaHref,
    facts[] { text, attribution }
  }
`

export const missionPageQuery = `
  *[_type == "missionPage"][0] {
    heroHeadline,
    body,
    donationHeading,
    donationSubtext
  }
`

export const resourcesPageQuery = `
  *[_type == "resourcesPage"][0] {
    pageTitle,
    subtitle,
    footerNote,
    sections[] {
      title,
      items[] { name, url, description }
    }
  }
`

export const contributorPageQuery = `
  *[_type == "contributorPage"][0] {
    gateLabel, gateHeadline, gateSubtext, gateCtaLabel,
    formLabel, formHeadline, formSubtext, guidelines, submitCtaLabel,
    successLabel, successHeadline, successMessage
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
    maintenanceTitle,
    maintenanceMessage,
    maintenanceFact,
    sections {
      showHero,
      showLatestDispatches,
      showFromArchive,
      showEraGrid,
      showFlagshipSeries
    }
  }
`
