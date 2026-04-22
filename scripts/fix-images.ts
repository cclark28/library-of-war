/**
 * fix-images.ts
 *
 * For each idDrillQuestion in Sanity:
 *  1. Queries Wikipedia REST API to find a real working image
 *  2. Downloads the image
 *  3. Uploads it to Sanity's CDN
 *  4. Patches the document's image.url field
 *
 * Run: npx tsx scripts/fix-images.ts
 */

import { createClient } from '@sanity/client'

const PROJECT_ID  = 'tifzt4zw'
const DATASET     = 'production'
const WRITE_TOKEN = 'sk7UrlIVTqzhoIlYTLTrxlCiGH48GIZ8bJz8WRtZb02w7Yy3PBI6dEGiitcLTbN6fMCXACArztXgPgUwut3BhrBrJJESQMFMwNMpoTBPgHGRQftJQReptzvAE1QdsAQKIL7fg05V8BANrgo9DxwDkBXtSuQbDAahGKh7H1rfpUc9CYqsvqOM'

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  token:     WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:    false,
})

const UA = 'LibraryOfWarBot/1.0 (https://libraryofwar.com; educational, public domain images)'
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// Map question names → Wikipedia article titles (when they differ)
const WIKI_TITLE_MAP: Record<string, string> = {
  'F-14 Tomcat':                           'Grumman F-14 Tomcat',
  'F/A-18 Hornet':                         'McDonnell Douglas F/A-18 Hornet',
  'F-15 Eagle':                            'McDonnell Douglas F-15 Eagle',
  'F-16 Fighting Falcon':                  'General Dynamics F-16 Fighting Falcon',
  'F-22 Raptor':                           'Lockheed Martin F-22 Raptor',
  'F-35 Lightning II':                     'Lockheed Martin F-35 Lightning II',
  'F-117 Nighthawk':                       'Lockheed F-117 Nighthawk',
  'F-4 Phantom II':                        'McDonnell Douglas F-4 Phantom II',
  'F-86 Sabre':                            'North American F-86 Sabre',
  'A-10 Thunderbolt II':                   'Fairchild Republic A-10 Thunderbolt II',
  'AH-64 Apache':                          'Boeing AH-64 Apache',
  'AH-1 Cobra':                            'Bell AH-1 Cobra',
  'AV-8B Harrier II':                      'McDonnell Douglas AV-8B Harrier II',
  'B-1 Lancer':                            'Rockwell B-1 Lancer',
  'B-2 Spirit':                            'Northrop Grumman B-2 Spirit',
  'B-17 Flying Fortress':                  'Boeing B-17 Flying Fortress',
  'B-24 Liberator':                        'Consolidated B-24 Liberator',
  'B-29 Superfortress':                    'Boeing B-29 Superfortress',
  'B-52 Stratofortress':                   'Boeing B-52 Stratofortress',
  'SR-71 Blackbird':                       'Lockheed SR-71 Blackbird',
  'U-2 Dragon Lady':                       'Lockheed U-2',
  'C-130 Hercules':                        'Lockheed C-130 Hercules',
  'C-17 Globemaster III':                  'Boeing C-17 Globemaster III',
  'CH-47 Chinook':                         'Boeing CH-47 Chinook',
  'UH-60 Black Hawk':                      'Sikorsky UH-60 Black Hawk',
  'UH-1 Iroquois (Huey)':                 'Bell UH-1 Iroquois',
  'MH-60G Pave Hawk':                      'Sikorsky UH-60 Black Hawk',
  'OH-6 Cayuse (Little Bird)':            'Hughes OH-6 Cayuse',
  'V-22 Osprey':                           'Bell Boeing V-22 Osprey',
  'MQ-9 Reaper':                           'General Atomics MQ-9 Reaper',
  'AC-130 Gunship':                        'Lockheed AC-130',
  'KC-135 Stratotanker':                   'Boeing KC-135 Stratotanker',
  'E-3 Sentry (AWACS)':                   'Boeing E-3 Sentry',
  'P-51 Mustang':                          'North American P-51 Mustang',
  'P-47 Thunderbolt':                      'Republic P-47 Thunderbolt',
  'P-38 Lightning':                        'Lockheed P-38 Lightning',
  'F4U Corsair':                           'Vought F4U Corsair',
  'Spitfire':                              'Supermarine Spitfire',
  'Avro Lancaster':                        'Avro Lancaster',
  'Bf 109':                                'Messerschmitt Bf 109',
  'Me 262 Schwalbe':                       'Messerschmitt Me 262',
  'Ju 87 Stuka':                           'Junkers Ju 87',
  'A6M Zero':                              'Mitsubishi A6M Zero',
  'MiG-15 Fagot':                          'Mikoyan-Gurevich MiG-15',
  'MiG-21 Fishbed':                        'Mikoyan-Gurevich MiG-21',
  'MiG-29 Fulcrum':                        'Mikoyan MiG-29',
  'Su-27 Flanker':                         'Sukhoi Su-27',
  'Eurofighter Typhoon':                   'Eurofighter Typhoon',
  'M1 Abrams':                             'M1 Abrams',
  'M4 Sherman':                            'M4 Sherman',
  'M2 Bradley':                            'M2 Bradley',
  'T-34':                                  'T-34',
  'T-72':                                  'T-72',
  'T-90':                                  'T-90 tank',
  'Leopard 2':                             'Leopard 2',
  'Challenger 2':                          'Challenger 2',
  'Tiger I':                               'Tiger I',
  'Panther (Panzerkampfwagen V)':         'Panther tank',
  'Panzerkampfwagen IV':                  'Panzer IV',
  'IS-2 Stalin':                           'IS-2',
  'Churchill Infantry Tank':              'Churchill tank',
  'M26 Pershing':                          'M26 Pershing',
  'Centurion Tank':                        'Centurion tank',
  'Merkava Mk IV':                         'Merkava',
  'M60 Patton':                            'M60 Patton',
  'Stryker':                               'Stryker',
  'M113 APC':                              'M113 armored personnel carrier',
  'ZSU-23-4 Shilka':                      'ZSU-23-4',
  'Leclerc MBT':                           'AMX Leclerc',
  'M16 Rifle':                             'M16 rifle',
  'M4 Carbine':                            'M4 carbine',
  'M1 Garand':                             'M1 Garand',
  'AK-47':                                 'AK-47',
  'M1911':                                 'M1911 pistol',
  'M1911 Pistol':                          'M1911 pistol',
  'M249 SAW':                              'M249 light machine gun',
  'M249 Squad Automatic Weapon':          'M249 light machine gun',
  'M2 Browning':                           'M2 Browning',
  'Browning M2 Heavy Machine Gun':        'M2 Browning',
  'Barrett M82':                           'Barrett M82',
  'MP40':                                  'MP 40',
  'Thompson M1928 Submachine Gun':        'Thompson submachine gun',
  'PPSh-41':                               'PPSh-41',
  'Karabiner 98k':                         'Karabiner 98k',
  'StG 44':                                'Sturmgewehr 44',
  'Lee-Enfield Mk III':                    'Lee–Enfield',
  'FN FAL':                                'FN FAL',
  'M14 Rifle':                             'M14 rifle',
  'M60 Machine Gun':                       'M60 machine gun',
  'M240B Machine Gun':                     'M240 machine gun',
  'RPG-7':                                 'RPG-7',
  'M79 Grenade Launcher':                 'M79 grenade launcher',
  'M72 LAW':                               'M72 LAW',
  'Beretta M9':                            'Beretta M9',
  'USS Missouri (BB-63)':                 'USS Missouri (BB-63)',
  'USS Enterprise (CV-6)':               'USS Enterprise (CV-6)',
  'USS Nimitz (CVN-68)':                  'USS Nimitz',
  'USS George Washington (CVN-73)':       'USS George Washington (CVN-73)',
  'USS Zumwalt (DDG-1000)':              'USS Zumwalt',
  'USS Arleigh Burke (DDG-51)':          'USS Arleigh Burke (DDG-51)',
  'Arleigh Burke-class Destroyer':        'Arleigh Burke-class destroyer',
  'Nimitz-class Carrier':                 'Nimitz-class aircraft carrier',
  'Ticonderoga-class Cruiser':           'Ticonderoga-class cruiser',
  'Los Angeles-class Submarine':         'Los Angeles-class submarine',
  'Ohio-class Submarine (SSBN)':         'Ohio-class submarine',
  'Virginia-class Submarine':            'Virginia-class submarine',
  'Bismarck':                             'German battleship Bismarck',
  'Bismarck (battleship)':               'German battleship Bismarck',
  'Yamato':                               'Japanese battleship Yamato',
  'HMS Hood':                             'HMS Hood',
  'HMS Belfast':                          'HMS Belfast',
  'Scharnhorst':                          'German battleship Scharnhorst',
  'Tirpitz':                              'German battleship Tirpitz',
  'HMCS Haida (G63)':                    'HMCS Haida',
  'USS Indianapolis CA-35':              'USS Indianapolis (CA-35)',
  'Slava-class Cruiser':                 'Slava-class cruiser',
  'Type 45 Destroyer':                   'Type 45 destroyer',
  'Medal of Honor':                       'Medal of Honor',
  'Medal of Honor (Army)':               'Medal of Honor',
  'Purple Heart':                         'Purple Heart',
  'Silver Star':                          'Silver Star (military decoration)',
  'Bronze Star':                          'Bronze Star Medal',
  'Bronze Star Medal':                    'Bronze Star Medal',
  'Navy Cross':                           'Navy Cross',
  'Distinguished Flying Cross':          'Distinguished Flying Cross (United States)',
  'Distinguished Service Cross':         'Distinguished Service Cross (United States Army)',
  'Air Medal':                            'Air Medal',
  'Legion of Merit':                      'Legion of Merit',
  'Meritorious Service Medal':           'Meritorious Service Medal (United States)',
  'Air Force Cross':                      'Air Force Cross (United States)',
  'Victoria Cross':                       'Victoria Cross',
  'Iron Cross':                           'Iron Cross',
  'Prisoner of War Medal':               'Prisoner of War Medal',
  'Army Good Conduct Medal':             'Good Conduct Medal (United States Army)',
  'Combat Infantryman Badge':            'Combat Infantryman Badge',
  'Combat Action Badge':                 'Combat Action Badge',
  'Air Assault Badge':                    'Air Assault Badge',
  'Master Parachutist Badge':            'Parachutist Badge (United States)',
  'Master Blaster Badge':                'Parachutist Badge (United States)',
  'Expert Infantryman Badge':            'Expert Infantryman Badge',
  'Navy SEAL Trident':                   'Special Warfare insignia',
  'Army General (O-10)':                 'General (United States)',
  'General of the Army (5-Star)':        'General of the Army (United States)',
  'Navy Admiral (O-10)':                 'Admiral (United States)',
  'Sergeant Major of the Army (E-9S)':  'Sergeant Major of the Army',
  'Sergeant Major of the Army (SMA)':   'Sergeant Major of the Army',
  'Sergeant Major of the Marine Corps':  'Sergeant Major of the Marine Corps',
  'Master Chief Petty Officer (E-9, Navy)': 'Master Chief Petty Officer of the Navy',
  'Chief Petty Officer (E-7)':          'Chief petty officer',
  'Chief Petty Officer (Navy)':         'Chief petty officer',
  'Captain (Navy O-6)':                 'Captain (naval)',
  'Captain (O-3, Army)':               'Captain (United States O-3)',
  'Second Lieutenant (O-1)':            'Second lieutenant',
  'Lieutenant Colonel (O-5)':          'Lieutenant colonel (United States)',
  'Brigadier General (O-7)':           'Brigadier general (United States)',
  'Sergeant (E-5)':                     'Sergeant',
  'Staff Sergeant (E-6)':             'Staff sergeant',
  'Master Sergeant (E-8)':            'Master sergeant',
  'Specialist (E-4)':                  'Specialist (rank)',
  'Corporal (E-4)':                    'Corporal',
  'Lance Corporal (E-3, USMC)':       'Lance corporal',
  'Ensign (O-1, Navy)':               'Ensign (rank)',
  'Command Sergeant Major (E-9)':     'Command sergeant major',
  'Chief Warrant Officer 4 (CW4)':   'Warrant officer (United States)',
  'Chief Warrant Officer 5 (Army)':  'Warrant officer (United States)',
  '101st Airborne Division "Screaming Eagles"': '101st Airborne Division',
  '82nd Airborne Division':            '82nd Airborne Division',
  '82nd Airborne Division Patch':     '82nd Airborne Division',
  '1st Infantry Division "Big Red One"': '1st Infantry Division (United States)',
  '1st Marine Division':               '1st Marine Division',
  '3rd Infantry Division "Rock of the Marne"': '3rd Infantry Division (United States)',
  '10th Mountain Division':            '10th Mountain Division (United States)',
  '75th Ranger Regiment':             '75th Ranger Regiment',
  'U.S. Army Special Forces (Green Berets)': 'United States Army Special Forces',
  'Ranger Tab':                        'Ranger tab',
  'Airborne Tab':                      'Airborne tab',
  'Special Forces Tab':               'Special Forces tab',
  'M109 Paladin':                      'M109 howitzer',
  'M198 Howitzer':                     'M198 howitzer',
  'M270 MLRS':                         'M270 Multiple Launch Rocket System',
  'M142 HIMARS':                       'M142 HIMARS',
  'M777 Howitzer':                     'M777 howitzer',
  'M101 Howitzer':                     'M101 howitzer',
  'M119 Howitzer':                     'M119 howitzer',
  'BM-21 Grad':                        'BM-21 Grad',
  'D-30 Howitzer':                     'D-30 howitzer',
  'FH70 Howitzer':                     'FH-70',
  'Panzerhaubitze 2000':               'Panzerhaubitze 2000',
}

async function getWikipediaImage(questionName: string): Promise<{ url: string; credit: string; sourceUrl: string } | null> {
  const articleTitle = WIKI_TITLE_MAP[questionName] || questionName

  // Try Wikipedia REST API page summary (fastest, gives thumbnail)
  try {
    const encoded = encodeURIComponent(articleTitle.replace(/ /g, '_'))
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } })
    if (res.ok) {
      const data: { thumbnail?: { source: string }; originalimage?: { source: string }; content_urls?: { desktop: { page: string } } } = await res.json()
      const imgUrl = data.originalimage?.source || data.thumbnail?.source
      if (imgUrl) {
        const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`
        return {
          url: imgUrl,
          credit: `Wikimedia Commons · Public Domain`,
          sourceUrl: pageUrl,
        }
      }
    }
  } catch { /* fall through */ }

  // Fallback: Wikimedia Commons API search
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(articleTitle)}&srnamespace=6&srlimit=1&format=json&origin=*`
    const res = await fetch(searchUrl, { headers: { 'User-Agent': UA } })
    if (res.ok) {
      const data: { query?: { search?: Array<{ title: string }> } } = await res.json()
      const file = data.query?.search?.[0]?.title
      if (file) {
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(file)}&prop=imageinfo&iiprop=url&format=json&origin=*`
        const infoRes = await fetch(infoUrl, { headers: { 'User-Agent': UA } })
        if (infoRes.ok) {
          const infoData: { query?: { pages?: Record<string, { imageinfo?: Array<{ url: string }> }> } } = await infoRes.json()
          const pages = infoData.query?.pages || {}
          const page = Object.values(pages)[0]
          const imgUrl = page?.imageinfo?.[0]?.url
          if (imgUrl) {
            return {
              url: imgUrl,
              credit: 'Wikimedia Commons · Public Domain',
              sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(file)}`,
            }
          }
        }
      }
    }
  } catch { /* fall through */ }

  return null
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'image/jpeg,image/png,image/webp,image/*' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const mimeType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
  return { buffer: Buffer.from(await res.arrayBuffer()), mimeType }
}

async function run() {
  const docs = await client.fetch<Array<{ _id: string; name: string; image: { url: string; credit?: string; sourceUrl?: string } }>>(
    `*[_type == "idDrillQuestion"] | order(name asc) { _id, name, image }`
  )
  console.log(`Found ${docs.length} documents.\n`)

  let ok = 0, skipped = 0, failed = 0

  for (const doc of docs) {
    // Skip if already on Sanity CDN
    if (doc.image?.url?.startsWith('https://cdn.sanity.io/')) {
      console.log(`[SKIP] ${doc.name}`)
      skipped++
      continue
    }

    process.stdout.write(`[↓] ${doc.name.padEnd(45)} `)

    try {
      await sleep(800)

      // 1. Find real Wikipedia image
      const imgMeta = await getWikipediaImage(doc.name)
      if (!imgMeta) {
        console.log('✗  no Wikipedia image found')
        failed++
        continue
      }

      await sleep(400)

      // 2. Download
      const { buffer, mimeType } = await downloadImage(imgMeta.url)

      // 3. Upload to Sanity
      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
      const filename = `${doc.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60)}.${ext}`
      const asset = await client.assets.upload('image', buffer, { filename, contentType: mimeType })
      const sanityUrl = (asset as unknown as { url: string }).url

      // 4. Patch document
      await client.patch(doc._id)
        .set({
          'image.url':       sanityUrl,
          'image.credit':    imgMeta.credit,
          'image.sourceUrl': imgMeta.sourceUrl,
        })
        .commit()

      console.log(`✓  ${sanityUrl.slice(0, 60)}`)
      ok++
    } catch (err) {
      console.log(`✗  ${(err as Error).message.slice(0, 60)}`)
      failed++
    }
  }

  console.log(`\n── Done ──────────────────`)
  console.log(`  OK      : ${ok}`)
  console.log(`  Skipped : ${skipped}`)
  console.log(`  Failed  : ${failed}`)
}

run().catch(err => { console.error('Fatal:', err); process.exit(1) })
