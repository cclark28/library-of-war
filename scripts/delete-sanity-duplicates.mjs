#!/usr/bin/env node
/**
 * Library of War — Delete Sanity Duplicates
 *
 * Finds and hard-deletes:
 *   1. Articles with duplicate slugs (same URL) — keeps most recently published
 *   2. Articles with duplicate mainImage asset refs — keeps most recently published
 *   3. Draft versions that have a published counterpart
 *
 * Requires SANITY_WRITE_TOKEN in .env.local (Editor or above)
 * Run: node scripts/delete-sanity-duplicates.mjs
 * Add --dry-run to preview without deleting
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

try {
  const envPath = join(__dirname, '..', '.env.local')
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const [key, ...rest] = t.split('=')
    if (key && !process.env[key]) process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
  }
} catch { /* rely on process.env */ }

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_WRITE_TOKEN

if (!PROJECT_ID) { console.error('❌  NEXT_PUBLIC_SANITY_PROJECT_ID not set'); process.exit(1) }
if (!TOKEN)      { console.error('❌  SANITY_WRITE_TOKEN not set in .env.local'); process.exit(1) }

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data`

async function query(groq) {
  const res = await fetch(`${API}/query/${DATASET}?query=${encodeURIComponent(groq)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  return (await res.json()).result
}

async function deleteDoc(id) {
  if (DRY_RUN) { console.log(`  [DRY RUN] would delete: ${id}`); return }
  const res = await fetch(`${API}/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ delete: { id } }] }),
  })
  const json = await res.json()
  if (!res.ok) console.error(`  ❌ Failed to delete ${id}:`, json)
  else console.log(`  ✅ Deleted: ${id}`)
}

console.log(`\n🔍  Library of War — Duplicate Purge ${DRY_RUN ? '(DRY RUN)' : '(LIVE)'}\n`)

// ── 1. Duplicate slugs ───────────────────────────────────────────────────────
console.log('── Step 1: Duplicate slugs ─────────────────────────────────────')
const allArticles = await query(
  `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id, title, "slug": slug.current, publishedAt, "imageRef": mainImage.asset._ref
  }`
)

const slugMap = new Map()
let slugDupes = 0
for (const a of allArticles) {
  if (!a.slug) continue
  if (slugMap.has(a.slug)) {
    // Keep the first (most recent publishedAt), delete the rest
    console.log(`  DUPE slug "${a.slug}": keeping ${slugMap.get(a.slug)._id}, deleting ${a._id}`)
    console.log(`    Keep: "${slugMap.get(a.slug).title}" (${slugMap.get(a.slug).publishedAt})`)
    console.log(`    Del:  "${a.title}" (${a.publishedAt})`)
    await deleteDoc(a._id)
    slugDupes++
  } else {
    slugMap.set(a.slug, a)
  }
}
console.log(`  Found ${slugDupes} duplicate slug(s)\n`)

// ── 2. Duplicate mainImage asset refs ────────────────────────────────────────
console.log('── Step 2: Duplicate hero images ───────────────────────────────')
const imageMap = new Map()
let imageDupes = 0
for (const a of allArticles) {
  if (!a.imageRef) continue
  if (imageMap.has(a.imageRef)) {
    const keeper = imageMap.get(a.imageRef)
    console.log(`  DUPE image: keeping "${keeper.title}" (${keeper._id}), deleting "${a.title}" (${a._id})`)
    await deleteDoc(a._id)
    imageDupes++
  } else {
    imageMap.set(a.imageRef, a)
  }
}
console.log(`  Found ${imageDupes} duplicate image(s)\n`)

// ── 3. Orphaned drafts (published version exists) ────────────────────────────
console.log('── Step 3: Orphaned drafts with published counterpart ──────────')
const drafts = await query(
  `*[_type == "article" && _id in path("drafts.**")] { _id, "pubId": string::split(_id, "drafts.")[1] }`
)
const publishedIds = new Set(allArticles.map(a => a._id))
let draftDupes = 0
for (const d of drafts) {
  if (publishedIds.has(d.pubId)) {
    console.log(`  Orphaned draft: ${d._id} (published version ${d.pubId} exists)`)
    await deleteDoc(d._id)
    draftDupes++
  }
}
console.log(`  Found ${draftDupes} orphaned draft(s)\n`)

console.log(`\n✅  Done. Removed: ${slugDupes + imageDupes + draftDupes} document(s)`)
if (DRY_RUN) console.log('   Run without --dry-run to actually delete.')
