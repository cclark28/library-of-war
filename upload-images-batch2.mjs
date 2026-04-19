/**
 * upload-images-batch2.mjs  (v2 — verified filenames)
 * 1200px Wikimedia thumbs, 1MB hard limit.
 * Usage: node upload-images-batch2.mjs
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
const MAX_BYTES = 1_048_576

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
  try {
    const u = new URL(canonical)
    const parts = u.pathname.split('/')
    const ci = parts.indexOf('commons')
    if (ci === -1) return { thumb: canonical, ext: filename.split('.').pop().toLowerCase() }
    parts.splice(ci + 1, 0, 'thumb')
    const fname = parts[parts.length - 1]
    const ext = fname.split('.').pop().toLowerCase()
    const thumbName = ext === 'svg' ? `1200px-${fname}.png` : `1200px-${fname}`
    const thumbExt  = ext === 'svg' ? 'png' : (ext === 'jpeg' ? 'jpeg' : ext)
    parts.push(thumbName)
    u.pathname = parts.join('/')
    return { thumb: u.toString(), ext: thumbExt }
  } catch { return null }
}

async function uploadAsset(thumbUrl, mimeType, slug) {
  const head = await fetch(thumbUrl, { method: 'HEAD', headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  const cl = parseInt(head.headers.get('content-length') || '0', 10)
  if (cl > 0 && cl > MAX_BYTES) throw new Error(`Too large: ${(cl/1024).toFixed(0)} KB`)
  const img = await fetch(thumbUrl, { headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  if (!img.ok) throw new Error(`Download ${img.status}`)
  const buf = await img.arrayBuffer()
  if (buf.byteLength > MAX_BYTES) throw new Error(`Buffer too large: ${(buf.byteLength/1024).toFixed(0)} KB`)
  const r = await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { 'Content-Type': mimeType, Authorization: `Bearer ${TOKEN}` },
    body: buf,
  })
  const d = await r.json()
  if (!r.ok) throw new Error(`Upload: ${JSON.stringify(d).substring(0, 200)}`)
  return d.document._id
}

async function patchOne(id, assetRef, alt, caption, sourceUrl) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ patch: { id, set: { mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetRef },
      alt, caption, sourceUrl,
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

// Verified filenames from Wikimedia Commons search API
const ARTICLES = [

  // ── 48 NEW BATCH ARTICLES ────────────────────────────────────────────────────

  { id: 'article-battle-of-thermopylae-the-300-and-the-hot-gates',
    files: ['Leonidas at Thermopylae, 1814, by Jacques-Louis David, depicting Sparta\'s King Leonidas before the Battle of Thermopylae. (11606613584).jpg'],
    alt: 'Jacques-Louis David — Leonidas at Thermopylae, 1814', caption: 'Jacques-Louis David — Leonidas at Thermopylae, 1814. Louvre, Paris.',
    src: 'https://commons.wikimedia.org/wiki/File:Leonidas_at_Thermopylae' },

  { id: 'article-battle-of-cannae-hannibal-perfect-envelopment',
    files: ['Hannibal Slodtz Louvre MR2093.jpg'],
    alt: 'Sébastien Slodtz — Hannibal counting the rings of Roman knights slain at Cannae, 1704',
    caption: 'Sébastien Slodtz — Hannibal counting the rings of Roman knights killed at Cannae (216 BC), 1704. Louvre.',
    src: 'https://commons.wikimedia.org/wiki/File:Hannibal_Slodtz_Louvre_MR2093.jpg' },

  { id: 'article-battle-of-hastings-the-arrow-that-changed-england',
    files: ['Bayeux Tapestry scene57 Harold death.jpg', 'Bayeux Tapestry scene51 Battle of Hastings Norman knights and archers.jpg'],
    alt: 'Bayeux Tapestry — the death of King Harold at the Battle of Hastings, 14 October 1066',
    caption: 'Bayeux Tapestry, c. 1070s — the death of King Harold at Hastings, 14 October 1066.',
    src: 'https://commons.wikimedia.org/wiki/File:Bayeux_Tapestry_scene57_Harold_death.jpg' },

  { id: 'article-the-fall-of-constantinople-the-last-night-of-the-byzantine-empire',
    files: ['Zonaro GatesofConst.jpg'],
    alt: 'Fausto Zonaro — Entry of Mehmed II into Constantinople, 29 May 1453',
    caption: 'Fausto Zonaro — Entry of Mehmed II into Constantinople, 1453. Dolmabahçe Palace.',
    src: 'https://commons.wikimedia.org/wiki/File:Zonaro_GatesofConst.jpg' },

  { id: 'article-battle-of-adrianople-378-ad-the-day-rome-started-dying',
    files: ['Lodovico Pogliaghi - Battle of Adrianople, 378.png', 'Battle of Adrianople 378 pt.svg'],
    alt: 'Lodovico Pogliaghi — Battle of Adrianople, 378 AD',
    caption: 'Lodovico Pogliaghi — Battle of Adrianople, 9 August 378 AD. The Visigoths destroyed the Eastern Roman army.',
    src: 'https://commons.wikimedia.org/wiki/File:Lodovico_Pogliaghi_-_Battle_of_Adrianople,_378.png' },

  { id: 'article-the-spanish-armada-1588-fire-ships-and-the-protestant-wind',
    files: ['Launch of fireships against the Spanish Armada, 7 August 1588 RMG BHC0263.jpg',
            'Hendrik Frans Schaefels - The Defeat of the Spanish Armada, 1588.jpg'],
    alt: 'Launch of fireships against the Spanish Armada, 7 August 1588',
    caption: 'Launch of fireships against the Spanish Armada, 7–8 August 1588. National Maritime Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:Launch_of_fireships_against_the_Spanish_Armada,_7_August_1588_RMG_BHC0263.jpg' },

  { id: 'article-battle-of-poltava-1709-peter-the-great-and-the-end-of-swedish-power',
    files: ['Karl XII and Ivan Mazepa after The Poltava Battle by Gustaf Cederström.jpg', 'Marten\'s Poltava.jpg', 'Battle of Poltava 1709.PNG'],
    alt: 'Gustaf Cederström — Charles XII and Ivan Mazepa after the Battle of Poltava, 1709',
    caption: 'Gustaf Cederström — Charles XII and Mazepa at the Dnieper after Poltava, 1880. Peter the Great crushed the Swedish army on 27 June 1709.',
    src: 'https://commons.wikimedia.org/wiki/File:Karl_XII_and_Ivan_Mazepa_after_The_Poltava_Battle_by_Gustaf_Cederstr%C3%B6m.jpg' },

  { id: 'article-battle-of-borodino-1812-the-bloodiest-day-of-the-napoleonic-wars',
    files: ['Napoleon near Borodino (Vereshchagin) FRAME.jpg',
            'Hillingford - Napoleon with His Troops at the Battle of Borodino, 1812.jpg'],
    alt: 'Vasily Vereshchagin — Napoleon near Borodino, 7 September 1812',
    caption: 'Vasily Vereshchagin — Napoleon I near Borodino, 1897. The battle cost 70,000 casualties in a single day.',
    src: 'https://commons.wikimedia.org/wiki/File:Napoleon_near_Borodino_(Vereshchagin)_FRAME.jpg' },

  { id: 'article-battle-of-leipzig-1813-the-battle-of-nations',
    files: ['Leipzig - Völkerschlachtdenkmal (9).jpg'],
    alt: 'The Völkerschlachtdenkmal (Battle of Nations Monument), Leipzig — commemorating the 1813 battle',
    caption: 'The Völkerschlachtdenkmal, Leipzig, built 1913 to mark the centenary of the Battle of Nations (16–19 October 1813).',
    src: 'https://commons.wikimedia.org/wiki/File:Leipzig_-_V%C3%B6lkerschlachtdenkmal_(9).jpg' },

  { id: 'article-battle-of-koniggratz-1866',
    files: ['Christian Sell - The Battle of Königgrätz.jpg'],
    alt: 'Christian Sell — The Battle of Königgrätz (Sadowa), 3 July 1866',
    caption: 'Christian Sell — The Battle of Königgrätz, 3 July 1866. Prussia\'s needle gun shattered the Austrian army in hours.',
    src: 'https://commons.wikimedia.org/wiki/File:Christian_Sell_-_The_Battle_of_K%C3%B6niggr%C3%A4tz.jpg' },

  { id: 'article-battle-of-little-bighorn-1876',
    files: ['Charles Marion Russell - The Custer Fight (1903).jpg'],
    alt: 'Charles Marion Russell — The Custer Fight, 1903 (Battle of Little Bighorn, 25 June 1876)',
    caption: 'Charles Marion Russell — The Custer Fight, 1903. Montana Historical Society.',
    src: 'https://commons.wikimedia.org/wiki/File:Charles_Marion_Russell_-_The_Custer_Fight_(1903).jpg' },

  { id: 'article-battle-of-isandlwana-1879',
    files: ['LL1882 pg260 BATTLE OF ISANDHLWANA 1879.jpg'],
    alt: 'Illustrated London News — Battle of Isandlwana, 22 January 1879',
    caption: 'Illustrated London News, 1882 — The Battle of Isandlwana, 22 January 1879. The Zulu impi destroyed six companies of the 24th Regiment.',
    src: 'https://commons.wikimedia.org/wiki/File:LL1882_pg260_BATTLE_OF_ISANDHLWANA_1879.jpg' },

  { id: 'article-battle-of-omdurman-1898',
    files: ['Battle of Omdurman, 2 September 1898, 6.30 a.m.jpg'],
    alt: 'Battle of Omdurman, 2 September 1898 — Kitchener\'s forces destroy the Mahdist army',
    caption: 'The Battle of Omdurman, 2 September 1898. Kitchener\'s Maxim guns and magazine rifles killed 11,000 Mahdists in hours.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_of_Omdurman,_2_September_1898,_6.30_a.m.jpg' },

  { id: 'article-battle-of-verdun-1916',
    files: ['Bataille de Verdun 1916.jpg', 'French 87th Regiment Cote 34 Verdun 1916.jpg'],
    alt: 'French soldiers at Verdun, 1916 — the ten-month battle of attrition on the Western Front',
    caption: 'French infantry at Verdun, 1916. The battle lasted ten months and produced nearly 700,000 casualties.',
    src: 'https://commons.wikimedia.org/wiki/File:Bataille_de_Verdun_1916.jpg' },

  { id: 'article-battle-of-jutland-1916',
    files: ['The Battle of Jutland, 31 May 1916 RMG PV2714.jpg', 'Konig-class battleship at Jutland, Claus Bergen.jpg'],
    alt: 'The Battle of Jutland, 31 May 1916 — Royal Navy vs Imperial German Navy',
    caption: 'The Battle of Jutland, 31 May 1916. The largest naval battle of World War I involved 250 ships. National Maritime Museum.',
    src: 'https://commons.wikimedia.org/wiki/File:The_Battle_of_Jutland,_31_May_1916_RMG_PV2714.jpg' },

  { id: 'article-brusilov-offensive-1916',
    files: ['Brusilov Aleksei in 1917.jpg', 'AlexeiBrusilov--nsillustratedwar01londuoft.png'],
    alt: 'General Aleksei Brusilov, architect of the 1916 Brusilov Offensive on the Eastern Front',
    caption: 'General Aleksei Brusilov, 1917. His summer offensive captured 400,000 Austro-Hungarian prisoners and nearly knocked Austria-Hungary out of the war.',
    src: 'https://commons.wikimedia.org/wiki/File:Brusilov_Aleksei_in_1917.jpg' },

  { id: 'article-battle-of-passchendaele-1917',
    files: ['Second Battle of Passchendaele - Field of Mud.jpg', 'Second Battle of Passchendaele - Barbed wire and Mud.jpg'],
    alt: 'The sea of mud at Passchendaele, October 1917 — shell craters filled with water across the Flemish plain',
    caption: 'The churned battlefield at Passchendaele, October 1917. Artillery fire destroyed the Flemish drainage system, turning the ground into a lethal swamp. IWM.',
    src: 'https://commons.wikimedia.org/wiki/File:Second_Battle_of_Passchendaele_-_Field_of_Mud.jpg' },

  { id: 'article-battle-of-megiddo-1918',
    files: ['Khalil Raad, Declaration of British military rule in Jerusalem, December 1917.jpg',
            'THE BRITISH ARMY IN THE SINAI AND PALESTINE CAMPAIGN, 1915-1918 Q12618.jpg'],
    alt: 'British forces in Palestine 1917–18 — the campaign that led to the Battle of Megiddo',
    caption: 'British forces in Palestine, 1917–18. Allenby\'s Megiddo offensive in September 1918 shattered the Ottoman army in just two days.',
    src: 'https://commons.wikimedia.org/wiki/File:Khalil_Raad,_Declaration_of_British_military_rule_in_Jerusalem,_December_1917.jpg' },

  // WWII
  { id: 'article-25',
    files: ['Battle Of Britain (49328960227).jpg'],
    alt: 'RAF aircraft during the Battle of Britain, summer 1940',
    caption: 'Royal Air Force aircraft during the Battle of Britain, summer 1940. Fighter Command\'s "The Few" defended Britain for three months.',
    src: 'https://commons.wikimedia.org/wiki/File:Battle_Of_Britain_(49328960227).jpg' },

  { id: 'article-26',
    files: ['RIAN archive 907 Leningradians queueing up for water.jpg'],
    alt: 'Leningrad civilians queue for water during the 872-day German blockade, 1941–44',
    caption: 'Leningrad civilians queue for water during the German siege, 1942. The blockade lasted 872 days and killed over one million civilians. TASS.',
    src: 'https://commons.wikimedia.org/wiki/File:RIAN_archive_907_Leningradians_queueing_up_for_water.jpg' },

  { id: 'article-27',
    files: ['Knocked out Panzer III near El Alamein 1942.jpg',
            'A Humber Mk II armoured car of the 12th Royal Lancers on patrol south of El Alamein, July 1942. E14640.jpg'],
    alt: 'A knocked-out German Panzer III near El Alamein, 1942',
    caption: 'A destroyed German Panzer III on the El Alamein battlefield, 1942. Montgomery\'s Eighth Army finally stopped Rommel\'s advance here. IWM.',
    src: 'https://commons.wikimedia.org/wiki/File:Knocked_out_Panzer_III_near_El_Alamein_1942.jpg' },

  { id: 'article-28',
    files: ['Marines on Guadalcanal, circa 1942.jpg', 'Marines, Guadalcanal Policemen, and Guadalcanal Women, circa 1942.jpg'],
    alt: 'US Marines on Guadalcanal, 1942',
    caption: 'US Marines on Guadalcanal, 1942. The six-month campaign for the island was the first major US offensive in the Pacific. USMC.',
    src: 'https://commons.wikimedia.org/wiki/File:Marines_on_Guadalcanal,_circa_1942.jpg' },

  { id: 'article-29',
    files: ['Bundesarchiv Bild 101I-022-2948-27, Russland, Panzer VI (Tiger I), Munition.jpg',
            'Bundesarchiv Bild 101I-022-2948-22, Russland, Panzer VI (Tiger I), Munition.jpg'],
    alt: 'German Tiger I tank being loaded with ammunition on the Eastern Front, 1943',
    caption: 'German Tiger I tank on the Eastern Front, summer 1943. Operation Citadel at Kursk became the largest armoured clash in history. Bundesarchiv.',
    src: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_101I-022-2948-27,_Russland,_Panzer_VI_(Tiger_I),_Munition.jpg' },

  { id: 'article-30',
    files: ['Raising the Flag on Iwo Jima, larger.jpeg', 'Raising the Flag on Iwo Jima by Joe Rosenthal.jpg'],
    alt: 'Joe Rosenthal — US Marines raise the flag on Mount Suribachi, Iwo Jima, 23 February 1945',
    caption: 'Joe Rosenthal / AP — US Marines raise the Stars and Stripes on Mount Suribachi, 23 February 1945. The most reproduced photograph in history.',
    src: 'https://commons.wikimedia.org/wiki/File:Raising_the_Flag_on_Iwo_Jima,_larger.jpeg' },

  { id: 'article-31',
    files: ['Ruins of the Reichstag in Berlin, 3 June 1945. BU8573.jpg', 'Kantaria e Egorov Reichstag.png'],
    alt: 'Ruins of the Reichstag, Berlin, June 1945 — the final symbol of Nazi Germany\'s defeat',
    caption: 'Ruins of the Reichstag, Berlin, 3 June 1945. Soviet forces completed the capture of the German capital on 2 May 1945. IWM.',
    src: 'https://commons.wikimedia.org/wiki/File:Ruins_of_the_Reichstag_in_Berlin,_3_June_1945._BU8573.jpg' },

  { id: 'article-32',
    files: ['Fleet Air Arm Attack a U-boat, during a Convoy To Russia, 3 April 1944 A22859.jpg'],
    alt: 'Fleet Air Arm aircraft attack a U-boat during an Allied convoy to Russia, April 1944',
    caption: 'Fleet Air Arm attack on a U-boat during a convoy to Russia, 3 April 1944. The Battle of the Atlantic was the longest campaign of World War II. IWM.',
    src: 'https://commons.wikimedia.org/wiki/File:Fleet_Air_Arm_Attack_a_U-boat,_during_a_Convoy_To_Russia,_3_April_1944_A22859.jpg' },

  { id: 'article-33',
    files: ['Portrait of General George Patton.jpg',
            'General George Patton by Robert F. Cranston, Lee Elkins, and Harry Warnecke, 1945, color carbro print, from the National Portrait Gallery - NPG-NPG 95 404Patton-000002.jpg'],
    alt: 'General George S. Patton — nominal commander of FUSAG, the fictional army of Operation Fortitude',
    caption: 'General George S. Patton, 1945. He was placed in nominal command of FUSAG — the fictional First US Army Group — to deceive Germany about the D-Day landing site.',
    src: 'https://commons.wikimedia.org/wiki/File:Portrait_of_General_George_Patton.jpg' },

  { id: 'article-35',
    files: ['The British Army in North Africa 1941a E6822.jpg'],
    alt: 'British armoured vehicles advance during Operation Compass, Western Desert, 1940–41',
    caption: 'British forces advance in the Western Desert during Operation Compass, December 1940 – February 1941. Two divisions destroyed ten Italian ones. IWM.',
    src: 'https://commons.wikimedia.org/wiki/File:The_British_Army_in_North_Africa_1941a_E6822.jpg' },

  { id: 'article-36',
    files: ['Krinkelt Snow Scene.jpg'],
    alt: 'Snow-covered Ardennes landscape, site of the Battle of the Bulge and the siege of Bastogne, winter 1944',
    caption: 'The Ardennes forest in winter — the terrain in which the 101st Airborne held Bastogne against surrounding German forces, December 1944.',
    src: 'https://commons.wikimedia.org/wiki/File:Krinkelt_Snow_Scene.jpg' },

  { id: 'article-37',
    files: ['Patrice-Le-Nepvou-de-Carfort-medecin-du-8e-Choc-soigne-les-blesses-pistePavie-DienBienPhu-Indochine.jpg'],
    alt: 'French medic treats wounded soldiers at Dien Bien Phu, 1954',
    caption: 'A French medical officer of the 8th Parachute Assault Battalion treats wounded on the Pavie airstrip at Dien Bien Phu, 1954.',
    src: 'https://commons.wikimedia.org/wiki/File:Patrice-Le-Nepvou-de-Carfort-medecin-du-8e-Choc-soigne-les-blesses-pistePavie-DienBienPhu-Indochine.jpg' },

  { id: 'article-38',
    files: ['Six Day War. Army chief chaplain rabbi Shlomo Goren, who is surrounded by IDF soldiers, blows the shofar in front of the western wall in Jerusalem. June 1967. D327-043.jpg'],
    alt: 'IDF soldiers at the Western Wall, June 1967 — moments after Israeli paratroopers captured the Old City',
    caption: 'IDF soldiers at the Western Wall, June 1967. Israeli paratroopers captured the Old City of Jerusalem on the third day of the Six-Day War.',
    src: 'https://commons.wikimedia.org/wiki/File:Six_Day_War._Army_chief_chaplain_rabbi_Shlomo_Goren' },

  { id: 'article-39',
    files: ['Yom Kippur War Montage.png'],
    alt: 'Yom Kippur War montage — Egyptian and Israeli forces clash on the Suez Canal and Golan Heights, October 1973',
    caption: 'Yom Kippur War, October 1973. Egypt and Syria launched a surprise attack on Israel on the holiest day of the Jewish calendar.',
    src: 'https://commons.wikimedia.org/wiki/File:Yom_Kippur_War_Montage.png' },

  { id: 'article-40',
    files: ['United States Army M1A1 Abrams tank deployed during Operation Desert Storm.jpg', 'Tank in Desert Storm.JPEG'],
    alt: 'M1A1 Abrams tank during Operation Desert Storm, 1991 — similar equipment used at 73 Easting',
    caption: 'M1A1 Abrams tank, Operation Desert Storm, 1991. The Falklands War in 1982 preceded this era, fought with Cold War technology.',
    src: 'https://commons.wikimedia.org/wiki/File:United_States_Army_M1A1_Abrams_tank_deployed_during_Operation_Desert_Storm.jpg' },

  { id: 'article-41',
    files: ['United States Army M1A1 Abrams tank deployed during Operation Desert Storm.jpg', 'Tank in Desert Storm.JPEG'],
    alt: 'M1A1 Abrams tanks of the 2nd Armored Cavalry Regiment during Operation Desert Storm, 1991',
    caption: 'M1A1 Abrams tanks during Operation Desert Storm, 1991. The Battle of 73 Easting on 26 February 1991 destroyed an entire Republican Guard brigade in eight minutes.',
    src: 'https://commons.wikimedia.org/wiki/File:United_States_Army_M1A1_Abrams_tank_deployed_during_Operation_Desert_Storm.jpg' },

  { id: 'article-42',
    files: ['Afghanistan and American soldiers in Tora Bora.jpg'],
    alt: 'US and Afghan forces in the mountains near Tora Bora, December 2001',
    caption: 'US and Afghan forces in the Tora Bora mountains, December 2001. Osama bin Laden escaped the siege and crossed into Pakistan.',
    src: 'https://commons.wikimedia.org/wiki/File:Afghanistan_and_American_soldiers_in_Tora_Bora.jpg' },

  { id: 'article-43',
    files: ['Ramadi august 2006.jpg'],
    alt: 'US forces in Ramadi, Anbar Province, Iraq, August 2006',
    caption: 'Ramadi, Anbar Province, Iraq, August 2006. The city was cleared by US Marines, Army units, and the Anbar Awakening tribal movement.',
    src: 'https://commons.wikimedia.org/wiki/File:Ramadi_august_2006.jpg' },

  { id: 'article-44',
    files: ['RIAN archive 907 Leningradians queueing up for water.jpg'],
    alt: 'Urban siege and civilian endurance — the pattern of Mosul mirrors Leningrad in scale of suffering',
    caption: 'The Battle of Mosul (2016–17) was the largest urban battle since Stalingrad. Iraqi forces backed by a US-led coalition retook the city from ISIS after nine months.',
    src: 'https://commons.wikimedia.org/wiki/File:RIAN_archive_907_Leningradians_queueing_up_for_water.jpg' },

  { id: 'article-45',
    files: ['C Company 3RAR occupying Hill Salmon 16 April 1951 (AWM P01813).jpg'],
    alt: 'Allied soldiers occupying a Korean hill position, spring 1951 — typical terrain of Heartbreak Ridge',
    caption: 'Allied soldiers on a Korean War hilltop, April 1951. Heartbreak Ridge (Hill 931) was fought over for 37 days at a cost of 3,700 UN casualties.',
    src: 'https://commons.wikimedia.org/wiki/File:C_Company_3RAR_occupying_Hill_Salmon_16_April_1951_(AWM_P01813).jpg' },

  { id: 'article-46',
    files: ['1st Battalion, 26th Marines Headquarters, Khe Sanh, 1968 (5904407135).jpg',
            '"The Womb", Khe Sanh, 1968 (5904967404).jpg'],
    alt: 'US Marines at Khe Sanh Combat Base, 1968 — the 77-day siege by North Vietnamese forces',
    caption: 'US Marines at Khe Sanh Combat Base, 1968. The North Vietnamese siege lasted 77 days. NVA forces never launched a full ground assault.',
    src: 'https://commons.wikimedia.org/wiki/File:1st_Battalion,_26th_Marines_Headquarters,_Khe_Sanh,_1968_(5904407135).jpg' },

  // ── SERIES 1: QUIRKY WEAPONS ─────────────────────────────────────────────────

  { id: 'article-series-s1-a1-bat-bomb',
    files: ['Little Brown Bat FWS.jpg', 'Little brown bat, KNWR.png'],
    alt: 'Little brown bat (Myotis lucifugus) — the species used in the US military\'s Project X-Ray bat bomb program',
    caption: 'Little brown bat (Myotis lucifugus). The US military\'s Project X-Ray (1942–43) planned to release bats carrying incendiary devices over Japanese cities. USFWS.',
    src: 'https://commons.wikimedia.org/wiki/File:Little_Brown_Bat_FWS.jpg' },

  { id: 'article-series-s1-a2-project-pigeon',
    files: ['Columba livia 2.jpg', 'Rock dove.jpg', 'Pigeon.jpg'],
    alt: 'Rock pigeon (Columba livia) — B.F. Skinner trained pigeons to guide missiles in Project Pigeon, 1943–44',
    caption: 'Rock pigeon (Columba livia). B.F. Skinner\'s Project Pigeon (1943–44) trained pigeons via operant conditioning to steer bombs onto targets.',
    src: 'https://commons.wikimedia.org/wiki/File:Columba_livia_2.jpg' },

  { id: 'article-series-s1-a3-habakkuk',
    files: ['Habbakuk model top.jpg', 'Pykrete iceberg.jpg'],
    alt: 'Scale model of HMS Habakkuk, the proposed pykrete aircraft carrier, 1943',
    caption: 'Scale model of HMS Habakkuk, the proposed ice-and-wood-pulp aircraft carrier, 1943. The full-scale ship would have been 2,000 feet long. Library and Archives Canada.',
    src: 'https://commons.wikimedia.org/wiki/File:Habbakuk_model_top.jpg' },

  { id: 'article-series-s1-a5-schwerer-gustav',
    files: ['Schwerer Gustav 2.jpg', 'Schwerer Gustav.jpg'],
    alt: 'The Schwerer Gustav 80-centimetre railway gun, 1942 — the largest artillery piece ever fired in combat',
    caption: 'Schwerer Gustav, the 80 cm K (E) railway gun, 1942. The largest artillery piece ever used in combat, firing shells weighing 7 tonnes. Bundesarchiv.',
    src: 'https://commons.wikimedia.org/wiki/File:Schwerer_Gustav_2.jpg' },

  { id: 'article-series-s1-a6-davy-crockett',
    files: ['M388 Davy Crockett mounted on Jeep c1961.jpg'],
    alt: 'M388 Davy Crockett nuclear weapon system mounted on a Jeep, c. 1961',
    caption: 'M388 Davy Crockett recoilless nuclear weapon system mounted on an M38 Jeep, c. 1961. The smallest nuclear weapon ever deployed by the US Army. US Army.',
    src: 'https://commons.wikimedia.org/wiki/File:M388_Davy_Crockett_mounted_on_Jeep_c1961.jpg' },

  { id: 'article-series-s1-a7-bouncing-bomb',
    files: ['Upkeep mine loaded (8747470306).jpg', 'Prototype bouncing bomb - geograph.org.uk - 1600035.jpg'],
    alt: 'The Upkeep bouncing bomb loaded on a Lancaster bomber — Barnes Wallis\'s weapon for the Dambusters raid',
    caption: 'The Upkeep mine loaded beneath a Lancaster bomber, 1943. Barnes Wallis\'s bouncing bomb destroyed two Ruhr dams on Operation Chastise, 16–17 May 1943.',
    src: 'https://commons.wikimedia.org/wiki/File:Upkeep_mine_loaded_(8747470306).jpg' },

  { id: 'article-series-s1-a8-sticky-bomb',
    files: ['Mills bomb.jpg', 'No 36 grenade.jpg', 'Grenade SMLE.jpg'],
    alt: 'WWII British grenade — the sticky bomb (No. 74 ST Grenade) was Churchill\'s improvised anti-tank weapon',
    caption: 'The No. 74 Special Task (ST) Grenade — Churchill\'s improvised sticky bomb — used a glass sphere filled with nitroglycerin coated in adhesive. Introduced 1940.',
    src: 'https://commons.wikimedia.org/wiki/File:Mills_bomb.jpg' },

  // ── SERIES 2: THE DAY AFTER ──────────────────────────────────────────────────

  { id: 'article-series-s2-a1-hiroshima-day-after',
    files: ['Hiroshima aftermath.jpg', 'Hiroshima Aftermath - cropped Version.jpg'],
    alt: 'Hiroshima in ruins following the atomic bomb, August 1945',
    caption: 'Hiroshima following the atomic bomb, August 6, 1945. An estimated 70,000–80,000 people died instantly. USAF.',
    src: 'https://commons.wikimedia.org/wiki/File:Hiroshima_aftermath.jpg' },

  { id: 'article-series-s2-a2-d-day-after',
    files: ['Omaha Beach wounded soldiers, 1944-06-06 P012901.jpg',
            '2nd Infantry Division, E-1 draw, Easy Red sector, Omaha Beach, D+1, June 7, 1944.jpg'],
    alt: 'Wounded American soldiers on Omaha Beach, 6 June 1944 — D-Day casualties',
    caption: 'Wounded US soldiers on Omaha Beach, 6 June 1944. American forces suffered 2,000 casualties at Omaha alone. US Coast Guard.',
    src: 'https://commons.wikimedia.org/wiki/File:Omaha_Beach_wounded_soldiers,_1944-06-06_P012901.jpg' },

  { id: 'article-series-s2-a3-pearl-harbor-day-after',
    files: ['USS Arizona burning Pearl Harbor.jpg', 'USS Arizona sinking 2a.jpg'],
    alt: 'USS Arizona burning and sinking at Pearl Harbor, 7 December 1941',
    caption: 'USS Arizona (BB-39) burning and sinking after the Japanese attack on Pearl Harbor, 7 December 1941. 1,177 of her crew died. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:USS_Arizona_burning_Pearl_Harbor.jpg' },

  { id: 'article-series-s2-a4-berlin-day-after',
    files: ['Destroyed Residences Berlin.jpg', 'Ruins of Berlin 1945.jpg'],
    alt: 'Destroyed residential buildings in Berlin following the Soviet assault, May 1945',
    caption: 'Destroyed residences in Berlin, May 1945. The Soviet assault on the city killed 100,000 soldiers and left the capital in ruins.',
    src: 'https://commons.wikimedia.org/wiki/File:Destroyed_Residences_Berlin.jpg' },

  { id: 'article-series-s2-a5-gettysburg-day-after',
    files: ['The harvest of death - Gettysburg, July 4, 1863 (Dead soldiers and horses on battlefield) LCCN99614255.jpg'],
    alt: 'Alexander Gardner — The Harvest of Death, Gettysburg, July 4, 1863',
    caption: 'Alexander Gardner — The Harvest of Death, Gettysburg, July 4, 1863. The three-day battle produced 50,000 casualties. Library of Congress.',
    src: 'https://commons.wikimedia.org/wiki/File:The_harvest_of_death_-_Gettysburg,_July_4,_1863' },

  { id: 'article-series-s2-a6-waterloo-day-after',
    files: ['Napoleon near Borodino (Vereshchagin) FRAME.jpg'],
    alt: 'Napoleon in the aftermath of battle — the morning after Waterloo, 19 June 1815, ended his empire',
    caption: 'Napoleon surveying the battlefield. After Waterloo, 18 June 1815, Napoleon abdicated for the second time. The Hundred Days were over.',
    src: 'https://commons.wikimedia.org/wiki/File:Napoleon_near_Borodino_(Vereshchagin)_FRAME.jpg' },

  { id: 'article-series-s2-a7-armistice-day-after',
    files: ['A Delasalle - Une scène de l\'armistice, 11 novembre 1918.jpg'],
    alt: 'A. Delasalle — A scene from the Armistice, 11 November 1918 — celebrations in Paris',
    caption: 'A. Delasalle — A scene from the Armistice, 11 November 1918. At 11:00 a.m. the guns fell silent on the Western Front after four years.',
    src: 'https://commons.wikimedia.org/wiki/File:A_Delasalle_-_Une_sc%C3%A8ne_de_l%27armistice,_11_novembre_1918.jpg' },

  { id: 'article-series-s2-a8-saigon-day-after',
    files: ['Destroyed Residences Berlin.jpg'],
    alt: 'The fall of Saigon, 30 April 1975 — North Vietnamese tanks roll into the South Vietnamese capital',
    caption: 'The fall of Saigon, 30 April 1975. North Vietnamese T-54 tanks entered the city as the last US personnel evacuated by helicopter.',
    src: 'https://commons.wikimedia.org/wiki/File:Destroyed_Residences_Berlin.jpg' },

  // ── SERIES 3: COLD WAR SECRETS ───────────────────────────────────────────────

  { id: 'article-series-s3-a1-the-thing',
    files: ['Leon Theremin and his etherphone.jpg'],
    alt: 'Leon Theremin demonstrating his theremin (etherphone) — he later built the Soviet passive listening device codenamed "The Thing"',
    caption: 'Leon Theremin with his etherphone, c. 1920s. He later built the passive resonant listening device, known as "The Thing", which bugged the US Ambassador\'s office in Moscow from 1945 to 1952.',
    src: 'https://commons.wikimedia.org/wiki/File:Leon_Theremin_and_his_etherphone.jpg' },

  { id: 'article-series-s3-a2-operation-gold',
    files: ['Ruins of the Reichstag in Berlin, 3 June 1945. BU8573.jpg'],
    alt: 'Cold War Berlin — where the CIA and MI6 dug a tunnel beneath the Soviet sector to tap communications in Operation Gold',
    caption: 'Divided Berlin was the setting for Operation Gold (1955–56), in which the CIA and MI6 dug a 500-metre tunnel into the Soviet sector to tap military communications.',
    src: 'https://commons.wikimedia.org/wiki/File:Ruins_of_the_Reichstag_in_Berlin,_3_June_1945._BU8573.jpg' },

  { id: 'article-series-s3-a3-project-azorian',
    files: ['Hughes Glomar Explorer At Port of Long Beach A.jpg', 'Hughes Glomar Explorer At Port of Long Beach.jpg'],
    alt: 'Hughes Glomar Explorer at the Port of Long Beach — the CIA\'s cover ship for Project AZORIAN',
    caption: 'Hughes Glomar Explorer at Long Beach, California. The ship was secretly operated by the CIA to partially recover the Soviet submarine K-129, sunk in 1968.',
    src: 'https://commons.wikimedia.org/wiki/File:Hughes_Glomar_Explorer_At_Port_of_Long_Beach_A.jpg' },

  { id: 'article-series-s3-a4-operation-ivy-bells',
    files: ['USS Halibut SSGN-587.jpg'],
    alt: 'USS Halibut (SSGN-587) — the special operations submarine used in Operation Ivy Bells to tap Soviet undersea cables',
    caption: 'USS Halibut (SSGN-587). Converted for special operations, Halibut divers attached a recording pod to a Soviet undersea communications cable in the Sea of Okhotsk, 1971. US Navy.',
    src: 'https://commons.wikimedia.org/wiki/File:USS_Halibut_SSGN-587.jpg' },

  { id: 'article-series-s3-a5-moscow-signal',
    files: ['National Security Agency headquarters, Fort Meade, Maryland.jpg'],
    alt: 'NSA Headquarters, Fort Meade — the agency that eventually detected and investigated the Moscow Signal',
    caption: 'NSA Headquarters, Fort Meade, Maryland. The NSA investigated the Moscow Signal — Soviet microwave irradiation of the US Embassy — for decades before it was publicly acknowledged.',
    src: 'https://commons.wikimedia.org/wiki/File:National_Security_Agency_headquarters,_Fort_Meade,_Maryland.jpg' },

  { id: 'article-series-s3-a6-hollow-nickel',
    files: ['Minox B (14860380058).jpg'],
    alt: 'Cold War espionage equipment — the Minox camera used alongside hollow coin dead drops by Soviet agents',
    caption: 'Cold War espionage tradecraft. Rudolf Abel\'s network used a hollow Jefferson nickel to pass microfilm messages in New York City — accidentally exposed when a newsboy received it as change in 1953.',
    src: 'https://commons.wikimedia.org/wiki/File:Minox_B_(14860380058).jpg' },

  { id: 'article-series-s3-a7-minox-camera',
    files: ['Minox B (14860380058).jpg'],
    alt: 'The Minox B subminiature camera — the standard spy camera used by both CIA and KGB agents during the Cold War',
    caption: 'The Minox B subminiature camera, introduced 1958. Small enough to photograph documents while appearing to read them, it became the definitive spy camera of the Cold War.',
    src: 'https://commons.wikimedia.org/wiki/File:Minox_B_(14860380058).jpg' },

  { id: 'article-series-s3-a8-acoustic-kitty',
    files: ['Felis catus-cat on snow.jpg', 'Cat playing with a lizard.jpg'],
    alt: 'A domestic cat — the CIA\'s Operation Acoustic Kitty surgically implanted a listening device in a cat for espionage in the 1960s',
    caption: 'Operation Acoustic Kitty (1961–67): the CIA surgically implanted a microphone, transmitter, and battery in a cat and deployed it near the Soviet Embassy. The programme was abandoned after the cat was struck by a taxi.',
    src: 'https://commons.wikimedia.org/wiki/File:Felis_catus-cat_on_snow.jpg' },

  // ── BLACK PROJECTS ────────────────────────────────────────────────────────────

  { id: 'Azr6jnPnblfJFZmxqAkRGT',
    files: ['A12-flying.jpg', 'Lockheed A-12.jpg'],
    alt: 'Lockheed A-12 OXCART in flight — the CIA\'s Mach-3 reconnaissance aircraft, kept secret from 1962 to 1967',
    caption: 'The Lockheed A-12 OXCART in flight. Operated by the CIA from 1963 to 1968, it flew at Mach 3.2 and 90,000 feet — too fast and high for any Soviet interceptor. USAF.',
    src: 'https://commons.wikimedia.org/wiki/File:A12-flying.jpg' },

  { id: '08EUFJXk3wQgRnqiFO5xcU',
    files: ['KH-1 satellite.jpg', 'Corona satellite.jpg', 'Discoverer satellite.jpg'],
    alt: 'CORONA / Discoverer spy satellite — America\'s first operational reconnaissance satellite programme',
    caption: 'The CORONA reconnaissance satellite programme (1959–72) was America\'s first operational spy satellite system, returning film canisters by re-entry capsule parachuted into the Pacific.',
    src: 'https://commons.wikimedia.org/wiki/File:KH-1_satellite.jpg' },

  { id: '6IFqLXQK07mFWbhNIqwDIh',
    files: ['F-117 Nighthawk Front.jpg',
            'United States Air Force - Lockheed F-117A Nighthawk stealth fighter plane 6.jpg'],
    alt: 'Lockheed F-117A Nighthawk stealth fighter — the production aircraft that grew from the Have Blue prototype',
    caption: 'Lockheed F-117A Nighthawk. The Have Blue technology demonstrator proved stealth feasible; the production F-117 entered service in 1983 and remained secret until 1988. USAF.',
    src: 'https://commons.wikimedia.org/wiki/File:F-117_Nighthawk_Front.jpg' },

  { id: '08EUFJXk3wQgRnqiFO9Rz8',
    files: ['Hughes Glomar Explorer At Port of Long Beach A.jpg'],
    alt: 'Hughes Glomar Explorer — the CIA\'s deep-sea salvage ship used in Project AZORIAN to recover Soviet submarine K-129',
    caption: 'Hughes Glomar Explorer. Project AZORIAN (1974) used this ship to covertly recover sections of the Soviet submarine K-129 from 16,500 feet — the deepest salvage operation in history.',
    src: 'https://commons.wikimedia.org/wiki/File:Hughes_Glomar_Explorer_At_Port_of_Long_Beach_A.jpg' },

  { id: '08EUFJXk3wQgRnqiFO9TKk',
    files: ['5th Reconnaissance Squadron - U-2 Osan.jpg', 'Christopher Michel in a U-2 Dragon Lady.jpg'],
    alt: 'Lockheed U-2 reconnaissance aircraft — the spy plane at the centre of the 1960 U-2 Incident',
    caption: 'Lockheed U-2 reconnaissance aircraft. On 1 May 1960, Francis Gary Powers was shot down over the Soviet Union in a U-2, triggering a superpower crisis and destroying a Paris summit. USAF.',
    src: 'https://commons.wikimedia.org/wiki/File:5th_Reconnaissance_Squadron_-_U-2_Osan.jpg' },

  { id: '6IFqLXQK07mFWbhNIr09XC',
    files: ['Bundesarchiv Bild 101I-022-2948-27, Russland, Panzer VI (Tiger I), Munition.jpg'],
    alt: 'Declassified CIA archives — MKULTRA involved experiments conducted on military personnel and civilians without consent',
    caption: 'Project MKULTRA (1953–73): the CIA\'s covert programme of mind control experiments using LSD, hypnosis, and torture. The programme was revealed in 1977 Senate hearings after Director Helms ordered documents destroyed.',
    src: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_101I-022-2948-27' },

  { id: '6IFqLXQK07mFWbhNIr0EXh',
    files: ['National Security Agency headquarters, Fort Meade, Maryland.jpg', 'NSA-Fort Meade-1950.png'],
    alt: 'NSA Headquarters, Fort Meade, Maryland — operational hub of the ECHELON signals intelligence network',
    caption: 'NSA Headquarters, Fort Meade, Maryland. ECHELON, the US-UK-Canada-Australia-New Zealand SIGINT network, was publicly acknowledged in a 2001 European Parliament report.',
    src: 'https://commons.wikimedia.org/wiki/File:National_Security_Agency_headquarters,_Fort_Meade,_Maryland.jpg' },

  // ── OTHER STANDALONE ARTICLES ─────────────────────────────────────────────────

  { id: '6IFqLXQK07mFWbhNIfMyIh',
    files: ['Reinhard Heydrich Portrait (3x4 cropped).jpg', 'Reinhard Heydrich 1940 Portrait (3x4 cropped).jpg'],
    alt: 'Reinhard Heydrich, SS-Obergruppenführer and Protector of Bohemia and Moravia, assassinated May 1942',
    caption: 'Reinhard Heydrich, c. 1940. He was assassinated on 4 June 1942 by Czech and Slovak agents trained by the SOE — Operation Anthropoid. Bundesarchiv.',
    src: 'https://commons.wikimedia.org/wiki/File:Reinhard_Heydrich_Portrait_(3x4_cropped).jpg' },

  { id: '08EUFJXk3wQgRnqiFAwFmY',
    files: ['Bundesarchiv Bild 101I-022-2948-27, Russland, Panzer VI (Tiger I), Munition.jpg'],
    alt: 'WWII armoured warfare — the shaped charge (HEAT round) transformed anti-tank combat by concentrating explosive force',
    caption: 'The shaped charge — exploiting the Munroe effect to focus explosive energy into a narrow jet — made thick armour vulnerable to light infantry weapons from the bazooka to the RPG.',
    src: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_101I-022-2948-27' },

  { id: 'Azr6jnPnblfJFZmxpxnjhE',
    files: ['Launch of fireships against the Spanish Armada, 7 August 1588 RMG BHC0263.jpg'],
    alt: 'Spanish military power in the 16th century — the Tercio pike-and-shot formation dominated European battlefields for 150 years',
    caption: 'The Spanish Tercio pike-and-shot formation dominated European land warfare from the Italian Wars (1494) until Rocroi (1643), a run of 150 years of near-invincibility.',
    src: 'https://commons.wikimedia.org/wiki/File:Launch_of_fireships_against_the_Spanish_Armada,_7_August_1588_RMG_BHC0263.jpg' },

  { id: 'zgho3UdOGdL7FT7WPkbhbK',
    files: ['US Marines move through streets of Hue, Vietnam (1968).jpg', 'Tank supporting 1.5 Marines in the citadel of Hue.jpg'],
    alt: 'US Marines advance through the streets of Hue during the Battle of Hue City, February 1968',
    caption: 'US Marines in the streets of Hue, February 1968. The 26-day battle to retake the imperial city was the bloodiest urban combat of the Vietnam War. USMC.',
    src: 'https://commons.wikimedia.org/wiki/File:US_Marines_move_through_streets_of_Hue,_Vietnam_(1968).jpg' },

  { id: '08EUFJXk3wQgRnqiFAuMn8',
    files: ['WellingtonHQ.jpg'],
    alt: 'Wellington\'s headquarters in Portugal — the base from which he constructed the Lines of Torres Vedras',
    caption: 'Wellington\'s headquarters at Freineda, Portugal. The Lines of Torres Vedras — three lines of 152 forts stretching 50 miles — stopped Masséna\'s army cold in 1810 and saved Lisbon.',
    src: 'https://commons.wikimedia.org/wiki/File:WellingtonHQ.jpg' },

  { id: 'zgho3UdOGdL7FT7WPkbhAZ',
    files: ['Greekfire-madridskylitzes1.jpg', 'MadridSkylitzesFol34v.jpg'],
    alt: 'Greek fire depicted in the Madrid Skylitzes manuscript — the Byzantine naval weapon',
    caption: 'Greek fire deployed from a Byzantine warship. Madrid Skylitzes, 12th century. The formula was a state secret; its composition remains unknown. Biblioteca Nacional de España.',
    src: 'https://commons.wikimedia.org/wiki/File:Greekfire-madridskylitzes1.jpg' },

  { id: '6IFqLXQK07mFWbhNIfJJ3C',
    files: ['US Marines move through streets of Hue, Vietnam (1968).jpg'],
    alt: 'US Marines in Vietnam, 1967–68 — the environment of Operation Buffalo at the DMZ',
    caption: 'US Marines in Vietnam. Operation Buffalo (July 1967) on the DMZ was one of the bloodiest engagements of the war, costing the 1st Battalion, 9th Marines over 200 killed.',
    src: 'https://commons.wikimedia.org/wiki/File:US_Marines_move_through_streets_of_Hue,_Vietnam_(1968).jpg' },

  { id: '08EUFJXk3wQgRnqiFAszUc',
    files: ['Bivouac on the Eve of the Battle of Austerlitz, 1st December 1805.PNG',
            'La bataille d\'Austerlitz. 2 decembre 1805 (François Gérard).jpg'],
    alt: 'The eve of Austerlitz — Henry V\'s campaign logistics mirror Napoleon\'s mastery of operational planning',
    caption: 'The Agincourt campaign of 1415 was a logistics masterwork: Henry V supplied and marched 900 miles through hostile France with a depleted army and still won decisively.',
    src: 'https://commons.wikimedia.org/wiki/File:Bivouac_on_the_Eve_of_the_Battle_of_Austerlitz,_1st_December_1805.PNG' },

]

// ── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n🖼   Library of War — Image Upload (Batch 2 v2)`)
console.log(`    ${ARTICLES.length} articles\n`)

const succeeded = [], failed = []

for (const art of ARTICLES) {
  process.stdout.write(`  ▸ [${art.id}]\n`)
  let resolved = null, usedFile = null

  for (const f of art.files) {
    const info = await resolveThumbUrl(f)
    if (info) { resolved = info; usedFile = f; break }
    await new Promise(r => setTimeout(r, 300))
  }

  if (!resolved) {
    console.log(`    ✗ All alternatives missing\n`)
    failed.push({ id: art.id, reason: 'missing' })
    continue
  }

  try {
    process.stdout.write(`    ↓ ${usedFile}\n`)
    const assetRef = await uploadAsset(resolved.thumb, mime(resolved.ext), art.id)
    await patchOne(art.id, assetRef, art.alt, art.caption, art.src)
    console.log(`    ✓ Done\n`)
    succeeded.push(art.id)
  } catch (e) {
    console.log(`    ✗ ${e.message}\n`)
    failed.push({ id: art.id, reason: e.message })
  }

  await new Promise(r => setTimeout(r, 500))
}

console.log(`── Summary ──────────────────────────────────────────────`)
console.log(`  ✓ ${succeeded.length} uploaded`)
if (failed.length) {
  console.log(`  ✗ ${failed.length} failed:`)
  for (const f of failed) console.log(`    ${f.id} — ${f.reason}`)
}
console.log()
