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
  if(cl>MAX)throw new Error(`Too large: ${(cl/1024).toFixed(0)}KB`)
  const img=await fetch(thumbUrl,{headers:{'User-Agent':UA,Referer:'https://commons.wikimedia.org/'}})
  if(!img.ok)throw new Error(`Download ${img.status}`)
  const buf=await img.arrayBuffer()
  if(buf.byteLength>MAX)throw new Error(`Buffer too large`)
  const r=await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`,{method:'POST',headers:{'Content-Type':mimeType,Authorization:`Bearer ${TOKEN}`},body:buf})
  const d=await r.json()
  if(!d?.document?._id)throw new Error(`Upload failed: ${JSON.stringify(d)}`)
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
    id:'article-battle-of-the-bulge',
    files:['Battle Bulge 1944 HD-SN-99-02998.JPEG'],
    alt:'American soldiers advance through snow during the Battle of the Bulge, Ardennes, winter 1944',
    caption:'American troops in the Ardennes during the Battle of the Bulge, December 1944. Hitler\'s last major offensive on the Western Front created a 50-mile bulge in Allied lines. It was the largest and bloodiest battle fought by the United States in World War II.',
    src:'https://commons.wikimedia.org/wiki/File:Battle_Bulge_1944_HD-SN-99-02998.JPEG',
  },
  {
    id:'article-battle-of-waterloo',
    files:['Bataille Waterloo 1815 reconstitution 2011 cuirassier.jpg'],
    alt:'French cuirassier cavalry re-enactment of the Battle of Waterloo, 1815 — heavy armoured horsemen who made massed charges against Wellington\'s squares',
    caption:'French cuirassiers at a Waterloo re-enactment. On June 18, 1815, Napoleon committed his elite heavy cavalry in repeated charges against British infantry squares. The squares held. By nightfall, the Grande Armée had ceased to exist.',
    src:'https://commons.wikimedia.org/wiki/File:Bataille_Waterloo_1815_reconstitution_2011_cuirassier.jpg',
  },
  {
    id:'article-siege-of-leningrad',
    files:['RIAN archive 2153 After bombing.jpg'],
    alt:'Leningrad street scene after a German air raid, 1941 — civilians survey destroyed buildings during the 872-day siege',
    caption:'A Leningrad street after German bombing, 1941. The siege lasted 872 days — from September 1941 to January 1944. Over one million civilians died, most from starvation. The city never surrendered.',
    src:'https://commons.wikimedia.org/wiki/File:RIAN_archive_2153_After_bombing.jpg',
  },
  {
    id:'article-battle-of-midway',
    files:['Japanese aircraft carrier Sōryū underway during Battle of Midway on 4 June 1942.jpg'],
    alt:'Japanese aircraft carrier Sōryū manoeuvring under attack during the Battle of Midway, June 4, 1942',
    caption:'The Japanese carrier Sōryū manoeuvring under attack at Midway, June 4, 1942. Within six minutes, American dive bombers sank three Japanese fleet carriers. Sōryū, Kaga, and Akagi — the core of the force that had attacked Pearl Harbor — were all burning by mid-morning.',
    src:'https://commons.wikimedia.org/wiki/File:Japanese_aircraft_carrier_S%C5%8Dry%C5%AB_underway_during_Battle_of_Midway_on_4_June_1942.jpg',
  },
  {
    id:'article-irish-brigade-civil-war',
    files:['Carl Röchling - The Battle of Fredericksburg, December 13, 1862.jpg'],
    alt:'The Battle of Fredericksburg, December 13, 1862 — painting by Carl Röchling depicting the assault on Marye\'s Heights',
    caption:'Carl Röchling\'s painting of the Battle of Fredericksburg, December 13, 1862. The Irish Brigade charged Marye\'s Heights six times. Each charge was repulsed with devastating losses. Confederate defenders later said they had never seen men fight with such courage and such hopelessness.',
    src:'https://commons.wikimedia.org/wiki/File:Carl_R%C3%B6chling_-_The_Battle_of_Fredericksburg,_December_13,_1862.jpg',
  },
  {
    id:'article-battle-of-sekigahara',
    files:['Sekigaharascreen.jpg','Battle of Sekigahara folding screen.jpg'],
    alt:'Folding screen depicting the Battle of Sekigahara, October 21, 1600 — the decisive clash that established the Tokugawa shogunate',
    caption:'A folding screen depicting the Battle of Sekigahara, October 21, 1600. Tokugawa Ieyasu\'s victory over the western coalition ended Japan\'s century of civil war. The Tokugawa shogunate that followed would rule Japan for 265 years.',
    src:'https://commons.wikimedia.org/wiki/File:Sekigaharascreen.jpg',
  },
]

console.log(`\n📸  Uploading images for Batch 3D (${ARTICLES.length} articles)\n`)
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
