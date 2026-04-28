/**
 * generate-nightly-article.mjs
 *
 * State manager for the nightly article pipeline.
 * Actual article content is written to nightly-article-data.json
 * by the Library of War editorial session (Claude / Cowork).
 *
 * This script:
 *   1. Reports the current voice assignment
 *   2. Validates nightly-article-data.json (if it exists)
 *   3. Advances the voice index and updates nightly-state.json
 *
 * Usage:
 *   node generate-nightly-article.mjs           # advance state + validate
 *   node generate-nightly-article.mjs --check   # validate only, do not advance
 *   node generate-nightly-article.mjs --status  # print current state and exit
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const CHECK_ONLY = process.argv.includes('--check')
const STATUS_ONLY = process.argv.includes('--status')

// ── Constants ─────────────────────────────────────────────────────────────────

const VOICES = ['correspondent', 'historian', 'archivist', 'analyst', 'tactician']

const VALID_ERAS = [
  'ancient-medieval', 'early-modern', 'napoleonic-wars', 'american-civil-war',
  'world-war-i', 'world-war-ii', 'korean-war', 'vietnam-war',
  'cold-war', 'modern-conflicts', 'technology-weapons', 'intelligence-special-ops',
]

// ── State ─────────────────────────────────────────────────────────────────────

const statePath = resolve('nightly-state.json')
const state = JSON.parse(readFileSync(statePath, 'utf-8'))
const voiceIndex = state.voiceIndex ?? 0
const currentVoice = VOICES[voiceIndex % VOICES.length]
const nextVoice = VOICES[(voiceIndex + 1) % VOICES.length]

console.log(`\n✍  Library of War — Nightly State`)
console.log(`   Current voice : ${currentVoice}`)
console.log(`   Next voice    : ${nextVoice}`)
console.log(`   Articles      : ${state.articlesWritten ?? 0} published`)
console.log(`   Last run      : ${state.lastRun ?? 'never'}\n`)

if (STATUS_ONLY) process.exit(0)

// ── Validate nightly-article-data.json ───────────────────────────────────────

const dataPath = resolve('nightly-article-data.json')

if (!existsSync(dataPath)) {
  console.error('✗ nightly-article-data.json not found.')
  console.error('  Write article content to that file first, then re-run.\n')
  process.exit(1)
}

let data
try {
  data = JSON.parse(readFileSync(dataPath, 'utf-8'))
} catch (e) {
  console.error(`✗ nightly-article-data.json is invalid JSON: ${e.message}\n`)
  process.exit(1)
}

const errors = []

if (!data.imageFile)                     errors.push('missing imageFile')
if (!data.longForm?.title)               errors.push('missing longForm.title')
if (!data.longForm?.slug)                errors.push('missing longForm.slug')
if (!data.longForm?.paragraphs?.length)  errors.push('missing longForm.paragraphs')
if ((data.longForm?.paragraphs?.length ?? 0) < 6)
  errors.push(`longForm has only ${data.longForm?.paragraphs?.length} paragraphs — need 6+`)
if (!data.shortForm?.title)              errors.push('missing shortForm.title')
if (!data.onThisDay?.headline)           errors.push('missing onThisDay.headline')
if (!VALID_ERAS.includes(data.longForm?.era))
  errors.push(`invalid longForm era: "${data.longForm?.era}"`)
if (!VALID_ERAS.includes(data.shortForm?.era))
  errors.push(`invalid shortForm era: "${data.shortForm?.era}"`)
for (const src of (data.longForm?.sources || [])) {
  if (!src.href?.startsWith('https://')) errors.push(`bad source href: ${src.href}`)
}

if (errors.length) {
  console.error('✗ Validation failed:')
  errors.forEach(e => console.error(`  • ${e}`))
  process.exit(1)
}

console.log(`  ✓ Long form  : ${data.longForm.title}`)
console.log(`                 /${data.longForm.slug} [${data.longForm.era}] [${data.longForm.voice}]`)
console.log(`  ✓ Short form : ${data.shortForm.title}`)
console.log(`  ✓ On This Day: ${data.onThisDay.headline}`)
console.log(`  ✓ Image      : ${data.imageFile}\n`)

if (CHECK_ONLY) {
  console.log('  Check passed. Run without --check to advance state.\n')
  process.exit(0)
}

// ── Advance state ─────────────────────────────────────────────────────────────

const usedSlugs = [...new Set([
  ...(state.usedSlugs || []),
  data.longForm.slug,
  data.shortForm.slug,
])].slice(-500)

const newState = {
  ...state,
  voiceIndex:      (voiceIndex + 1) % VOICES.length,
  lastRun:         new Date().toISOString(),
  articlesWritten: (state.articlesWritten ?? 0) + 2,
  usedSlugs,
}

writeFileSync(statePath, JSON.stringify(newState, null, 2) + '\n')
console.log(`  ✓ State advanced → next voice: ${nextVoice}`)
console.log(`  ↳ Run: npm run nightly:publish\n`)
