/**
 * upload-batch3-a-images.mjs — images for articles 1–6
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

if (!TOKEN) { console.error('No SANITY_API_TOKEN'); process.exit(1) }

const PROJECT = 'tifzt4zw'
const DATASET = 'production'
const BASE    = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`
const ASSETS  = `https://${PROJECT}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
const UA      = 'LibraryOfWarImageBot/1.0 (hello@libraryofwar.com)'
const MAX     = 1_048_576

async function resolveThumbUrl(filename) {
  const r = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`,
    { headers: { 'User-Agent': UA } }
  )
  const d = await r.json()
  const pages = Object.values(d?.query?.pages || {})
  const url = pages[0]?.imageinfo?.[0]?.url
  if (!url) return null
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)(\/\w\/\w\w\/)(.+)$/)
  if (!m) return null
  const ext = filename.split('.').pop().toLowerCase()
  return { thumb: `${m[1]}/thumb${m[2]}${m[3]}/1200px-${m[3]}`, ext }
}

async function upload(thumbUrl, mimeType, slug) {
  const head = await fetch(thumbUrl, { method: 'HEAD', headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  const cl = parseInt(head.headers.get('content-length') || '0', 10)
  if (cl > 0 && cl > MAX) throw new Error(`Too large: ${(cl/1024).toFixed(0)} KB`)
  const img = await fetch(thumbUrl, { headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  if (!img.ok) throw new Error(`Download ${img.status}`)
  const buf = await img.arrayBuffer()
  if (buf.byteLength > MAX) throw new Error(`Buffer too large`)
  const r = await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { 'Content-Type': mimeType, Authorization: `Bearer ${TOKEN}` },
    body: buf,
  })
  const d = await r.json()
  if (!d?.document?._id) throw new Error(`Upload failed: ${JSON.stringify(d)}`)
  return d.document._id
}

async function patch(id, assetRef, alt, caption, sourceUrl) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ patch: { id, set: { mainImage: {
      _type: 'image', asset: { _type: 'reference', _ref: assetRef }, alt, caption, sourceUrl
    }}}}]}),
  })
  if (!r.ok) throw new Error(await r.text())
}

function mime(ext) {
  return ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
}

const ARTICLES = [
  {
    id: 'article-doolittle-raid',
    files: ['Doolittle Raid - B-25 takes off from USS Hornet.jpg', 'Doolittle raid.jpg'],
    alt: 'A B-25 Mitchell bomber takes off from USS Hornet during the Doolittle Raid, April 18, 1942',
    caption: 'A B-25 Mitchell lifts off from USS Hornet on April 18, 1942. The bombers had never been designed for carrier operations — the deck run was 450 feet. All 16 aircraft made it airborne.',
    src: 'https://commons.wikimedia.org/wiki/File:Doolittle_raid.jpg',
  },
  {
    id: 'article-light-brigade',
    files: ['Charge of the Light Brigade.jpg', 'Charge of the Light Brigade by William Simpson.jpg'],
    alt: 'The Charge of the Light Brigade, October 25, 1854 — British cavalry charges Russian artillery at Balaclava',
    caption: 'The Charge of the Light Brigade, October 25, 1854. 673 men rode into artillery fire on three sides because three generals could not agree on what one order meant.',
    src: 'https://commons.wikimedia.org/wiki/File:Charge_of_the_Light_Brigade.jpg',
  },
  {
    id: 'article-market-garden',
    files: ['Operation Market Garden - paratroopers.jpg', 'Parachute infantry Market Garden.jpg', 'Operation Market Garden airborne troops.jpg'],
    alt: 'Allied paratroopers land during Operation Market Garden, September 1944',
    caption: 'Allied paratroopers descend over the Netherlands during Operation Market Garden, September 1944. The largest airborne operation in history came within reach of ending the war — and stalled at the last bridge.',
    src: 'https://commons.wikimedia.org/wiki/File:Operation_Market_Garden_airborne_troops.jpg',
  },
  {
    id: 'article-winter-war',
    files: ['Finnish soldiers in the Winter War.jpg', 'Talvisota Finnish soldiers 1940.jpg', 'Winter War Finnish ski troops.jpg'],
    alt: 'Finnish soldiers during the Winter War, 1939-1940, in the forests of Karelia',
    caption: 'Finnish soldiers in the forests of Karelia, Winter War 1939-40. Finnish ski troops used the terrain to devastating effect, cutting Soviet columns into isolated pockets and destroying them in what became known as motti tactics.',
    src: 'https://commons.wikimedia.org/wiki/File:Finnish_soldiers_in_the_Winter_War.jpg',
  },
  {
    id: 'article-operation-mincemeat',
    files: ['Operation Mincemeat - Major Martin.jpg', 'Ewen Montagu.jpg', 'HMS Seraph.jpg'],
    alt: 'HMS Seraph (P219), the British submarine that deposited the body of Major William Martin off the coast of Spain in April 1943',
    caption: 'HMS Seraph (P219). On April 30, 1943, this submarine surfaced off Huelva, Spain, and released the body of Glyndwr Michael — disguised as Royal Marines Major William Martin — into the Atlantic. The deception worked.',
    src: 'https://commons.wikimedia.org/wiki/File:HMS_Seraph.jpg',
  },
  {
    id: 'article-christmas-truce-1914',
    files: ['Christmas Truce 1914.jpg', 'British and German soldiers Christmas Truce 1914.jpg', 'Fraternizing soldiers Christmas 1914.jpg'],
    alt: 'British and German soldiers meet in no man\'s land during the Christmas Truce, December 1914',
    caption: 'British and German soldiers meet in no man\'s land, Christmas 1914. The truce was not ordered or planned — it emerged spontaneously along sections of the Western Front when German troops placed candles on their parapets on Christmas Eve.',
    src: 'https://commons.wikimedia.org/wiki/File:Christmas_Truce_1914.jpg',
  },
]

console.log(`\n📸  Uploading images for Batch 3A (${ARTICLES.length} articles)\n`)
const ok = [], fail = []

for (const a of ARTICLES) {
  process.stdout.write(`  ▸ [${a.id}]\n`)
  let resolved = null, used = null
  for (const f of a.files) {
    const info = await resolveThumbUrl(f)
    if (info) { resolved = info; used = f; break }
    await new Promise(r => setTimeout(r, 400))
  }
  if (!resolved) { console.log(`    ✗ Not found\n`); fail.push(a.id); continue }
  try {
    process.stdout.write(`    ↓ ${used}\n`)
    const ref = await upload(resolved.thumb, mime(resolved.ext), a.id)
    await patch(a.id, ref, a.alt, a.caption, a.src)
    console.log(`    ✓ Done\n`)
    ok.push(a.id)
  } catch(e) {
    console.log(`    ✗ ${e.message}\n`)
    fail.push(a.id)
  }
  await new Promise(r => setTimeout(r, 600))
}

console.log(`── Result: ${ok.length} uploaded, ${fail.length} failed`)
if (fail.length) { console.log(`Failed:`); fail.forEach(f => console.log(`  ${f}`)) }
console.log()
