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
    id:'article-night-witches',
    files:['Po 2 w 2 Pulku Lotnictwa Bombowego.jpg','Евдокия Давыдовна Бершанская.jpg'],
    alt:'A Polikarpov Po-2 biplane — the aircraft flown by the Night Witches, 588th Night Bomber Regiment, in World War II',
    caption:'A Polikarpov Po-2 in service with a night bomber regiment. The Night Witches flew this wood-and-canvas biplane on up to 18 sorties per night. Its engine could be cut on approach, letting crews glide silently over German positions.',
    src:'https://commons.wikimedia.org/wiki/File:Po_2_w_2_Pulku_Lotnictwa_Bombowego.jpg',
  },
  {
    id:'article-tet-offensive',
    files:['US Embassy, Saigon, January 1968.jpg','A deserted street in Saigon during the Tet fighting.jpg'],
    alt:'US Embassy compound in Saigon, January 1968, after the Tet Offensive attack',
    caption:'The US Embassy compound in Saigon, January 1968. A Viet Cong sapper team breached the outer wall during the Tet Offensive. Every attacker was killed before reaching the main building — but the images reached American living rooms first.',
    src:'https://commons.wikimedia.org/wiki/File:US_Embassy,_Saigon,_January_1968.jpg',
  },
  {
    id:'article-442nd-regiment',
    files:['Co. L, 3rd Battalion, 442nd RCT receives Presidential Unit Citation 1945-09-04.jpg'],
    alt:'Men of Co. L, 3rd Battalion, 442nd Regimental Combat Team receive the Presidential Unit Citation, September 4, 1945',
    caption:'Men of Co. L, 3rd Battalion, 442nd RCT receive a Presidential Unit Citation, September 4, 1945. Their families were in internment camps. They volunteered anyway. The 442nd became the most decorated unit of its size in American military history.',
    src:'https://commons.wikimedia.org/wiki/File:Co._L,_3rd_Battalion,_442nd_RCT_receives_Presidential_Unit_Citation_1945-09-04.jpg',
  },
  {
    id:'article-battle-of-cannae',
    files:['Hannibal Slodtz Louvre MR2093.jpg'],
    alt:'Sculpture of Hannibal Barca by Sébastien Slodtz, 1704, Louvre — architect of the double envelopment at Cannae in 216 BC',
    caption:'Hannibal Barca, marble sculpture by Sébastien Slodtz, 1704 (Louvre). At Cannae, Hannibal destroyed a Roman army twice the size of his own in six hours using a double envelopment that military academies still study today.',
    src:'https://commons.wikimedia.org/wiki/File:Hannibal_Slodtz_Louvre_MR2093.jpg',
  },
  {
    id:'article-isandlwana',
    files:['Isandlwana.jpg'],
    alt:'The battlefield at Isandlwana, KwaZulu-Natal, South Africa — site of the British defeat by Zulu forces on January 22, 1879',
    caption:'Isandlwana hill, KwaZulu-Natal. On January 22, 1879, a Zulu impi of 20,000 warriors destroyed a British column of 1,300 regulars here in under two hours. The white cairns mark where the dead were found.',
    src:'https://commons.wikimedia.org/wiki/File:Isandlwana.jpg',
  },
  {
    id:'article-heydrich-assassination',
    files:['Bundesarchiv Bild 146-1972-039-44, Heydrich-Attentat.jpg'],
    alt:'The site of the Heydrich assassination attempt, Prague, May 27, 1942 — the ambush point on the Holešovice hairpin bend',
    caption:'The hairpin bend at Holesovice, Prague, where Jozef Gabcik and Jan Kubis ambushed Reinhard Heydrich\'s open-topped Mercedes on May 27, 1942. Heydrich died nine days later from septicaemia caused by upholstery fibres in the wound.',
    src:'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_146-1972-039-44,_Heydrich-Attentat.jpg',
  },
]

console.log(`\n📸  Uploading images for Batch 3B (${ARTICLES.length} articles)\n`)
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
