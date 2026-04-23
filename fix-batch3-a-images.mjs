import { readFileSync } from 'fs'
import { resolve } from 'path'

const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => { try { const e = readFileSync(resolve('.env.local'), 'utf-8'); return e.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim() } catch { return null } })()
if (!TOKEN) { console.error('No token'); process.exit(1) }

const PROJECT = 'tifzt4zw', DATASET = 'production'
const BASE = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`
const ASSETS = `https://${PROJECT}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
const UA = 'LibraryOfWarImageBot/1.0 (hello@libraryofwar.com)'
const MAX = 1_048_576

async function resolveThumbUrl(filename) {
  const r = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`, { headers: { 'User-Agent': UA } })
  const d = await r.json()
  const pages = Object.values(d?.query?.pages || {})
  const url = pages[0]?.imageinfo?.[0]?.url
  if (!url) return null
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)(\/\w\/\w\w\/)(.+)$/)
  if (!m) return null
  return { thumb: `${m[1]}/thumb${m[2]}${m[3]}/1200px-${m[3]}`, ext: filename.split('.').pop().toLowerCase() }
}

async function upload(thumbUrl, mimeType, slug) {
  const head = await fetch(thumbUrl, { method: 'HEAD', headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  const cl = parseInt(head.headers.get('content-length') || '0', 10)
  if (cl > MAX) throw new Error(`Too large: ${(cl/1024).toFixed(0)} KB`)
  const img = await fetch(thumbUrl, { headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  if (!img.ok) throw new Error(`Download ${img.status}`)
  const buf = await img.arrayBuffer()
  if (buf.byteLength > MAX) throw new Error(`Buffer too large`)
  const r = await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`, { method: 'POST', headers: { 'Content-Type': mimeType, Authorization: `Bearer ${TOKEN}` }, body: buf })
  const d = await r.json()
  if (!d?.document?._id) throw new Error(`Upload failed: ${JSON.stringify(d)}`)
  return d.document._id
}

async function patch(id, assetRef, alt, caption, sourceUrl) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ patch: { id, set: { mainImage: { _type: 'image', asset: { _type: 'reference', _ref: assetRef }, alt, caption, sourceUrl } } } }] }),
  })
  if (!r.ok) throw new Error(await r.text())
}

function mime(ext) { return ext === 'png' ? 'image/png' : 'image/jpeg' }

const FIXES = [
  {
    id: 'article-doolittle-raid',
    files: ['B-25 bomber by James Doolittle took off from the USS Hornet for Doolittle Raid in 1942.jpg'],
    alt: 'A B-25 Mitchell bomber takes off from USS Hornet during the Doolittle Raid, April 18, 1942',
    caption: 'A B-25 Mitchell lifts from USS Hornet on April 18, 1942. The bombers had never been designed for carrier operations. All 16 aircraft made it airborne.',
    src: 'https://commons.wikimedia.org/wiki/File:B-25_bomber_by_James_Doolittle_took_off_from_the_USS_Hornet_for_Doolittle_Raid_in_1942.jpg',
  },
  {
    id: 'article-market-garden',
    files: ['British paratroopers in Oosterbeek.jpg'],
    alt: 'British paratroopers in Oosterbeek during Operation Market Garden, September 1944',
    caption: 'British paratroopers in Oosterbeek, September 1944. The British 1st Airborne held the perimeter around Arnhem for nine days before fewer than 2,400 of the original 10,000 were evacuated across the Rhine.',
    src: 'https://commons.wikimedia.org/wiki/File:British_paratroopers_in_Oosterbeek.jpg',
  },
  {
    id: 'article-winter-war',
    files: ['1939-1940 Winter war soldiers.png'],
    alt: 'Finnish soldiers during the Winter War, 1939-1940',
    caption: 'Finnish soldiers during the Winter War, 1939-40. Outnumbered roughly three-to-one in men and dramatically outgunned in armour, Finland held the Soviet Union to a grinding 95-day campaign that shocked military planners across Europe.',
    src: 'https://commons.wikimedia.org/wiki/File:1939-1940_Winter_war_soldiers.png',
  },
  {
    id: 'article-christmas-truce-1914',
    files: ['The Christmas Truce on the Western Front, 1914 Q50721.jpg'],
    alt: 'British and German soldiers meet in no man\'s land during the Christmas Truce, December 25, 1914',
    caption: 'British and German soldiers in no man\'s land, Christmas 1914. The truce was not ordered — it emerged spontaneously when German troops lit candles on their parapets on Christmas Eve. Photographed by soldiers on both sides.',
    src: 'https://commons.wikimedia.org/wiki/File:The_Christmas_Truce_on_the_Western_Front,_1914_Q50721.jpg',
  },
]

console.log(`\n🔧  Fixing ${FIXES.length} Batch 3A images\n`)
const ok = [], fail = []
for (const a of FIXES) {
  process.stdout.write(`  ▸ [${a.id}]\n`)
  let resolved = null, used = null
  for (const f of a.files) {
    const info = await resolveThumbUrl(f)
    if (info) { resolved = info; used = f; break }
    await new Promise(r => setTimeout(r, 400))
  }
  if (!resolved) { console.log(`    ✗ Missing\n`); fail.push(a.id); continue }
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
console.log(`── ${ok.length} fixed, ${fail.length} failed`)
if (fail.length) fail.forEach(f => console.log(`  ✗ ${f}`))
