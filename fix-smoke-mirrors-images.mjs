/**
 * fix-smoke-mirrors-images.mjs
 * Fixes the 9 articles that failed in the initial image upload.
 * Uses verified Wikimedia Commons filenames.
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
  if (buf.byteLength > MAX) throw new Error(`Buffer too large: ${(buf.byteLength/1024).toFixed(0)} KB`)
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
  if (ext === 'svg') return 'image/svg+xml'
  return 'image/jpeg'
}

const FIXES = [
  {
    id: 'sm-northwoods',
    files: ['President Kennedy - signing Cuba Quarantine Proclamation.jpg'],
    alt: 'President Kennedy signing the Cuban Quarantine proclamation, October 1962',
    caption: 'Kennedy signs the Cuban quarantine proclamation on October 23, 1962. Operation Northwoods — the Joint Chiefs\' plan to stage terrorist attacks to justify invading Cuba — had been rejected by Kennedy 18 months earlier. He never told the public it had been proposed.',
    src: 'https://commons.wikimedia.org/wiki/File:President_Kennedy_-_signing_Cuba_Quarantine_Proclamation.jpg',
  },
  {
    id: 'sm-gladio',
    files: ['Strage di bologna soccorsi 18.jpg'],
    alt: 'Rescue operations at Bologna railway station after the 1980 bombing — the deadliest act of postwar Italian terrorism, linked to stay-behind networks',
    caption: 'Rescue workers at Bologna Centrale station after the August 2, 1980 bombing that killed 85 people. Italian parliamentary investigations linked elements of the attack to neo-fascist networks with ties to Operation Gladio, NATO\'s secret stay-behind armies.',
    src: 'https://commons.wikimedia.org/wiki/File:Strage_di_bologna_soccorsi_18.jpg',
  },
  {
    id: 'sm-sea-spray',
    files: ['GoldenGateBridge-001.jpg'],
    alt: 'Golden Gate Bridge, San Francisco — the city used as a testing ground for Operation Sea-Spray biological aerosol experiments in 1950',
    caption: 'San Francisco Bay and the Golden Gate Bridge. In September 1950, US Army vessels sailed through the bay and released clouds of Serratia marcescens and Bacillus globigii over the city to test how a biological agent would disperse. Residents were not informed. One hospital recorded an unusual spike in urinary tract infections.',
    src: 'https://commons.wikimedia.org/wiki/File:GoldenGateBridge-001.jpg',
  },
  {
    id: 'sm-mockingbird',
    files: ['Aerial view of CIA headquarters, Langley, Virginia 14271v.jpg'],
    alt: 'Aerial view of CIA headquarters, Langley, Virginia — the agency accused of running Operation Mockingbird, a Cold War media influence program',
    caption: 'CIA headquarters at Langley, Virginia. The 1975 Church Committee confirmed the agency had cultivated journalists and placed stories in domestic and foreign media. The full scope of what became known as Operation Mockingbird remains partially classified.',
    src: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_CIA_headquarters%2C_Langley%2C_Virginia_14271v.jpg',
  },
  {
    id: 'sm-stargate',
    files: ['SRI International HQ.jpg'],
    alt: 'SRI International, Menlo Park, California — where the US government\'s remote viewing research program began in 1972',
    caption: 'SRI International in Menlo Park, California. The Army\'s remote viewing research began here in 1972 under physicists Hal Puthoff and Russell Targ, funded by the CIA. The program produced 20 years of results — enough to convince the DIA to keep funding it, never quite enough to prove it worked.',
    src: 'https://commons.wikimedia.org/wiki/File:SRI_International_HQ.jpg',
  },
  {
    id: 'sm-gehlen',
    files: ['Reinhard Gehlen 1945.jpg'],
    alt: 'Reinhard Gehlen, 1945 — the Nazi intelligence chief who surrendered his files to the US Army and was allowed to rebuild his spy network as a CIA asset',
    caption: 'Reinhard Gehlen, photographed in 1945. As chief of Fremde Heere Ost — German military intelligence on the Eastern Front — he carefully preserved his files on Soviet operations and surrendered them as his bargaining chip. The US handed him an intelligence empire staffed with ex-SS officers.',
    src: 'https://commons.wikimedia.org/wiki/File:Reinhard_Gehlen_1945.jpg',
  },
  {
    id: 'sm-nazi-bell',
    files: ['Zamek Ksiaz.jpg'],
    alt: 'Zamek Ksiaz (Furstenstein Castle), Lower Silesia — the SS command centre for the Riese underground construction program, at the heart of the Nazi Bell legend',
    caption: 'Zamek Ksiaz (Furstenstein Castle) in Lower Silesia. The SS\'s massive Riese underground construction project, which the Die Glocke legend is attached to, was centred on this region. No contemporaneous documentation of the Bell device has ever been found.',
    src: 'https://commons.wikimedia.org/wiki/File:Zamek_Ksiaz.jpg',
  },
  {
    id: 'sm-philadelphia',
    files: ['USS Eldridge (DE-173) underway, circa in 1944.jpg'],
    alt: 'USS Eldridge (DE-173) underway, circa 1944 — the destroyer at the centre of the Philadelphia Experiment legend',
    caption: 'USS Eldridge (DE-173) underway, circa 1944. According to the Philadelphia Experiment legend, Eldridge was made invisible and teleported to Norfolk in October 1943. Ships\' logs place Eldridge elsewhere on the alleged dates. Surviving crew members denied the story.',
    src: 'https://commons.wikimedia.org/wiki/File:USS_Eldridge_(DE-173)_underway,_circa_in_1944.jpg',
  },
  {
    id: 'sm-majestic12',
    files: ['International UFO Museum and Research Center Roswell New Mexico.jpg'],
    alt: 'International UFO Museum and Research Center, Roswell, New Mexico — the epicentre of the Majestic 12 legend',
    caption: 'The International UFO Museum in Roswell, New Mexico. The 1947 Roswell incident — a crashed balloon, according to declassified Air Force documents — spawned the Majestic 12 legend. The alleged briefing papers first surfaced in 1984; the FBI investigated and concluded they were fabricated.',
    src: 'https://commons.wikimedia.org/wiki/File:International_UFO_Museum_and_Research_Center_Roswell_New_Mexico.jpg',
  },
]

console.log(`\n🔧  Fixing ${FIXES.length} Smoke and Mirrors images\n`)
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
  await new Promise(r => setTimeout(r, 600))
}

console.log(`── Result ──────────────────────────────`)
console.log(`  ✓ ${ok.length} fixed`)
if (fail.length) {
  console.log(`  ✗ ${fail.length} still failing:`)
  fail.forEach(f => console.log(`    ${f}`))
}
console.log()
