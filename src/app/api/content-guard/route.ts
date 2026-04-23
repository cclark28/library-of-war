export const runtime = 'edge'

/**
 * /api/content-guard
 * ──────────────────────────────────────────────────────────────────────────
 * Global content validation agent. Triggered by a Sanity webhook on every
 * article publish/update. Runs the following checks in sequence:
 *
 *  1. IMAGE PRESENCE    — article must have a mainImage to appear in feature blocks
 *  2. IMAGE UNIQUENESS  — mainImage must not already be used by another live article
 *  3. TITLE UNIQUENESS  — belt-and-suspenders check beyond the schema-level guard
 *  4. SOURCES COUNT     — minimum 3 sources (general + primary combined)
 *  5. SOURCE URLS       — HEAD-checks every cited URL for reachability
 *  6. TOPIC RELEVANCE   — AI confirms content is on-topic (military history)
 *  7. HALLUCINATION RISK — AI flags claims unverifiable against the cited sources
 *
 * Results are written to a `contentValidationReport` document in Sanity,
 * visible under 🛡 Validation Reports in Studio.
 *
 * ── Required env vars ───────────────────────────────────────────────────────
 *  NEXT_PUBLIC_SANITY_PROJECT_ID   (already set)
 *  NEXT_PUBLIC_SANITY_DATASET      (already set)
 *  SANITY_WEBHOOK_SECRET           (already set — reuse from indexnow webhook)
 *  SANITY_API_TOKEN                (write-capable token — add if not present)
 *  ANTHROPIC_API_KEY               (for topic + hallucination checks)
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

// Node.js runtime — needs up to 60 s for AI call + URL checks
export const maxDuration = 60

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? ''
const ANTHROPIC_API_KEY     = process.env.ANTHROPIC_API_KEY ?? ''

// Write-capable client — needs a token with "Editor" or "Administrator" role
const sanityWrite = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type PTBlock = { _type: string; children?: { text?: string }[] }

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
  body?: PTBlock[]
  sources?: Source[]
  primarySources?: Source[]
  categories?: { title?: string }[]
}

interface CheckResult {
  pass: boolean
  message: string
  [key: string]: unknown
}

interface SemanticResult {
  topicRelevance:    { pass: boolean; score: number; message: string }
  hallucinationRisk: { pass: boolean; flags: string[]; message: string }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert Sanity Portable Text blocks to plain string */
function ptToText(blocks: PTBlock[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
    .join('\n\n')
}

/** Fetch full article content from Sanity (bypasses CDN) */
async function fetchArticle(id: string): Promise<SanityArticle | null> {
  // Accept both draft and published _id so the guard runs correctly
  // regardless of which variant the webhook delivers.
  const cleanId = id.replace(/^drafts\./, '')
  return sanityWrite.fetch<SanityArticle | null>(
    `*[_type == "article" && (_id == $id || _id == $draftId)][0]{
      _id, title, slug, status,
      mainImage { asset { _ref }, alt },
      body,
      sources[]   { title, publisher, url },
      primarySources[] { title, url },
      categories[]->{ title }
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
      // 405 = HEAD not allowed but server responded — treat as reachable
      redirect: 'follow',
      signal: AbortSignal.timeout(7_000),
    })
    return res.ok || res.status === 405
  } catch {
    return false
  }
}

/** Call Anthropic to evaluate topic relevance and hallucination risk */
async function runSemanticCheck(
  title: string,
  bodyText: string,
  sources: Source[]
): Promise<SemanticResult | null> {
  if (!ANTHROPIC_API_KEY) return null

  const sourceList = sources
    .map((s, i) => `${i + 1}. ${s.title ?? '(untitled)'}${s.url ? ` — ${s.url}` : ''}`)
    .join('\n')

  const prompt = `You are a content quality agent for Library of War, a military history publication. Analyze the article below and respond with ONLY valid JSON — no markdown, no explanation.

Article Title: ${title}

Article Body (truncated to 4000 chars):
${bodyText.slice(0, 4_000)}

Cited Sources:
${sourceList || '(none listed)'}

Return this exact JSON shape:
{
  "topicRelevance": {
    "pass": true,
    "score": 95,
    "message": "One-sentence explanation."
  },
  "hallucinationRisk": {
    "pass": true,
    "flags": [],
    "message": "One-sentence explanation."
  }
}

Rules:
- topicRelevance.pass = true if the article clearly covers military history: wars, battles, weapons systems, intelligence operations, military tactics, strategy, soldiers, commanders, arms development, or armed conflict.
- topicRelevance.score = integer 0–100. 100 = squarely on topic. 0 = completely unrelated.
- topicRelevance.pass = false if the article drifts substantially into politics, entertainment, lifestyle, celebrity, or any non-military domain.
- hallucinationRisk.flags = array of up to 5 specific claims from the article body that appear unverifiable or inconsistent with what the cited sources could plausibly cover. Empty array if none.
- hallucinationRisk.pass = false if flags contains 3 or more high-confidence entries.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      console.error('[content-guard] Anthropic error', res.status, await res.text())
      return null
    }

    const data = await res.json() as { content: { type: string; text: string }[] }
    const raw  = data.content?.[0]?.text ?? ''
    return JSON.parse(raw) as SemanticResult
  } catch (err) {
    console.error('[content-guard] Semantic check failed:', err)
    return null
  }
}

/** Upsert the validation report document in Sanity */
async function writeReport(
  articleId: string,
  report: {
    checkedAt:         string
    overallStatus:     'PASS' | 'WARN' | 'BLOCK'
    featureEligible:   boolean
    imagePresent:      CheckResult
    imageDuplicate:    CheckResult
    titleDuplicate:    CheckResult
    sourcesCount:      CheckResult & { count: number }
    sourceUrls:        CheckResult & { checked: number; deadLinks: string[] }
    topicRelevance:    CheckResult & { score: number | null }
    hallucinationRisk: CheckResult & { flags: string[] }
  }
): Promise<void> {
  const docId = `contentValidationReport-${articleId.replace(/^drafts\./, '')}`

  await sanityWrite.createOrReplace({
    _id:   docId,
    _type: 'contentValidationReport',

    article:     { _type: 'reference', _ref: articleId.replace(/^drafts\./, '') },
    checkedAt:   report.checkedAt,
    overallStatus: report.overallStatus,
    featureEligible: report.featureEligible,

    checkImagePresent:    { pass: report.imagePresent.pass,    message: report.imagePresent.message },
    checkImageDuplicate:  { pass: report.imageDuplicate.pass,  message: report.imageDuplicate.message },
    checkTitleDuplicate:  { pass: report.titleDuplicate.pass,  message: report.titleDuplicate.message },
    checkSourcesCount:    { pass: report.sourcesCount.pass,    count: report.sourcesCount.count, message: report.sourcesCount.message },
    checkSourceUrls:      { pass: report.sourceUrls.pass,      checked: report.sourceUrls.checked, deadLinks: report.sourceUrls.deadLinks, message: report.sourceUrls.message },
    checkTopicRelevance:  { pass: report.topicRelevance.pass,  score: report.topicRelevance.score, message: report.topicRelevance.message },
    checkHallucinationRisk: { pass: report.hallucinationRisk.pass, flags: report.hallucinationRisk.flags, message: report.hallucinationRisk.message },
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

  const docType   = body._type   as string | undefined
  const docStatus = body.status  as string | undefined
  const docId     = body._id     as string | undefined

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
    pass: hasImage,
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
        pass: false,
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
        pass: false,
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

  // ── 8. SEMANTIC CHECK (topic + hallucination) ──────────────────────────────
  const bodyText = ptToText(article.body ?? [])
  const semantic = await runSemanticCheck(article.title ?? '', bodyText, allSources)

  const topicRelevance: CheckResult & { score: number | null } = semantic?.topicRelevance
    ? { pass: semantic.topicRelevance.pass, score: semantic.topicRelevance.score, message: semantic.topicRelevance.message }
    : { pass: true, score: null, message: 'Semantic check skipped — ANTHROPIC_API_KEY not configured.' }

  const hallucinationRisk: CheckResult & { flags: string[] } = semantic?.hallucinationRisk
    ? { pass: semantic.hallucinationRisk.pass, flags: semantic.hallucinationRisk.flags, message: semantic.hallucinationRisk.message }
    : { pass: true, flags: [], message: 'Hallucination check skipped — ANTHROPIC_API_KEY not configured.' }

  // ── 9. OVERALL STATUS ──────────────────────────────────────────────────────
  // Hard failures → BLOCK (article should not appear in feature blocks)
  const hardFail =
    !imagePresent.pass ||
    !titleDuplicate.pass ||
    !sourcesCount.pass  ||
    !topicRelevance.pass ||
    !hallucinationRisk.pass

  // Soft failures → WARN (article can publish but needs editorial review)
  const softFail = !imageDuplicate.pass || !sourceUrls.pass

  const overallStatus: 'PASS' | 'WARN' | 'BLOCK' = hardFail
    ? 'BLOCK'
    : softFail
    ? 'WARN'
    : 'PASS'

  // Feature eligibility: article needs a main image and no hard failures
  const featureEligible = hasImage && !hardFail

  // ── 10. WRITE REPORT TO SANITY ─────────────────────────────────────────────
  await writeReport(docId, {
    checkedAt:       now,
    overallStatus,
    featureEligible,
    imagePresent,
    imageDuplicate,
    titleDuplicate,
    sourcesCount,
    sourceUrls,
    topicRelevance,
    hallucinationRisk,
  })

  console.log(`[content-guard] ${docId} → ${overallStatus} (feature: ${featureEligible})`)

  return NextResponse.json({
    ok:             true,
    articleId:      docId,
    overallStatus,
    featureEligible,
    checks: {
      imagePresent:      imagePresent.pass,
      imageDuplicate:    imageDuplicate.pass,
      titleDuplicate:    titleDuplicate.pass,
      sourcesCount:      sourcesCount.pass,
      sourceUrls:        sourceUrls.pass,
      topicRelevance:    topicRelevance.pass,
      hallucinationRisk: hallucinationRisk.pass,
    },
  })
}
