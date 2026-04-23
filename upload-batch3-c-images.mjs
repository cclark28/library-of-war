import { readFileSync } from 'fs'
import { resolve } from 'path'
const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => { try { const e = readFileSync(resolve('.env.local'), 'utf-8'); return e.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim() } catch { return null } })()
if (!TOKEN) { console.error('No token'); process.exit(1) }
const PROJECT='tifzt4zw',DATASET='production'
const BASE=`https://${PROJECT}.api.sanity.io/v2023-01-01/data`
const ASSETS=`https://${PROJECT}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
const UA='LibraryOfWarImageBot/1.0 (hello@libraryofwar.com)',MAX=1_048_576
async function resolveThumbUrl(f){
  const r=await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(f)}&prop=imageinfo&iiprop=url&format=json`,{headers:{'User-Agent':UA}})
  const d=await r.json(),pages=Object.values(d?.query?.pages||{})
  const url=pages[0]?.imageinfo?.[0]?.url
  if(!url)return null
  const m=url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)(\/\w\/\w\w\/)(.+)$/)
  if(!m)return null
  return{thumb:`${m[1]}/thumb${m[2]}${m[3]}/1200px-${m[3]}`,ext:f.split('.').pop().toLowerCase()}
}
async function upload(thumbUrl,mimeType,slug){
  const head=await fetch(thumbUrl,{method:'HEAD',headers:{'User-Agent':UA,Referer:'https://commons.wikimedia.org/'}})
  const cl=parseInt(head.headers.get('content-length')||'0',10)
  if(cl>MAX)throw new Error(`Too large`)
  const img=await fetch(thumbUrl,{headers:{'User-Agent':UA,Referer:'https://commons.wikimedia.org/'}})
  if(!img.ok)throw new Error(`Download ${img.status}`)
  const buf=await img.arrayBuffer()
  if(buf.byteLength>MAX)throw new Error(`Buffer too large`)
  const r=await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`,{method:'POST',headers:{'Content-Type':mimeType,Authorization:`Bearer ${TOKEN}`},body:buf})
  const d=await r.json()
  if(!d?.document?._id)throw new Error(`Upload failed`)
  return d.document._id
}
async function patch(id,assetRef,alt,caption,sourceUrl){
  const r=await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`,{
    method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${TOKEN}`},
    body:JSON.stringify({mutations:[{patch:{id,set:{mainImage:{_type:'image',asset:{_type:'reference',_ref:assetRef},alt,caption,sourceUrl}}}}]})
  })
  if(!r.ok)throw new Error(await r.text())
}
function mime(ext){return ext==='png'?'image/png':ext==='gif'?'image/gif':'image/jpeg'}

const ARTICLES=[
  {
    id:'article-fall-of-singapore',
    files:['Surrender Singapore.jpg'],
    alt:'General Percival and British officers walk to the surrender of Singapore, February 15, 1942',
    caption:'General Arthur Percival (right, carrying the Union Jack) leads the British delegation to surrender Singapore to Japanese forces, February 15, 1942. 85,000 troops went into captivity — a defeat Churchill called the worst in British military history.',
    src:'https://commons.wikimedia.org/wiki/File:Surrender_Singapore.jpg',
  },
  {
    id:'article-greek-fire',
    files:['Greekfire-madridskylitzes1.jpg'],
    alt:'Byzantine warship deploying Greek fire against an enemy fleet — illumination from the Madrid Skylitzes manuscript, 12th century',
    caption:'Byzantine warships deploying Greek fire, from the Madrid Skylitzes manuscript (12th century). The weapon burned on water and could not be extinguished. Its formula was kept so secret that the Byzantines eventually lost it themselves.',
    src:'https://commons.wikimedia.org/wiki/File:Greekfire-madridskylitzes1.jpg',
  },
  {
    id:'article-thermopylae',
    files:['Textile, Leonidas at Thermopylae, ca. 1815 (CH 18682991).jpg'],
    alt:'Leonidas at Thermopylae — French decorative textile, circa 1815, depicting the Spartan king\'s last stand at the Hot Gates in 480 BC',
    caption:'Leonidas at Thermopylae, French textile, circa 1815. The three-day defence of the Hot Gates by 300 Spartans and several thousand Greek allies in 480 BC became the defining story of the Persian Wars — and of noble last stands across 2,500 years of Western culture.',
    src:'https://commons.wikimedia.org/wiki/File:Textile,_Leonidas_at_Thermopylae,_ca._1815_(CH_18682991).jpg',
  },
  {
    id:'article-kamikaze-pilots',
    files:['Mitsubishi A6M kamikaze attacking USS Enterprise (CV-6) 1945.jpg'],
    alt:'A Mitsubishi A6M Zero in a kamikaze attack on USS Enterprise, 1945',
    caption:'A Mitsubishi A6M Zero in a kamikaze attack on USS Enterprise (CV-6), 1945. Between October 1944 and August 1945, approximately 3,800 kamikaze pilots died in operations that sank 34 American ships and damaged 368 others.',
    src:'https://commons.wikimedia.org/wiki/File:Mitsubishi_A6M_kamikaze_attacking_USS_Enterprise_(CV-6)_1945.jpg',
  },
  {
    id:'article-raid-on-ploesti',
    files:['Oil installations being raided by B-24 Liberator bombers, Ploesti, Romania, 1943 (27703596316).jpg','B-24D Suzy Q returning from raid in Ploesti (1943).jpg'],
    alt:'B-24 Liberator bombers attacking oil installations at Ploesti, Romania, August 1, 1943 — Operation Tidal Wave',
    caption:'B-24 Liberator bombers attacking oil refineries at Ploesti, Romania, during Operation Tidal Wave, August 1, 1943. The mission was flown at rooftop level. 53 of 178 aircraft were lost. Five Medals of Honor were awarded — the most for any single American military operation.',
    src:'https://commons.wikimedia.org/wiki/File:Oil_installations_being_raided_by_B-24_Liberator_bombers,_Ploesti,_Romania,_1943_(27703596316).jpg',
  },
  {
    id:'article-bletchley-park-enigma',
    files:['Building at Bletchley Park - geograph.org.uk - 1593263.jpg'],
    alt:'Bletchley Park, Buckinghamshire — wartime home of Government Code and Cypher School, where the Enigma cipher was broken',
    caption:'Bletchley Park, Buckinghamshire. In this Victorian country house and its surrounding huts, mathematicians, linguists, and chess champions broke Nazi Germany\'s Enigma cipher. The secret was maintained for 30 years after the war ended.',
    src:'https://commons.wikimedia.org/wiki/File:Building_at_Bletchley_Park_-_geograph.org.uk_-_1593263.jpg',
  },
]

console.log(`\n📸  Uploading images for Batch 3C\n`)
const ok=[],fail=[]
for(const a of ARTICLES){
  process.stdout.write(`  ▸ [${a.id}]\n`)
  let resolved=null,used=null
  for(const f of a.files){
    const info=await resolveThumbUrl(f)
    if(info){resolved=info;used=f;break}
    await new Promise(r=>setTimeout(r,400))
  }
  if(!resolved){console.log(`    ✗ Missing\n`);fail.push(a.id);continue}
  try{
    process.stdout.write(`    ↓ ${used}\n`)
    const ref=await upload(resolved.thumb,mime(resolved.ext),a.id)
    await patch(a.id,ref,a.alt,a.caption,a.src)
    console.log(`    ✓ Done\n`)
    ok.push(a.id)
  }catch(e){
    console.log(`    ✗ ${e.message}\n`)
    fail.push(a.id)
  }
  await new Promise(r=>setTimeout(r,600))
}
console.log(`── ${ok.length} uploaded, ${fail.length} failed`)
if(fail.length)fail.forEach(f=>console.log(`  ✗ ${f}`))
