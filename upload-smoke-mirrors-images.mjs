/**
 * upload-smoke-mirrors-images.mjs
 * Uploads Wikimedia Commons public domain images for all 12 Smoke and Mirrors articles.
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
  return 'image/jpeg'
}

const ARTICLES = [
  {
    id: 'sm-paperclip',
    files: ['Wernher von Braun 1960.jpg'],
    alt: 'Wernher von Braun, 1960 — former SS officer and Operation Paperclip recruit who became the architect of NASA\'s Saturn V rocket',
    caption: 'Wernher von Braun in 1960. A former SS-Sturmbannführer and director of the V-2 rocket program, he was brought to the US under Operation Paperclip and became director of NASA\'s Marshall Space Flight Center.',
    src: 'https://commons.wikimedia.org/wiki/File:Wernher_von_Braun_1960.jpg',
  },
  {
    id: 'sm-northwoods',
    files: ['Bay of Pigs Invasion - Brigade 2506 Patch.jpg', 'Kennedy signing Proclamation 3504 (Cuban Quarantine).jpg'],
    alt: 'President Kennedy signing the proclamation for the Cuban quarantine, October 1962',
    caption: 'Kennedy signs Proclamation 3504 establishing the Cuban quarantine, October 23, 1962. Operation Northwoods — a plan to stage terrorist attacks to justify invading Cuba — had been presented to Kennedy 18 months earlier. He rejected it and fired the Joint Chiefs\' chairman.',
    src: 'https://commons.wikimedia.org/wiki/File:Kennedy_signing_Proclamation_3504_(Cuban_Quarantine).jpg',
  },
  {
    id: 'sm-gladio',
    files: ['Bologna station massacre.jpg', 'Stragi bologna 1980.jpg'],
    alt: 'Bologna railway station after the 1980 bombing — the deadliest act of terrorism in postwar Italy, linked to neo-fascist networks with Gladio connections',
    caption: 'The aftermath of the Bologna railway station bombing, August 2, 1980. The attack killed 85 people and wounded more than 200. Italian investigations linked elements of the attack to neo-fascist groups with ties to military intelligence and, more distantly, Operation Gladio stay-behind networks.',
    src: 'https://commons.wikimedia.org/wiki/File:Stragi_bologna_1980.jpg',
  },
  {
    id: 'sm-green-run',
    files: ['Hanford N Reactor adjusted.jpg', 'Hanford B Reactor.jpg'],
    alt: 'Hanford Site nuclear reactor, Washington State — location of the 1949 Green Run deliberate radioactive release experiment',
    caption: 'The Hanford Site B Reactor. On December 2, 1949, Hanford operators deliberately vented radioactive iodine-131 and xenon-133 from a nuclear reactor into the atmosphere as part of the classified Green Run experiment, exposing downwind communities in Washington and Oregon without their knowledge or consent.',
    src: 'https://commons.wikimedia.org/wiki/File:Hanford_B_Reactor.jpg',
  },
  {
    id: 'sm-sea-spray',
    files: ['Golden Gate Bridge als Hintergrund Alcatraz.jpg', 'San Francisco from Marin Headlands in November 2013.jpg'],
    alt: 'San Francisco Bay — the city targeted by Operation Sea-Spray, a 1950 US Army biological aerosol test on an unwitting civilian population',
    caption: 'San Francisco Bay. In September 1950, US Army ships sailed into the bay and sprayed clouds of Serratia marcescens and Bacillus globigii over the city to test how a biological weapon would disperse in an urban environment. Residents were not told.',
    src: 'https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_als_Hintergrund_Alcatraz.jpg',
  },
  {
    id: 'sm-unit-731',
    files: ['Unit 731 - Complex.jpg', '731 complex.jpg'],
    alt: 'Unit 731 complex, Harbin, Manchuria — the Japanese Imperial Army\'s biological warfare research facility where thousands of prisoners were killed in human experiments',
    caption: 'Aerial view of the Unit 731 complex outside Harbin. The facility ran from 1936 to 1945 and killed an estimated 3,000 to 10,000 prisoners through deliberate infection, vivisection, and exposure experiments. The US granted immunity to its leadership in exchange for the research data.',
    src: 'https://commons.wikimedia.org/wiki/File:Unit_731_-_Complex.jpg',
  },
  {
    id: 'sm-mockingbird',
    files: ['CIA-Hauptquartier in Langley.jpg', 'Cia-headquarters.jpg'],
    alt: 'CIA headquarters, Langley, Virginia — the agency accused of running Operation Mockingbird, a media influence program during the Cold War',
    caption: 'CIA headquarters in Langley, Virginia. The Church Committee (1975) confirmed the CIA had paid journalists and placed stories in domestic media. The full scope of what became known as Operation Mockingbird remains disputed — the name itself appears in few official documents.',
    src: 'https://commons.wikimedia.org/wiki/File:Cia-headquarters.jpg',
  },
  {
    id: 'sm-stargate',
    files: ['US Army soldier resting.jpg', 'Russell Targ at TED conference.jpg'],
    alt: 'Remote viewing research — Project Stargate, the US Army\'s psychic intelligence program, ran from 1972 to 1995',
    caption: 'The US Army\'s Project Stargate used "remote viewers" — people who claimed to perceive distant locations psychically — for intelligence collection from 1972 to 1995. An independent evaluation found the program had "no demonstrated intelligence value." It was shut down, not because it was too weird, but because it didn\'t work well enough.',
    src: 'https://commons.wikimedia.org/wiki/File:Russell_Targ_at_TED_conference.jpg',
  },
  {
    id: 'sm-gehlen',
    files: ['Reinhard Gehlen.jpg'],
    alt: 'Reinhard Gehlen, former Nazi intelligence chief who built West Germany\'s postwar intelligence service for the CIA',
    caption: 'Reinhard Gehlen. As head of German military intelligence on the Eastern Front, he surrendered his files to the US Army in 1945 and was allowed to rebuild his spy network — staffed with former SS and Gestapo officers — as a CIA asset. He ran it until 1968.',
    src: 'https://commons.wikimedia.org/wiki/File:Reinhard_Gehlen.jpg',
  },
  {
    id: 'sm-nazi-bell',
    files: ['Wenceslaus Mine (Kopalnia Waclaw) - The Henge 2.jpg', 'Riese - Komplex Osowka (3).jpg'],
    alt: 'The Henge at the Wenceslaus Mine in Lower Silesia — a mysterious concrete structure linked by conspiracy theorists to the alleged Nazi Bell superweapon',
    caption: 'The so-called "Henge" at the Wenceslaus Mine near Ludwikowice, Poland. The structure\'s actual purpose is disputed (possibly a cooling tower mount). It became central to the Die Glocke legend after Igor Witkowski\'s 2000 book — despite no contemporaneous documentation of the device ever being found.',
    src: 'https://commons.wikimedia.org/wiki/File:Wenceslaus_Mine_(Kopalnia_Waclaw)_-_The_Henge_2.jpg',
  },
  {
    id: 'sm-philadelphia',
    files: ['USS_Eldridge_DE-173.jpg', 'USS Eldridge DE-173.jpg'],
    alt: 'USS Eldridge (DE-173) — the destroyer escort at the centre of the Philadelphia Experiment legend',
    caption: 'USS Eldridge (DE-173). According to the Philadelphia Experiment legend, in October 1943 the Eldridge was made invisible, teleported to Norfolk and back, and caused crew members to be fused into bulkheads. Surviving crew members denied it. Ships\' logs place Eldridge elsewhere on the alleged dates.',
    src: 'https://commons.wikimedia.org/wiki/File:USS_Eldridge_DE-173.jpg',
  },
  {
    id: 'sm-majestic12',
    files: ['Roswell UFO crash site marker.jpg', 'UFO Roswell Museum.jpg'],
    alt: 'Roswell, New Mexico — the 1947 crash site that spawned the Majestic 12 legend about a secret government UFO committee',
    caption: 'The International UFO Museum in Roswell, New Mexico. The Majestic 12 documents, first surfaced in 1984, purported to reveal a secret committee established by Truman to manage alien contact after the Roswell crash. The FBI investigated and concluded they were fabricated.',
    src: 'https://commons.wikimedia.org/wiki/File:UFO_Roswell_Museum.jpg',
  },
]

console.log(`\n🕵️  Smoke and Mirrors — Uploading ${ARTICLES.length} images\n`)
const ok = [], fail = []

for (const a of ARTICLES) {
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
console.log(`  ✓ ${ok.length} images uploaded`)
if (fail.length) {
  console.log(`  ✗ ${fail.length} failed:`)
  fail.forEach(f => console.log(`    ${f}`))
}
console.log()
