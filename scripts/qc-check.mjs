#!/usr/bin/env node
/**
 * Library of War — QC Check Script
 *
 * Checks for:
 *  1. Duplicate hero images across articles (same Sanity asset ref)
 *  2. Duplicate article titles (exact + fuzzy)
 *  3. Broken external links inside article body portable text
 *  4. Articles missing hero images (flagged as not eligible for featured sections)
 *
 * Usage:
 *   node scripts/qc-check.mjs
 *
 * Requires env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * Reads from .env.local automatically via --env-file flag or dotenv.
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local manually ────────────────────────────────────────────────
try {
  const envPath = join(__dirname, '..', '.env.local')
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && !process.env[key]) process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
  }
} catch {
  // .env.local not found — rely on process.env
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!PROJECT_ID) {
  console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID not set.')
  process.exit(1)
}

const SANITY_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`

async function query(groq) {
  const url = `${SANITY_URL}?query=${encodeURIComponent(groq)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const json = await res.json()
  return json.result
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractLinks(body = []) {
  const links = []
  for (const block of body) {
    if (block._type !== 'block') continue
    const markDefs = block.markDefs || []
    for (const def of markDefs) {
      if (def._type === 'link' && def.href) links.push(def.href)
    }
  }
  return links
}

async function checkUrl(url) {
  // Skip mailto, tel, hash-only, and relative links
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'LibraryOfWar-QC/1.0' },
    })
    clearTimeout(timeout)
    return res.status
  } catch (e) {
    return e.name === 'AbortError' ? 'TIMEOUT' : 'ERROR'
  }
}

function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => j === 0 ? i : 0))
  for (let j = 1; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍  Library of War — QC Check\n')
  console.log(`Project: ${PROJECT_ID} / Dataset: ${DATASET}\n`)

  // Fetch all published articles
  const articles = await query(`
    *[_type == "article" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "imageRef": mainImage.asset._ref,
      body
    }
  `)

  console.log(`📚  ${articles.length} published articles found.\n`)
  let issues = 0

  // ── 1. Missing hero images ─────────────────────────────────────────────────
  const noImage = articles.filter(a => !a.imageRef)
  if (noImage.length) {
    console.log(`⚠️   MISSING HERO IMAGE (${noImage.length}) — excluded from featured sections:`)
    for (const a of noImage) {
      console.log(`     • "${a.title}" → /articles/${a.slug?.current}`)
    }
    console.log()
    issues += noImage.length
  } else {
    console.log('✅  All articles have hero images.\n')
  }

  // ── 2. Duplicate hero images ───────────────────────────────────────────────
  const imageMap = {}
  for (const a of articles) {
    if (!a.imageRef) continue
    if (!imageMap[a.imageRef]) imageMap[a.imageRef] = []
    imageMap[a.imageRef].push(a)
  }
  const dupImages = Object.entries(imageMap).filter(([, group]) => group.length > 1)
  if (dupImages.length) {
    console.log(`⚠️   DUPLICATE HERO IMAGES (${dupImages.length} asset(s) reused):`)
    for (const [ref, group] of dupImages) {
      console.log(`     Asset: ${ref}`)
      for (const a of group) console.log(`       └─ "${a.title}" → /articles/${a.slug?.current}`)
    }
    console.log()
    issues += dupImages.length
  } else {
    console.log('✅  No duplicate hero images.\n')
  }

  // ── 3. Duplicate titles ────────────────────────────────────────────────────
  const titles = articles.map(a => a.title?.toLowerCase().trim()).filter(Boolean)
  const titleDups = []
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const a = articles[i].title?.toLowerCase().trim() || ''
      const b = articles[j].title?.toLowerCase().trim() || ''
      if (!a || !b) continue
      // Exact match
      if (a === b) {
        titleDups.push({ type: 'exact', a: articles[i], b: articles[j] })
        continue
      }
      // Near-duplicate: edit distance ≤ 5 and length > 10
      if (a.length > 10 && levenshtein(a, b) <= 5) {
        titleDups.push({ type: 'similar', a: articles[i], b: articles[j] })
      }
    }
  }
  if (titleDups.length) {
    console.log(`⚠️   DUPLICATE / NEAR-DUPLICATE TITLES (${titleDups.length}):`)
    for (const d of titleDups) {
      console.log(`     [${d.type.toUpperCase()}]`)
      console.log(`       └─ "${d.a.title}" → /articles/${d.a.slug?.current}`)
      console.log(`       └─ "${d.b.title}" → /articles/${d.b.slug?.current}`)
    }
    console.log()
    issues += titleDups.length
  } else {
    console.log('✅  No duplicate article titles.\n')
  }

  // ── 4. Broken links in article bodies ────────────────────────────────────
  console.log('🔗  Checking links in article bodies (this may take a minute)…\n')
  const brokenLinks = []
  const checkedUrls = {} // cache results

  for (const article of articles) {
    const links = extractLinks(article.body)
    if (!links.length) continue
    for (const url of links) {
      let status
      if (url in checkedUrls) {
        status = checkedUrls[url]
      } else {
        status = await checkUrl(url)
        checkedUrls[url] = status
      }
      const isBroken = status === 'ERROR' || status === 'TIMEOUT' || (typeof status === 'number' && status >= 400)
      if (isBroken) {
        brokenLinks.push({ article, url, status })
      }
    }
  }

  if (brokenLinks.length) {
    console.log(`⚠️   BROKEN LINKS (${brokenLinks.length}):`)
    for (const { article, url, status } of brokenLinks) {
      console.log(`     [${status}] ${url}`)
      console.log(`       └─ in "${article.title}" → /articles/${article.slug?.current}`)
    }
    console.log()
    issues += brokenLinks.length
  } else {
    console.log('✅  No broken links found.\n')
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('─'.repeat(60))
  if (issues === 0) {
    console.log('✅  All checks passed. No issues found.')
  } else {
    console.log(`❌  ${issues} issue(s) found. Review above and fix in Sanity Studio.`)
  }
  console.log()
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
