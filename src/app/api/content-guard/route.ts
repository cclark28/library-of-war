/**
 * /api/content-guard
 * ──────────────────────────────────────────────────────────────────────────
 * Global content validation agent. Triggered by a Sanity webhook on every
 * article publish/update. Runs five structural checks — zero external API
 * calls, zero cost:
 *
 *  1. IMAGE PRESENCE    — article must have a mainImage to appear in feature blocks
 *  2. IMAGE UNIQUENESS  — mainImage must not already be used by another live article
 *  3. TITLE UNIQUENESS  — belt-and-suspenders guard beyond the schema-level check
 *  4. SOURCES COUNT     — minimum 3 sources (general + primary combined)
 *  5. SOURCE URLS       — HEAD-checks every cited URL for reachability
 *
 * Results are written to a `contentValidationReport` document in Sanity,
 * visible under 🛡 Validation Reports in Studio.
 *
 * ── Required env vars ───────────────────────────────────────────────────────
 *  NEXT_PUBLIC_SANITY_PROJECT_ID   (already set)
 *  NEXT_PUBLIC_SANITY_DATASET      (already set)
 *  SANITY_WEBHOOK_SECRET           (set)
 *  SANITY_API_TOKEN                (set — write-capable token)
 *
 * ── Sanity webhook setup ────────────────────────────────────────────────────
 *  Dashboard → API → Webhooks → Add webhook
 *  URL:     https://libraryofwar.com/api/content-guard
 *  Trigger: Create + Update on document type "article"
 *  Filter:  status == "published"
 *  Secret:  <same value as SANITY_WEBHOOK_SECRET>
 *  HTTP method: POST
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'edge'
export const maxDuration = 30

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? ''

// Write-capable client — needs a token with "Editor" or "Administrator" role
const sanityWrite = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface Source {
  title?: string
  publisher?: string
  url?: string
}

interface SanityArticle {
  _id: string
  title?: string
  slug?: { current?: string }
  status?: string
  mainImage?: { asset?: { _ref?: string }; alt?: string }
  sources?: Source[]
  primarySources?: Source[]
}

interface CheckResult {
  pass: boolean
  message: string
  [key: string]: unknown
}

// ─── Sanity queries ───────────────────────────────────────────────────────────

/** Fetch full article content from Sanity (bypasses CDN) */
async function fetchArticle(id: string): Promise<SanityArticle | null> {
  // Accept both draft and published _id so the guard runs correctly
  // regardless of which variant the webhook delivers.
  const cleanId = id.replace(/^drafts\./, '')
  return sanityWrite.fetch<SanityArticle | null>(
    `*[_type == "article" && (_id == $id || _id == $draftId)][0]{
      _id, title, slug, status,
      mainImage { asset { _ref }, alt },
      sources[]        { title, publisher, url },
      primarySources[] { title, url }
    }`,
    { id: cleanId, draftId: `drafts.${cleanId}` }
  )
}

/** Check whether another published article already uses this image asset */
async function findDuplicateImage(
  assetRef: string,
  articleId: string
): Promise<{ _id: string; title?: string } | null> {
  const cleanId = articleId.replace(/^drafts\./, '')
  return sanityWrite.fetch(
    `*[
      _type == "article" &&
      mainImage.asset._ref == $ref &&
      !(_id in [$id, $draftId]) &&
      !(_id in path("drafts.**")) &&
      status == "published"
    ][0]{ _id, title }`,
    { ref: assetRef, id: cleanId, draftId: `drafts.${cleanId}` }
  )
}

/** Check whether another published article uses the same title */
async function findDuplicateTitle(
  title: string,
  articleId: string
): Promise<{ _id: string; title?: string } | null> {
  const cleanId = articleId.replace(/^drafts\./, '')
  return sanityWrite.fetch(
    `*[
      _type == "article" &&
      title == $title &&
      !(_id in [$id, $draftId]) &&
      !(_id in path("drafts.**")) &&
      status == "published"
    ][0]{ _id, title }`,
    { title, id: cleanId, draftId: `drafts.${cleanId}` }
  )
}

/** HEAD-request a URL. Returns true if reachable (200–3xx or 405). */
async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(7_000),
    })
    // 405 = HEAD not allowed but server responded — treat as reachable
    return res.ok || res.status === 405
  } catch {
    return false
  }
}

/** Upsert the validation report document in Sanity */
async function writeReport(
  articleId: string,
  report: {
    checkedAt:       string
    overallStatus:   'PASS' | 'WARN' | 'BLOCK'
    featureEligible: boolean
    imagePresent:    CheckResult
    imageDuplicate:  CheckResult
    titleDuplicate:  CheckResult
    sourcesCount:    CheckResult & { count: number }
    sourceUrls:      CheckResult & { checked: number; deadLinks: string[] }
  }
): Promise<void> {
  const docId = `contentValidationReport-${articleId.replace(/^drafts\./, '')}`

  await sanityWrite.createOrReplace({
    _id:   docId,
    _type: 'contentValidationReport',

    article:         { _type: 'reference', _ref: articleId.replace(/^drafts\./, '') },
    checkedAt:       report.checkedAt,
    overallStatus:   report.overallStatus,
    featureEligible: report.featureEligible,

    checkImagePresent:   { pass: report.imagePresent.pass,   message: report.imagePresent.message },
    checkImageDuplicate: { pass: report.imageDuplicate.pass, message: report.imageDuplicate.message },
    checkTitleDuplicate: { pass: report.titleDuplicate.pass, message: report.titleDuplicate.message },
    checkSourcesCount:   { pass: report.sourcesCount.pass,   count: report.sourcesCount.count, message: report.sourcesCount.message },
    checkSourceUrls:     { pass: report.sourceUrls.pass,     checked: report.sourceUrls.checked, deadLinks: report.sourceUrls.deadLinks, message: report.sourceUrls.message },
  })
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Authenticate ─────────────────────────────────────────────────────
  const incomingSecret = req.headers.get('sanity-webhook-secret') ?? ''
  if (SANITY_WEBHOOK_SECRET && incomingSecret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const docType   = body._type  as string | undefined
  const docStatus = body.status as string | undefined
  const docId     = body._id    as string | undefined

  // Only run on published articles
  if (docType !== 'article' || docStatus !== 'published' || !docId) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Not a published article' })
  }

  // ── 2. Fetch full article ─────────────────────────────────────────────────
  const article = await fetchArticle(docId)
  if (!article) {
    return NextResponse.json({ error: 'Article not found in Sanity' }, { status: 404 })
  }

  const now = new Date().toISOString()

  // ── 3. IMAGE PRESENCE ─────────────────────────────────────────────────────
  const hasImage = !!(article.mainImage?.asset?._ref)
  const imagePresent: CheckResult = {
    pass:    hasImage,
    message: hasImage
      ? 'Main image present.'
      : 'BLOCK — No main image. Article cannot appear in any feature block until an image is added.',
  }

  // ── 4. IMAGE UNIQUENESS ───────────────────────────────────────────────────
  let imageDuplicate: CheckResult = { pass: true, message: 'No duplicate image.' }
  if (hasImage) {
    const dup = await findDuplicateImage(article.mainImage!.asset!._ref!, docId)
    if (dup) {
      imageDuplicate = {
        pass:    false,
        message: `WARN — This image is already used by "${dup.title ?? dup._id}". Use a different photo to avoid visual repetition.`,
      }
    }
  }

  // ── 5. TITLE UNIQUENESS ───────────────────────────────────────────────────
  let titleDuplicate: CheckResult = { pass: true, message: 'Title is unique.' }
  if (article.title) {
    const dup = await findDuplicateTitle(article.title, docId)
    if (dup) {
      titleDuplicate = {
        pass:    false,
        message: `BLOCK — Duplicate title. Another published article already has this exact title (${dup._id}).`,
      }
    }
  }

  // ── 6. SOURCES COUNT ──────────────────────────────────────────────────────
  const allSources: Source[] = [
    ...(article.sources        ?? []),
    ...(article.primarySources ?? []),
  ]
  const sourcesCount: CheckResult & { count: number } = {
    pass:    allSources.length >= 3,
    count:   allSources.length,
    message: allSources.length >= 3
      ? `${allSources.length} source(s) cited — minimum met.`
      : `BLOCK — Only ${allSources.length} source(s). A minimum of 3 verifiable sources is required.`,
  }

  // ── 7. SOURCE URL REACHABILITY ────────────────────────────────────────────
  const urlsToCheck = allSources
    .map((s) => s.url)
    .filter((u): u is string => typeof u === 'string' && u.startsWith('http'))

  const urlResults = await Promise.all(
    urlsToCheck.map(async (url) => ({ url, ok: await isUrlReachable(url) }))
  )
  const deadLinks = urlResults.filter((r) => !r.ok).map((r) => r.url)
  const sourceUrls: CheckResult & { checked: number; deadLinks: string[] } = {
    pass:      deadLinks.length === 0,
    checked:   urlsToCheck.length,
    deadLinks,
    message:   deadLinks.length === 0
      ? `All ${urlsToCheck.length} source URL(s) resolved successfully.`
      : `WARN — ${deadLinks.length} URL(s) unreachable: ${deadLinks.join(' | ')}`,
  }

  // ── 8. OVERALL STATUS ──────────────────────────────────────────────────────
  const hardFail = !imagePresent.pass || !titleDuplicate.pass || !sourcesCount.pass
  const softFail = !imageDuplicate.pass || !sourceUrls.pass

  const overallStatus: 'PASS' | 'WARN' | 'BLOCK' = hardFail
    ? 'BLOCK'
    : softFail
    ? 'WARN'
    : 'PASS'

  const featureEligible = hasImage && !hardFail

  // ── 9. WRITE REPORT TO SANITY ─────────────────────────────────────────────
  await writeReport(docId, {
    checkedAt: now,
    overallStatus,
    featureEligible,
    imagePresent,
    imageDuplicate,
    titleDuplicate,
    sourcesCount,
    sourceUrls,
  })

  console.log(`[content-guard] ${docId} → ${overallStatus} (feature: ${featureEligible})`)

  return NextResponse.json({
    ok:             true,
    articleId:      docId,
    overallStatus,
    featureEligible,
    checks: {
      imagePresent:    imagePresent.pass,
      imageDuplicate:  imageDuplicate.pass,
      titleDuplicate:  titleDuplicate.pass,
      sourcesCount:    sourcesCount.pass,
      sourceUrls:      sourceUrls.pass,
    },
  })
}
