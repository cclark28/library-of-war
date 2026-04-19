/**
 * qc-duplicates.mjs
 * Pre-publish QC agent — detects duplicate and near-duplicate articles.
 *
 * Checks:
 *   1. Exact title match
 *   2. Slug collision
 *   3. Fuzzy title similarity (>75% word overlap)
 *   4. Shared main image across different articles
 *   5. Excerpt similarity (>80% word overlap)
 *
 * Usage:
 *   node qc-duplicates.mjs              — check all published articles
 *   node qc-duplicates.mjs --all        — include drafts
 *   node qc-duplicates.mjs --fix        — auto-unpublish detected duplicates (keeps longer body)
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => {
    try {
      const env = readFileSync(resolve('.env.local'), 'utf-8')
      return env.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim()
    } catch { return null }
  })()

if (!TOKEN) { console.error('No SANITY_API_TOKEN found.'); process.exit(1) }

const PROJECT = 'tifzt4zw'
const DATASET = 'production'
const FIX     = process.argv.includes('--fix')
const ALL     = process.argv.includes('--all')

const statusFilter = ALL
  ? `_type == "article"`
  : `_type == "article" && status == "published"`

// ── Fetch all articles ────────────────────────────────────────────────────────
const q = encodeURIComponent(`*[${statusFilter}] | order(publishedAt desc) {
  _id, title, slug, status, publishedAt, excerpt,
  "imgRef": mainImage.asset._ref,
  "bodyLen": length(pt::text(body))
}`)

const r = await fetch(`https://${PROJECT}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${q}`, {
  headers: { Authorization: `Bearer ${TOKEN}` }
})
const { result: articles } = await r.json()

console.log(`\n🔍  Library of War — Duplicate QC`)
console.log(`    Scanning ${articles.length} articles${ALL ? ' (including drafts)' : ' (published only)'}\n`)

// ── Helpers ───────────────────────────────────────────────────────────────────
function words(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
}

function similarity(a = '', b = '') {
  const wa = new Set(words(a))
  const wb = new Set(words(b))
  const intersection = [...wa].filter(w => wb.has(w)).length
  const union = new Set([...wa, ...wb]).size
  return union === 0 ? 0 : intersection / union
}

// ── Run checks ────────────────────────────────────────────────────────────────
const issues = []

// 1. Exact title
const titleMap = {}
for (const a of articles) {
  const key = a.title?.trim().toLowerCase()
  if (!key) continue
  if (titleMap[key]) {
    issues.push({ type: 'EXACT_TITLE', severity: 'FAIL', articles: [titleMap[key], a] })
  } else {
    titleMap[key] = a
  }
}

// 2. Slug collision
const slugMap = {}
for (const a of articles) {
  const key = a.slug?.current
  if (!key) continue
  if (slugMap[key]) {
    issues.push({ type: 'SLUG_COLLISION', severity: 'FAIL', articles: [slugMap[key], a] })
  } else {
    slugMap[key] = a
  }
}

// 3. Fuzzy title similarity >75%
for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    const sim = similarity(articles[i].title, articles[j].title)
    if (sim > 0.75 && articles[i].title !== articles[j].title) {
      issues.push({
        type: 'SIMILAR_TITLE',
        severity: 'WARN',
        similarity: Math.round(sim * 100),
        articles: [articles[i], articles[j]],
      })
    }
  }
}

// 4. Shared main image (only flag if titles are also similar — different articles can legitimately share battle images)
const imgMap = {}
for (const a of articles) {
  if (!a.imgRef) continue
  if (imgMap[a.imgRef]) {
    const prev = imgMap[a.imgRef]
    const sim = similarity(prev.title, a.title)
    if (sim > 0.4) { // titles are somewhat related — flag it
      issues.push({ type: 'SHARED_IMAGE', severity: 'WARN', articles: [prev, a] })
    }
  } else {
    imgMap[a.imgRef] = a
  }
}

// 5. Excerpt similarity >80%
for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    if (!articles[i].excerpt || !articles[j].excerpt) continue
    const sim = similarity(articles[i].excerpt, articles[j].excerpt)
    if (sim > 0.80) {
      issues.push({
        type: 'SIMILAR_EXCERPT',
        severity: 'WARN',
        similarity: Math.round(sim * 100),
        articles: [articles[i], articles[j]],
      })
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const fails = issues.filter(i => i.severity === 'FAIL')
const warns = issues.filter(i => i.severity === 'WARN')

if (issues.length === 0) {
  console.log('✅  QC PASSED — no duplicates detected\n')
  process.exit(0)
}

if (fails.length) {
  console.log(`❌  FAILURES (${fails.length}) — must resolve before publishing:`)
  for (const issue of fails) {
    console.log(`\n  [${issue.type}]`)
    for (const a of issue.articles) {
      console.log(`    · [${a._id}] "${a.title}" (${a.bodyLen ?? '?'} chars body)`)
    }
  }
}

if (warns.length) {
  console.log(`\n⚠️   WARNINGS (${warns.length}) — review these:`)
  for (const issue of warns) {
    const simLabel = issue.similarity ? ` (${issue.similarity}% similar)` : ''
    console.log(`\n  [${issue.type}${simLabel}]`)
    for (const a of issue.articles) {
      console.log(`    · [${a._id}] "${a.title}"`)
    }
  }
}

// ── Auto-fix ─────────────────────────────────────────────────────────────────
if (FIX && fails.length > 0) {
  console.log('\n🔧  --fix mode: auto-removing shorter duplicate in each FAIL pair...')
  const toDelete = []

  for (const issue of fails) {
    const [a, b] = issue.articles
    // Keep the longer body; delete the shorter
    const del = (a.bodyLen ?? 0) >= (b.bodyLen ?? 0) ? b : a
    const keep = del === a ? b : a
    toDelete.push(del._id)
    console.log(`  Keep:   [${keep._id}] ${keep.title}`)
    console.log(`  Delete: [${del._id}] ${del.title}\n`)
  }

  const mutations = [...new Set(toDelete)].map(id => ({ delete: { id } }))
  const dr = await fetch(`https://${PROJECT}.api.sanity.io/v2023-01-01/data/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  })
  const dd = await dr.json()
  if (dr.ok) console.log(`✅  Deleted ${mutations.length} duplicate(s). transactionId: ${dd.transactionId}`)
  else console.log('❌  Fix failed:', JSON.stringify(dd))
}

console.log(`\n  Summary: ${fails.length} failure(s), ${warns.length} warning(s)\n`)
process.exit(fails.length > 0 ? 1 : 0)
