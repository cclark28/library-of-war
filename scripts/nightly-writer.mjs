/**
 * scripts/nightly-writer.mjs
 *
 * Automated nightly article generator for Library of War.
 *
 * Runs every night at 11pm via macOS launchd.
 * Generates at least 5 articles per night using the Anthropic API.
 *
 * If API credits are exhausted mid-run, saves a checkpoint to
 * nightly-pending.json and exits cleanly. The retry launchd agent
 * (runs every 30 min) picks up the checkpoint and continues as
 * soon as credits are available.
 *
 * Usage:
 *   node scripts/nightly-writer.mjs              # normal run
 *   node scripts/nightly-writer.mjs --status     # print state, do nothing
 *   node scripts/nightly-writer.mjs --retry      # force retry from checkpoint
 */

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync, execSync } from 'child_process'

const __dirname  = dirname(fileURLToPath(import.meta.url))
const ROOT       = resolve(__dirname, '..')
const STATUS_ONLY = process.argv.includes('--status')
const FORCE_RETRY = process.argv.includes('--retry')

// ── Config ───────────────────────────────────────────────────────────────────

const TARGET_ARTICLES   = 5          // minimum articles to write per night
const ARTICLES_PER_BATCH = 2         // long form + short form per API call
const MODEL             = 'claude-sonnet-4-6'
const MAX_TOKENS        = 8000
const RATE_LIMIT_SLEEP  = 65_000     // ms to wait after a 429
const RATE_LIMIT_RETRIES = 4

// ── Paths ────────────────────────────────────────────────────────────────────

const STATE_PATH   = resolve(ROOT, 'nightly-state.json')
const DATA_PATH    = resolve(ROOT, 'nightly-article-data.json')
const PENDING_PATH = resolve(ROOT, 'nightly-pending.json')
const LOG_DIR      = resolve(ROOT, 'logs')
const LOG_PATH     = resolve(LOG_DIR, 'nightly-writer.log')

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  console.log(line)
  try {
    ensureLogDir()
    const existing = existsSync(LOG_PATH) ? readFileSync(LOG_PATH, 'utf-8') : ''
    // Keep last 500 lines
    const lines = existing.split('\n').filter(Boolean)
    lines.push(line)
    writeFileSync(LOG_PATH, lines.slice(-500).join('\n') + '\n')
  } catch { /* non-fatal */ }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function loadState() {
  return JSON.parse(readFileSync(STATE_PATH, 'utf-8'))
}

function loadPending() {
  if (!existsSync(PENDING_PATH)) return null
  try { return JSON.parse(readFileSync(PENDING_PATH, 'utf-8')) } catch { return null }
}

function savePending(data) {
  writeFileSync(PENDING_PATH, JSON.stringify({ ...data, savedAt: new Date().toISOString() }, null, 2) + '\n')
  log(`  ⏸  Checkpoint saved → ${PENDING_PATH}`)
}

function clearPending() {
  try { execSync(`rm -f "${PENDING_PATH}"`) } catch { /* non-fatal */ }
}

function isCreditError(err) {
  const msg = (err?.message || '').toLowerCase()
  return (
    msg.includes('credit') ||
    msg.includes('balance') ||
    msg.includes('billing') ||
    (err?.status === 400 && msg.includes('credit'))
  )
}

function isRateLimitError(err) {
  return err?.status === 429 || err instanceof Anthropic.RateLimitError
}

// ── Anthropic client ──────────────────────────────────────────────────────────

function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  try {
    const env = readFileSync(resolve(ROOT, '.env.local'), 'utf-8')
    return env.match(/ANTHROPIC_API_KEY\s*=\s*(.+)/)?.[1]?.trim() || null
  } catch { return null }
}

// ── Voice definitions (condensed from writer-voices.md) ───────────────────────

const VOICE_DESCRIPTIONS = {
  correspondent: `
THE CORRESPONDENT: A field journalist close to conflict. Reports from the record like a war correspondent.
- Short sentences that land hard, then a longer one that earns the weight.
- Open mid-action or mid-fact. No scene-setting preamble.
- Use names: specific people, places, times. Occasional present tense for reconstruction.
- Editorialise through selection, not statement. Never say "this was a failure" — describe what happened and let the reader conclude.
- Opening move: Drop into the record. Date, place, fact. No setup.
- NEVER: throat-clearing intros, passive voice to avoid responsibility, adjective stacks.`,

  historian: `
THE HISTORIAN: A serious scholar with a narrative gift. Dense authoritative prose that moves.
- Long paragraphs sustaining an argument. Names individuals and follows them through decisions.
- Interested in contingency — how things could have gone differently and why they didn't.
- Careful about what people knew at the time vs what we know now. Engages with historiography.
- Occasional single sentence that breaks from analysis into something like grief or admiration — always earned.
- Opening move: Establish the historical moment with specific texture, then pull back to show significance.
- NEVER: anachronistic moral judgment, hero/villain frames, treating secondary sources as primary.`,

  archivist: `
THE ARCHIVIST: A researcher who lives in the primary record. Declassified documents, signals intercepts, after-action reports.
- Methodical, precise, occasionally dry to the point of dark wit when a document reveals something an official account omits.
- Quotes directly from primary sources or describes them closely. Notes classification dates and what was redacted.
- Comfortable with incomplete records and says so rather than papering over gaps.
- Quietly animated when the record contradicts the legend.
- Opening move: Name the document or the gap in the record. Start from the evidence.
- NEVER: treat secondary literature as authoritative when primary sources exist, claim certainty where record is incomplete.`,

  analyst: `
THE ANALYST: A strategic thinker with slight contempt for how wars get remembered. Policy, intelligence, or defense academia.
- Interested in decisions: who made them, on what information, under what constraints. Finds incompetence more interesting than evil.
- Controlled and precise. Sentences built like arguments. Conditional framing: "Had X occurred, Y would have followed."
- Uses numbers carefully with appropriate uncertainty. Comfortable saying an official history is wrong.
- Occasional dry wit — not jokes, but a sentence that makes you aware they noticed the irony.
- Opening move: Name the received wisdom. Then complicate it.
- NEVER: emotional appeals, "brave soldiers" framing, treating official narratives as settled.`,

  tactician: `
THE TACTICIAN: A former military officer. Interested in the operational layer — terrain, logistics, timing, unit cohesion.
- No patience for strategic abstraction when the real failure was a supply convoy that didn't arrive.
- Direct and precise. Thinks spatially — describes terrain before the fight.
- Breaks down sequences: what was ordered, what happened, at what time, and why the gap mattered.
- Opinionated about specific decisions in a way that feels earned. Will say a commander made the wrong call.
- Opening move: Give the ground. Then give the problem.
- NEVER: vague strategic language when operational specifics exist, "troops fought bravely" without specifics, ignore terrain.`,
}

const VALID_ERAS = [
  'ancient-medieval', 'early-modern', 'napoleonic-wars', 'american-civil-war',
  'world-war-i', 'world-war-ii', 'korean-war', 'vietnam-war',
  'cold-war', 'modern-conflicts', 'technology-weapons', 'intelligence-special-ops',
]

const VOICES = ['correspondent', 'historian', 'archivist', 'analyst', 'tactician']

// ── Tool schema for structured output ─────────────────────────────────────────

function buildTool() {
  const articleSchema = (isShortForm) => ({
    type: 'object',
    properties: {
      id:         { type: 'string', description: isShortForm ? 'article-{slug} — slug must end in -dispatch' : 'article-{slug}' },
      title:      { type: 'string', description: 'Max 120 chars, factual, no clickbait' },
      slug:       { type: 'string', description: isShortForm ? 'lowercase, hyphens only, ends in -dispatch' : 'lowercase, hyphens only, max 60 chars' },
      excerpt:    { type: 'string', description: 'Max 300 chars, hooks reader, states central fact' },
      era:        { type: 'string', enum: VALID_ERAS },
      voice:      { type: 'string', enum: VOICES },
      paragraphs: {
        type: 'array',
        items: { type: 'string' },
        minItems: isShortForm ? 3 : 8,
        description: isShortForm
          ? '3–4 paragraphs, 80–150 words each. Tight and focused.'
          : '8–10 paragraphs, 100–250 words each. Use ## headings within paragraphs where natural (start para with ## Heading).',
      },
      sources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            href:  { type: 'string', description: 'Must start with https://' },
          },
          required: ['label', 'href'],
        },
        minItems: isShortForm ? 2 : 4,
        description: 'Real, verifiable URLs only. Verify mentally before including.',
      },
    },
    required: ['id', 'title', 'slug', 'excerpt', 'era', 'voice', 'paragraphs', 'sources'],
  })

  return {
    name: 'write_library_of_war_batch',
    description: 'Write one long-form article, one short-form dispatch, and one On This Day entry for Library of War.',
    input_schema: {
      type: 'object',
      properties: {
        imageFile: {
          type: 'string',
          description: 'Exact Wikimedia Commons filename (e.g. Battle_of_Kursk_1943.jpg) OR a direct https:// URL from LOC/NARA/IWM. Public domain only.',
        },
        imageAlt:     { type: 'string', description: 'Factual alt text: who, what, where, approx when' },
        imageCaption: { type: 'string', description: 'Attribution: archive name, collection, year' },
        imageSrc:     { type: 'string', description: 'Source URL for the image record page' },
        longForm:  articleSchema(false),
        shortForm: articleSchema(true),
        onThisDay: {
          type: 'object',
          properties: {
            month:    { type: 'integer', minimum: 1, maximum: 12 },
            day:      { type: 'integer', minimum: 1, maximum: 31 },
            year:     { type: 'integer', description: 'The year this event occurred' },
            headline: { type: 'string', description: 'One clear factual sentence' },
            summary:  { type: 'string', description: '2–3 sentences of context. No speculation.' },
            era:      { type: 'string', enum: VALID_ERAS },
            linkedArticleSlug: { type: 'string', description: 'Optional — slug of a related article already in the archive' },
          },
          required: ['month', 'day', 'year', 'headline', 'summary', 'era'],
        },
      },
      required: ['imageFile', 'imageAlt', 'imageCaption', 'imageSrc', 'longForm', 'shortForm', 'onThisDay'],
    },
  }
}

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildSystemPrompt(voice) {
  return `You are a military history writer for Library of War — a rigorous, atmospheric online archive of military history. Every article must read like it was written by a skilled historian who also knows how to write a film. Dense with verified fact. Zero tolerance for vague claims, unverified assertions, or hallucination.

ASSIGNED VOICE FOR THIS BATCH: ${voice.toUpperCase()}
${VOICE_DESCRIPTIONS[voice]}

═══════════════════════════════════════════════
GENERATION RULES (ALL VOICES — NON-NEGOTIABLE)
═══════════════════════════════════════════════

1. OPEN WITHOUT SETUP. No "Throughout history..." or "In the annals of..." First sentence is a fact, a scene, or a document.

2. USE REAL NAMES, DATES, AND UNIT DESIGNATIONS. "A German general" is AI. "Field Marshal von Manstein" is a person. Specificity is what separates human writing from AI writing.

3. CITE ACTUAL HISTORIANS WHEN DISPUTING RECEIVED WISDOM. "David Glantz's 1999 operational study revised the tank count" is a human sentence.

4. ACKNOWLEDGE UNCERTAINTY CORRECTLY. "The evidence suggests," "later archival research indicates," "the precise figure remains disputed." Do not flatten uncertainty into false confidence.

5. NO ADJECTIVE STACKS. Pick one adjective. Not "brutal, devastating, catastrophic."

6. NO TRANSITION SUMMARIES. Don't close a paragraph by restating it.

7. NO MOTIVATIONAL FRAMING. This is not content marketing. Do not end articles with a "legacy" statement.

8. ONE POINT OF VIEW PER ARTICLE. Pick a position and defend it. False balance is an AI tell.

9. SOURCES MUST BE REAL AND LINKABLE. Every source URL must be a real page that exists. Wikipedia and Britannica are acceptable secondary sources. Named academic works are better.

10. HALLUCINATION PREVENTION: Before including ANY named individual, unit, operation, date, or statistic — ask yourself: "Is this verifiable in the Wikipedia article for this subject, or in one of my listed sources?" If the answer is no, REMOVE IT. Never invent quotes. Never invent casualty figures without qualification. Never invent unit names or designations. If uncertain, hedge or cut.

11. TOPIC SCOPE: Library of War covers ONLY wars, battles, sieges, campaigns, military strategy and doctrine, weapons development, intelligence operations, individual military figures (in their military role), logistics, and POW experiences. No political commentary. No lifestyle drift.

12. APPROVED IMAGE SOURCES: Wikimedia Commons (preferred), Library of Congress (loc.gov/pictures), NARA (catalog.archives.gov), US Army/Navy/USMC/USAF history sites, Imperial War Museum (IWM — public domain only), Australian War Memorial, Bundesarchiv. The imageFile must be a valid Wikimedia filename OR a direct .jpg/.png/.tif URL from an approved source.`
}

function buildUserPrompt(voice, usedSlugs, batchNum, todayDate) {
  const [year, month, day] = todayDate.split('-').map(Number)
  const underrepresented = 'ancient-medieval, early-modern, napoleonic-wars, american-civil-war, korean-war, modern-conflicts, intelligence-special-ops'

  return `Today's date: ${todayDate} (${new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })})

BATCH ${batchNum} — Voice: ${voice.toUpperCase()}

Generate one long-form article, one short-form dispatch, and one On This Day entry.

ALREADY PUBLISHED SLUGS — DO NOT WRITE ABOUT THESE TOPICS (they are already in the archive):
${usedSlugs.slice(-100).join(', ')}

ERA DISTRIBUTION GUIDANCE:
- Actively seek underrepresented eras: ${underrepresented}
- World War II is over-represented in the archive. Choose WWII topics only when there is a genuinely distinctive angle not already covered.
- Long form and short form must cover DIFFERENT topics, ideally different eras.

ON THIS DAY:
- The entry must be for a real event that happened on ${month}/${day} in any year.
- Cross-reference the calendar: what military events actually occurred on this date?
- If today (${month}/${day}) has a strong match to your long-form era, use it. Otherwise pick the most historically significant military event on this date.

QUALITY CHECK (run mentally before calling the tool):
- Can every named person, unit, and key claim be found in Wikipedia or one of my sources?
- Does every source URL actually exist and resolve to a real page?
- Is the opening sentence a fact or scene — not context-setting?
- Is the voice consistent throughout both articles?
- Does the long form have at least 8 paragraphs?
- Do all source hrefs start with https://?
- Does the short form slug end in -dispatch?
- Is the imageFile a real Wikimedia filename or a direct image URL from an approved archive?

Call write_library_of_war_batch with your output now.`
}

// ── Pipeline runner ───────────────────────────────────────────────────────────

async function runPipeline() {
  log('  → Running generator (validate + advance state)')
  execFileSync('node', [resolve(ROOT, 'generate-nightly-article.mjs')], {
    stdio: 'inherit',
    cwd: ROOT,
  })

  log('  → Running publisher (push to Sanity)')
  execFileSync('node', [resolve(ROOT, 'publish-nightly-article.mjs')], {
    stdio: 'inherit',
    cwd: ROOT,
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log('═══════════════════════════════════════════════')
  log('  Library of War — Nightly Auto-Writer')
  log(`  Target: ${TARGET_ARTICLES} articles`)
  log('═══════════════════════════════════════════════')

  // ── Status only ──
  if (STATUS_ONLY) {
    const state   = loadState()
    const pending = loadPending()
    log(`  Voice index    : ${state.voiceIndex} (${VOICES[state.voiceIndex % VOICES.length]})`)
    log(`  Articles total : ${state.articlesWritten}`)
    log(`  Last run       : ${state.lastRun || 'never'}`)
    log(`  Pending work   : ${pending ? JSON.stringify(pending) : 'none'}`)
    return
  }

  // ── API key check ──
  const apiKey = getApiKey()
  if (!apiKey) {
    log('✗ ANTHROPIC_API_KEY not found in environment or .env.local')
    log('  Add it: echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.local')
    process.exit(1)
  }
  const anthropic = new Anthropic({ apiKey })

  // ── Load state ──
  const state   = loadState()
  const pending = loadPending()

  // ── Determine starting point ──
  let articlesThisSession = 0
  let startBatch          = 1

  if (pending && !FORCE_RETRY) {
    // Check if the pending work is for today
    if (pending.date === todayStr()) {
      articlesThisSession = pending.articlesWritten || 0
      startBatch          = pending.batchesCompleted + 1
      log(`  Resuming from checkpoint: ${articlesThisSession} articles written, starting at batch ${startBatch}`)
    } else {
      log(`  Stale checkpoint from ${pending.date} — starting fresh`)
      execSync(`rm -f "${PENDING_PATH}"`)
    }
  }

  const today      = todayStr()
  const usedSlugs  = state.usedSlugs || []
  let voiceIndex   = state.voiceIndex ?? 0

  // ── Generation loop ──
  const batchesNeeded = Math.ceil((TARGET_ARTICLES - articlesThisSession) / ARTICLES_PER_BATCH)
  log(`  Articles already done : ${articlesThisSession}`)
  log(`  Batches needed        : ${batchesNeeded}`)

  for (let batch = startBatch; batch < startBatch + batchesNeeded; batch++) {
    if (articlesThisSession >= TARGET_ARTICLES) break

    const voice = VOICES[voiceIndex % VOICES.length]
    log(`\n  ── Batch ${batch} — Voice: ${voice} ──`)

    // Build prompts
    const systemPrompt = buildSystemPrompt(voice)
    const userPrompt   = buildUserPrompt(voice, usedSlugs, batch, today)
    const tool         = buildTool()

    // API call with rate-limit retry
    let response = null
    for (let attempt = 1; attempt <= RATE_LIMIT_RETRIES; attempt++) {
      try {
        log(`  Calling Anthropic API (${MODEL})...`)
        response = await anthropic.messages.create({
          model:      MODEL,
          max_tokens: MAX_TOKENS,
          system:     systemPrompt,
          tools:      [tool],
          tool_choice: { type: 'tool', name: 'write_library_of_war_batch' },
          messages:   [{ role: 'user', content: userPrompt }],
        })
        break // success
      } catch (err) {
        if (isCreditError(err)) {
          log(`  ✗ Credit limit hit: ${err.message}`)
          savePending({ date: today, targetArticles: TARGET_ARTICLES, articlesWritten: articlesThisSession, batchesCompleted: batch - 1 })
          log('  → Retry job will continue when credits are available.')
          process.exit(0)
        }
        if (isRateLimitError(err) && attempt < RATE_LIMIT_RETRIES) {
          log(`  Rate limited. Waiting ${RATE_LIMIT_SLEEP / 1000}s before retry ${attempt + 1}/${RATE_LIMIT_RETRIES}...`)
          await sleep(RATE_LIMIT_SLEEP)
          continue
        }
        throw err
      }
    }

    if (!response) {
      log('  ✗ No response after retries — skipping batch')
      continue
    }

    // Extract tool use result
    const toolBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolBlock) {
      log('  ✗ API did not call the tool — skipping batch')
      log('  Response:', JSON.stringify(response.content).slice(0, 200))
      continue
    }

    const data = toolBlock.input
    log(`  ✓ Generated: "${data.longForm?.title}"`)
    log(`  ✓ Dispatch:  "${data.shortForm?.title}"`)
    log(`  ✓ OTD:       "${data.onThisDay?.headline}"`)

    // Write data file for the pipeline
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
    log('  ✓ Written to nightly-article-data.json')

    // Run the existing validate + publish pipeline
    try {
      await runPipeline()
    } catch (err) {
      log(`  ✗ Pipeline error: ${err.message}`)
      // Non-fatal — continue to next batch
      continue
    }

    // Update counters
    articlesThisSession += ARTICLES_PER_BATCH
    voiceIndex++

    // Re-read state (generate-nightly-article.mjs updates it)
    const newState = loadState()
    usedSlugs.push(...(newState.usedSlugs || []).slice(-10))

    log(`  ✓ Batch ${batch} complete. Total this session: ${articlesThisSession}`)
  }

  // ── Done ──
  if (articlesThisSession >= TARGET_ARTICLES) {
    // Clear any pending checkpoint
    execSync(`rm -f "${PENDING_PATH}"`)
    log(`\n✓ Nightly run complete. ${articlesThisSession} articles written.`)
  } else {
    log(`\n⚠ Run ended with ${articlesThisSession}/${TARGET_ARTICLES} articles. Check logs.`)
  }

  log('═══════════════════════════════════════════════\n')
}

main().catch(err => {
  log(`✗ Fatal error: ${err.message}`)
  log(err.stack || '')
  process.exit(1)
})
