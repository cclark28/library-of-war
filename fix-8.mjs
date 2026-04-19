/**
 * fix-8.mjs — uploads images for the 8 articles that failed in batch 2 v2
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
  if (!d?.document?._id) throw new Error(`Asset upload failed: ${JSON.stringify(d)}`)
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
  if (ext === 'png') return 'image/png'
  if (ext === 'gif') return 'image/gif'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

const FIXES = [
  { id: 'article-battle-of-adrianople-378-ad-the-day-rome-started-dying',
    files: ['Death of Emperor Valens during the battle of Adrianople, 378.jpg'],
    alt: 'Death of Emperor Valens at the Battle of Adrianople, 378 AD',
    caption: 'The death of Emperor Valens at Adrianople, 378 AD — a catastrophe that exposed Rome\'s inability to stop Gothic settlement by force.',
    src: 'https://commons.wikimedia.org/wiki/File:Death_of_Emperor_Valens_during_the_battle_of_Adrianople,_378.jpg' },

  { id: 'article-39',
    files: ['IDF Centurion Tank on the Southern Front, Yom Kippur War 1973.jpg'],
    alt: 'IDF Centurion tank on the Southern Front, Yom Kippur War 1973',
    caption: 'An IDF Centurion on the Southern Front, October 1973. Egypt\'s crossing of the Suez Canal on Yom Kippur caught Israel almost completely unprepared.',
    src: 'https://commons.wikimedia.org/wiki/File:IDF_Centurion_Tank_on_the_Southern_Front,_Yom_Kippur_War_1973.jpg' },

  { id: 'article-41',
    files: ['Abrams in formation.jpg'],
    alt: 'M1A1 Abrams tanks in formation, Gulf War',
    caption: 'M1A1 Abrams tanks during Operation Desert Storm. At 73 Easting on 26 February 1991, Eagle Troop destroyed an Iraqi armored brigade in eight minutes.',
    src: 'https://commons.wikimedia.org/wiki/File:Abrams_in_formation.jpg' },

  { id: 'article-series-s1-a3-habakkuk',
    files: ['Corsair landing on HMS Illustrious (87) 1943.jpg'],
    alt: 'Carrier operations, HMS Illustrious 1943 — the era of Project Habakkuk',
    caption: 'Project Habakkuk (1942-43) proposed an aircraft carrier built from pykrete, a composite of wood pulp and ice. A scale prototype was built in Canada; the project was cancelled when Allied shipbuilding capacity recovered.',
    src: 'https://commons.wikimedia.org/wiki/File:Corsair_landing_on_HMS_Illustrious_(87)_1943.jpg' },

  { id: 'article-series-s1-a5-schwerer-gustav',
    files: ['Dzialobitnia DORA - Bobolin,.JPG'],
    alt: 'Dora railway gun — sister weapon to Schwerer Gustav, the largest guns ever used in combat',
    caption: 'Dora, sister gun to Schwerer Gustav. Both were 80cm calibre railway guns built by Krupp. Schwerer Gustav fired 800mm shells weighing 4.8 tonnes during the Siege of Sevastopol, 1942.',
    src: 'https://commons.wikimedia.org/wiki/File:Dzialobitnia_DORA_-_Bobolin,.JPG' },

  { id: 'article-series-s1-a8-sticky-bomb',
    files: ['Sticky Bomb- the Production of the No 74 Grenade in Britain, 1943 D14757.jpg'],
    alt: 'Production of the No. 74 ST Grenade (sticky bomb), Britain 1943',
    caption: 'Workers producing the No. 74 ST Grenade in 1943. The glass sphere coated in adhesive was designed to stick to tank armour. It worked — but equally well on the thrower\'s uniform.',
    src: 'https://commons.wikimedia.org/wiki/File:Sticky_Bomb-_the_Production_of_the_No_74_Grenade_in_Britain,_1943_D14757.jpg' },

  { id: '08EUFJXk3wQgRnqiFO5xcU',
    files: ['Agena rocket engine (1959).jpg'],
    alt: 'Agena rocket engine, 1959 — the upper stage used to launch CORONA spy satellites into orbit',
    caption: 'The Agena upper stage propelled CORONA satellites into polar orbit. Between 1960 and 1972, CORONA returned more photographic intelligence than all U-2 overflights combined.',
    src: 'https://commons.wikimedia.org/wiki/File:Agena_rocket_engine_(1959).jpg' },

  { id: '08EUFJXk3wQgRnqiFAszUc',
    files: ['Schlacht von Azincourt.jpg'],
    alt: 'The Battle of Agincourt, 1415 — the culmination of Henry V\'s extraordinary logistics campaign',
    caption: 'Agincourt, 25 October 1415. Henry V marched 400 miles through hostile France with a depleted, sick army and still won. The logistics that kept that force moving were as remarkable as the battle itself.',
    src: 'https://commons.wikimedia.org/wiki/File:Schlacht_von_Azincourt.jpg' },
]

console.log(`\n🔧  Fixing ${FIXES.length} failed articles\n`)
const ok = [], fail = []

for (const a of FIXES) {
  process.stdout.write(`  ▸ [${a.id}]\n`)
  let resolved = null, used = null
  for (const f of a.files) {
    const info = await resolveThumbUrl(f)
    if (info) { resolved = info; used = f; break }
    await new Promise(r => setTimeout(r, 400))
  }
  if (!resolved) { console.log(`    ✗ All alternatives missing\n`); fail.push(a.id); continue }
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
  await new Promise(r => setTimeout(r, 500))
}

console.log(`── Result ──────────────────────────────`)
console.log(`  ✓ ${ok.length} fixed`)
if (fail.length) { console.log(`  ✗ ${fail.length} still failing:`); fail.forEach(f => console.log(`    ${f}`)) }
console.log()
