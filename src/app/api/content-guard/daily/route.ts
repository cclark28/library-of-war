/**
 * /api/content-guard/daily
 * ──────────────────────────────────────────────────────────────────────────
 * Bulk archive audit. Checks every published article in one fast pass:
 *
 *  1. IMAGE PRESENCE    — articles without a mainImage flagged as BLOCK
 *  2. IMAGE DUPLICATES  — articles sharing the same image asset flagged as WARN
 *  3. TITLE DUPLICATES  — articles sharing the same title flagged as BLOCK
 *  4. SOURCES COUNT     — articles with < 3 sources flagged as BLOCK
 *
 * NOTE: Source URL reachability is intentionally NOT checked here.
 * It is checked on every individual publish by the /api/content-guard webhook.
 * Running HEAD checks against ~1200 external URLs would exceed Cloudflare
 * Workers' 30-second wall-clock limit and cause a 504 timeout.
 *
 * Designed for efficiency: 1 Sanity read (no external HTTP),
 * then 1 Sanity write (a single transaction containing all N contentValidationReport
 * mutations). Using a transaction avoids Cloudflare Workers' 50-subrequest cap,
 * which was previously cutting off writes after ~49 articles.
 *
 * Called by GitHub Actions on a daily schedule. Protected by CRON_SECRET.
 *
 * ── Auth ────────────────────────────────────────────────────────────────────
 *  Header: x-cron-secret: <CRON_SECRET env var>
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const runtime = 'edge'

const CRON_SECRET = process.env.CRON_SECRET ?? ''

const sanityWrite = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleRow {
  _id:         string
  title?:      string
  imageRef?:   string
  sourceCount: number
}

interface ReportRow {
  articleId:       string
  overallStatus:   'PASS' | 'WARN' | 'BLOCK'
  featureEligible: boolean
  checks: {
    imagePresent:   { pass: boolean; message: string }
    imageDuplicate: { pass: boolean; message: string }
    titleDuplicate: { pass: boolean; message: string }
    sourcesCount:   { pass: boolean; count: number; message: string }
    // sourceUrls is not checked in the daily run — handled by the publish webhook
    sourceUrls:     { pass: boolean; checked: number; deadLinks: string[]; message: string }
  }
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchAllArticles(): Promise<ArticleRow[]> {
  type Raw = {
    _id: string
    title?: string
    mainImage?: { asset?: { _ref?: string } }
    sourceCount: number
  }

  // Count sources server-side — no need to fetch individual URLs for the daily job
  // Use coalesce to guard against null (articles with no sources field at all)
  const rows: Raw[] = await sanityWrite.fetch(
    `*[_type == "article" && status == "published" && !(_id in path("drafts.**"))] {
      _id,
      title,
      mainImage { asset { _ref } },
      "sourceCount": length(coalesce(sources, [])) + length(coalesce(primarySources, []))
    }`
  )

  return rows.map((r) => ({
    _id:         r._id,
    title:       r.title,
    imageRef:    r.mainImage?.asset?._ref,
    sourceCount: r.sourceCount ?? 0,
  }))
}

// ─── Write all reports in a single Sanity transaction ────────────────────────
// One API call = one subrequest. Cloudflare Workers free tier caps at 50
// subrequests per invocation. Writing each report individually would exhaust
// that cap after ~49 articles (1 read + 49 writes). A transaction bundles all
// createOrReplace mutations into a single HTTP request, leaving the cap unused.

async function writeAllReports(reports: ReportRow[], checkedAt: string): Promise<void> {
  try {
    const tx = sanityWrite.transaction()
    for (const r of reports) {
      const c = r.checks
      tx.createOrReplace({
        _id:             `contentValidationReport-${r.articleId}`,
        _type:           'contentValidationReport',
        article:         { _type: 'reference', _ref: r.articleId },
        checkedAt,
        overallStatus:   r.overallStatus,
        featureEligible: r.featureEligible,
        checkImagePresent:   c.imagePresent,
        checkImageDuplicate: c.imageDuplicate,
        checkTitleDuplicate: c.titleDuplicate,
        checkSourcesCount:   c.sourcesCount,
        checkSourceUrls:     c.sourceUrls,
      })
    }
    await tx.commit()
  } catch (err) {
    // Log write failures but don't crash the route — audit summary is more important
    console.error('[content-guard/daily] transaction write failed:', err)
  }
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ───────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-cron-secret') ?? ''
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return await runAudit()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[content-guard/daily] unhandled error:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

async function runAudit(): Promise<NextResponse> {
  const startMs   = Date.now()
  const checkedAt = new Date().toISOString()

  // ── 1. Fetch all articles ─────────────────────────────────────────────
  const articles = await fetchAllArticles()
  if (articles.length === 0) {
    return NextResponse.json({ ok: true, total: 0, durationMs: Date.now() - startMs })
  }

  // ── 2. In-memory duplicate detection ─────────────────────────────────
  // Image duplicates: map imageRef → first article _id that uses it
  const imageRefMap = new Map<string, string>()
  for (const a of articles) {
    if (a.imageRef) {
      if (!imageRefMap.has(a.imageRef)) imageRefMap.set(a.imageRef, a._id)
    }
  }

  // Title duplicates: map normalised title → first article _id
  const titleMap = new Map<string, string>()
  for (const a of articles) {
    if (a.title) {
      const key = a.title.trim().toLowerCase()
      if (!titleMap.has(key)) titleMap.set(key, a._id)
    }
  }

  // ── 3. Build reports ──────────────────────────────────────────────────
  // (URL reachability is not checked here — handled by the publish webhook)
  const reports: ReportRow[] = articles.map((a) => {
    // Image presence
    const hasImage = !!a.imageRef
    const imagePresent = {
      pass:    hasImage,
      message: hasImage
        ? 'Main image present.'
        : 'BLOCK — No main image. Cannot appear in feature blocks.',
    }

    // Image duplicate
    const imageOwner     = a.imageRef ? imageRefMap.get(a.imageRef) : undefined
    const imageDuplicate = {
      pass:    !a.imageRef || imageOwner === a._id,
      message: (!a.imageRef || imageOwner === a._id)
        ? 'Image is unique.'
        : `WARN — Image already used by article ${imageOwner}.`,
    }

    // Title duplicate
    const titleKey   = a.title?.trim().toLowerCase() ?? ''
    const titleOwner = titleKey ? titleMap.get(titleKey) : undefined
    const titleDuplicate = {
      pass:    !titleKey || titleOwner === a._id,
      message: (!titleKey || titleOwner === a._id)
        ? 'Title is unique.'
        : `BLOCK — Duplicate title. Also used by article ${titleOwner}.`,
    }

    // Sources count
    const sourcesCount = {
      pass:    a.sourceCount >= 3,
      count:   a.sourceCount,
      message: a.sourceCount >= 3
        ? `${a.sourceCount} source(s) cited — minimum met.`
        : `BLOCK — Only ${a.sourceCount} source(s). Minimum 3 required.`,
    }

    // Source URLs — not checked in daily run; stub so report schema stays consistent
    const sourceUrls = {
      pass:      true,
      checked:   0,
      deadLinks: [] as string[],
      message:   'URL reachability checked at publish time by webhook — not re-checked in daily run.',
    }

    // Overall (URL check excluded from daily pass/fail evaluation)
    const hardFail = !imagePresent.pass || !titleDuplicate.pass || !sourcesCount.pass
    const softFail = !imageDuplicate.pass
    const overallStatus: 'PASS' | 'WARN' | 'BLOCK' = hardFail ? 'BLOCK' : softFail ? 'WARN' : 'PASS'

    return {
      articleId:       a._id,
      overallStatus,
      featureEligible: hasImage && !hardFail,
      checks: { imagePresent, imageDuplicate, titleDuplicate, sourcesCount, sourceUrls },
    }
  })

  // ── 4. Write all reports to Sanity (single transaction = 1 subrequest) ──
  // This replaces the previous batched approach, which was exhausting Cloudflare
  // Workers' 50-subrequest cap after ~49 articles (1 read + 49 individual writes).
  await writeAllReports(reports, checkedAt)

  // ── 5. Summary ────────────────────────────────────────────────────────
  const summary = {
    total: reports.length,
    pass:  reports.filter((r) => r.overallStatus === 'PASS').length,
    warn:  reports.filter((r) => r.overallStatus === 'WARN').length,
    block: reports.filter((r) => r.overallStatus === 'BLOCK').length,
    featureEligible: reports.filter((r) => r.featureEligible).length,
    durationMs: Date.now() - startMs,
  }

  console.log(`[content-guard/daily] ${summary.total} articles — ${summary.pass} PASS, ${summary.warn} WARN, ${summary.block} BLOCK (${summary.durationMs}ms)`)

  return NextResponse.json({ ok: true, checkedAt, ...summary })
}
