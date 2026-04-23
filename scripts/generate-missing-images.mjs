#!/usr/bin/env node
/**
 * Library of War — AI Image Generator (Pollinations.ai — 100% Free, No API Key)
 *
 * Finds all published articles without a mainImage, generates a cinematic
 * AI image via Pollinations.ai (Flux model), uploads it to Sanity, and patches
 * the article's mainImage field.
 *
 * Engine: https://pollinations.ai — completely free, no signup, no API key.
 * Model: Flux — photorealistic + painterly. Best for historical/military content.
 *
 * Usage:
 *   node scripts/generate-missing-images.mjs           — process all
 *   node scripts/generate-missing-images.mjs --dry-run — preview prompts only
 *   node scripts/generate-missing-images.mjs --id <sanity_id> — one article
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN   = process.argv.includes('--dry-run')
const TARGET_ID = process.argv.includes('--id')
  ? process.argv[process.argv.indexOf('--id') + 1]
  : null

// ── Load env ─────────────────────────────────────────────────────────────────
try {
  const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const [key, ...rest] = t.split('=')
    if (key && !process.env[key]) process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
  }
} catch { /* rely on process.env */ }

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN      = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('❌  Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN')
  process.exit(1)
}

const SANITY_API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data`

// ── Cinematic prompt builder ──────────────────────────────────────────────────
function buildPrompt(title, excerpt) {
  const t = (title || '').toLowerCase()
  const e = (excerpt || '').toLowerCase()

  // Era / topic detection for style selection
  const isAncient    = /greek|roman|spartan|thermopylae|caesar|macedon|persian|trojan|carthage|hannibal|agincourt|medieval|trebuchet|crusade|mongol|byzantine|napoleo|waterloo|trafalgar|wellington/.test(t + e)
  const isWWI        = /world war i|wwi|somme|ypres|verdun|passchendaele|gallipoli|1914|1915|1916|1917|1918|trench|western front/.test(t + e)
  const isWWII       = /world war ii|wwii|stalingrad|normandy|midway|bismarck|berlin|holocaust|d-day|hiroshima|nagasaki|pacific|1939|1940|1941|1942|1943|1944|1945|doolittle|mincemeat|arnhem|airlift/.test(t + e)
  const isKorea      = /korean|inchon|chosin|pusan|macarthur|38th parallel/.test(t + e)
  const isVietnam    = /vietnam|tet|saigon|mekong|viet cong|napalm|khe sanh|hue|dmz/.test(t + e)
  const isColdWar    = /cold war|cia|kgb|spy|espionage|berlin tunnel|berlin wall|cuban|missile|defector|cicero|mossad/.test(t + e)
  const isModern     = /desert storm|gulf war|iraq|afghanistan|operation|1990|1991|2001|2003|2004|2005/.test(t + e)

  let style, subject

  if (isAncient) {
    style = 'epic oil painting, Romantic era military art style, dramatic chiaroscuro lighting, painterly brushwork, museum masterpiece quality, warm amber and crimson tones'
    subject = title
  } else if (isWWI) {
    style = 'dramatic WWI era oil painting, mud and steel, No Man\'s Land, haunting atmosphere, muted earth tones punctuated by fire, expressionist war art, powerful and somber'
    subject = title
  } else if (isWWII) {
    style = 'cinematic WWII war photography aesthetic, high contrast black and white or dramatic desaturated color, documentary realism, intense dramatic lighting, smoke and steel'
    subject = title
  } else if (isVietnam) {
    style = 'cinematic Vietnam War photography, dense jungle atmosphere, helicopter silhouettes, dramatic dusk or dawn light, film grain, high contrast documentary style'
    subject = title
  } else if (isKorea) {
    style = 'cinematic Korean War era military photography, frozen winter landscape, dramatic cold grey skies, intense chiaroscuro, documentary realism'
    subject = title
  } else if (isColdWar) {
    style = 'atmospheric Cold War era espionage, shadows and fog, dim streetlights, tension-filled composition, film noir aesthetic, moody dramatic lighting'
    subject = title
  } else if (isModern) {
    style = 'cinematic modern warfare photography, desert or urban environment, dramatic military realism, intense directional light, photojournalism quality'
    subject = title
  } else {
    style = 'cinematic military history, dramatic oil painting, powerful composition, intense atmospheric lighting, museum quality, ultra detailed'
    subject = title
  }

  return `${subject}, ${style}, ultra detailed, 8k, no text, no watermarks, no logos, historical accuracy, powerful visual storytelling`
}

// ── Sanity helpers ────────────────────────────────────────────────────────────
async function sanityQuery(groq) {
  const res = await fetch(`${SANITY_API}/query/${DATASET}?query=${encodeURIComponent(groq)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })
  return (await res.json()).result
}

async function uploadImageToSanity(imageBuffer, filename) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'image/jpeg',
      },
      body: imageBuffer,
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Upload failed: ${res.status} ${err}`)
  }
  return (await res.json()).document._id
}

async function patchArticleImage(articleId, assetId, altText) {
  const res = await fetch(`${SANITY_API}/mutate/${DATASET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: articleId,
          set: {
            mainImage: {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
              alt: altText,
            }
          }
        }
      }]
    })
  })
  if (!res.ok) throw new Error(`Patch failed: ${res.status} ${await res.text()}`)
  return await res.json()
}

// ── Image generation via Pollinations.ai ──────────────────────────────────────
async function generateImage(prompt, retries = 3) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=800&nologo=true&model=flux&seed=${Math.floor(Math.random() * 99999)}`

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = await res.arrayBuffer()
      if (buf.byteLength < 10000) throw new Error('Image too small — likely a placeholder')
      return Buffer.from(buf)
    } catch (err) {
      console.log(`    ⚠️  Attempt ${i + 1} failed: ${err.message}`)
      if (i < retries - 1) await new Promise(r => setTimeout(r, 5000))
    }
  }
  throw new Error('All retries exhausted')
}

// ── Main ──────────────────────────────────────────────────────────────────────
const query = TARGET_ID
  ? `*[_type == "article" && _id == "${TARGET_ID}"] { _id, title, "slug": slug.current, excerpt }`
  : `*[_type == "article" && status == "published" && !(_id in path("drafts.**")) && !defined(mainImage.asset._ref)] | order(publishedAt desc) { _id, title, "slug": slug.current, excerpt } [0...50]`

console.log(`\n🎨  Library of War — AI Image Generator (Pollinations.ai / Flux)\n`)
console.log(`Engine: pollinations.ai — 100% free, no API key, no usage limits\n`)
if (DRY_RUN) console.log('⚡  DRY RUN — no images will be generated or uploaded\n')

const articles = await sanityQuery(query)
console.log(`Found ${articles.length} article(s) without images\n`)

// Deduplicate by _id in case Sanity returns duplicates
const seen = new Set()
const unique = articles.filter(a => {
  if (seen.has(a._id)) return false
  seen.add(a._id)
  return true
})

let success = 0, failed = 0

for (const article of unique) {
  const prompt = buildPrompt(article.title, article.excerpt)
  console.log(`── ${article.title}`)
  console.log(`   ID:     ${article._id}`)
  console.log(`   Prompt: ${prompt.slice(0, 100)}...`)

  if (DRY_RUN) { console.log(''); continue }

  try {
    console.log('   Generating...')
    const imgBuf = await generateImage(prompt)
    console.log(`   Generated: ${Math.round(imgBuf.byteLength / 1024)}KB`)

    const slug = article.slug || article._id.slice(0, 20)
    const filename = `ai-${slug.replace(/[^a-z0-9]/gi, '-').slice(0, 40)}.jpg`

    console.log('   Uploading to Sanity...')
    const assetId = await uploadImageToSanity(imgBuf, filename)
    console.log(`   Asset: ${assetId}`)

    await patchArticleImage(article._id, assetId, article.title)
    console.log('   ✅ Patched\n')
    success++

    // Rate limit: 3 seconds between requests
    await new Promise(r => setTimeout(r, 3000))
  } catch (err) {
    console.log(`   ❌ Failed: ${err.message}\n`)
    failed++
  }
}

console.log(`\n✅  Done. Success: ${success} | Failed: ${failed}`)
if (DRY_RUN) console.log('   Run without --dry-run to generate and upload images.')
console.log('\n📌  Engine used: https://pollinations.ai (Flux model)')
console.log('   Free tier: unlimited, no API key, no signup required.')
console.log('   For higher volume or custom training: Replicate.com or Hugging Face Inference API')
