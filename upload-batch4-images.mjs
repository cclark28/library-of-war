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
    id:'article-fall-of-constantinople',
    files:['Le siège de Constantinople (1453) by Jean Le Tavernier after 1455.jpg'],
    alt:'Illuminated manuscript depicting the Ottoman siege of Constantinople, 1453 — Jean Le Tavernier, after 1455',
    caption:'The siege of Constantinople, 1453, depicted in a Flemish illuminated manuscript by Jean Le Tavernier. After 53 days of bombardment, Ottoman forces under Mehmed II breached the walls. The thousand-year Eastern Roman Empire ended in a single morning.',
    src:'https://commons.wikimedia.org/wiki/File:Le_si%C3%A8ge_de_Constantinople_(1453)_by_Jean_Le_Tavernier_after_1455.jpg',
  },
  {
    id:'article-battle-of-agincourt',
    files:["Battle of Agincourt, St. Alban's Chronicle by Thomas Walsingham.jpg"],
    alt:"Battle of Agincourt illustrated in the St. Alban's Chronicle by Thomas Walsingham, depicting English longbowmen and French knights, October 25, 1415",
    caption:"The Battle of Agincourt, from the St. Alban's Chronicle by Thomas Walsingham, c. 1422. English longbowmen armed with stakes and arrows destroyed a French force three times their size in the narrow field between two forests. France lost over 6,000 men. England lost fewer than 400.",
    src:"https://commons.wikimedia.org/wiki/File:Battle_of_Agincourt,_St._Alban%27s_Chronicle_by_Thomas_Walsingham.jpg",
  },
  {
    id:'article-siege-of-dien-bien-phu',
    files:['Frieze Showing French Surrender in May 1954 - Hill D1 (Victory Monument) - Dien Bien Phu - Vietnam (48168819157).jpg'],
    alt:'Frieze at the Dien Bien Phu Victory Monument depicting the French surrender in May 1954',
    caption:'A frieze at the Dien Bien Phu Victory Monument depicting the French surrender, May 7, 1954. General Giap had moved heavy artillery through jungle mountains the French believed impassable. After 55 days, the garrison surrendered. France\'s war in Indochina was over.',
    src:'https://commons.wikimedia.org/wiki/File:Frieze_Showing_French_Surrender_in_May_1954_-_Hill_D1_(Victory_Monument)_-_Dien_Bien_Phu_-_Vietnam_(48168819157).jpg',
  },
  {
    id:'article-battle-of-stalingrad',
    files:['RIAN archive 602770 Battle of Stalingrad.jpg','RIAN archive 2391 Destroyed Stalingrad.jpg'],
    alt:'Soviet soldiers fighting in the ruins of Stalingrad, winter 1942-43',
    caption:'Soviet soldiers in the ruins of Stalingrad, 1942. Vasily Chuikov kept his men so close to German lines that the Luftwaffe could not bomb without hitting their own troops. The battle lasted six months and killed approximately two million people. Germany never launched another major eastern offensive.',
    src:'https://commons.wikimedia.org/wiki/File:RIAN_archive_602770_Battle_of_Stalingrad.jpg',
  },
  {
    id:'article-operation-barbarossa',
    files:['Operation Barbarossa collage.jpg'],
    alt:'Operation Barbarossa collage — German armoured columns, Luftwaffe aircraft, and Soviet prisoners during the June 1941 invasion of the Soviet Union',
    caption:'Operation Barbarossa, June 22, 1941. Three million German soldiers crossed into the Soviet Union on a 2,900-kilometre front. By December, the Wehrmacht had reached the outskirts of Moscow — and then the temperature dropped to minus 30 Celsius. The campaign that was supposed to end before winter did not end before winter.',
    src:'https://commons.wikimedia.org/wiki/File:Operation_Barbarossa_collage.jpg',
  },
  {
    id:'article-battle-of-britain',
    files:['Hawker Hurricanes of No 1 Squadron, Royal Air Force, based at Wittering, Cambridgeshire, followed by a similar formation of Supermarine Spitfires of No 266 Squadron, during a flying display for aircraft factory workers, CH1561.jpg'],
    alt:'Hawker Hurricanes of No. 1 Squadron RAF followed by Supermarine Spitfires of No. 266 Squadron in formation during the Battle of Britain, 1940',
    caption:'Hawker Hurricanes of No. 1 Squadron RAF, followed by Supermarine Spitfires of No. 266 Squadron, 1940. The Battle of Britain was decided not by heroics alone but by the RAF\'s integrated radar and control system, pilot recovery rates, and German intelligence failures. Hitler postponed Operation Sea Lion on September 17, 1940.',
    src:'https://commons.wikimedia.org/wiki/File:Hawker_Hurricanes_of_No_1_Squadron,_Royal_Air_Force,_based_at_Wittering,_Cambridgeshire,_followed_by_a_similar_formation_of_Supermarine_Spitfires_of_No_266_Squadron,_during_a_flying_display_for_aircraft_factory_workers,_CH1561.jpg',
  },
  {
    id:'article-warsaw-uprising-1944',
    files:['The Warsaw Uprising, August-october 1944 HU105392.jpg'],
    alt:'Polish Home Army fighters during the Warsaw Uprising, August-October 1944',
    caption:'Polish Home Army fighters during the Warsaw Uprising, 1944. The uprising lasted 63 days while the Red Army waited on the east bank of the Vistula. When it ended, Hitler ordered Warsaw systematically demolished. 85 percent of the city was rubble by the time Soviet forces crossed the river in January 1945.',
    src:'https://commons.wikimedia.org/wiki/File:The_Warsaw_Uprising,_August-october_1944_HU105392.jpg',
  },
  {
    id:'article-battle-of-trafalgar',
    files:['The Battle of Trafalgar, 21 October 1805 RMG L8148-001.jpg'],
    alt:'The Battle of Trafalgar, October 21, 1805 — oil painting from the Royal Museums Greenwich collection',
    caption:'The Battle of Trafalgar, October 21, 1805. Nelson attacked in two perpendicular columns, cutting the Franco-Spanish line and creating a close-quarters melee where superior British gunnery dominated. 22 of 33 enemy ships were captured or sunk. Nelson died at 4:30 PM. He had already won.',
    src:'https://commons.wikimedia.org/wiki/File:The_Battle_of_Trafalgar,_21_October_1805_RMG_L8148-001.jpg',
  },
  {
    id:'article-operation-entebbe',
    files:['Operation Thunderbolt. IV.jpg'],
    alt:'Israeli commandos and rescued hostages at Entebbe airport, Uganda, July 4, 1976 — Operation Thunderbolt',
    caption:'Israeli commandos and rescued hostages at Entebbe airport, July 4, 1976. The operation lasted 53 minutes from landing to takeoff. All seven hijackers were killed. 102 hostages were freed. Lieutenant Colonel Yonatan Netanyahu, commanding the assault force, was the only Israeli military fatality.',
    src:'https://commons.wikimedia.org/wiki/File:Operation_Thunderbolt._IV.jpg',
  },
  {
    id:'article-siege-of-the-alamo',
    files:['Fall-of-the-alamo-gentilz 1844.jpg'],
    alt:'The Fall of the Alamo, painting by Theodore Gentilz, 1844 — depicting the Mexican assault on the Texas mission on March 6, 1836',
    caption:'The Fall of the Alamo by Theodore Gentilz, 1844. The final assault began at 5:30 AM on March 6, 1836. The defenders had perhaps twenty minutes. Every man inside died. Six weeks later, Sam Houston\'s army destroyed Santa Anna\'s force at San Jacinto in eighteen minutes. Texas won its independence.',
    src:'https://commons.wikimedia.org/wiki/File:Fall-of-the-alamo-gentilz_1844.jpg',
  },
]

console.log(`\n📸  Uploading images for Batch 4 (${ARTICLES.length} articles)\n`)
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
    process.stdout.write(`    ↓ ${used.slice(0,70)}\n`)
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
