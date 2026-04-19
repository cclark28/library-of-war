/**
 * upload-images.mjs
 * Downloads 1200px Wikimedia thumbnails (≤1 MB each), uploads to Sanity,
 * patches each article's mainImage field.
 *
 * Usage: node upload-images.mjs
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

if (!TOKEN) { console.error('No SANITY_API_TOKEN found.'); process.exit(1) }

const PROJECT   = 'tifzt4zw'
const DATASET   = 'production'
const BASE      = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`
const ASSETS    = `https://${PROJECT}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
const UA        = 'LibraryOfWarImageBot/1.0 (hello@libraryofwar.com)'
const MAX_BYTES = 1_048_576   // 1 MB hard limit per user requirement

// Resolve canonical URL from Wikimedia Commons filename, return 1200px thumb info
async function resolveThumbUrl(filename) {
  const r = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`,
    { headers: { 'User-Agent': UA } }
  )
  const d = await r.json()
  const page = Object.values(d.query.pages)[0]
  if (page?.missing !== undefined) return null
  const canonical = page?.imageinfo?.[0]?.url
  if (!canonical) return null

  // canonical: https://upload.wikimedia.org/wikipedia/commons/a/a0/File.jpg
  // thumb:     https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/File.jpg/1200px-File.jpg
  try {
    const u = new URL(canonical)
    const parts = u.pathname.split('/')
    const ci = parts.indexOf('commons')
    if (ci === -1) return { thumb: canonical, ext: filename.split('.').pop().toLowerCase() }
    parts.splice(ci + 1, 0, 'thumb')
    const fname = parts[parts.length - 1]
    const ext = fname.split('.').pop().toLowerCase()
    // SVG thumbs render as PNG; JPEG/WEBP/PNG stay same ext
    const thumbName = ext === 'svg' ? `1200px-${fname}.png` : `1200px-${fname}`
    const thumbExt  = ext === 'svg' ? 'png' : (ext === 'jpeg' ? 'jpeg' : ext)
    parts.push(thumbName)
    u.pathname = parts.join('/')
    return { thumb: u.toString(), ext: thumbExt }
  } catch {
    return null
  }
}

async function uploadAsset(thumbUrl, mime, slug) {
  // Check size first — skip if over 1 MB
  const head = await fetch(thumbUrl, {
    method: 'HEAD',
    headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' }
  })
  const cl = parseInt(head.headers.get('content-length') || '0', 10)
  if (cl > 0 && cl > MAX_BYTES) throw new Error(`Too large: ${(cl/1024).toFixed(0)} KB`)

  const img = await fetch(thumbUrl, {
    headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' }
  })
  if (!img.ok) throw new Error(`Download ${img.status}`)
  const buf = await img.arrayBuffer()
  if (buf.byteLength > MAX_BYTES) throw new Error(`Buffer too large: ${(buf.byteLength/1024).toFixed(0)} KB`)

  const r = await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { 'Content-Type': mime, Authorization: `Bearer ${TOKEN}` },
    body: buf,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(`Upload: ${JSON.stringify(d).substring(0, 200)}`)
  return d.document._id
}

async function patchAll(mutations) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

// ── Verified Wikimedia Commons filenames ──────────────────────────────────────
const ARTICLES = [
  // ANCIENT / MEDIEVAL
  { id: 'article-the-battle-of-marathon-how-10-000-athenians-stopped-an-empire',
    file: 'Battle of Marathon.jpg',
    alt: 'Illustration of the Battle of Marathon, 490 BC',
    caption: 'The Battle of Marathon, 490 BC.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Marathon.jpg' },
  { id: 'article-mongol-warfare-the-military-machine-that-conquered-eurasia',
    file: 'YuanEmperorAlbumGenghisPortrait.jpg',
    alt: 'Portrait of Genghis Khan, Yuan dynasty, 14th century',
    caption: 'Genghis Khan. Yuan dynasty, c. 1278. National Palace Museum, Taipei.',
    src: 'https://commons.wikimedia.org/wiki/File:YuanEmperorAlbumGenghisPortrait.jpg' },
  { id: 'article-the-siege-of-alesia-caesars-fortress-inside-a-fortress',
    file: 'Lionel Royer - Vercingetorix Throwing down His Weapons at the feet of Julius Caesar.jpg',
    alt: 'Vercingetorix surrenders to Julius Caesar — Lionel Royer, 1899',
    caption: 'Lionel Royer — Vercingetorix throws down his arms at the feet of Julius Caesar, 1899.',
    src: 'https://commons.wikimedia.org/wiki/File:Lionel_Royer_-_Vercingetorix_Throwing_down_His_Weapons_at_the_feet_of_Julius_Caesar.jpg' },
  { id: 'article-the-battle-of-agincourt-longbows-mud-and-the-death-of-chivalry',
    file: 'Morning of the Battle of Agincourt, 25th October 1415.PNG',
    alt: 'Sir John Gilbert — Morning of the Battle of Agincourt, 25 October 1415',
    caption: 'Sir John Gilbert — The Morning of the Battle of Agincourt, 25 October 1415.',
    src: 'https://commons.wikimedia.org/wiki/File:Morning_of_the_Battle_of_Agincourt,_25th_October_1415.PNG' },

  // EARLY MODERN
  { id: 'article-the-tercio-how-spains-infantry-square-dominated-european-warfare-for-a-century',
    file: 'Battle of Lepanto 1571.jpg',
    alt: '16th-century naval warfare — Battle of Lepanto, 1571',
    caption: 'Battle of Lepanto, 1571.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Lepanto_1571.jpg' },
  { id: 'article-the-battle-of-lepanto-christianitys-last-crusade-on-the-water',
    file: 'Battle of Lepanto 1571.jpg',
    alt: 'Battle of Lepanto 1571 — Holy League fleet vs Ottoman Empire',
    caption: 'The Battle of Lepanto, 7 October 1571.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Lepanto_1571.jpg' },
  { id: 'article-gustavus-adolphus-and-the-swedish-military-revolution',
    file: 'Jacob Hoefnagel (Attr.) - Portrait of king Gustavus Adolphus of Sweden.jpg',
    alt: 'Portrait of King Gustavus Adolphus of Sweden',
    caption: 'Attributed to Jacob Hoefnagel — Gustavus Adolphus, King of Sweden (1594–1632).',
    src: 'https://commons.wikimedia.org/wiki/File:Jacob_Hoefnagel_(Attr.)_-_Portrait_of_king_Gustavus_Adolphus_of_Sweden.jpg' },
  { id: 'article-the-siege-of-vienna-1683-when-the-ottoman-tide-finally-turned',
    file: 'Powrot z Wiednia.jpg',
    alt: 'Józef Brandt — Return from Vienna 1683, Jan III Sobieski',
    caption: 'Józef Brandt — Return from Vienna, 1683. National Museum, Warsaw.',
    src: 'https://commons.wikimedia.org/wiki/File:Powrot_z_Wiednia.jpg' },

  // NAPOLEONIC
  { id: 'article-austerlitz-napoleons-perfect-battle',
    file: "La bataille d'Austerlitz. 2 decembre 1805 (François Gérard).jpg",
    alt: 'François Gérard — The Battle of Austerlitz, 2 December 1805',
    caption: "François Gérard — La Bataille d'Austerlitz, 2 December 1805. Château de Versailles.",
    src: "https://commons.wikimedia.org/wiki/File:La_bataille_d%27Austerlitz._2_decembre_1805_(Fran%C3%A7ois_G%C3%A9rard).jpg" },
  { id: 'article-the-peninsular-war-where-napoleons-empire-began-to-unravel',
    file: 'El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg',
    alt: 'Francisco de Goya — El Tres de Mayo, 1808',
    caption: 'Francisco de Goya — El Tres de Mayo, 1814. Museo del Prado, Madrid.',
    src: 'https://commons.wikimedia.org/wiki/File:El_Tres_de_Mayo,_by_Francisco_de_Goya,_from_Prado_thin_black_margin.jpg' },
  { id: 'article-trafalgar-nelsons-death-and-britains-century-of-naval-supremacy',
    file: 'Turner, The Battle of Trafalgar (1822).jpg',
    alt: "J.M.W. Turner — The Battle of Trafalgar, 1822",
    caption: 'J.M.W. Turner — The Battle of Trafalgar, 1822. National Maritime Museum, London.',
    src: 'https://commons.wikimedia.org/wiki/File:Turner,_The_Battle_of_Trafalgar_(1822).jpg' },
  { id: 'article-napoleons-russian-campaign-how-logistics-and-space-destroyed-the-grande-arm-e',
    file: 'Minard.png',
    alt: "Charles Minard's figurative map of Napoleon's 1812 Russian campaign",
    caption: "Charles Joseph Minard — Figurative map of Napoleon's Russian campaign, 1869.",
    src: 'https://commons.wikimedia.org/wiki/File:Minard.png' },

  // AMERICAN CIVIL WAR
  { id: 'article-gettysburg-three-days-that-decided-the-civil-war',
    file: 'Thure de Thulstrup - L. Prang and Co. - Battle of Gettysburg - Restoration by Adam Cuerden.jpg',
    alt: "Thure de Thulstrup — Pickett's Charge at Gettysburg, 1887",
    caption: "Thure de Thulstrup — Battle of Gettysburg (Pickett's Charge), 1887.",
    src: 'https://commons.wikimedia.org/wiki/File:Thure_de_Thulstrup_-_L._Prang_and_Co._-_Battle_of_Gettysburg_-_Restoration_by_Adam_Cuerden.jpg' },
  { id: 'article-monitor-vs-virginia-the-day-wooden-navies-died',
    file: 'Battle of Hampton Roads.jpg',
    alt: 'The Battle of Hampton Roads — Monitor vs Virginia, 1862',
    caption: 'The Battle of Hampton Roads, March 1862. Library of Congress.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Hampton_Roads.jpg' },
  { id: 'article-shermans-march-when-total-war-came-to-america',
    file: 'Sherman-march-sea-headquarters.jpg',
    alt: "Sherman's headquarters during the March to the Sea, 1864",
    caption: "Union headquarters during Sherman's March to the Sea, 1864.",
    src: 'https://commons.wikimedia.org/wiki/File:Sherman-march-sea-headquarters.jpg' },
  { id: 'article-the-siege-of-petersburg-the-first-modern-siege',
    file: 'Petersburg July30.png',
    alt: 'The Battle of the Crater during the Siege of Petersburg, 30 July 1864',
    caption: 'The explosion at the Battle of the Crater, Siege of Petersburg, 30 July 1864.',
    src: 'https://commons.wikimedia.org/wiki/File:Petersburg_July30.png' },
  { id: 'article-the-siege-of-petersburg-americas-first-modern-siege',
    file: 'Petersburg July30.png',
    alt: 'The Battle of the Crater during the Siege of Petersburg, 30 July 1864',
    caption: 'The explosion at the Battle of the Crater, Siege of Petersburg, 30 July 1864.',
    src: 'https://commons.wikimedia.org/wiki/File:Petersburg_July30.png' },

  // WORLD WAR I
  { id: 'article-the-battle-of-the-marne-how-paris-was-saved-in-a-taxi',
    file: 'Cheshire Regiment trench Somme 1916.jpg',
    alt: 'British troops in a trench on the Western Front, World War I',
    caption: 'Cheshire Regiment troops in a trench on the Somme, 1916. Imperial War Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:Cheshire_Regiment_trench_Somme_1916.jpg' },
  { id: 'article-the-battle-of-the-marne-how-paris-was-saved',
    file: 'Cheshire Regiment trench Somme 1916.jpg',
    alt: 'British troops in a trench on the Western Front, World War I',
    caption: 'Cheshire Regiment troops in a trench on the Somme, 1916. Imperial War Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:Cheshire_Regiment_trench_Somme_1916.jpg' },
  { id: 'article-gallipoli-the-anatomy-of-a-strategic-disaster',
    file: 'Landing of Australian troops at ANZAC Cove, 25 April 1915 slnsw.jpg',
    alt: 'ANZAC troops landing at ANZAC Cove, Gallipoli, 25 April 1915',
    caption: 'Australian troops landing at ANZAC Cove, Gallipoli, 25 April 1915. State Library of New South Wales.',
    src: 'https://commons.wikimedia.org/wiki/File:Landing_of_Australian_troops_at_ANZAC_Cove,_25_April_1915_slnsw.jpg' },
  { id: 'article-the-somme-one-day-57-000-casualties',
    file: 'The Battle of the Somme, July-november 1916 Q103.jpg',
    alt: 'British troops in a communications trench, Battle of the Somme 1916',
    caption: 'British troops in a communications trench near Thiepval, 1916. Imperial War Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:The_Battle_of_the_Somme,_July-november_1916_Q103.jpg' },
  { id: 'article-the-hundred-days-how-the-allies-finally-broke-the-western-front',
    file: 'Hindenburg Line Bellenglise AWM E03367.jpeg',
    alt: 'Allied troops crossing the St Quentin Canal during the Battle of the Hindenburg Line, 1918',
    caption: 'Allied troops crossing the St Quentin Canal during the Hundred Days Offensive, 1918. Australian War Memorial.',
    src: 'https://commons.wikimedia.org/wiki/File:Hindenburg_Line_Bellenglise_AWM_E03367.jpeg' },

  // WORLD WAR II
  { id: 'article-operation-barbarossa-the-scale-of-hitlers-eastern-gamble',
    file: 'Bundesarchiv Bild 183-84001-0011, Russland, Sturmgeschütz und Panzer III im Schnee.jpg',
    alt: 'German Panzer III tanks on the Eastern Front in snow, 1941',
    caption: 'German Panzer III and Sturmgeschütz on the Eastern Front, 1941. Bundesarchiv.',
    src: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-84001-0011,_Russland,_Sturmgeschütz_und_Panzer_III_im_Schnee.jpg' },
  { id: 'article-midway-six-minutes-that-turned-the-pacific-war',
    file: 'Battle of Midway.jpg',
    alt: 'Battle of Midway — USS Yorktown hit by Japanese bombers, June 1942',
    caption: 'USS Yorktown hit during the Battle of Midway, 4 June 1942. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Midway.jpg' },
  { id: 'article-stalingrad-the-turning-point-of-the-second-world-war',
    file: 'The Battle of Stalingrad second collage.jpg',
    alt: 'Composite image of the Battle of Stalingrad, 1942–1943',
    caption: 'The Battle of Stalingrad, 1942–1943. Bundesarchiv.',
    src: 'https://commons.wikimedia.org/wiki/File:The_Battle_of_Stalingrad_second_collage.jpg' },
  { id: 'article-d-day-the-logistics-behind-the-largest-amphibious-operation-in-history',
    file: 'Normandy-June-6th-1944-US-troops-assault-Omaha-Beach-during-the-D-Day-landings-3.png',
    alt: 'US troops landing on Omaha Beach, Normandy, D-Day, 6 June 1944',
    caption: 'US Army troops landing on Omaha Beach, 6 June 1944. National Archives.',
    src: 'https://commons.wikimedia.org/wiki/File:Normandy-June-6th-1944-US-troops-assault-Omaha-Beach-during-the-D-Day-landings-3.png' },
  { id: 'article-operation-market-garden-when-bold-planning-met-brutal-reality',
    file: 'British paratroopers in Oosterbeek.jpg',
    alt: 'British paratroopers during Operation Market Garden at Oosterbeek, September 1944',
    caption: 'British paratroopers at Oosterbeek during Operation Market Garden, September 1944. Imperial War Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:British_paratroopers_in_Oosterbeek.jpg' },
  { id: 'article-the-battle-of-the-bulge-germanys-last-gamble-in-the-west',
    file: 'American 290th Infantry Regiment infantrymen fighting in snow during the Battle of the Bulge.jpg',
    alt: 'US Army 290th Infantry Regiment in snow during the Battle of the Bulge, December 1944',
    caption: 'US Army 290th Infantry Regiment during the Battle of the Bulge, December 1944. National Archives.',
    src: 'https://commons.wikimedia.org/wiki/File:American_290th_Infantry_Regiment_infantrymen_fighting_in_snow_during_the_Battle_of_the_Bulge.jpg' },

  // KOREAN WAR
  { id: 'article-the-pusan-perimeter-how-south-korea-survived-its-first-summer',
    file: '27th Infantry Regiment soldiers at the Pusan Perimeter, September 4, 1950.jpg',
    alt: 'US Army 27th Infantry Regiment soldiers at the Pusan Perimeter, September 1950',
    caption: '27th Infantry Regiment soldiers at the Pusan Perimeter, 4 September 1950. US Army.',
    src: 'https://commons.wikimedia.org/wiki/File:27th_Infantry_Regiment_soldiers_at_the_Pusan_Perimeter,_September_4,_1950.jpg' },
  { id: 'article-inchon-macarthurs-masterstroke-and-its-dangerous-consequences',
    file: 'Lopez scaling seawall.jpg',
    alt: 'Lt. Baldomero Lopez scaling the seawall at Inchon, 15 September 1950',
    caption: 'Lt. Baldomero Lopez scaling the seawall at Inchon, 15 September 1950. US Marine Corps.',
    src: 'https://commons.wikimedia.org/wiki/File:Lopez_scaling_seawall.jpg' },
  { id: 'article-the-chosin-reservoir-15-000-marines-12-chinese-divisions',
    file: '1st Marine Division at Chosin Reservoir in Korea, December 1950.jpg',
    alt: '1st Marine Division troops at the Chosin Reservoir, Korea, December 1950',
    caption: '1st Marine Division troops during the Chosin Reservoir campaign, December 1950. US Marine Corps.',
    src: 'https://commons.wikimedia.org/wiki/File:1st_Marine_Division_at_Chosin_Reservoir_in_Korea,_December_1950.jpg' },
  { id: 'article-mig-alley-the-first-jet-war',
    file: 'USAF F-86 Sabre at Suwon Air Base.jpg',
    alt: 'USAF F-86 Sabre jet fighters at Suwon Air Base, Korea',
    caption: 'USAF F-86 Sabres at Suwon Air Base, Korea. US Air Force.',
    src: 'https://commons.wikimedia.org/wiki/File:USAF_F-86_Sabre_at_Suwon_Air_Base.jpg' },

  // VIETNAM
  { id: 'article-the-battle-of-ia-drang-the-first-major-american-engagement-in-vietnam',
    file: "Bruce Crandall's UH-1D.jpg",
    alt: "UH-1D Huey helicopters at the Battle of Ia Drang Valley, November 1965",
    caption: "Maj. Bruce Crandall's UH-1D Huey lifts off at the Battle of Ia Drang, November 1965. US Army.",
    src: "https://commons.wikimedia.org/wiki/File:Bruce_Crandall%27s_UH-1D.jpg" },
  { id: 'article-the-tet-offensive-how-a-military-defeat-became-a-strategic-victory',
    file: 'Tank supporting 1.5 Marines in the citadel of Hue.jpg',
    alt: 'US Marines and M48 tank during the Battle of Hue, Tet Offensive 1968',
    caption: 'US Marines and tank in the citadel of Hue during the Tet Offensive, February 1968. US Marine Corps.',
    src: 'https://commons.wikimedia.org/wiki/File:Tank_supporting_1.5_Marines_in_the_citadel_of_Hue.jpg' },
  { id: 'article-operation-rolling-thunder-the-limits-of-strategic-bombing',
    file: 'North American F-105D Thunderchief (33524053288).jpg',
    alt: 'USAF F-105D Thunderchief — the primary strike aircraft of Operation Rolling Thunder',
    caption: 'USAF F-105D Thunderchief, the primary strike aircraft of Operation Rolling Thunder. US Air Force.',
    src: 'https://commons.wikimedia.org/wiki/File:North_American_F-105D_Thunderchief_(33524053288).jpg' },
  { id: 'article-the-fall-of-saigon-the-end-of-american-vietnam',
    file: 'South Vietnamese helicopter is pushed over the side of the USS Okinawa during Operation Frequent Wind, April 1975.jpg',
    alt: 'South Vietnamese helicopter pushed overboard from USS Okinawa during Operation Frequent Wind, April 1975',
    caption: 'A South Vietnamese helicopter is pushed overboard from USS Okinawa to make room during Operation Frequent Wind, April 1975. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:South_Vietnamese_helicopter_is_pushed_over_the_side_of_the_USS_Okinawa_during_Operation_Frequent_Wind,_April_1975.jpg' },

  // COLD WAR
  { id: 'article-the-berlin-airlift-how-cargo-planes-won-a-cold-war-standoff',
    file: 'C-54 dropping candy during Berlin Airlift c1949.jpg',
    alt: 'USAF C-54 Skymaster drops candy to West Berlin children during the Berlin Airlift, 1949',
    caption: 'USAF C-54 Skymaster dropping candy to West Berlin children during the Berlin Airlift, c.1949.',
    src: 'https://commons.wikimedia.org/wiki/File:C-54_dropping_candy_during_Berlin_Airlift_c1949.jpg' },
  { id: 'article-the-cuban-missile-crisis-thirteen-days-at-the-nuclear-brink',
    file: 'U-2 photo during Cuban Missile Crisis.jpg',
    alt: 'U-2 aerial reconnaissance photograph of Soviet missile sites in Cuba, October 1962',
    caption: 'U-2 reconnaissance photograph of Soviet MRBM missile site in Cuba, October 1962. CIA / National Archives.',
    src: 'https://commons.wikimedia.org/wiki/File:U-2_photo_during_Cuban_Missile_Crisis.jpg' },
  { id: 'article-the-soviet-afghan-war-the-empire-strikes-out',
    file: 'Soviet-Afghan War collage.jpg',
    alt: 'Composite image of the Soviet-Afghan War, 1979–1989',
    caption: 'The Soviet-Afghan War, 1979–1989.',
    src: 'https://commons.wikimedia.org/wiki/File:Soviet-Afghan_War_collage.jpg' },
  { id: 'article-operation-eagle-claw-the-hostage-rescue-disaster-that-remade-special-operations',
    file: 'Eagle Claw wrecks at Desert One.png',
    alt: 'Burned US aircraft at Desert One, Iran, following Operation Eagle Claw failure, April 1980',
    caption: 'Wreckage at Desert One, Iran, following the failed Operation Eagle Claw, 25 April 1980. US DOD.',
    src: 'https://commons.wikimedia.org/wiki/File:Eagle_Claw_wrecks_at_Desert_One.png' },

  // MODERN CONFLICTS
  { id: 'article-operation-desert-storm-the-100-hour-war-that-remade-modern-warfare',
    file: 'M1A1 abrams front.jpg',
    alt: 'M1A1 Abrams tank in the Kuwaiti desert during Operation Desert Storm, 1991',
    caption: 'M1A1 Abrams main battle tank, Operation Desert Storm, 1991. US Army.',
    src: 'https://commons.wikimedia.org/wiki/File:M1A1_abrams_front.jpg' },
  { id: 'article-black-hawk-down-the-battle-of-mogadishu',
    file: 'UH-60 Black Hawk Flight (8298567).jpg',
    alt: 'UH-60 Black Hawk helicopter in flight',
    caption: 'UH-60 Black Hawk helicopter. US Army.',
    src: 'https://commons.wikimedia.org/wiki/File:UH-60_Black_Hawk_Flight_(8298567).jpg' },
  { id: 'article-the-battle-of-fallujah-2004-urban-combat-in-the-21st-century',
    file: '4-14 Marines in Fallujah.jpg',
    alt: 'US Marines conducting urban combat operations in Fallujah, Iraq, 2004',
    caption: 'US Marines during Operation Phantom Fury, Fallujah, November 2004. USMC.',
    src: 'https://commons.wikimedia.org/wiki/File:4-14_Marines_in_Fallujah.jpg' },
  { id: 'article-operation-neptune-spear-the-raid-that-killed-bin-laden',
    file: 'Obama and Biden await updates on bin Laden.jpg',
    alt: 'President Obama and VP Biden in the Situation Room during Operation Neptune Spear, May 2011',
    caption: 'President Obama, VP Biden, and national security team during Operation Neptune Spear, 1 May 2011. White House / Pete Souza.',
    src: 'https://commons.wikimedia.org/wiki/File:Obama_and_Biden_await_updates_on_bin_Laden.jpg' },

  // TECHNOLOGY & WEAPONS
  { id: 'article-the-tank-from-the-mud-of-the-somme-to-the-digital-battlefield',
    file: 'British Mark I male tank Somme 25 September 1916.jpg',
    alt: 'British Mark I Male tank on the Somme, 25 September 1916 — the first tank in combat',
    caption: 'British Mark I Male tank on the Somme, 25 September 1916. Imperial War Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:British_Mark_I_male_tank_Somme_25_September_1916.jpg' },
  { id: 'article-the-aircraft-carrier-how-a-floating-airfield-became-the-capital-ship',
    file: 'USS Nimitz (CVN-68) returning to Norfolk 1981.JPEG',
    alt: 'USS Nimitz (CVN-68) aircraft carrier returning to Norfolk, 1981',
    caption: 'USS Nimitz (CVN-68) returning to Norfolk, 1981. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:USS_Nimitz_(CVN-68)_returning_to_Norfolk_1981.JPEG' },
  { id: 'article-drones-in-modern-warfare-the-rise-of-unmanned-combat',
    file: 'MQ-9 Reaper UAV.jpg',
    alt: 'USAF MQ-9 Reaper unmanned combat aerial vehicle',
    caption: 'USAF MQ-9 Reaper UCAV. US Air Force.',
    src: 'https://commons.wikimedia.org/wiki/File:MQ-9_Reaper_UAV.jpg' },

  // INTELLIGENCE & SPECIAL OPS
  { id: 'article-operation-mincemeat-the-corpse-that-fooled-hitler',
    file: 'Ewen Montagu Published in Daily Mirror 1922.jpg',
    alt: 'Ewen Montagu, the architect of Operation Mincemeat',
    caption: 'Ewen Montagu, Naval Intelligence officer and architect of Operation Mincemeat.',
    src: 'https://commons.wikimedia.org/wiki/File:Ewen_Montagu_Published_in_Daily_Mirror_1922.jpg' },
  { id: 'article-the-oss-americas-first-intelligence-agency-and-the-template-for-modern-espionage',
    file: 'William Joseph (Wild Bill) Donovan, Head of the OSS.jpg',
    alt: 'Major General William "Wild Bill" Donovan, Director of the Office of Strategic Services',
    caption: 'Major General William "Wild Bill" Donovan, Director of the OSS. National Archives.',
    src: 'https://commons.wikimedia.org/wiki/File:William_Joseph_(Wild_Bill)_Donovan,_Head_of_the_OSS.jpg' },
  { id: 'article-the-oss-americas-first-intelligence-agency',
    file: 'William Joseph (Wild Bill) Donovan, Head of the OSS.jpg',
    alt: 'Major General William "Wild Bill" Donovan, Director of the Office of Strategic Services',
    caption: 'Major General William "Wild Bill" Donovan, Director of the OSS. National Archives.',
    src: 'https://commons.wikimedia.org/wiki/File:William_Joseph_(Wild_Bill)_Donovan,_Head_of_the_OSS.jpg' },
  { id: 'article-seal-team-six-from-mogadishu-to-abbottabad',
    file: 'United States Navy SEALs 449.jpg',
    alt: 'US Navy SEALs conducting a combat operation',
    caption: 'US Navy SEALs during a combat operation. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:United_States_Navy_SEALs_449.jpg' },
]

// ── Run ───────────────────────────────────────────────────────────────────────
console.log(`\n📸 Library of War — Image Upload (1200px thumbs, max 1 MB)\n`)

const q = encodeURIComponent(`*[_type=="article" && defined(mainImage.asset)] { _id }`)
const chkRes = await fetch(`https://${PROJECT}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${q}`, {
  headers: { Authorization: `Bearer ${TOKEN}` }
})
const chkData = await chkRes.json()
const alreadyHaveImage = new Set(chkData.result.map(a => a._id))
console.log(`   ${alreadyHaveImage.size} already have images — skipping\n`)

const toProcess = ARTICLES.filter(a => !alreadyHaveImage.has(a.id))
console.log(`   ${toProcess.length} to process\n`)

const CHUNK   = 6
const patches = []

for (let i = 0; i < toProcess.length; i += CHUNK) {
  const chunk = toProcess.slice(i, i + CHUNK)
  console.log(`⚙️  Chunk ${Math.floor(i/CHUNK)+1}/${Math.ceil(toProcess.length/CHUNK)}`)

  const results = await Promise.allSettled(chunk.map(async (a) => {
    const info = await resolveThumbUrl(a.file)
    if (!info) throw new Error(`Not found on Commons: ${a.file}`)
    const mime = info.ext === 'png' ? 'image/png' : 'image/jpeg'
    const slug = a.id.replace('article-', '').split('-').slice(0,4).join('-') + (mime === 'image/png' ? '.png' : '.jpg')
    const assetId = await uploadAsset(info.thumb, mime, slug)
    return {
      patch: {
        id: a.id,
        set: {
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: a.alt,
            caption: a.caption,
            sourceUrl: a.src,
          }
        }
      }
    }
  }))

  for (let j = 0; j < chunk.length; j++) {
    const r = results[j]
    const label = chunk[j].id.substring(8, 58)
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${label}`)
      patches.push(r.value.patch)
    } else {
      console.log(`  ✗ ${label}: ${String(r.reason).substring(0, 90)}`)
    }
  }
  console.log()
}

if (patches.length > 0) {
  console.log(`🔗 Patching ${patches.length} articles in Sanity...`)
  const res = await patchAll(patches.map(p => ({ patch: p })))
  console.log(`✅ Done. transactionId: ${res.transactionId}`)
} else {
  console.log('⚠️  No successful uploads.')
}
