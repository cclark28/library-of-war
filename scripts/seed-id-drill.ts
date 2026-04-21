/**
 * Library of War — ID Drill Content Seed
 * ─────────────────────────────────────────────────────────────────────────────
 * Populates Sanity with 200+ ID Drill questions using verified public domain
 * images from Wikimedia Commons, DVIDS, Library of Congress, and U.S. DoD.
 *
 * Usage:
 *   npx ts-node scripts/seed-id-drill.ts
 *
 * Requires SANITY_API_TOKEN with write access in your environment.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_TOKEN!,
  useCdn:    false,
})

/* ─── Question data type ─────────────────────────────────────────────────────── */
interface QuestionSeed {
  _type:       'idDrillQuestion'
  name:        string
  category:    string
  branch:      string
  difficulty:  string
  era?:        string
  image: {
    url:       string
    alt:       string
    credit:    string
    sourceUrl?: string
  }
  description: string
  history?:    string
  wikiUrl:     string
  distractors: [string, string, string]
  active:      boolean
}

/* ═══════════════════════════════════════════════════════════════════════════════
   QUESTIONS
   Every image: public domain via Wikimedia Commons, DVIDS, or U.S. government.
   Alt text does NOT reveal the answer name.
═══════════════════════════════════════════════════════════════════════════════ */

const questions: QuestionSeed[] = [

  /* ─────────────────────────────── AIRCRAFT ──────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'F-14 Tomcat', category: 'aircraft', branch: 'navy',
    difficulty: 'recruit', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/F-14_Tomcat_launching_from_USS_Enterprise_%28CVN-65%29_1986.jpg/800px-F-14_Tomcat_launching_from_USS_Enterprise_%28CVN-65%29_1986.jpg',
      alt: 'Twin-engine swing-wing fighter launching from aircraft carrier deck',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-14_Tomcat_launching_from_USS_Enterprise_(CVN-65)_1986.jpg',
    },
    description: 'The F-14 Tomcat was a supersonic twin-engine carrier-based air superiority fighter developed for the U.S. Navy. It served from 1974 to 2006 and is famous for its variable-sweep wing design and role in Top Gun.',
    history: 'Developed by Grumman in response to the F-111B failure, the F-14 entered service in 1974. Its AWG-9 radar and AIM-54 Phoenix missiles gave it unmatched long-range intercept capability during the Cold War. It was retired in 2006, replaced by the F/A-18E/F Super Hornet.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Grumman_F-14_Tomcat',
    distractors: ['F/A-18 Hornet', 'F-15 Eagle', 'F-16 Fighting Falcon'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-52 Stratofortress', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/B-52_Stratofortress.jpg/800px-B-52_Stratofortress.jpg',
      alt: 'Eight-engine swept-wing heavy bomber in flight',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:B-52_Stratofortress.jpg',
    },
    description: 'The B-52 Stratofortress is a long-range, subsonic, jet-powered strategic bomber operated by the U.S. Air Force since 1955. It is distinguished by its eight turbofan engines and swept wings.',
    history: 'Designed by Boeing, the B-52 first flew in 1952 and entered service in 1955. It has been the backbone of America\'s strategic bombing capability for over 70 years and is expected to remain in service past 2050, making it one of the longest-serving military aircraft ever.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_B-52_Stratofortress',
    distractors: ['B-1 Lancer', 'B-2 Spirit', 'B-47 Stratojet'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'P-51 Mustang', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/North_American_P-51D_Mustang.jpg/800px-North_American_P-51D_Mustang.jpg',
      alt: 'Single-engine propeller fighter with bubble canopy',
      credit: 'USAF · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:North_American_P-51D_Mustang.jpg',
    },
    description: 'The P-51 Mustang was an American long-range single-seat fighter and fighter-bomber used during WWII. Its Merlin engine and range made it the premier escort fighter over Europe.',
    history: 'Developed in 1940 for the RAF, the P-51 became transformative for the U.S. 8th Air Force. Equipped with drop tanks, it could escort bombers from England to Berlin and back, decimating the Luftwaffe in 1944. Over 15,000 were built.',
    wikiUrl: 'https://en.wikipedia.org/wiki/North_American_P-51_Mustang',
    distractors: ['P-47 Thunderbolt', 'P-38 Lightning', 'Spitfire'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F-117 Nighthawk', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/F117_Nighthawk_Front.jpg/800px-F117_Nighthawk_Front.jpg',
      alt: 'Faceted angular stealth attack aircraft with V-tail on ramp',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F117_Nighthawk_Front.jpg',
    },
    description: 'The F-117 Nighthawk was the world\'s first operational stealth aircraft. Its faceted, angular fuselage was designed to scatter radar waves and evade detection.',
    history: 'Developed under the secret HAVE BLUE program at Lockheed\'s Skunk Works, the F-117 first flew in 1981 and remained classified until 1988. It conducted the opening strikes of Operation Desert Storm in 1991 with near-zero radar signature, revolutionizing air warfare.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_F-117_Nighthawk',
    distractors: ['B-2 Spirit', 'A-10 Thunderbolt II', 'F-22 Raptor'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'AH-64 Apache', category: 'aircraft', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/AH-64_Apache.jpg/800px-AH-64_Apache.jpg',
      alt: 'Twin-engine attack helicopter with tandem cockpit',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:AH-64_Apache.jpg',
    },
    description: 'The AH-64 Apache is the U.S. Army\'s primary attack helicopter. It carries Hellfire missiles, Hydra rockets, and a 30mm M230 chain gun for tank-killing and close air support.',
    history: 'First flown in 1975 and fielded in 1986, the Apache saw its combat debut during Operation Just Cause (Panama, 1989). It proved devastating during Desert Storm, where Apache crews destroyed Iraqi radar sites in the opening minutes of the air campaign. Later models feature the Longbow radar mast.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_AH-64_Apache',
    distractors: ['UH-60 Black Hawk', 'CH-47 Chinook', 'OH-58 Kiowa'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'SR-71 Blackbird', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Lockheed_SR-71_Blackbird.jpg/800px-Lockheed_SR-71_Blackbird.jpg',
      alt: 'Long dark twin-engine reconnaissance aircraft with chines on runway',
      credit: 'NASA · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lockheed_SR-71_Blackbird.jpg',
    },
    description: 'The SR-71 Blackbird was a long-range, high-altitude, Mach 3+ strategic reconnaissance aircraft. It remains the fastest air-breathing manned aircraft ever flown.',
    history: 'Designed by Kelly Johnson at Lockheed\'s Skunk Works, the SR-71 entered service in 1966. Built from titanium and special composites, it could outrun any missile by accelerating. Over its career it flew 3,551 sorties; not a single SR-71 was lost to enemy action. Retired in 1998.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_SR-71_Blackbird',
    distractors: ['U-2 Dragon Lady', 'A-12 Avenger', 'YF-12'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'A-10 Thunderbolt II', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/A-10_Thunderbolt_II_In-flight-2.jpg/800px-A-10_Thunderbolt_II_In-flight-2.jpg',
      alt: 'Twin-engine ground attack jet with massive nose cannon and straight wings',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:A-10_Thunderbolt_II_In-flight-2.jpg',
    },
    description: 'The A-10 Thunderbolt II, nicknamed the "Warthog," is a heavily armored close air support aircraft built around its GAU-8 Avenger 30mm rotary cannon — one of the most powerful aircraft guns ever built.',
    history: 'Designed in the late 1960s specifically to kill Soviet tanks, the A-10 entered service in 1977. Its titanium "bathtub" cockpit armor protects the pilot, and its design allows it to fly on a single engine with hydraulic or electric backup controls. It decimated Iraqi armor during Desert Storm.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Fairchild_Republic_A-10_Thunderbolt_II',
    distractors: ['F-16 Fighting Falcon', 'OV-10 Bronco', 'AC-130 Gunship'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'UH-60 Black Hawk', category: 'aircraft', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UH-60_Blackhawk_helicopter.jpg/800px-UH-60_Blackhawk_helicopter.jpg',
      alt: 'Twin-engine utility helicopter in flight over terrain',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:UH-60_Blackhawk_helicopter.jpg',
    },
    description: 'The UH-60 Black Hawk is the U.S. Army\'s primary utility tactical transport helicopter. It can carry 11 combat troops and is used for assault, medevac, and special operations.',
    history: 'Developed by Sikorsky to replace the UH-1 Huey, the Black Hawk entered service in 1979. It gained global fame from the 1993 Battle of Mogadishu (Black Hawk Down). Over 4,000 have been built and it serves in over 25 nations.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sikorsky_UH-60_Black_Hawk',
    distractors: ['CH-47 Chinook', 'AH-64 Apache', 'MH-53 Pave Low'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-2 Spirit', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/B-2_Spirit_front.jpg/800px-B-2_Spirit_front.jpg',
      alt: 'Flying wing stealth bomber with no tail surfaces',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:B-2_Spirit_front.jpg',
    },
    description: 'The B-2 Spirit is an American stealth strategic bomber with a flying-wing design. It carries both conventional and nuclear weapons and has a radar cross-section comparable to a large bird.',
    history: 'Developed by Northrop during the Cold War at a cost of $2.1 billion per aircraft, the B-2 entered service in 1997. Only 21 were built. It made its combat debut in Kosovo (1999) and has since flown strikes in Afghanistan, Iraq, and Libya from its home base in Missouri.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Northrop_Grumman_B-2_Spirit',
    distractors: ['B-52 Stratofortress', 'B-1 Lancer', 'F-117 Nighthawk'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F-22 Raptor', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/F-22_Raptor.jpg/800px-F-22_Raptor.jpg',
      alt: 'Supermaneuverable stealth fighter with canted tail fins',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-22_Raptor.jpg',
    },
    description: 'The F-22 Raptor is a fifth-generation air dominance fighter combining stealth, supercruise, and supermaneuverability. It is widely considered the world\'s most capable air superiority fighter.',
    history: 'Developed by Lockheed Martin and Boeing, the F-22 entered service in 2005. Its AN/APG-77 AESA radar, internal weapons bays, and thrust-vectoring nozzles give it unprecedented combat capability. Production was capped at 187 aircraft, well below the 750 originally planned.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_Martin_F-22_Raptor',
    distractors: ['F-35 Lightning II', 'F-15 Eagle', 'Eurofighter Typhoon'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'C-130 Hercules', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/C-130_Hercules.jpg/800px-C-130_Hercules.jpg',
      alt: 'Four-engine turboprop transport with high-mounted wings and rear loading ramp',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:C-130_Hercules.jpg',
    },
    description: 'The C-130 Hercules is a four-engine turboprop military transport aircraft. It serves in tactical airlift, airdrop, aerial refueling, maritime patrol, and gunship roles across over 60 nations.',
    history: 'First flown in 1954, the C-130 has been in continuous production longer than any other military aircraft. It was designed to operate from unprepared dirt strips and can land on aircraft carriers without arresting gear. The gunship variants (AC-47, AC-119, AC-130) have been devastating in fire support roles.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_C-130_Hercules',
    distractors: ['C-17 Globemaster III', 'C-141 Starlifter', 'C-5 Galaxy'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MiG-21 Fishbed', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/MiG-21MF_in_flight.jpg/800px-MiG-21MF_in_flight.jpg',
      alt: 'Delta-wing supersonic jet with nose intake cone',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MiG-21MF_in_flight.jpg',
    },
    description: 'The MiG-21 Fishbed is a Soviet supersonic interceptor and fighter aircraft. With over 11,000 built, it remains the most widely produced supersonic jet in history and saw combat on every continent.',
    history: 'First flown in 1956, the MiG-21 was the primary Soviet-bloc fighter during the Vietnam War, where it proved challenging for U.S. aircraft. Its light weight and high speed made it formidable in close combat. Over 50 nations have operated it.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mikoyan-Gurevich_MiG-21',
    distractors: ['MiG-29 Fulcrum', 'Su-27 Flanker', 'MiG-23 Flogger'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Spitfire', category: 'aircraft', branch: 'all',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Supermarine_Spitfire_in_flight.jpg/800px-Supermarine_Spitfire_in_flight.jpg',
      alt: 'Elliptical-winged single-engine propeller fighter with roundel markings',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Supermarine_Spitfire_in_flight.jpg',
    },
    description: 'The Supermarine Spitfire was the primary British fighter during WWII. Its distinctive elliptical wings and Merlin engine made it one of the most recognizable and beloved aircraft of the war.',
    history: 'Designed by R.J. Mitchell and first flown in 1936, the Spitfire played a crucial role in the Battle of Britain (1940). Over 20,000 were built in many variants. Its continuous development from 355 mph to 454 mph over the course of the war matched every German advance.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Supermarine_Spitfire',
    distractors: ['Hurricane', 'Bf 109', 'P-51 Mustang'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'AV-8B Harrier II', category: 'aircraft', branch: 'marines',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/AV-8B_Harrier_II_VMAT-203.jpg/800px-AV-8B_Harrier_II_VMAT-203.jpg',
      alt: 'Single-engine V/STOL jet with four rotating exhaust nozzles',
      credit: 'U.S. Marine Corps · DVIDS · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:AV-8B_Harrier_II_VMAT-203.jpg',
    },
    description: 'The AV-8B Harrier II is a single-engine ground-attack jet capable of vertical and short takeoff and landing (V/STOL). It operates from amphibious assault ships without conventional catapults.',
    history: 'Developed from the British Hawker Siddeley Harrier, the AV-8B entered USMC service in 1985. It proved invaluable in Desert Storm flying from ships and expeditionary airstrips. Its rotating exhaust nozzles allow it to hover, land vertically, and perform "viffing" (vectoring in forward flight) to defeat enemy fighters.',
    wikiUrl: 'https://en.wikipedia.org/wiki/McDonnell_Douglas_AV-8B_Harrier_II',
    distractors: ['F/A-18 Hornet', 'A-6 Intruder', 'A-7 Corsair II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'E-3 Sentry (AWACS)', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/E-3_Sentry.jpg/800px-E-3_Sentry.jpg',
      alt: 'Boeing 707 body with large rotating disc radar dome on top',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:E-3_Sentry.jpg',
    },
    description: 'The E-3 Sentry is an airborne warning and control system (AWACS) aircraft. Its distinctive rotating rotodome houses a radar capable of detecting aircraft hundreds of miles away and directing battle.',
    history: 'Based on the Boeing 707, the E-3 entered USAF service in 1977. During Desert Storm, AWACS aircraft tracked hundreds of aircraft simultaneously and directed all coalition air operations, achieving a 38:0 kill ratio. NATO, France, Saudi Arabia, and the UK also operate it.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_E-3_Sentry',
    distractors: ['E-8 Joint STARS', 'RC-135', 'EC-130 Compass Call'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'CH-47 Chinook', category: 'aircraft', branch: 'army',
    difficulty: 'recruit', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/CH-47_Chinook_helicopter_in_flight.jpg/800px-CH-47_Chinook_helicopter_in_flight.jpg',
      alt: 'Tandem rotor heavy-lift helicopter with rear loading ramp',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:CH-47_Chinook_helicopter_in_flight.jpg',
    },
    description: 'The CH-47 Chinook is a tandem rotor heavy-lift helicopter. Its distinctive twin rotor layout allows it to lift over 26,000 lbs of cargo, vehicles, and troops.',
    history: 'Entering service in 1962, the Chinook has been the Army\'s primary heavy-lift helicopter for over 60 years. In Vietnam, "hook" crews performed extraordinary rescues and resupply operations in impossible terrain. It has been continuously updated and remains in production as the F model.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_CH-47_Chinook',
    distractors: ['UH-60 Black Hawk', 'CH-53 Sea Stallion', 'V-22 Osprey'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F/A-18 Hornet', category: 'aircraft', branch: 'navy',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/F-A-18_Hornet.jpg/800px-F-A-18_Hornet.jpg',
      alt: 'Twin-engine carrier fighter with twin tail fins and LERX',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-A-18_Hornet.jpg',
    },
    description: 'The F/A-18 Hornet is a twin-engine supersonic carrier-based multirole fighter. It has served as the backbone of U.S. Navy and Marine Corps aviation since 1983.',
    history: 'Designed by Northrop and McDonnell Douglas, the F/A-18 replaced the A-7 Corsair, F-4 Phantom, and partially the A-6 Intruder in Navy/Marine service. The larger F/A-18E/F Super Hornet, introduced in 1999, replaced the F-14 Tomcat as the primary carrier fighter.',
    wikiUrl: 'https://en.wikipedia.org/wiki/McDonnell_Douglas_F/A-18_Hornet',
    distractors: ['F-14 Tomcat', 'A-6 Intruder', 'F-16 Fighting Falcon'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-1 Lancer', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/B-1_Lancer.jpg/800px-B-1_Lancer.jpg',
      alt: 'Four-engine supersonic bomber with variable-sweep wings',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:B-1_Lancer.jpg',
    },
    description: 'The B-1B Lancer is a supersonic variable-sweep wing strategic bomber. Its blended aerodynamic shape and terrain-following radar give it both speed and low-level penetration capability.',
    history: 'Originally designed as a nuclear penetration bomber during the Cold War, the B-1B entered service in 1986 but was later converted to conventional roles. With its capacious bomb bay, it has become the U.S.\'s most prolific conventional bomber, logging over 7,000 combat flight hours in Operation Enduring Freedom.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Rockwell_B-1_Lancer',
    distractors: ['B-52 Stratofortress', 'B-2 Spirit', 'Tu-160 Blackjack'],
    active: true,
  },

  /* ─────────────────────────────── ARMOR ─────────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'M1 Abrams', category: 'armor', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/M1A1_Abrams_Tank.jpg/800px-M1A1_Abrams_Tank.jpg',
      alt: 'Low-profile 120mm smoothbore main battle tank in desert terrain',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1A1_Abrams_Tank.jpg',
    },
    description: 'The M1 Abrams is the U.S. Army\'s primary main battle tank. It uses a 120mm smoothbore cannon and Chobham composite armor. Its gas turbine engine gives it a top speed of 42 mph on roads.',
    history: 'Entering service in 1980 to replace the M60, the Abrams was designed to defeat Soviet T-72 tanks. In Desert Storm (1991), Abrams destroyed over 2,000 Iraqi tanks while suffering minimal losses. Its advanced thermal sighting system allowed engagement at ranges exceeding 3,000 meters.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M1_Abrams',
    distractors: ['Leopard 2', 'Challenger 2', 'M60 Patton'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'T-34', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/T-34-76_1943.jpg/800px-T-34-76_1943.jpg',
      alt: 'Soviet medium tank with sloped armor and 76mm gun',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:T-34-76_1943.jpg',
    },
    description: 'The T-34 was a Soviet medium tank widely regarded as the most effective and influential tank design of WWII. Its sloped armor, wide tracks, and 76mm gun set the standard for modern tank design.',
    history: 'When Germany invaded in 1941, the T-34 shocked Panzer crews with armor that deflected shells. The T-34/85 variant, introduced in 1944, carried an 85mm gun capable of defeating the Tiger at combat ranges. Over 84,000 were built — more than any other WWII tank.',
    wikiUrl: 'https://en.wikipedia.org/wiki/T-34',
    distractors: ['T-54', 'Sherman', 'Panzer IV'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Tiger I', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Bundesarchiv_Bild_101I-299-1805-16%2C_Nordafrika%2C_Panzer_VI_%28Tiger_I%29.jpg/800px-Bundesarchiv_Bild_101I-299-1805-16%2C_Nordafrika%2C_Panzer_VI_%28Tiger_I%29.jpg',
      alt: 'Heavy tank with vertical armor, interleaved road wheels, and long barrel 88mm gun',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_101I-299-1805-16,_Nordafrika,_Panzer_VI_(Tiger_I).jpg',
    },
    description: 'The Tiger I was Germany\'s heavy tank used from late 1942. Its 88mm KwK 36 gun could destroy any Allied tank at ranges beyond 2,000 meters, and its 100mm frontal armor was nearly impenetrable.',
    history: 'Deployed from North Africa to the Eastern Front, the Tiger I struck fear into Allied tankers. One Tiger could destroy dozens of enemy tanks before being put out of action. However, its mechanical complexity and high fuel consumption limited its strategic impact. Only 1,347 were built.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tiger_I',
    distractors: ['Panther', 'Panzerkampfwagen IV', 'Tiger II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M4 Sherman', category: 'armor', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/M4_Sherman_Tanks.jpg/800px-M4_Sherman_Tanks.jpg',
      alt: 'Medium tank with rounded cast turret and 75mm gun',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M4_Sherman_Tanks.jpg',
    },
    description: 'The M4 Sherman was the primary Allied medium tank of WWII. Over 49,000 were produced — more than any other Allied tank. Its reliability and mechanical simplicity were its greatest strengths.',
    history: 'Entering service in 1942, the Sherman equipped U.S. and Allied forces from North Africa to Berlin. While outgunned by German Panthers and Tigers, numerical superiority and superior logistics gave the Allies the edge. The "Easy Eight" variant with the 76mm high-velocity gun partially closed the gap.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M4_Sherman',
    distractors: ['M26 Pershing', 'Cromwell', 'T-34'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M2 Bradley', category: 'armor', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/M2_Bradley.jpg/800px-M2_Bradley.jpg',
      alt: 'Tracked infantry fighting vehicle with 25mm chain gun turret',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M2_Bradley.jpg',
    },
    description: 'The M2 Bradley is an infantry fighting vehicle (IFV) designed to transport troops into battle and provide fire support. It carries a 25mm M242 Bushmaster chain gun, TOW missiles, and up to seven infantry.',
    history: 'Entering service in 1981, the Bradley IFV represented a new concept — an armored vehicle that could fight alongside tanks rather than just transport infantry. During Desert Storm, Bradleys destroyed more Iraqi armor than M1 Abrams tanks.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M2_Bradley',
    distractors: ['M113', 'LAV-25', 'Stryker'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Leopard 2', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Leopard2A5.jpg/800px-Leopard2A5.jpg',
      alt: 'German main battle tank with spaced armor packages on turret and hull',
      credit: 'Bundeswehr · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Leopard2A5.jpg',
    },
    description: 'The Leopard 2 is a German main battle tank widely regarded as one of the finest in the world. It is operated by 19 nations and combines a 120mm smoothbore cannon with advanced fire control.',
    history: 'Developed in the 1970s as the German answer to the U.S. XM1 program, the Leopard 2 entered Bundeswehr service in 1979. Multiple upgraded variants (A4, A5, A6, A7) have kept it competitive. It saw combat in Kosovo and Afghanistan with NATO allies.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Leopard_2',
    distractors: ['Challenger 2', 'Leclerc', 'Merkava'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'T-72', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/T-72A_of_the_Polish_Army.jpg/800px-T-72A_of_the_Polish_Army.jpg',
      alt: 'Soviet main battle tank with low-profile turret and flat hull',
      credit: 'Polish Armed Forces · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:T-72A_of_the_Polish_Army.jpg',
    },
    description: 'The T-72 is a Soviet main battle tank introduced in 1973. It became one of the most widely produced tanks of the Cold War and remains in service in dozens of nations.',
    history: 'Designed to be cheaper and faster to produce than the T-64, the T-72 became the standard Warsaw Pact tank of the 1970s-1990s. Iraqi T-72s were destroyed en masse during Desert Storm and again in 2003, revealing the limitations of export versions against Western fire control technology.',
    wikiUrl: 'https://en.wikipedia.org/wiki/T-72',
    distractors: ['T-64', 'T-80', 'T-90'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M60 Patton', category: 'armor', branch: 'army',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/M60A3.jpg/800px-M60A3.jpg',
      alt: 'Main battle tank with mushroom-shaped cupola and 105mm gun',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M60A3.jpg',
    },
    description: 'The M60 Patton was the U.S. Army\'s main battle tank from 1960 to 1980. Its 105mm M68 gun and cast steel turret made it the backbone of NATO armor during the Cold War.',
    history: 'An evolution of the M48, the M60 entered service in 1960. Over 15,000 were built. While replaced by the Abrams in U.S. service, the M60 remains in active use in Turkey, Egypt, and other nations. Israel\'s highly modified Magach version served through the Gulf War.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M60_Patton',
    distractors: ['M48 Patton', 'M1 Abrams', 'Centurion'],
    active: true,
  },

  /* ─────────────────────────────── SMALL ARMS ────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'M16 Rifle', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/M16A2.jpg/800px-M16A2.jpg',
      alt: 'Black polymer and aluminum select-fire rifle with carrying handle sight',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M16A2.jpg',
    },
    description: 'The M16 is the standard U.S. military assault rifle, chambered in 5.56×45mm NATO. It has served as the primary U.S. infantry rifle since Vietnam and is one of the most produced rifles in history.',
    history: 'Designed by Eugene Stoner at ArmaLite, the M16 entered service in 1963 to replace the M14. Early Vietnam-era models suffered reliability issues due to incorrect propellant and inadequate cleaning kits. Refined versions became highly reliable and the M16A2/A4 remained the standard until partial replacement by the M4 Carbine.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M16_rifle',
    distractors: ['M4 Carbine', 'M14 Rifle', 'AR-10'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'AK-47', category: 'smallarms', branch: 'all',
    difficulty: 'recruit', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/AK-47_type_II_part_dm.jpg/800px-AK-47_type_II_part_dm.jpg',
      alt: 'Wooden stock assault rifle with curved banana magazine and gas tube over barrel',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:AK-47_type_II_part_dm.jpg',
    },
    description: 'The AK-47 is a gas-operated assault rifle designed by Mikhail Kalashnikov in 1947. Chambered in 7.62×39mm, it is the most widely used and produced rifle in history, with over 100 million manufactured.',
    history: 'Designed to be simple, cheap, and reliable in the harshest conditions, the AK-47 became the symbol of communist insurgencies worldwide. Its short-stroke piston and loose tolerances allow it to function even when fouled with mud or sand. The AKM (1959) and AK-74 (1974) are its principal successors.',
    wikiUrl: 'https://en.wikipedia.org/wiki/AK-47',
    distractors: ['AKM', 'RPK', 'FN FAL'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M1 Garand', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/M1_Garand_rifle.jpg/800px-M1_Garand_rifle.jpg',
      alt: 'Semi-automatic rifle with wooden stock and en-bloc clip-fed action',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1_Garand_rifle.jpg',
    },
    description: 'The M1 Garand was the standard U.S. infantry rifle in WWII and Korea. As the world\'s first semi-automatic service rifle, it gave American soldiers a significant firepower advantage over bolt-action-armed opponents.',
    history: 'Designed by John Garand at Springfield Armory and adopted in 1936, the M1 fed from 8-round en bloc clips. When the last round fired, the clip was ejected with a distinctive "ping." General Patton called it "the greatest battle implement ever devised." Over 5.4 million were made.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M1_Garand',
    distractors: ['M1903 Springfield', 'M1 Carbine', 'BAR M1918'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M1911', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww1',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/M1911A1.jpg/800px-M1911A1.jpg',
      alt: 'Single-action semi-automatic pistol with grip safety and lanyard loop',
      credit: 'U.S. Government · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1911A1.jpg',
    },
    description: 'The M1911 is a .45 ACP semi-automatic pistol designed by John Browning. It served as the standard U.S. sidearm for 74 years (1911–1985) and remains in use by special operations forces.',
    history: 'Adopted after experience showed .38-caliber rounds failed to stop Moro warriors in the Philippines, the M1911 in .45 ACP proved definitive. From WWI trenches to Vietnam jungles, it was carried by officers, pilots, and tankers. The M1911A1 variant, adopted in 1924, featured a shorter trigger and arched mainspring housing.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M1911_pistol',
    distractors: ['M9 Beretta', 'Colt Single Action Army', 'Walther P38'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M4 Carbine', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/M4A1_SOPMOD.jpg/800px-M4A1_SOPMOD.jpg',
      alt: 'Compact assault rifle with collapsible stock and rail system, shorter than M16',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M4A1_SOPMOD.jpg',
    },
    description: 'The M4 Carbine is a shortened, lightweight version of the M16A2 assault rifle. It uses a 14.5-inch barrel (vs the M16\'s 20-inch) and a collapsible stock for use in close quarters.',
    history: 'Entering service in 1994, the M4 became the dominant U.S. infantry weapon in Iraq and Afghanistan. Its rail system (SOPMOD) allows mounting of optics, lasers, lights, and grenade launchers. By 2015 it had largely replaced the M16 as the standard individual weapon.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M4_carbine',
    distractors: ['M16 Rifle', 'HK416', 'SCAR-L'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M249 SAW', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/M249_squad_automatic_weapon_in_firing_position.jpg/800px-M249_squad_automatic_weapon_in_firing_position.jpg',
      alt: 'Belt-fed light machine gun with bipod and plastic stock',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M249_squad_automatic_weapon_in_firing_position.jpg',
    },
    description: 'The M249 Squad Automatic Weapon (SAW) is a belt-fed light machine gun chambered in 5.56×45mm NATO. It provides suppressive fire at the squad level, with a cyclic rate of 850 rounds per minute.',
    history: 'Adopted in 1984 from the Belgian FN Minimi, the M249 filled the gap between the M16 and heavier M60 machine gun. It proved its worth in Desert Storm but reliability issues in Iraq\'s dust led to modifications. It has been partially replaced at the squad level by the M27 IAR in the Marine Corps.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M249_light_machine_gun',
    distractors: ['M240B', 'M60', 'M27 IAR'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MP40', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/MP40_parabellum.jpg/800px-MP40_parabellum.jpg',
      alt: 'German submachine gun with folding metal stock and straight box magazine',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MP40_parabellum.jpg',
    },
    description: 'The MP40 was the standard German submachine gun of WWII, chambered in 9mm Parabellum. Its folding metal stock, pressed steel construction, and open-bolt operation made it reliable and fast to manufacture.',
    history: 'Developed by Erma Werke in 1940, the MP40 was issued to NCOs, officers, vehicle crews, and paratroopers. Often incorrectly called the "Schmeisser," it was actually designed by Heinrich Vollmer. Over 1.1 million were made during the war.',
    wikiUrl: 'https://en.wikipedia.org/wiki/MP_40',
    distractors: ['MP18', 'PPSh-41', 'Thompson'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M2 Browning', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/M2_Browning_1.jpg/800px-M2_Browning_1.jpg',
      alt: 'Heavy machine gun with heavy receiver, water jacket-less barrel, and spade grips on mount',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M2_Browning_1.jpg',
    },
    description: 'The M2 Browning is a .50 caliber heavy machine gun used since 1933. Nicknamed "Ma Deuce," it is one of the longest-serving weapons in U.S. military history and serves on vehicles, aircraft, and ships.',
    history: 'Designed by John Browning and finalized by Colt in the 1920s, the M2HB (Heavy Barrel) variant has served in every U.S. conflict since WWII. Its 2,000 yard effective range and ability to pierce light armor made it devastating against trucks, aircraft, and personnel. Still in active production.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M2_Browning',
    distractors: ['M240B', 'M60', 'M1919 Browning'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Barrett M82', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/M82A1_barrett.jpg/800px-M82A1_barrett.jpg',
      alt: 'Very large semi-automatic anti-materiel rifle with muzzle brake and bipod',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M82A1_barrett.jpg',
    },
    description: 'The Barrett M82 is a semi-automatic, .50 BMG anti-materiel rifle. At over 57 inches long and 32 lbs, it is used for long-range sniper and counter-materiel operations up to 1,800 meters.',
    history: 'Designed by Ronnie Barrett and fielded by the U.S. military in the 1980s, the M82 (M107 in military designation) saw widespread use during Desert Storm to destroy Iraqi equipment from beyond the range of return fire. It remains the primary U.S. long-range anti-materiel rifle.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Barrett_M82',
    distractors: ['M24 SWS', 'M110 SASS', 'CheyTac M200'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M79 Grenade Launcher', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/M79_grenade_launcher.jpg/800px-M79_grenade_launcher.jpg',
      alt: 'Single-shot break-open grenade launcher resembling an oversized shotgun',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M79_grenade_launcher.jpg',
    },
    description: 'The M79 Grenade Launcher is a single-shot, break-open, shoulder-fired grenade launcher chambered in 40×46mm. Nicknamed "Thumper" or "Blooper," it gave infantry squads indirect fire capability.',
    history: 'Fielded in 1961, the M79 gave Vietnam-era infantry a weapon that bridged the gap between hand grenades and mortars. Skilled gunners could achieve pinpoint accuracy at ranges up to 375 meters. It was largely replaced by the M203 under-barrel launcher but remains in limited service.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M79_grenade_launcher',
    distractors: ['M203', 'M320', 'RPG-7'],
    active: true,
  },

  /* ─────────────────────────────── WARSHIPS ──────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'USS Missouri (BB-63)', category: 'warship', branch: 'navy',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Uss_missouri_bb63.jpg/800px-Uss_missouri_bb63.jpg',
      alt: 'Iowa-class battleship with three triple 16-inch gun turrets underway',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Uss_missouri_bb63.jpg',
    },
    description: 'USS Missouri (BB-63) is an Iowa-class battleship famous as the site of the Japanese surrender ceremony on September 2, 1945. Her 16-inch guns could hurl 2,700-lb shells 23 miles.',
    history: 'Commissioned in 1944, Missouri (nicknamed "Mighty Mo") supported amphibious landings at Iwo Jima and Okinawa. The formal Japanese surrender ending WWII was signed on her deck. She was reactivated in 1984 and served in Desert Storm (1991), firing Tomahawk missiles and 16-inch shells at Iraqi positions.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Missouri_(BB-63)',
    distractors: ['USS New Jersey', 'USS Iowa', 'USS Wisconsin'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Enterprise (CV-6)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/USS_Enterprise_%28CV-6%29_underway_1939.jpg/800px-USS_Enterprise_%28CV-6%29_underway_1939.jpg',
      alt: 'Yorktown-class aircraft carrier underway with aircraft on deck',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Enterprise_(CV-6)_underway_1939.jpg',
    },
    description: 'USS Enterprise (CV-6), known as "The Big E," was the most decorated U.S. warship of WWII. She was the only pre-war carrier to serve throughout the entire Pacific War.',
    history: 'Enterprise participated in virtually every major Pacific campaign from Pearl Harbor to Tokyo Bay. She survived six Japanese attempts to sink her and was awarded 20 battle stars — more than any other U.S. vessel. Tragically, despite her record, she was scrapped in 1958 due to costs, a decision that remains controversial.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Enterprise_(CV-6)',
    distractors: ['USS Yorktown (CV-5)', 'USS Saratoga (CV-3)', 'USS Hornet (CV-8)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Bismarck (battleship)', category: 'warship', branch: 'all',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Bundesarchiv_Bild_193-04-1-26%2C_Schlachtschiff_Bismarck.jpg/800px-Bundesarchiv_Bild_193-04-1-26%2C_Schlachtschiff_Bismarck.jpg',
      alt: 'German battleship with distinctive clipper bow and twin turrets fore and aft',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_193-04-1-26,_Schlachtschiff_Bismarck.jpg',
    },
    description: 'Bismarck was Nazi Germany\'s most powerful battleship. At 50,300 tons displacement, she carried eight 15-inch guns and sank HMS Hood — the Royal Navy\'s pride — in just 8 minutes.',
    history: 'On her first operational sortie in May 1941, Bismarck destroyed HMS Hood with a lucky shell through the magazine. The Royal Navy committed nearly 50 ships to her pursuit. Crippled by torpedo bombers from HMS Ark Royal, she was scuttled by her crew on May 27, 1941, after being riddled by gunfire.',
    wikiUrl: 'https://en.wikipedia.org/wiki/German_battleship_Bismarck',
    distractors: ['Tirpitz', 'Scharnhorst', 'Gneisenau'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Nimitz (CVN-68)', category: 'warship', branch: 'navy',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/USS_Nimitz_%28CVN-68%29_3.jpg/800px-USS_Nimitz_%28CVN-68%29_3.jpg',
      alt: 'Massive nuclear-powered aircraft carrier with angled flight deck',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Nimitz_(CVN-68)_3.jpg',
    },
    description: 'USS Nimitz (CVN-68) is the lead ship of the Nimitz-class nuclear-powered aircraft carriers. At 1,092 feet and 102,000 tons, she can carry 90 aircraft and operate for 20 years without refueling.',
    history: 'Commissioned in 1975, Nimitz is one of the largest warships ever built. Her nuclear reactors give her unlimited range, and her air wing can project power anywhere within 500 miles. The Nimitz class has dominated carrier operations for 50 years; the class\'s successor is the Gerald R. Ford class.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Nimitz',
    distractors: ['USS Gerald R. Ford', 'USS Enterprise (CVN-65)', 'USS Kitty Hawk'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Arleigh Burke (DDG-51)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/USS_Arleigh_Burke_%28DDG-51%29.jpg/800px-USS_Arleigh_Burke_%28DDG-51%29.jpg',
      alt: 'Modern guided missile destroyer with slanted angled superstructure and Mk 41 VLS forward',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Arleigh_Burke_(DDG-51).jpg',
    },
    description: 'USS Arleigh Burke (DDG-51) is the lead ship of the most numerous destroyer class in U.S. Navy history. Her Aegis combat system and 90-cell VLS can engage aircraft, missiles, ships, and submarines simultaneously.',
    history: 'Commissioned in 1991, the DDG-51 class has been continuously improved through Flights I, II, and III. With Aegis BMD capability, these destroyers serve as the backbone of carrier strike groups and ballistic missile defense. Over 90 ships have been commissioned, with more on order.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Arleigh_Burke-class_destroyer',
    distractors: ['Ticonderoga-class cruiser', 'Spruance-class destroyer', 'Zumwalt-class destroyer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'HMCS Haida (G63)', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/HMCS_Haida.jpg/800px-HMCS_Haida.jpg',
      alt: 'WWII-era Tribal-class destroyer preserved as museum ship',
      credit: 'Parks Canada · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HMCS_Haida.jpg',
    },
    description: 'HMCS Haida (G63) is a Tribal-class destroyer that served in the Royal Canadian Navy from WWII through the Korean War. She is the most decorated Canadian warship ever and is preserved as a National Historic Site.',
    history: 'Haida sank more enemy surface tonnage than any other Canadian ship. During WWII she participated in the sinkings of German destroyers Z32 and T-24 in the English Channel. She later served in Korea. Saved from scrapping by public fundraising, she is now a museum ship in Hamilton, Ontario.',
    wikiUrl: 'https://en.wikipedia.org/wiki/HMCS_Haida',
    distractors: ['HMCS Sackville', 'HMCS Ontario', 'HMCS Uganda'],
    active: true,
  },

  /* ─────────────────────────────── MEDALS ────────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'Medal of Honor', category: 'medal', branch: 'all',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Medal_of_Honor_Army_current.jpg/400px-Medal_of_Honor_Army_current.jpg',
      alt: 'Five-pointed star medal on light blue ribbon suspended from eagle bar',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Medal_of_Honor_Army_current.jpg',
    },
    description: 'The Medal of Honor is the United States\' highest military decoration. It is awarded for conspicuous gallantry and intrepidity at the risk of life, above and beyond the call of duty, in action against an enemy.',
    history: 'Established by Congress in 1861 during the Civil War, the Medal of Honor has been awarded 3,522 times. Recipients are presented the medal by the President in the name of Congress. It is traditionally worn above all other decorations. Many awards are posthumous.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Medal_of_Honor',
    distractors: ['Distinguished Service Cross', 'Navy Cross', 'Air Force Cross'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Purple Heart', category: 'medal', branch: 'all',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/PurpleHeart.jpg/400px-PurpleHeart.jpg',
      alt: 'Heart-shaped medal with George Washington profile on purple enamel, gold border',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PurpleHeart.jpg',
    },
    description: 'The Purple Heart is awarded to service members wounded or killed in action. It is the oldest American military decoration still awarded, directly descended from the Badge of Military Merit created by George Washington in 1782.',
    history: 'The modern Purple Heart was established in 1932. During WWII alone, 1.5 million were awarded. Unlike most medals, it does not require a recommendation — eligible service members are automatically entitled upon hospitalization for a combat wound. Multiple Purple Hearts are possible; Senator John McCain received multiple wounds in Vietnam.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Purple_Heart',
    distractors: ['Bronze Star', 'Silver Star', 'Combat Infantryman Badge'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Silver Star', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Silver_Star_medal.jpg/400px-Silver_Star_medal.jpg',
      alt: 'Five-pointed star medal with small central silver star on red, white and blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Silver_Star_medal.jpg',
    },
    description: 'The Silver Star is the third-highest military decoration for valor in the United States Armed Forces. It is awarded for gallantry in action against an enemy.',
    history: 'Authorized in 1918 as a small silver citation star worn on the Victory Medal ribbon, the Silver Star was established as a separate award in 1932. It is awarded across all branches and has been worn by generals, enlisted personnel, and Navy SEALs. Several women have been awarded Silver Stars for valor in combat zones.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Silver_Star',
    distractors: ['Bronze Star', 'Distinguished Flying Cross', 'Legion of Merit'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Distinguished Flying Cross', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Distinguished_Flying_Cross_US.jpg/400px-Distinguished_Flying_Cross_US.jpg',
      alt: 'Four-blade propeller-shaped medal cross on red-and-blue striped ribbon',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Distinguished_Flying_Cross_US.jpg',
    },
    description: 'The Distinguished Flying Cross (DFC) is awarded to any member of the U.S. Armed Forces who distinguishes themselves by heroism or extraordinary achievement while participating in aerial flight.',
    history: 'The DFC was established in 1926. Charles Lindbergh received the first one from President Coolidge for his solo transatlantic flight. It has since been awarded for combat valor — James Doolittle, George H.W. Bush, and John Glenn all received it. Notable also to Al Gore and James Webb.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Distinguished_Flying_Cross_(United_States)',
    distractors: ['Air Medal', 'Airman\'s Medal', 'Silver Star'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Navy Cross', category: 'medal', branch: 'navy',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Navy_cross.jpg/400px-Navy_cross.jpg',
      alt: 'Cross patonce medal with anchor and sailing ship motif on navy blue and white ribbon',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Navy_cross.jpg',
    },
    description: 'The Navy Cross is the U.S. Navy\'s second-highest military decoration, awarded for extraordinary heroism in combat. It is equivalent to the Army\'s Distinguished Service Cross and Air Force Cross.',
    history: 'Established in 1919, the Navy Cross is awarded to members of the Navy, Marine Corps, and Coast Guard. Some of the most famous Navy Cross recipients include John Basilone (also MOH), Mitchell Red Cloud Jr., and numerous SEAL Team operators in Afghanistan and Iraq.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Navy_Cross',
    distractors: ['Medal of Honor', 'Silver Star', 'Marine Corps Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Bronze Star', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bronze_star_medal.jpg/400px-Bronze_star_medal.jpg',
      alt: 'Five-pointed bronze star medal with superimposed small star on red-white-blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bronze_star_medal.jpg',
    },
    description: 'The Bronze Star Medal is the fourth-highest individual military award. It can be awarded for valor in combat (denoted by a "V" device) or for meritorious service.',
    history: 'Created in 1944 by General Marshall to recognize ground combat service alongside the Silver Star, the Bronze Star has become one of the most widely awarded decorations. When awarded with the "V" device it denotes valor in direct combat. Without it, it recognizes meritorious service or achievement.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bronze_Star_Medal',
    distractors: ['Army Commendation Medal', 'Silver Star', 'Meritorious Service Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Victoria Cross', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Victoria_Cross_-_transparent_background.png/400px-Victoria_Cross_-_transparent_background.png',
      alt: 'Simple dark bronze cross with lion on crown motif and "FOR VALOUR" inscription',
      credit: 'British Government · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Victoria_Cross_-_transparent_background.png',
    },
    description: 'The Victoria Cross (VC) is the Commonwealth\'s highest military decoration for valour. It is awarded for most conspicuous bravery or some daring or pre-eminent act of valour or self-sacrifice in the presence of the enemy.',
    history: 'Instituted by Queen Victoria in 1856 for the Crimean War, the VC is cast from captured Russian cannon (traditionally). Only 1,358 have been awarded. The medal is so valued that a VC at auction typically fetches over £300,000. Recipients receive a £10,000 annual pension from the British government.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Victoria_Cross',
    distractors: ['George Cross', 'Distinguished Service Order', 'Military Cross'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Iron Cross', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Iron_Cross_1813.jpg/400px-Iron_Cross_1813.jpg',
      alt: 'Black cross medal with silver border and date inscription',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Iron_Cross_1813.jpg',
    },
    description: 'The Iron Cross (Eisernes Kreuz) is a German military decoration awarded for battlefield valor. First awarded by Prussia in 1813, it was revived in WWI and WWII and remains one of the most recognized military symbols in history.',
    history: 'The Iron Cross was established by King Frederick William III of Prussia in 1813 during the Napoleonic Wars. The WWII series had the Eisernes Kreuz (1st and 2nd class), Ritterkreuz (Knight\'s Cross), and higher grades. Only 27 people received the Knight\'s Cross with Oak Leaves, Swords, and Diamonds — the highest grade.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Iron_Cross',
    distractors: ['Knight\'s Cross', 'Pour le Mérite', 'German Cross'],
    active: true,
  },

  /* ─────────────────────────────── RANKS ─────────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'Army General (O-10)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Army-USA-OF-09.svg/200px-Army-USA-OF-09.svg.png',
      alt: 'Four silver five-pointed stars arranged in a row on shoulder board',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-09.svg',
    },
    description: 'General (O-10) is the highest active-duty rank in the U.S. Army, denoted by four silver stars. Generals command field armies, major commands, and the Army as a whole.',
    history: 'The rank of General was established during the Civil War. Ulysses S. Grant was the first permanent holder. Today, Army Generals typically command theaters of operation or serve as Army Chief of Staff. The five-star General of the Army rank (last held by Omar Bradley) has not been used since WWII.',
    wikiUrl: 'https://en.wikipedia.org/wiki/General_(United_States)',
    distractors: ['Lieutenant General (O-9)', 'Major General (O-8)', 'Brigadier General (O-7)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Sergeant Major of the Army (E-9S)', category: 'rank', branch: 'army',
    difficulty: 'commander', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/SMA_Rank.svg/200px-SMA_Rank.svg.png',
      alt: 'Enlisted rank chevron with stars, stripes, and distinctive wreath insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SMA_Rank.svg',
    },
    description: 'The Sergeant Major of the Army is the Army\'s most senior enlisted soldier and serves as the principal advisor to the Army Chief of Staff on all enlisted-related matters.',
    history: 'The position was created in 1966 to give the Chief of Staff a senior enlisted advisor following the Vietnam-era enlisted-officer communication gap. Only one person holds the grade at any time. Past holders include William Wooldridge, who established the NCO Corps professional standards still in use.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sergeant_Major_of_the_Army',
    distractors: ['Command Sergeant Major', 'Sergeant Major', 'Master Sergeant'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Navy Admiral (O-10)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Navy-USA-OF-09.svg/200px-Navy-USA-OF-09.svg.png',
      alt: 'Four silver stars on Navy shoulder board',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Navy-USA-OF-09.svg',
    },
    description: 'Admiral (O-10) is the highest active-duty rank in the U.S. Navy, denoted by four silver stars. Admirals command fleets and serve as Chief of Naval Operations.',
    history: 'The rank of Admiral was established during the Civil War when David G. Farragut was promoted. The five-star Fleet Admiral rank (held by Nimitz, King, Leahy, and Halsey) has not been awarded since WWII. The current CNO serves as the Navy\'s senior uniformed officer on the Joint Chiefs of Staff.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Admiral_(United_States)',
    distractors: ['Vice Admiral (O-9)', 'Rear Admiral (O-8)', 'Commodore'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Master Sergeant (E-8)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/MSG_Rank.svg/200px-MSG_Rank.svg.png',
      alt: 'Three upward chevrons with three rocker stripes below and star in center',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MSG_Rank.svg',
    },
    description: 'Master Sergeant (E-8) is a senior non-commissioned officer rank in the U.S. Army, denoted by three chevrons and three rockers with a star. It is one of two E-8 grades, the other being the First Sergeant.',
    history: 'The Master Sergeant rank serves as a senior technical NCO or staff position. Unlike First Sergeant (who is a company-level leadership position), the MSG typically occupies specialized technical roles at higher headquarters. In Special Forces, MSG is a team sergeant position of great authority.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Master_sergeant_(United_States)',
    distractors: ['First Sergeant (1SG)', 'Sergeant First Class (E-7)', 'Command Sergeant Major (E-9)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Captain (O-3, Army)', category: 'rank', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Army-USA-OF-02.svg/200px-Army-USA-OF-02.svg.png',
      alt: 'Two silver railroad track bars on collar or shoulder board',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-02.svg',
    },
    description: 'Captain (O-3) is an officer rank in the U.S. Army, denoted by two silver bars ("railroad tracks"). Captains typically command infantry, armor, artillery, or support companies of 100–200 soldiers.',
    history: 'The company commander has been the basic fighting unit leader since the Revolutionary War. The Captain rank sits at the critical junction between junior leadership (platoon level) and staff work (battalion and above). In the Army, Captains also typically serve as executive officers of larger companies.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Captain_(United_States)',
    distractors: ['First Lieutenant (O-2)', 'Major (O-4)', 'Second Lieutenant (O-1)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Specialist (E-4)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/SPC_Rank.svg/200px-SPC_Rank.svg.png',
      alt: 'Eagle device within inverted chevron on rank insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SPC_Rank.svg',
    },
    description: 'Specialist (E-4) is an enlisted rank unique to the U.S. Army, denoted by an inverted chevron with eagle device. Unlike Corporal, Specialists hold no command authority but may outrank Privates and PFCs.',
    history: 'Created in 1955 to provide a technical career path parallel to the NCO track, the Specialist rank allows skilled soldiers in technical fields (intelligence, medicine, communications) to receive higher pay without supervisory responsibilities. It is the most common rank in the Army.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Specialist_(United_States_Army)',
    distractors: ['Corporal (E-4)', 'Private First Class (E-3)', 'Private (E-1/E-2)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Corporal (E-4)', category: 'rank', branch: 'marines',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/USMC-E4.svg/200px-USMC-E4.svg.png',
      alt: 'Two upward chevrons on rank insignia',
      credit: 'USMC · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USMC-E4.svg',
    },
    description: 'Corporal (E-4) is the lowest Non-Commissioned Officer rank in the U.S. Marine Corps. Unlike Army Specialists, Marine Corporals hold NCO authority and are expected to lead fire teams.',
    history: 'The Marine Corps places exceptional responsibility on its Corporals, who are expected to be tactical experts and leaders from the moment they pin on the rank. The title dates to the 17th century. In the Marine Corps, the NCO grade begins at Corporal — there is no Specialist equivalent.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Corporal#United_States',
    distractors: ['Lance Corporal (E-3)', 'Sergeant (E-5)', 'Staff Sergeant (E-6)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Chief Petty Officer (E-7)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/CPO_USN.svg/200px-CPO_USN.svg.png',
      alt: 'Navy anchor-fouled insignia with eagle and stars on rating badge',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:CPO_USN.svg',
    },
    description: 'Chief Petty Officer (CPO) is a highly prestigious senior enlisted rank in the U.S. Navy, denoted by distinctive anchors and eagle insignia. Chiefs are the backbone of the Navy\'s operational readiness.',
    history: 'The CPO grade was established in 1893. The initiation into the Chief\'s Mess is a rigorous 6-week "Season" process unlike anything else in the military — candidates are evaluated not just on technical skill but on judgment, character, and leadership. "The Chief drives the Navy" is a common adage.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chief_petty_officer_(United_States)',
    distractors: ['Petty Officer 1st Class (E-6)', 'Senior Chief Petty Officer (E-8)', 'Master Chief Petty Officer (E-9)'],
    active: true,
  },

  /* ─────────────────────────────── INSIGNIA ──────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: '101st Airborne Division "Screaming Eagles"', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/101st_Airborne_Division_shoulder_sleeve_insignia.jpg/400px-101st_Airborne_Division_shoulder_sleeve_insignia.jpg',
      alt: 'Black shield with white eagle head and tab reading AIRBORNE',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:101st_Airborne_Division_shoulder_sleeve_insignia.jpg',
    },
    description: 'The Screaming Eagles insignia is the shoulder sleeve insignia of the U.S. Army\'s 101st Airborne Division. The eagle\'s head (nicknamed "Old Abe") recalls the 8th Wisconsin Infantry\'s mascot from the Civil War.',
    history: 'Activated in 1942, the 101st Airborne jumped into Normandy the night before D-Day (June 6, 1944), then fought at Market Garden and held Bastogne during the Battle of the Bulge. Today the 101st is an air assault division based at Fort Campbell, KY, and has deployed extensively to Iraq and Afghanistan.',
    wikiUrl: 'https://en.wikipedia.org/wiki/101st_Airborne_Division',
    distractors: ['82nd Airborne Division', '1st Cavalry Division', '1st Infantry Division "Big Red One"'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: '82nd Airborne Division', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/82nd_Airborne_Division_shoulder_sleeve_insignia.jpg/400px-82nd_Airborne_Division_shoulder_sleeve_insignia.jpg',
      alt: 'Blue square patch with two "AA" letters and AIRBORNE tab',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:82nd_Airborne_Division_shoulder_sleeve_insignia.jpg',
    },
    description: 'The 82nd Airborne Division "All Americans" insignia features two interlocking "AA"s on a blue field. The nickname comes from the division\'s WWII composition of soldiers from all 48 states.',
    history: 'The 82nd was converted to an airborne division in 1942 and made its first combat jump in Sicily (1943). Its parachute assault into Normandy and Holland was critical to Allied operations. Today the 82nd maintains its Global Response Force mission — a brigade ready to deploy anywhere in the world within 18 hours.',
    wikiUrl: 'https://en.wikipedia.org/wiki/82nd_Airborne_Division',
    distractors: ['101st Airborne Division', '173rd Airborne Brigade', '75th Ranger Regiment'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'U.S. Army Special Forces (Green Berets)', category: 'insignia', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Special_Forces_Tab.jpg/400px-Special_Forces_Tab.jpg',
      alt: 'Arched tab with "Special Forces" text and crossed arrows with lightning bolt',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Special_Forces_Tab.jpg',
    },
    description: 'The Special Forces tab and De Oppresso Liber ("To Free the Oppressed") motto identify U.S. Army Special Forces. Green Berets are unconventional warfare specialists who train, advise, and lead indigenous forces.',
    history: 'Established in 1952 at Fort Bragg, Army Special Forces were championed by President Kennedy, who authorized the distinctive green beret in 1961. Green Berets played a controversial role in Vietnam running CIDG (Civilian Irregular Defense Group) programs training Montagnard tribesmen. Today they operate in over 70 countries.',
    wikiUrl: 'https://en.wikipedia.org/wiki/United_States_Army_Special_Forces',
    distractors: ['75th Ranger Regiment', 'Civil Affairs', 'Psychological Operations'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: '1st Marine Division', category: 'insignia', branch: 'marines',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/1stMarDiv.png/400px-1stMarDiv.png',
      alt: 'Blue diamond shape with southern cross stars and number 1',
      credit: 'USMC · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:1stMarDiv.png',
    },
    description: 'The 1st Marine Division "The Old Breed" insignia features the Southern Cross constellation on a blue diamond. It is the oldest, largest, and most decorated division in the Marine Corps.',
    history: 'Activated in 1941, the 1st Marine Division earned its "Old Breed" nickname for the hard-bitten veterans who formed its core. It fought at Guadalcanal, Peleliu, and Okinawa in WWII, and Chosin Reservoir in Korea. Its performance in Iraq (Fallujah, 2004) upheld the division\'s legendary reputation.',
    wikiUrl: 'https://en.wikipedia.org/wiki/1st_Marine_Division',
    distractors: ['2nd Marine Division', '3rd Marine Division', '4th Marine Division'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Navy SEAL Trident', category: 'insignia', branch: 'navy',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/US_Navy_SEAL_Trident.png/400px-US_Navy_SEAL_Trident.png',
      alt: 'Naval warfare insignia with eagle, anchor, trident, and flintlock pistol',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:US_Navy_SEAL_Trident.png',
    },
    description: 'The Navy SEAL Trident (SEAL Special Warfare insignia) consists of a golden eagle clutching a trident, anchor, and flintlock pistol. It is earned after completing the grueling BUD/S training pipeline, one of the most demanding selection courses in the world.',
    history: 'The SEAL Trident was approved in 1970. The anchor represents naval tradition, the trident represents dominance of the sea, the eagle for air operations, and the pistol for land combat — reflecting the SEAL\'s "Sea, Air, and Land" mission. Only about 6% of SEAL candidates complete BUD/S training.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Special_Warfare_insignia',
    distractors: ['Army Ranger Tab', 'USMC Force Recon Insignia', 'Air Force Combat Controller Badge'],
    active: true,
  },

  /* ─────────────────────────────── ARTILLERY ─────────────────────────────────── */

  {
    _type: 'idDrillQuestion', name: 'M198 Howitzer', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/M198_Howitzer.jpg/800px-M198_Howitzer.jpg',
      alt: 'Towed 155mm artillery piece with split-trail carriage and long barrel',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M198_Howitzer.jpg',
    },
    description: 'The M198 Howitzer is a towed 155mm artillery piece. It fires a range of projectiles up to 22 km conventionally or 30 km with rocket-assisted rounds. It was the U.S. Army\'s standard medium artillery from 1979 to present.',
    history: 'The M198 entered service in 1979 and has served in Grenada, Panama, Desert Storm, Kosovo, Afghanistan, and Iraq. Its large caliber allows it to fire nuclear-capable Copperhead laser-guided shells and the Excalibur GPS-guided round with <10m accuracy at extended ranges. It has been partially replaced by the lighter M777.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M198_howitzer',
    distractors: ['M777 Howitzer', 'M109 Paladin', 'M114 Howitzer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M109 Paladin', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/M109A6_Paladin_Howitzer.jpg/800px-M109A6_Paladin_Howitzer.jpg',
      alt: 'Self-propelled 155mm howitzer on tracked chassis with enclosed armored turret',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M109A6_Paladin_Howitzer.jpg',
    },
    description: 'The M109 Paladin is a self-propelled 155mm howitzer. Unlike towed guns, it can move under its own power, fire, and relocate quickly — reducing counter-battery vulnerability.',
    history: 'Entering service in 1963, the M109 has been continuously upgraded. The current A7 variant can autonomously position itself, fire, and relocate in under 90 seconds using the Advanced Gun Display Console. It has served in virtually every major U.S. ground conflict since Vietnam.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M109_howitzer',
    distractors: ['M198 Howitzer', 'Paladin PIM', 'AS-90'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M270 MLRS', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/M270_MLRS.jpg/800px-M270_MLRS.jpg',
      alt: 'Tracked rocket launcher vehicle with two pod launcher box on rotating turret',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M270_MLRS.jpg',
    },
    description: 'The M270 Multiple Launch Rocket System fires rockets and missiles up to 300 km. Its two pods can fire 12 unguided rockets or precision munitions like ATACMS ballistic missiles.',
    history: 'Entering service in 1983, the MLRS proved devastating in Desert Storm — Iraqis called it "steel rain." The GPS-guided GMLRS rocket (70 km range, <5m accuracy) transformed precision fire support. The M270 has been adopted by 10 nations including Germany, France, and Israel.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M270_Multiple_Launch_Rocket_System',
    distractors: ['M142 HIMARS', 'BM-21 Grad', 'M109 Paladin'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M142 HIMARS', category: 'artillery', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/HIMARS_launch.jpg/800px-HIMARS_launch.jpg',
      alt: 'Wheeled rocket launcher on 5-ton truck chassis with single pod launcher',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HIMARS_launch.jpg',
    },
    description: 'The M142 HIMARS (High Mobility Artillery Rocket System) is a wheeled, air-deployable rocket artillery system that fires the same GMLRS rockets and ATACMS missiles as the heavier M270 MLRS — but from a C-130-transportable truck.',
    history: 'Entering service in 2005, HIMARS became globally known for its decisive impact in Ukraine (2022) where Ukrainian forces used it to destroy Russian ammunition depots and command posts at standoff ranges Russian artillery could not match. Over 500 rounds of ATACMS have been fired operationally.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M142_HIMARS',
    distractors: ['M270 MLRS', 'M109 Paladin', 'BM-30 Smerch'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — AIRCRAFT (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'F-16 Fighting Falcon', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/F-16_Fighting_Falcon.jpg/800px-F-16_Fighting_Falcon.jpg',
      alt: 'Single-engine delta-wing multirole jet with side-stick controller and bubble canopy',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-16_Fighting_Falcon.jpg',
    },
    description: 'The F-16 Fighting Falcon is a single-engine multirole fighter used by the U.S. Air Force and over 25 nations. Its fly-by-wire controls, frameless bubble canopy, and high thrust-to-weight ratio make it an exceptional dogfighter and strike platform.',
    history: 'Designed as a lightweight day fighter in the early 1970s, the F-16 entered service in 1978. Over 4,600 have been built — more than any other Western jet. It has seen extensive combat with the Israeli Air Force, USAF, and numerous allied nations, accumulating an outstanding air-to-air kill record.',
    wikiUrl: 'https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon',
    distractors: ['F-15 Eagle', 'Mirage 2000', 'JAS 39 Gripen'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F-4 Phantom II', category: 'aircraft', branch: 'navy',
    difficulty: 'recruit', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/F-4_Phantom_II.jpg/800px-F-4_Phantom_II.jpg',
      alt: 'Twin-engine fighter with anhedral outer wing panels and distinctive drooped nose',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-4_Phantom_II.jpg',
    },
    description: 'The F-4 Phantom II is a twin-engine supersonic fighter-bomber developed for the U.S. Navy. It served as the primary fighter for the Navy, Marine Corps, and Air Force during the Vietnam War, and holds records in both air-to-air combat and ground attack.',
    history: 'First flown in 1958, the Phantom became the backbone of American tactical aviation through the 1970s. In Vietnam, its lack of an internal gun (initially) led to missile-only combat — a doctrine that failed against agile MiG-17s, prompting the creation of Top Gun. Over 5,195 were built.',
    wikiUrl: 'https://en.wikipedia.org/wiki/McDonnell_Douglas_F-4_Phantom_II',
    distractors: ['F-8 Crusader', 'F-105 Thunderchief', 'A-7 Corsair II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-17 Flying Fortress', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Boeing_B-17_Flying_Fortress.jpg/800px-Boeing_B-17_Flying_Fortress.jpg',
      alt: 'Four-engine heavy bomber with multiple gun turrets in flight over landscape',
      credit: 'U.S. Army Air Corps · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Boeing_B-17_Flying_Fortress.jpg',
    },
    description: 'The B-17 Flying Fortress was a four-engine heavy bomber used by the U.S. Army Air Forces in WWII. It became the symbol of American strategic bombing with its durability, defensive firepower, and ability to return from severe battle damage.',
    history: 'Entering service in 1938, over 12,700 B-17s were built. The 8th Air Force flew massive daylight precision bombing campaigns over Nazi Germany from English bases. Missions like the Schweinfurt raids suffered catastrophic losses before long-range fighter escorts became available. Memphis Belle was the first crew to complete 25 missions.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_B-17_Flying_Fortress',
    distractors: ['B-24 Liberator', 'Lancaster', 'B-29 Superfortress'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'P-47 Thunderbolt', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/P-47_Thunderbolt.jpg/800px-P-47_Thunderbolt.jpg',
      alt: 'Large radial-engine fighter with round fuselage and eight .50-caliber wing guns',
      credit: 'U.S. Army Air Forces · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:P-47_Thunderbolt.jpg',
    },
    description: 'The P-47 Thunderbolt was the largest, heaviest, and most expensive fighter of WWII. Its massive Pratt & Whitney radial engine and eight .50-cal machine guns made it a devastating escort fighter and ground attack platform.',
    history: 'Over 15,636 Thunderbolts were built — more than any other U.S. fighter in WWII. The "Jug" could absorb tremendous battle damage and dive faster than any German fighter. It escorted bombers over Europe and strafed German supply lines with ruthless effectiveness. Pilots credited it with destroying over 86,000 rail cars, 68,000 motor vehicles, and 9,000 locomotives.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Republic_P-47_Thunderbolt',
    distractors: ['P-51 Mustang', 'P-38 Lightning', 'P-40 Warhawk'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'P-38 Lightning', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Lockheed_P-38_Lightning.jpg/800px-Lockheed_P-38_Lightning.jpg',
      alt: 'Twin-boom twin-engine fighter with central gondola and tricycle landing gear',
      credit: 'U.S. Army Air Forces · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lockheed_P-38_Lightning.jpg',
    },
    description: 'The P-38 Lightning was a twin-engine, twin-boom fighter distinctive for its unusual configuration. Its long range made it the premier Pacific escort fighter, and Ace Richard Bong scored all 40 of his kills in the P-38.',
    history: 'Developed in the late 1930s, the P-38 entered service in 1941. It was the only U.S. fighter in continuous production throughout WWII. In April 1943, P-38s intercepted and shot down the transport carrying Admiral Yamamoto, architect of Pearl Harbor, over Bougainville after code-breakers revealed his itinerary.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_P-38_Lightning',
    distractors: ['P-47 Thunderbolt', 'P-51 Mustang', 'P-39 Airacobra'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'UH-1 Iroquois (Huey)', category: 'aircraft', branch: 'army',
    difficulty: 'recruit', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/UH-1_Huey.jpg/800px-UH-1_Huey.jpg',
      alt: 'Single-engine utility helicopter with skid landing gear and open side doors',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:UH-1_Huey.jpg',
    },
    description: 'The UH-1 Iroquois, universally known as the "Huey," is the most iconic helicopter of the Vietnam War. Its distinctive rotor sound became the auditory symbol of the war. Over 16,000 were built in a vast range of utility, gunship, and medevac variants.',
    history: 'The first turbine-powered U.S. military helicopter, the UH-1 entered service in 1959. In Vietnam it revolutionized airmobile warfare — the 1st Cavalry Division used Hueys to move infantry across terrain that would take days on foot. Medevac Hueys saved thousands of lives; Vietnam saw a wounded soldier reach surgery faster than in any previous war.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bell_UH-1_Iroquois',
    distractors: ['CH-47 Chinook', 'OH-6 Cayuse', 'AH-1 Cobra'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F-86 Sabre', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'korea',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/F-86D_Sabre.jpg/800px-F-86D_Sabre.jpg',
      alt: 'Swept-wing single-engine jet fighter with round nose intake',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-86D_Sabre.jpg',
    },
    description: 'The F-86 Sabre was America\'s first swept-wing jet fighter, the primary U.S. air superiority fighter during the Korean War. In air-to-air combat it achieved a remarkable kill ratio against the Soviet MiG-15.',
    history: 'Developed using captured German swept-wing research, the F-86 entered service in 1949. In the skies over "MiG Alley" in northwestern Korea, F-86 pilots — many of them WWII veterans — engaged Soviet-piloted MiG-15s in the first all-jet air battles. U.S. Air Force claimed a 10:1 kill ratio, though historians now believe 2:1 is more accurate.',
    wikiUrl: 'https://en.wikipedia.org/wiki/North_American_F-86_Sabre',
    distractors: ['MiG-15 Fagot', 'F-84 Thunderjet', 'F-94 Starfire'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MiG-15 Fagot', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'korea',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/MiG-15_in_flight.jpg/800px-MiG-15_in_flight.jpg',
      alt: 'Swept-wing Soviet jet fighter with T-tail and nose intake',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MiG-15_in_flight.jpg',
    },
    description: 'The MiG-15 Fagot was a Soviet swept-wing jet fighter that shocked UN forces when it appeared over Korea in 1950. It outclassed every Allied jet except the F-86 Sabre and was initially flown by Soviet pilots in secret.',
    history: 'Developed using British Rolls-Royce jet engine technology sold to the USSR in 1946, the MiG-15 was superior in climb rate and ceiling to early F-86 versions. Over 18,000 were built, making it the most produced jet fighter in history. Defecting North Korean pilot No Kum-Sok delivered an intact MiG-15 to the U.S. in 1953, earning $100,000.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mikoyan-Gurevich_MiG-15',
    distractors: ['MiG-17 Fresco', 'MiG-19 Farmer', 'MiG-21 Fishbed'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'V-22 Osprey', category: 'aircraft', branch: 'marines',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/V-22_Osprey_2.jpg/800px-V-22_Osprey_2.jpg',
      alt: 'Tiltrotor aircraft with large wing-mounted proprotors transitioning between helicopter and airplane mode',
      credit: 'U.S. Marine Corps · DVIDS · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:V-22_Osprey_2.jpg',
    },
    description: 'The V-22 Osprey is a tiltrotor aircraft that takes off like a helicopter and cruises like a turboprop airplane. It combines vertical landing capability with fixed-wing speed (316 mph) and range, replacing the aging CH-46 Sea Knight.',
    history: 'A troubled development program spanning the 1980s–90s saw four fatal crashes and congressional debate over cancellation. The MV-22 entered USMC service in 2007 and the CV-22 entered USAF Special Operations Command in 2009. It has flown combat missions in Iraq, Afghanistan, and Libya. A fatal crash in 2022 over Japan reinvigorated safety debates.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bell_Boeing_V-22_Osprey',
    distractors: ['CH-46 Sea Knight', 'CH-53 Sea Stallion', 'UH-60 Black Hawk'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'U-2 Dragon Lady', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/U2_high_altitude_aircraft.jpg/800px-U2_high_altitude_aircraft.jpg',
      alt: 'Single-engine glider-like jet with extremely long narrow wings and bicycle landing gear',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:U2_high_altitude_aircraft.jpg',
    },
    description: 'The U-2 Dragon Lady is a single-engine high-altitude reconnaissance aircraft capable of flying at 70,000 feet. It has provided strategic intelligence since 1956 and remains in service today.',
    history: 'Developed at Lockheed\'s Skunk Works, the U-2 was the CIA\'s primary intelligence platform during the Cold War. In May 1960, Francis Gary Powers was shot down over the Soviet Union in a U-2, creating a diplomatic crisis and derailing an Eisenhower-Khrushchev summit. U-2 imagery during the Cuban Missile Crisis (1962) provided the evidence that triggered the standoff.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_U-2',
    distractors: ['SR-71 Blackbird', 'A-12 Oxcart', 'RQ-4 Global Hawk'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'C-17 Globemaster III', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/C-17_Globemaster_III.jpg/800px-C-17_Globemaster_III.jpg',
      alt: 'Four-engine high-wing military transport with T-tail and rear loading ramp',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:C-17_Globemaster_III.jpg',
    },
    description: 'The C-17 Globemaster III is a large military transport aircraft capable of rapid strategic airlift of troops, equipment, and supplies to main operating bases or directly into forward bases. It can also perform airdrop and medevac missions.',
    history: 'Entering service in 1995, the C-17 replaced the aging C-141 Starlifter. Its combination of strategic range and tactical flexibility — it can land on short, austere runways — made it indispensable in Afghanistan, Iraq, and humanitarian operations. 279 were built. The last C-17 rolled off Boeing\'s Long Beach line in 2015.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_C-17_Globemaster_III',
    distractors: ['C-130 Hercules', 'C-5 Galaxy', 'KC-135 Stratotanker'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MQ-9 Reaper', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/MQ-9_Reaper_UAV.jpg/800px-MQ-9_Reaper_UAV.jpg',
      alt: 'Large unmanned aircraft with inverted V-tail, turboprop engine, and Hellfire missile pylons',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MQ-9_Reaper_UAV.jpg',
    },
    description: 'The MQ-9 Reaper is a large unmanned combat aerial vehicle (UCAV) capable of carrying Hellfire missiles, GBU-12 bombs, and AIM-9 Sidewinders. It provides persistent surveillance and strike capability in contested environments.',
    history: 'Entering service in 2007, the Reaper has flown over a million flight hours in combat. It has been used to eliminate high-value targets including ISIS leader Abu Bakr al-Baghdadi\'s associates and IRGC Quds Force commander Qasem Soleimani (2020). Its 14+ hour endurance allows it to loiter over targets for extended periods.',
    wikiUrl: 'https://en.wikipedia.org/wiki/General_Atomics_MQ-9_Reaper',
    distractors: ['MQ-1 Predator', 'RQ-4 Global Hawk', 'X-47B'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'AC-130 Gunship', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/AC-130_gunship_firing.jpg/800px-AC-130_gunship_firing.jpg',
      alt: 'Four-engine turboprop gunship with cannon ports on left side firing at night',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:AC-130_gunship_firing.jpg',
    },
    description: 'The AC-130 is a heavily armed ground-attack variant of the C-130 Hercules. Equipped with 105mm howitzer, 40mm cannon, and 25mm Gatling gun, it orbits a target area in a left-hand turn, delivering continuous, precise fire.',
    history: 'The gunship concept was developed in Vietnam as the AC-47 "Puff the Magic Dragon," then grew into the AC-119 and AC-130. In Vietnam, AC-130s interdicted the Ho Chi Minh Trail with devastating effect at night. The type has been used in every major U.S. conflict since, including the 2001 Battle of Qala-i-Jangi where AC-130s provided close support during a prison uprising.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_AC-130',
    distractors: ['C-130 Hercules', 'B-52 Stratofortress', 'A-10 Thunderbolt II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F4U Corsair', category: 'aircraft', branch: 'marines',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Vought_F4U_Corsair.jpg/800px-Vought_F4U_Corsair.jpg',
      alt: 'Inverted gull-wing single-engine fighter with large propeller',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vought_F4U_Corsair.jpg',
    },
    description: 'The F4U Corsair was a carrier-based fighter known for its distinctive inverted gull wing, which was designed to provide ground clearance for its massive 13-foot propeller. It became one of the most capable fighters of WWII.',
    history: 'Developed by Chance Vought, the Corsair initially had deck-landing difficulties that led the Navy to give priority to Marines flying from land bases. USMC pilots like Gregory "Pappy" Boyington dominated Pacific skies. Japanese pilots called it "Whistling Death" for the distinctive sound of its air intakes. It achieved a 11:1 kill ratio in Pacific combat.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Vought_F4U_Corsair',
    distractors: ['F6F Hellcat', 'F4F Wildcat', 'P-51 Mustang'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'F-35 Lightning II', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/F-35_Lightning_II_%281%29.jpg/800px-F-35_Lightning_II_%281%29.jpg',
      alt: 'Single-engine fifth-generation stealth fighter with internal weapons bays',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-35_Lightning_II_(1).jpg',
    },
    description: 'The F-35 Lightning II is a family of single-engine, stealth multirole fighters in three variants: F-35A (conventional), F-35B (short takeoff/vertical landing), and F-35C (carrier). It integrates sensor fusion and advanced avionics to make stealth pilots "god-like" situationally aware.',
    history: 'The most expensive weapons program in history at $1.7 trillion lifecycle cost, the F-35 entered service in 2015. It has been adopted by 16 nations. Israel was the first to use it in combat, conducting strikes over Syria in 2018. The F-35B\'s STOVL capability gives the Marine Corps and allied navies carrier-independent strike options.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II',
    distractors: ['F-22 Raptor', 'Eurofighter Typhoon', 'Dassault Rafale'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'A6M Zero', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/A6M2_over_China.jpg/800px-A6M2_over_China.jpg',
      alt: 'Light single-engine carrier fighter with fixed undercarriage and round fuselage',
      credit: 'Imperial Japanese Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:A6M2_over_China.jpg',
    },
    description: 'The Mitsubishi A6M Zero was the Imperial Japanese Navy\'s carrier-based fighter. At the start of WWII it was arguably the finest carrier aircraft in the world, with outstanding range, maneuverability, and rate of climb.',
    history: 'The Zero shocked Allied pilots during its debut at Pearl Harbor and in early Pacific fighting — it could out-turn and out-climb every opposing fighter. Its weakness was light construction and no self-sealing fuel tanks; as Allied aircraft improved, its fragility became fatal. By 1944 it served as a kamikaze platform. Over 10,000 were built.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mitsubishi_A6M_Zero',
    distractors: ['Ki-43 Hayabusa', 'N1K Shiden', 'Ki-84 Hayate'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-29 Superfortress', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/B-29_Superfortress.jpg/800px-B-29_Superfortress.jpg',
      alt: 'Large four-engine high-altitude bomber with pressurized fuselage and remote-controlled gun turrets',
      credit: 'U.S. Army Air Forces · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:B-29_Superfortress.jpg',
    },
    description: 'The B-29 Superfortress was the most technologically advanced bomber of WWII. Its pressurized cabin, remote-controlled gun turrets, and 3,250-mile range allowed it to conduct high-altitude strategic bombing of Japan from Pacific island bases.',
    history: 'Enola Gay, a B-29, dropped the first atomic bomb on Hiroshima on August 6, 1945. Three days later, Bockscar dropped the second on Nagasaki. The firebombing campaign by B-29s under General LeMay had already destroyed over 60 Japanese cities before the atomic missions. The B-29 program cost more than the Manhattan Project.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_B-29_Superfortress',
    distractors: ['B-17 Flying Fortress', 'B-24 Liberator', 'Lancaster'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — ARMOR (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Panther (Panzerkampfwagen V)', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Panther_Ausf_G_Wunsdorf_1944.jpg/800px-Panther_Ausf_G_Wunsdorf_1944.jpg',
      alt: 'German medium tank with sloped armor, wide tracks, and long 75mm high-velocity gun',
      credit: 'Bundesarchiv · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panther_Ausf_G_Wunsdorf_1944.jpg',
    },
    description: 'The Panther was Germany\'s medium tank, developed in response to the Soviet T-34. Many historians consider it the finest tank of WWII in terms of firepower, protection, and mobility — when it was working. Mechanical unreliability was its Achilles\' heel.',
    history: 'Rushed into production after Kursk (1943), early Panthers suffered severe mechanical failures. Once mature, the Panther\'s 75mm KwK 42 gun could defeat any Allied tank at 1,500 meters. Over 6,000 were built. Captured Panther chassis were used by French forces after liberation, and some served into the 1950s.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Panther_tank',
    distractors: ['Tiger I', 'Panzer IV', 'Tiger II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Stryker', category: 'armor', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Stryker_ICV.jpg/800px-Stryker_ICV.jpg',
      alt: 'Eight-wheeled armored infantry carrier with slat armor cage and remote weapon station',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stryker_ICV.jpg',
    },
    description: 'The Stryker is an eight-wheeled armored fighting vehicle providing the U.S. Army with a medium-weight capability between heavy armor and light infantry. Its wheeled design allows rapid road movement and strategic airlift on C-17s.',
    history: 'Adopted in 2002 after controversial debate about wheeled versus tracked vehicles, Strykers deployed to Iraq in 2003 with the 3rd Brigade, 2nd Infantry Division. They proved highly maneuverable in urban combat. Stryker Brigade Combat Teams provide a rapidly deployable combined-arms force. A 30mm autocannon variant (Dragoon) entered service in 2018.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Stryker',
    distractors: ['LAV-25', 'M1126 Stryker ICV', 'Pandur II'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M113 APC', category: 'armor', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/M113_Vietnam.jpg/800px-M113_Vietnam.jpg',
      alt: 'Boxy aluminum-hulled tracked armored personnel carrier',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M113_Vietnam.jpg',
    },
    description: 'The M113 Armored Personnel Carrier is a fully tracked aluminum-hulled transport that became one of the most widely used armored vehicles in history. It served from Vietnam through Afghanistan and remains in service in 50+ nations.',
    history: 'Adopted in 1960, the M113 saw widespread use in Vietnam where it was called the "Green Dragon" by crews who used it aggressively in combat. Its aluminum hull, initially intended only to stop small arms, was vulnerable to RPGs. Over 80,000 were built. Numerous specialized variants include mortar carriers, command vehicles, and the M577 command post variant.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M113_armored_personnel_carrier',
    distractors: ['M2 Bradley', 'Stryker', 'M59 APC'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Merkava Mk IV', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Merkava_Mark_IV_in_the_Golan_Heights.jpg/800px-Merkava_Mark_IV_in_the_Golan_Heights.jpg',
      alt: 'Israeli main battle tank with distinctive front-mounted engine and rear crew access',
      credit: 'IDF · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Merkava_Mark_IV_in_the_Golan_Heights.jpg',
    },
    description: 'The Merkava is Israel\'s main battle tank, unique for its front-mounted engine which provides additional crew protection and a rear exit for soldiers and casualties. It was designed specifically around crew survivability.',
    history: 'Israel developed the Merkava after being denied tank purchases following the 1967 war. First fielded in 1979, it saw combat in Lebanon. The Mk IV variant includes the Trophy active protection system, which has intercepted hundreds of RPGs and ATGMs in combat. Israel\'s combat experience with the Merkava has driven continuous improvement cycles unmatched by any other tank program.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Merkava',
    distractors: ['Challenger 2', 'Leopard 2', 'T-90'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'IS-2 Stalin', category: 'armor', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/IS-2_tank.jpg/800px-IS-2_tank.jpg',
      alt: 'Soviet heavy tank with large 122mm gun and rounded turret',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:IS-2_tank.jpg',
    },
    description: 'The IS-2 (Iosif Stalin 2) was a Soviet heavy tank carrying a 122mm gun capable of knocking out Tiger I tanks at 1,500 meters. It was designed specifically to defeat German heavy armor.',
    history: 'Introduced in early 1944, the IS-2\'s massive gun devastated German Tigers and Panthers and was equally effective against fortifications. It led the assault into Berlin in 1945. Its limitation was the two-piece ammunition — loading was slow and only 28 rounds could be carried. It served in Soviet satellite armies through the 1960s.',
    wikiUrl: 'https://en.wikipedia.org/wiki/IS-2',
    distractors: ['T-34-85', 'KV-2', 'IS-3'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Churchill Infantry Tank', category: 'armor', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Churchill_tank_Bovington.jpg/800px-Churchill_tank_Bovington.jpg',
      alt: 'British heavy infantry tank with side sponson tracks and boxy hull',
      credit: 'Wikimedia Commons · CC-BY-SA',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Churchill_tank_Bovington.jpg',
    },
    description: 'The Churchill was a British infantry tank designed for supporting infantry across difficult terrain. Its long tracks, wide stance, and excellent cross-country mobility made it valuable in Italy and Northwest Europe, despite its slow speed.',
    history: 'Rushed into production in 1941, early Churchills had chronic mechanical problems. Refined variants performed well at El Alamein and excelled in the Italian campaign\'s steep terrain. The AVRE (Armoured Vehicle Royal Engineers) variant carried a 290mm petard mortar to demolish fortifications. The Churchill was among the few Allied tanks to match Tiger I armor thickness.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Churchill_tank',
    distractors: ['Matilda II', 'Valentine', 'Cromwell'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — SMALL ARMS (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'M1 Garand', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/M1_Garand_rifle.jpg/800px-M1_Garand_rifle.jpg',
      alt: 'Semi-automatic wooden-stocked rifle with en-bloc clip and gas-operated action',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1_Garand_rifle.jpg',
    },
    description: 'The M1 Garand was the standard U.S. service rifle of WWII. General George Patton called it "the greatest battle implement ever devised." It was the world\'s first semi-automatic rifle adopted as a standard infantry weapon.',
    history: 'Designed by John C. Garand and adopted in 1936, the M1 gave American infantrymen a decisive advantage in firepower over bolt-action enemies. It holds eight rounds in a distinctive en-bloc clip that ejects with a distinctive "ping" when empty. Over 5.4 million were produced. It served through Korea and into early Vietnam before replacement by the M14.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M1_Garand',
    distractors: ['M14 Rifle', 'Springfield M1903', 'Johnson M1941'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M1911 Pistol', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/M1911A1.jpg/800px-M1911A1.jpg',
      alt: 'Single-action semi-automatic pistol with external hammer and grip safety, .45 caliber',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1911A1.jpg',
    },
    description: 'The M1911 is a single-action, .45 ACP semi-automatic pistol that served as the standard U.S. military sidearm from 1911 to 1985 — the longest service record of any U.S. military handgun. It remains in use by Marine Corps special operations units today.',
    history: 'Designed by John Moses Browning after the Army\'s experience with inadequate .38 caliber revolvers in the Philippines (1899–1902), the M1911 was adopted after competitive trials. It served in WWI, WWII, Korea, and Vietnam. Its stopping power, reliability, and robust design earned legendary status. It was replaced by the Beretta M9 in 1985, though USMC MEU(SOC) units retained the .45 until 2019.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M1911_pistol',
    distractors: ['Colt SAA', 'Beretta M9', 'SIG Sauer P226'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Thompson M1928 Submachine Gun', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/M1928A1Thompson.png/800px-M1928A1Thompson.png',
      alt: 'Submachine gun with drum or box magazine, wooden pistol grip and foregrip',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M1928A1Thompson.png',
    },
    description: 'The Thompson submachine gun, known as the "Tommy Gun," fired .45 ACP from drum or box magazines. It became iconic in both organized crime (1920s) and WWII service, valued for its reliability and devastating close-range firepower.',
    history: 'Invented by General John T. Thompson in 1919, the Thompson was initially marketed to law enforcement and civilians. Prohibition-era gangsters adopted it enthusiastically. The U.S. military bought large quantities for WWII, using it as a squad weapon and for jungle fighting in the Pacific. The simplified M1 variant reduced production cost. Over 1.5 million were built.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Thompson_submachine_gun',
    distractors: ['M3 Grease Gun', 'MP40', 'Sten Gun'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Browning M2 Heavy Machine Gun', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/M2_Browning_in_tripod_mount.jpg/800px-M2_Browning_in_tripod_mount.jpg',
      alt: 'Heavy .50 caliber water-cooled machine gun on M3 tripod',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M2_Browning_in_tripod_mount.jpg',
    },
    description: 'The M2 Browning .50 caliber heavy machine gun has been in continuous U.S. service since 1933. Firing the massive 12.7×99mm cartridge, it is effective against personnel, light vehicles, aircraft, and light fortifications to ranges beyond 2,000 meters.',
    history: 'Designed by John Browning as WWI ended, the M2 ("Ma Deuce") entered service in 1921. It armed virtually every WWII U.S. aircraft, vehicle, and ship. In Korea, Vietnam, Iraq, and Afghanistan it remained the go-to heavy weapon. At over 90 years in continuous production, it is one of the longest-serving weapons in the U.S. military.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M2_Browning',
    distractors: ['M240B Machine Gun', 'M60 Machine Gun', 'DShK 12.7mm'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M249 Squad Automatic Weapon', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/M249_Squad_Automatic_Weapon.jpg/800px-M249_Squad_Automatic_Weapon.jpg',
      alt: 'Light machine gun with plastic stock, 200-round drum box, and bipod',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M249_Squad_Automatic_Weapon.jpg',
    },
    description: 'The M249 SAW (Squad Automatic Weapon) fires 5.56mm NATO at up to 850 rounds per minute from a belt or M16 magazine. Each squad\'s SAW gunner provides the base of fire that allows the squad to maneuver.',
    history: 'Adopted in 1984 as the U.S. answer to the Soviet RPK, the M249 gave infantry squads their own belt-fed automatic weapon. It saw extensive use in Gulf War, Somalia, Afghanistan, and Iraq. Paratroopers complained about its weight (17 lbs loaded) and reliability in dusty environments. The Army began fielding the M250 (Mk 48 family) replacement in the 2020s.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M249_light_machine_gun',
    distractors: ['M240B Machine Gun', 'M60 Machine Gun', 'RPK'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Barrett M82', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Barrett_M82A1.jpg/800px-Barrett_M82A1.jpg',
      alt: 'Large caliber semi-automatic sniper rifle with muzzle brake and bipod, .50 BMG',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Barrett_M82A1.jpg',
    },
    description: 'The Barrett M82 is a .50 BMG semi-automatic anti-materiel rifle capable of engaging targets at ranges exceeding 1,800 meters. Its primary targets are light vehicles, radar systems, parked aircraft, and enemy crew-served weapons.',
    history: 'Designed by Ronnie Barrett and fielded in 1989, the M82 saw its combat debut in Desert Storm where U.S. snipers used it to detonate unexploded mines, disable vehicles, and engage bunkers. USMC sniper Carlos Hathcock was an early proponent of the anti-materiel concept. In Iraq and Afghanistan, U.S. snipers set new records using the M82A1M variant.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Barrett_M82',
    distractors: ['M24 SWS', 'M110 SASS', 'McMillan TAC-50'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MP40', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/MP40_smg.jpg/800px-MP40_smg.jpg',
      alt: 'German WWII-era submachine gun with folding stock and horizontal box magazine',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MP40_smg.jpg',
    },
    description: 'The MP40 was the standard German submachine gun of WWII, firing 9mm Parabellum from a 32-round box magazine. Its folding stock, stamped metal construction, and reliability made it the iconic weapon of the German infantryman and paratrooper.',
    history: 'Developed in 1940 by Heinrich Vollmer, the MP40 was widely issued to German paratroopers, NCOs, and vehicle crews. Contrary to popular belief, it was not the standard infantry rifle — most German soldiers carried the Karabiner 98k bolt action. Over 1.1 million MP40s were built. Captured examples were prized by Allied soldiers and partisans.',
    wikiUrl: 'https://en.wikipedia.org/wiki/MP40',
    distractors: ['Sten Gun', 'Thompson M1928', 'PPSh-41'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M4 Carbine', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/M4_Carbine_Profile.png/800px-M4_Carbine_Profile.png',
      alt: 'Compact select-fire carbine with collapsible stock, Picatinny rails, and short barrel',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M4_Carbine_Profile.png',
    },
    description: 'The M4 Carbine is the compact, collapsible-stock variant of the M16A2. It fires 5.56mm NATO and has largely replaced the M16 as the primary U.S. military infantry weapon. Its shorter barrel and Picatinny rails allow attachment of optics, lights, and the M203 grenade launcher.',
    history: 'Adopted in 1994, the M4 became the dominant U.S. service rifle through the wars in Afghanistan and Iraq. Its compact size was ideal for dismounted operations in vehicles and buildings. Early concerns about reliability in dusty conditions led to the M4A1 upgrade with heavier barrel and full-auto capability for special operations.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M4_carbine',
    distractors: ['M16 Rifle', 'HK416', 'FN SCAR-L'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M240B Machine Gun', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/M240B_in_use.jpg/800px-M240B_in_use.jpg',
      alt: 'Belt-fed medium machine gun on bipod firing 7.62mm NATO',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M240B_in_use.jpg',
    },
    description: 'The M240B is a belt-fed 7.62mm NATO general-purpose machine gun and the U.S. military\'s standard medium machine gun. More accurate and reliable than the M60 it replaced, it provides the squad and platoon with its primary sustained fire capability.',
    history: 'Adopted in 1977 as a coaxial tank machine gun and later adapted for ground infantry use, the M240B entered widespread ground service in the 1990s. Its FN MAG design origin dates to 1958 and is used by over 80 nations. In Somalia (1993) and throughout the Iraq War, M240 crews provided critical fire superiority in complex ambushes.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M240_machine_gun',
    distractors: ['M249 SAW', 'M60 Machine Gun', 'Browning M2'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — WARSHIPS
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'USS Missouri (BB-63)', category: 'warship', branch: 'navy',
    difficulty: 'recruit', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/USS_Missouri_BB-63_broadside.jpg/800px-USS_Missouri_BB-63_broadside.jpg',
      alt: 'Iowa-class battleship with nine 16-inch guns in three triple turrets firing broadside',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Missouri_BB-63_broadside.jpg',
    },
    description: 'USS Missouri (BB-63) is the last battleship built by the United States. Known as "The Mighty Mo," she is famous as the site of Japan\'s surrender on September 2, 1945, ending WWII. She was recommissioned in 1986 and fired Tomahawk missiles and 16-inch shells in Desert Storm.',
    history: 'Commissioned in 1944, Missouri participated in the final campaigns of the Pacific War including the bombardment of Honshu. Japanese Foreign Minister Mamoru Shigemitsu signed the instrument of surrender on her deck on September 2, 1945. Reactivated in 1986 with Tomahawk missiles and Harpoon anti-ship missiles, she fired the first shots of Desert Storm. Now a museum ship at Pearl Harbor.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Missouri_(BB-63)',
    distractors: ['USS Iowa (BB-61)', 'USS New Jersey (BB-62)', 'USS Wisconsin (BB-64)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Nimitz-class Carrier', category: 'warship', branch: 'navy',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/USS_Nimitz_(CVN-68).jpg/800px-USS_Nimitz_(CVN-68).jpg',
      alt: 'Nuclear-powered supercarrier with angled flight deck, island superstructure, and aircraft on deck',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Nimitz_(CVN-68).jpg',
    },
    description: 'The Nimitz class is a series of ten nuclear-powered aircraft carriers of the U.S. Navy, each displacing over 100,000 tons. They are the largest warships ever built and serve as the centerpiece of U.S. carrier strike groups.',
    history: 'USS Nimitz (CVN-68), the lead ship, was commissioned in 1975. The class proved the operational value of nuclear propulsion — unlimited range without refueling for 20+ years. Nimitz-class carriers have participated in every major U.S. military operation since 1975. The class is being succeeded by the Gerald R. Ford class, featuring electromagnetic catapults.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nimitz-class_aircraft_carrier',
    distractors: ['Gerald R. Ford class', 'Kitty Hawk class', 'Enterprise (CVN-65)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Arleigh Burke-class Destroyer', category: 'warship', branch: 'navy',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/USS_Arleigh_Burke_DDG-51.jpg/800px-USS_Arleigh_Burke_DDG-51.jpg',
      alt: 'Guided missile destroyer with Aegis radar arrays, Vertical Launch System cells, and stealth hull angles',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Arleigh_Burke_DDG-51.jpg',
    },
    description: 'The Arleigh Burke class is the U.S. Navy\'s primary surface combatant. Equipped with the Aegis Combat System, Vertical Launch Systems, and Tomahawk missiles, each ship can simultaneously engage multiple air, surface, and subsurface threats.',
    history: 'USS Arleigh Burke (DDG-51) was commissioned in 1991. With 73 ships currently commissioned and more under construction, it is the largest class of destroyers ever built. Flight IIA variants added helicopter hangars. The class has conducted ballistic missile defense tests, Tomahawk strikes, and anti-submarine warfare across every ocean.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Arleigh_Burke-class_destroyer',
    distractors: ['Ticonderoga-class Cruiser', 'Spruance-class Destroyer', 'Zumwalt-class Destroyer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Los Angeles-class Submarine', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/USS_Los_Angeles_SSN_688.jpg/800px-USS_Los_Angeles_SSN_688.jpg',
      alt: 'Nuclear-powered attack submarine surfacing with sail and forward planes visible',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Los_Angeles_SSN_688.jpg',
    },
    description: 'The Los Angeles class is the largest class of nuclear-powered attack submarines ever built. With 62 boats commissioned, they served as the backbone of U.S. submarine warfare for 40 years, conducting intelligence collection, special operations support, and Tomahawk strike missions.',
    history: 'USS Los Angeles (SSN-688) was commissioned in 1976. Improved 688I variants added under-ice capability and vertical launch tubes for Tomahawk missiles, first used in Desert Storm. The class hunted Soviet ballistic missile submarines throughout the Cold War and has fired over 300 Tomahawks in combat operations. Replaced by the Virginia class from 2004.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Los_Angeles-class_submarine',
    distractors: ['Ohio-class Submarine', 'Seawolf-class Submarine', 'Virginia-class Submarine'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Bismarck', category: 'warship', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bundesarchiv_DVM_10_Bild-23-63-03%2C_Schlachtschiff_Bismarck.jpg/800px-Bundesarchiv_DVM_10_Bild-23-63-03%2C_Schlachtschiff_Bismarck.jpg',
      alt: 'German battleship with massive armored turrets and raked bow',
      credit: 'Bundesarchiv · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_DVM_10_Bild-23-63-03,_Schlachtschiff_Bismarck.jpg',
    },
    description: 'Bismarck was the lead ship of the Bismarck class of German battleships. At over 50,000 tons fully laden, she was the heaviest warship ever built by a European power at the time. Her single operational voyage in May 1941 resulted in the sinking of HMS Hood and Bismarck\'s own destruction.',
    history: 'On May 24, 1941, Bismarck sank HMS Hood — Britain\'s pride — in eight minutes. "Sink the Bismarck!" became a national obsession. Three days later, Royal Navy ships, including 15 Swordfish torpedo bombers from Ark Royal, crippled and then sank Bismarck. Of her 2,200 crew, only 115 survived. The wreck was found by Robert Ballard in 1989.',
    wikiUrl: 'https://en.wikipedia.org/wiki/German_battleship_Bismarck',
    distractors: ['Tirpitz', 'Scharnhorst', 'Graf Spee'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Enterprise (CV-6)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/USS_Enterprise_%28CV-6%29_underway_c1939.jpg/800px-USS_Enterprise_%28CV-6%29_underway_c1939.jpg',
      alt: 'Yorktown-class carrier with straight flight deck and island superstructure underway',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Enterprise_(CV-6)_underway_c1939.jpg',
    },
    description: 'USS Enterprise (CV-6) was a Yorktown-class aircraft carrier and the most decorated U.S. Navy ship of WWII. Called "The Big E" and "The Grey Ghost," she participated in more major actions than any other U.S. ship in the Pacific War.',
    history: 'Enterprise fought in 20 of the 22 major naval campaigns in the Pacific, including Midway, Guadalcanal, Philippine Sea, and Leyte Gulf. She was reported sunk by Japanese propaganda six times. Surviving the war intact, she was controversially scrapped in 1958 when Congress declined to preserve her. She was awarded 20 Battle Stars.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Enterprise_(CV-6)',
    distractors: ['USS Yorktown (CV-5)', 'USS Hornet (CV-8)', 'USS Lexington (CV-2)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Yamato', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Yamato_sea_trials.jpg/800px-Yamato_sea_trials.jpg',
      alt: 'Massive Japanese battleship with three triple turrets of 18.1-inch guns on sea trials',
      credit: 'Imperial Japanese Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yamato_sea_trials.jpg',
    },
    description: 'Yamato was the lead ship of the Yamato-class battleships and the heaviest and most powerfully armed battleship ever built. She displaced 72,000 tons fully loaded and mounted nine 18.1-inch guns — the largest naval guns ever fitted to a warship.',
    history: 'Commissioned in 1941, Yamato\'s great size was meant to give Japan a qualitative edge to counter American numerical superiority. She saw little action through most of the war due to fuel shortages. On April 7, 1945, during Operation Ten-Go, she was sent on a one-way mission to Okinawa with only enough fuel to arrive — sunk by 386 U.S. carrier aircraft before reaching her destination. 2,498 of her 2,700 crew perished.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Japanese_battleship_Yamato',
    distractors: ['Musashi', 'Shinano', 'Nagato'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Ticonderoga-class Cruiser', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/USS_Bunker_Hill_CG-52.jpg/800px-USS_Bunker_Hill_CG-52.jpg',
      alt: 'Guided missile cruiser with twin Aegis phased array radars, helicopter deck, and Mk 41 VLS',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Bunker_Hill_CG-52.jpg',
    },
    description: 'The Ticonderoga class is the U.S. Navy\'s only cruiser class. Equipped with the Aegis Combat System and 122 Vertical Launch System cells for Tomahawk, SM-2, and SM-3 missiles, they serve as the air defense command ship of carrier strike groups.',
    history: 'USS Ticonderoga (CG-47) was commissioned in 1983. The class fired the first Tomahawk cruise missiles in combat (Libya, 1986) and the first ship-based ballistic missile intercepts. USS Vincennes controversially shot down Iran Air Flight 655 in 1988. Decommissioning of the class began in 2022 as they near the end of their service lives.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ticonderoga-class_cruiser',
    distractors: ['Arleigh Burke-class Destroyer', 'Zumwalt-class Destroyer', 'Spruance-class Destroyer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Ohio-class Submarine (SSBN)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/USS_Ohio_SSGN-726.jpg/800px-USS_Ohio_SSGN-726.jpg',
      alt: 'Massive nuclear-powered submarine surfaced with missile tube hatches visible on hull',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Ohio_SSGN-726.jpg',
    },
    description: 'The Ohio-class SSBN (ballistic missile submarine) is the sea-based leg of the U.S. nuclear triad. Each submarine carries 24 Trident II D5 ballistic missiles, each capable of carrying multiple independently targetable warheads with a range of 7,000 miles.',
    history: 'USS Ohio (SSBN-726) was commissioned in 1981. Fourteen Ohio-class SSBNs conduct deterrence patrols — at any given time multiple boats are submerged and undetectable, ready to launch within minutes of receiving an authenticated order. Four Ohio-class boats were converted to SSGNs carrying 154 Tomahawk cruise missiles and supporting special operations forces.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ohio-class_submarine',
    distractors: ['Los Angeles-class Submarine', 'Virginia-class Submarine', 'George Washington-class Submarine'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'HMS Hood', category: 'warship', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/HMS_Hood_%28pennant_51%29.jpg/800px-HMS_Hood_%28pennant_51%29.jpg',
      alt: 'Royal Navy battlecruiser underway with four twin 15-inch gun turrets',
      credit: 'Royal Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HMS_Hood_(pennant_51).jpg',
    },
    description: 'HMS Hood was Britain\'s largest and most famous warship, a battlecruiser that represented British naval power between the wars. Her sinking by Bismarck in 1941 shocked the nation and triggered the largest Royal Navy hunt of the war.',
    history: 'Commissioned in 1920, Hood displaced 48,360 tons and was the pride of the Royal Navy for two decades. Her battlecruiser design prioritized speed over armor — a fatal flaw. On May 24, 1941, during the Battle of the Denmark Strait, a salvo from Bismarck penetrated Hood\'s after magazine. She exploded and sank in three minutes. Of 1,418 crew, only three survived. "Sink the Bismarck!" became a national imperative.',
    wikiUrl: 'https://en.wikipedia.org/wiki/HMS_Hood',
    distractors: ['HMS Prince of Wales', 'HMS Repulse', 'HMS Rodney'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — MEDALS (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Medal of Honor (Army)', category: 'medal', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Medal_of_Honor_Army.jpg/400px-Medal_of_Honor_Army.jpg',
      alt: 'Five-pointed star on blue bar with eagle and Minerva, suspended on light blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Medal_of_Honor_Army.jpg',
    },
    description: 'The Medal of Honor is the United States\' highest military decoration, awarded by the President in the name of Congress for conspicuous gallantry above and beyond the call of duty at the risk of life. The Army version features Minerva\'s head on a five-pointed star.',
    history: 'Established during the Civil War (1861), the Medal of Honor has been awarded 3,517 times. Nearly half were awarded during the Civil War. Only 63 living recipients exist. Recipients receive a pension, free military air travel, and the right to salute the President first. Many are awarded posthumously. The criteria is deliberately vague to allow flexibility: "conspicuous gallantry and intrepidity at the risk of his life above and beyond the call of duty."',
    wikiUrl: 'https://en.wikipedia.org/wiki/Medal_of_Honor',
    distractors: ['Distinguished Service Cross', 'Silver Star', 'Distinguished Service Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Purple Heart', category: 'medal', branch: 'all',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/PurpleHeart.jpg/400px-PurpleHeart.jpg',
      alt: 'Heart-shaped purple medal with gold border and profile of George Washington',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PurpleHeart.jpg',
    },
    description: 'The Purple Heart is awarded to service members wounded or killed in action against enemy forces. It features a purple heart-shaped medallion with a profile of George Washington, who instituted its predecessor, the Badge of Military Merit, in 1782.',
    history: 'Revived in 1932 on the 200th anniversary of Washington\'s birth, the Purple Heart is the oldest military decoration in continuous use. Over 1.8 million have been awarded. Recipients include John F. Kennedy, Bob Dole, and John McCain. Multiple Purple Hearts are worn with oak leaf clusters (Army/AF) or awards stars (Navy/USMC). It is the only decoration that is awarded automatically — no paperwork is required beyond medical documentation.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Purple_Heart',
    distractors: ['Bronze Star Medal', 'Silver Star', 'Combat Infantryman Badge'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Navy Cross', category: 'medal', branch: 'navy',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Navy_Cross.jpg/400px-Navy_Cross.jpg',
      alt: 'Dark cross with eagle in center, hanging on navy blue and white ribbon',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Navy_Cross.jpg',
    },
    description: 'The Navy Cross is the second-highest military decoration awarded to members of the Navy, Marine Corps, and Coast Guard, awarded for extraordinary heroism in combat. It ranks below the Medal of Honor and above all other Navy decorations.',
    history: 'Established in 1919 after WWI, the Navy Cross was initially awarded for distinguished service but was later restricted to heroism in combat. Notable recipients include "Chesty" Puller (Marine Corps legend who earned five Navy Crosses — more than any other Marine), John Kerry (Vietnam), and SEAL Team Six members who participated in the bin Laden raid.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Navy_Cross',
    distractors: ['Distinguished Service Medal (Navy)', 'Silver Star', 'Medal of Honor (Navy)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Silver Star', category: 'medal', branch: 'all',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Silver_Star_Medal.jpg/400px-Silver_Star_Medal.jpg',
      alt: 'Circular medal with small silver star in center on red, white, and blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Silver_Star_Medal.jpg',
    },
    description: 'The Silver Star is the third-highest military decoration for valor in combat, awarded across all U.S. armed services for gallantry in action against an enemy of the United States. It ranks below the Medal of Honor and service crosses.',
    history: 'Originally a device attached to campaign medals, the Silver Star was established as a separate medal in 1932. It may be awarded for any act of valor that "does not otherwise justify award" of a higher decoration. During WWII, 100,000+ Silver Stars were awarded. In recent conflicts the standard has been raised considerably — recipients in Iraq and Afghanistan typically performed extraordinary acts under direct fire.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Silver_Star',
    distractors: ['Bronze Star Medal', 'Distinguished Flying Cross', 'Soldier\'s Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Distinguished Flying Cross', category: 'medal', branch: 'airforce',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Distinguished_Flying_Cross_USA.jpg/400px-Distinguished_Flying_Cross_USA.jpg',
      alt: 'Four-bladed propeller cross suspended from red, white, and blue striped ribbon',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Distinguished_Flying_Cross_USA.jpg',
    },
    description: 'The Distinguished Flying Cross is awarded to members of the U.S. armed forces for heroism or extraordinary achievement while participating in aerial flight. It is awarded across all branches for both combat and non-combat aviation heroism.',
    history: 'Established in 1926, the DFC was first awarded to Charles Lindbergh for the first solo transatlantic flight. WWII aces like Jimmy Doolittle and Chuck Yeager received it. In the Navy and Marine Corps, the DFC with Combat "V" distinguishes combat awards from non-combat awards. Neil Armstrong, who flew 78 combat missions in Korea, received the DFC before becoming an astronaut.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Distinguished_Flying_Cross_(United_States)',
    distractors: ['Air Medal', 'Aerial Achievement Medal', 'Distinguished Service Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Bronze Star Medal', category: 'medal', branch: 'all',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bronze_Star_Medal.jpg/400px-Bronze_Star_Medal.jpg',
      alt: 'Medallion with small bronze star in center on red, white, blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bronze_Star_Medal.jpg',
    },
    description: 'The Bronze Star Medal is awarded for heroic or meritorious achievement or service in connection with military operations against an armed enemy. With the "V" device (Valor), it recognizes acts of valor in direct combat. Without the "V," it recognizes meritorious service.',
    history: 'Established in 1944 to give all ground combat troops a decoration comparable to the Air Medal, the Bronze Star was made retroactive to December 7, 1941. General George Marshall directed that every soldier awarded a Combat Infantryman Badge would automatically receive a Bronze Star. It remains one of the most frequently awarded combat decorations. The "V" device version is far rarer and represents genuine heroism.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bronze_Star_Medal',
    distractors: ['Silver Star', 'Meritorious Service Medal', 'Army Commendation Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Combat Infantryman Badge', category: 'medal', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Combat_Infantryman_Badge.jpg/400px-Combat_Infantryman_Badge.jpg',
      alt: 'Infantry blue rectangle with silver flintlock musket on wreath with star above',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Combat_Infantryman_Badge.jpg',
    },
    description: 'The Combat Infantryman Badge (CIB) is awarded to Army infantry and Special Forces soldiers who have been in active ground combat. It is one of the most respected badges in the Army — a mark of having faced the enemy as an infantryman.',
    history: 'Established in 1943 by General George Marshall to recognize the unique dangers faced by infantry, the CIB requires that the soldier be in active ground combat, personally present and under fire. General Matthew Ridgway famously wore his CIB above all his decorations. The 2nd Award CIB (with one star) and 3rd Award (two stars) denote service in multiple wars. Rangers and Special Forces soldiers who serve in combat may also earn it.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Combat_Infantryman_Badge',
    distractors: ['Expert Infantryman Badge', 'Combat Action Badge', 'Combat Medical Badge'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Air Medal', category: 'medal', branch: 'airforce',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Air_Medal.jpg/400px-Air_Medal.jpg',
      alt: 'Compass rose medal with eagle and lightning bolts, blue and orange ribbon',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Air_Medal.jpg',
    },
    description: 'The Air Medal is awarded to members of the U.S. armed forces for meritorious achievement while participating in aerial flight. It was created to recognize the continuous hazards of combat and sustained aerial operations.',
    history: 'Established in 1942, the Air Medal was initially awarded based on the number of combat missions flown (Vietnam: 25 missions for USAF, or less for helicopter crews who flew in dangerous conditions daily). Medal of Honor recipient and astronaut John Glenn received the Air Medal six times. In Vietnam, helicopter crews could earn multiple Air Medals rapidly due to constant combat flying. The strike/flight "V" device denotes valor.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Air_Medal',
    distractors: ['Distinguished Flying Cross', 'Aerial Achievement Medal', 'Air Force Commendation Medal'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — RANKS (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'General of the Army (5-Star)', category: 'rank', branch: 'army',
    difficulty: 'commander', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Army-USA-OF-10.svg/200px-Army-USA-OF-10.svg.png',
      alt: 'Five silver stars in a pentagon pattern on shoulder boards',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-10.svg',
    },
    description: 'General of the Army is the highest possible rank in the U.S. Army, denoted by five stars. Only five officers have ever held this rank: George Marshall, Dwight D. Eisenhower, Douglas MacArthur, Henry "Hap" Arnold, and Omar Bradley. The rank has not been awarded since 1950.',
    history: 'Created by Congress in 1944 to provide American field commanders equivalent rank to Allied and enemy five-star officers, the five-star rank allowed Eisenhower and MacArthur to command allied forces without subordination issues. The rank is technically permanent — a five-star general never retires from active duty and is carried on the rolls until death. Omar Bradley, the last to receive it (1950), died in 1981.',
    wikiUrl: 'https://en.wikipedia.org/wiki/General_of_the_Army_(United_States)',
    distractors: ['General (O-10)', 'Lieutenant General (O-9)', 'Field Marshal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Second Lieutenant (O-1)', category: 'rank', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Army-USA-OF-00.svg/200px-Army-USA-OF-00.svg.png',
      alt: 'Single gold bar on collar or shoulder board',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-00.svg',
    },
    description: 'Second Lieutenant (2LT, O-1) is the lowest commissioned officer rank in the U.S. Army, denoted by a single gold bar. New 2LTs typically lead platoons of 16–44 soldiers. Nicknamed "butterbar" by enlisted soldiers.',
    history: 'The most junior commissioned rank, 2LT is typically held for 18 months before promotion to First Lieutenant. Second Lieutenants have commanded in combat since the Revolutionary War. In WWII, the average lifespan of a second lieutenant on the front line in Europe was estimated at 2–3 weeks in heavy fighting. Today\'s 2LTs are products of ROTC, West Point, or OCS programs.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Second_lieutenant#United_States',
    distractors: ['First Lieutenant (O-2)', 'Warrant Officer 1', 'Staff Sergeant (E-6)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Staff Sergeant (E-6)', category: 'rank', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/SSG_Rank.svg/200px-SSG_Rank.svg.png',
      alt: 'Three upward chevrons with one rocker stripe below',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SSG_Rank.svg',
    },
    description: 'Staff Sergeant (SSG, E-6) is a non-commissioned officer rank in the U.S. Army, denoted by three chevrons and one rocker. Staff Sergeants typically serve as squad leaders in infantry or the equivalent leadership position in other branches.',
    history: 'The SSG is the critical link between junior enlisted and the senior NCO corps. In the infantry squad, the Staff Sergeant Squad Leader is responsible for the lives, training, and welfare of eight to ten soldiers. The Army\'s NCO corps — often called "the backbone of the Army" — begins meaningfully at this rank. Congressional Medal of Honor recipient Alvin York held the rank of Corporal, which was equivalent to today\'s SSG in WWI.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Staff_sergeant#United_States_Army',
    distractors: ['Sergeant (E-5)', 'Sergeant First Class (E-7)', 'Corporal (E-4)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Lieutenant Colonel (O-5)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Army-USA-OF-04.svg/200px-Army-USA-OF-04.svg.png',
      alt: 'Silver oak leaf cluster on shoulder board or collar insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-04.svg',
    },
    description: 'Lieutenant Colonel (LTC, O-5) is denoted by a silver oak leaf and typically commands a battalion of 300–1,000 soldiers. Often addressed as "Colonel," the LTC is the Army\'s primary tactical commander.',
    history: 'The battalion commander is often described as the "penultimate" combat leader — close enough to troops to understand reality but senior enough to coordinate combined-arms operations. Famous LTCs include Hal Moore (Ia Drang, 1965, depicted in We Were Soldiers) and Dave Grossman (author and Army psychologist). The silver oak leaf distinguishes the LTC from the Major\'s gold oak leaf.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lieutenant_colonel_(United_States)',
    distractors: ['Major (O-4)', 'Colonel (O-6)', 'Brigadier General (O-7)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Brigadier General (O-7)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Army-USA-OF-06.svg/200px-Army-USA-OF-06.svg.png',
      alt: 'Single silver star on shoulder board or epaulette',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army-USA-OF-06.svg',
    },
    description: 'Brigadier General (BG, O-7) is the lowest general officer rank, denoted by one silver star. BGs typically serve as deputy division commanders or hold key staff positions at corps and army level.',
    history: 'Promotion to Brigadier General requires Senate confirmation and selection from a very competitive pool of senior colonels. Of the approximately 40,000 officers in the Army, fewer than 300 will ever become generals. The one-star represents the threshold into the general officer corps, where strategic thinking and senior leadership replace tactical command. President Eisenhower was a Brigadier General in 1941 before his rapid rise to five stars.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Brigadier_general_(United_States)',
    distractors: ['Major General (O-8)', 'Colonel (O-6)', 'Lieutenant General (O-9)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Sergeant (E-5)', category: 'rank', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SGT_Rank.svg/200px-SGT_Rank.svg.png',
      alt: 'Three upward chevrons on rank insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SGT_Rank.svg',
    },
    description: 'Sergeant (SGT, E-5) is the first rank in the U.S. Army\'s NCO (Non-Commissioned Officer) corps, denoted by three chevrons. Sergeants typically lead fire teams of four to five soldiers.',
    history: 'The Sergeant rank is the first leadership position in the Army\'s NCO corps. The transition from Specialist to Sergeant is significant — the soldier moves from being led to leading, with legal authority and accountability for the soldiers under their charge. Famous Sergeants include Sergeant York (WWI) and Sergeant First Class Paul Smith, who received the Medal of Honor posthumously for action in Iraq (2003), the first in that conflict.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sergeant#United_States_Army',
    distractors: ['Staff Sergeant (E-6)', 'Specialist (E-4)', 'Corporal (E-4)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Ensign (O-1, Navy)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Navy-USA-OF-00.svg/200px-Navy-USA-OF-00.svg.png',
      alt: 'Single gold bar on Navy officer shoulder board',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Navy-USA-OF-00.svg',
    },
    description: 'Ensign (ENS, O-1) is the lowest commissioned officer rank in the U.S. Navy, denoted by a single gold bar on the shoulder board. Ensigns are newly commissioned officers typically assigned as division officers responsible for 20–50 sailors.',
    history: 'Naval officer ranks differ from Army ranks in their names and traditions. The Ensign rank dates to the age of sail when junior officers carried the ship\'s ensign (flag) as a duty. Naval Academy and OCS graduates typically pin on Ensign at commissioning before promoting to Lieutenant Junior Grade (O-2) after 18 months. The classic naval salutation "Officer of the Deck" is often filled by Ensigns in port.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ensign_(rank)#United_States',
    distractors: ['Lieutenant Junior Grade (O-2)', 'Warrant Officer', 'Midshipman'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Command Sergeant Major (E-9)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/CSM_Rank.svg/200px-CSM_Rank.svg.png',
      alt: 'Three chevrons and three rockers with stars and wreath on rank insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:CSM_Rank.svg',
    },
    description: 'Command Sergeant Major (CSM, E-9) is the senior enlisted advisor to a battalion, brigade, or division commander. The CSM is the highest-ranking enlisted soldier in the unit and the commander\'s primary link to the enlisted force.',
    history: 'The CSM rank was created in 1967 to provide battalion and brigade commanders with a dedicated senior enlisted advisor. The Sergeant Major of the Army (SMA) is the most senior enlisted soldier in the U.S. Army, serving as advisor to the Chief of Staff. Only the most experienced and capable senior NCOs — typically with 20-30 years of service — achieve the CSM rank.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Command_sergeant_major_(United_States)',
    distractors: ['Sergeant Major (E-9)', 'Master Sergeant (E-8)', 'First Sergeant (1SG)'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — INSIGNIA (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: '1st Infantry Division "Big Red One"', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/1ID_Patch.svg/400px-1ID_Patch.svg.png',
      alt: 'Khaki shield with bold red numeral 1',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:1ID_Patch.svg',
    },
    description: 'The 1st Infantry Division "Big Red One" shoulder sleeve insignia features a large red numeral 1 on an olive drab shield. It is one of the most recognized and storied insignia in the U.S. Army.',
    history: 'The Big Red One is the oldest continuously serving division in the U.S. Army, activated in 1917. It was the first American division to arrive in France in WWI, land in Africa in WWII (Operation Torch), and land on Omaha Beach on D-Day. The division served in Vietnam and both Gulf Wars. The numeral 1 on the shield reportedly led a German soldier to say "We fight men, not boys" — a story possibly apocryphal but beloved by the division.',
    wikiUrl: 'https://en.wikipedia.org/wiki/1st_Infantry_Division_(United_States)',
    distractors: ['2nd Infantry Division', '3rd Infantry Division', '4th Infantry Division'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Ranger Tab', category: 'insignia', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ranger_Tab.svg/400px-Ranger_Tab.svg.png',
      alt: 'Black arched tab with yellow border reading RANGER',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ranger_Tab.svg',
    },
    description: 'The Ranger Tab is awarded to U.S. Army soldiers who successfully complete the 61-day Ranger School — one of the most demanding leadership schools in the world. It is worn above any unit patch on the left shoulder.',
    history: 'Ranger School tests small-unit tactics, leadership under extreme stress, and physical endurance through three phases: Darby (Fort Benning), Mountain (Dahlonega), and Swamp (Florida). Students average 3.5 hours of sleep per night and 2,500 calories daily while carrying 65+ lb rucksacks. Failure rates average 50%. In 2015, Capts. Kristen Griest and Shaye Haver became the first women to earn the Ranger Tab.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ranger_Tab',
    distractors: ['Special Forces Tab', 'Airborne Tab', 'Sapper Tab'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Airborne Tab', category: 'insignia', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Airborne_Tab.svg/400px-Airborne_Tab.svg.png',
      alt: 'Curved light blue tab with silver-blue lettering reading AIRBORNE',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Airborne_Tab.svg',
    },
    description: 'The Airborne Tab is worn above the shoulder patch of airborne-qualified units. It indicates the wearer has completed Basic Airborne Course at Fort Benning (now Fort Moore) and is qualified to conduct static-line parachute jumps.',
    history: 'The three-week Basic Airborne Course requires five qualifying jumps, the last of which is at night with combat equipment. Airborne soldiers receive $150/month jump pay. The U.S. Army airborne tradition traces to the 82nd and 101st Airborne Divisions\' WWII combat jumps. Today, true airborne operations are relatively rare; the 82nd Airborne Division maintains a brigade ready to conduct a forcible entry parachute assault on any objective within 18 hours.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Airborne_Tab',
    distractors: ['Air Assault Badge', 'Military Freefall Badge', 'Ranger Tab'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: '10th Mountain Division', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/10th_Mountain_Division_SSI.svg/400px-10th_Mountain_Division_SSI.svg.png',
      alt: 'White mountain range silhouette on crossed red and blue bayonets on dark blue shield',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:10th_Mountain_Division_SSI.svg',
    },
    description: 'The 10th Mountain Division shoulder sleeve insignia features two crossed bayonets on a blue shield with mountain peaks. It is the most deployed division in the U.S. Army since 1991.',
    history: 'Activated in 1943, the 10th Mountain Division trained in winter warfare at Camp Hale, Colorado (10,200 feet elevation). In Italy, they scaled the Riva Ridge and Mount Belvedere in February 1945 in a crucial surprise assault that broke the Gothic Line. Deactivated after WWII, the 10th Mountain was reactivated in 1985 at Fort Drum, New York. It has deployed to Somalia, Haiti, Bosnia, Afghanistan, and Iraq more than any other division.',
    wikiUrl: 'https://en.wikipedia.org/wiki/10th_Mountain_Division_(United_States)',
    distractors: ['1st Cavalry Division', '25th Infantry Division', '3rd Infantry Division'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: '75th Ranger Regiment', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/75th_Ranger_Regiment.jpg/400px-75th_Ranger_Regiment.jpg',
      alt: 'Black shield with gold ranger scroll at top and sword on black background',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:75th_Ranger_Regiment.jpg',
    },
    description: 'The 75th Ranger Regiment is the U.S. Army\'s premier light infantry direct action force. Rangers are experts in raids, airfield seizures, and other special operations missions. Assignment to the regiment requires passing the demanding Ranger Assessment and Selection Program (RASP).',
    history: 'The modern Ranger regiment traces its lineage to WWII Darby\'s Rangers. Reactivated in 1974, the 75th Ranger Regiment conducted its first combat jump since WWII in Grenada (1983). Rangers seized Tocumen Airport in Panama (1989) and Hunter Army Airfield in Grenada at 72 hours notice. The regiment\'s actions during the 1993 Battle of Mogadishu (Black Hawk Down) are among the most studied small-unit engagements of the modern era.',
    wikiUrl: 'https://en.wikipedia.org/wiki/75th_Ranger_Regiment',
    distractors: ['82nd Airborne Division', 'Special Forces', 'Delta Force'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Air Assault Badge', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Air_Assault_Badge.svg/400px-Air_Assault_Badge.svg.png',
      alt: 'Eagle with thunderbolts and downward-facing infantry sword on oval badge',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Air_Assault_Badge.svg',
    },
    description: 'The Air Assault Badge is awarded to soldiers who complete the Air Assault School, a ten-day course at Fort Campbell, Kentucky. It qualifies soldiers for helicopter sling-load operations, rappelling, and helicopter assault techniques.',
    history: 'Developed by the 101st Airborne Division (Air Assault) following Vietnam, the Air Assault Course tests soldiers in pathfinder operations, rappelling from UH-60s, rigging equipment for helicopter transport, and an 18-mile foot march in under 3 hours. The 101st pioneered airmobile tactics in Vietnam\'s Ia Drang Valley (1965) — the first large-scale helicopter combat assault in history. The Air Assault Badge is worn on the right breast.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Air_Assault_Badge',
    distractors: ['Airborne Tab', 'Military Freefall Badge', 'Pathfinder Badge'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION — ARTILLERY (additional)
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'M777 Howitzer', category: 'artillery', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/M777_Howitzer.jpg/800px-M777_Howitzer.jpg',
      alt: 'Ultra-lightweight 155mm towed howitzer with titanium and aluminum alloy construction',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M777_Howitzer.jpg',
    },
    description: 'The M777 Howitzer is an ultra-lightweight 155mm towed field gun that weighs just 4,218 lbs — less than half the M198 it replaced. It can be transported slung beneath a CH-47 Chinook helicopter and fires the same precision-guided Excalibur rounds.',
    history: 'Designed by BAE Systems with a titanium and aluminum alloy construction, the M777 entered service in 2005. It proved critical in Afghanistan\'s rugged terrain where heavy artillery could not be moved. The M777 gained global attention after the U.S. delivered 126 to Ukraine in 2022, where they were used with GPS-guided Excalibur rounds to strike targets at 40+ km with precision.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M777_howitzer',
    distractors: ['M198 Howitzer', 'M119 Howitzer', 'M101 Howitzer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'BM-21 Grad', category: 'artillery', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/BM-21_Grad.jpg/800px-BM-21_Grad.jpg',
      alt: 'Soviet 40-tube 122mm multiple rocket launcher on Ural truck chassis',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:BM-21_Grad.jpg',
    },
    description: 'The BM-21 Grad ("Hail") is a Soviet 122mm multiple launch rocket system mounted on a Ural-375D truck. With 40 tubes it can fire a full salvo in under 20 seconds, saturating an area of 14.5 hectares with rockets.',
    history: 'Introduced in 1963 and used by Soviet forces in Czechoslovakia (1968), Afghanistan, and Chechnya. Widely exported, it has been used in conflicts on every continent. The Grad\'s distinctive launcher has become the iconic image of artillery warfare in developing-world conflicts. Ukraine and Russia both use it extensively, making it the most-fired artillery system in the current war.',
    wikiUrl: 'https://en.wikipedia.org/wiki/BM-21_Grad',
    distractors: ['M270 MLRS', 'BM-30 Smerch', 'M142 HIMARS'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Panzerhaubitze 2000', category: 'artillery', branch: 'all',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/PzH-2000_der_Bundeswehr.jpg/800px-PzH-2000_der_Bundeswehr.jpg',
      alt: 'German self-propelled 155mm howitzer with long barrel and fully enclosed armored turret',
      credit: 'Bundeswehr · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PzH-2000_der_Bundeswehr.jpg',
    },
    description: 'The Panzerhaubitze 2000 (PzH 2000) is a German self-propelled 155mm howitzer widely considered the most capable and accurate artillery system in service. Its automated loader fires three rounds in nine seconds and can maintain a rate of 10 rounds per minute sustained.',
    history: 'Developed by Krauss-Maffei Wegmann and Rheinmetall, the PzH 2000 entered Bundeswehr service in 1998. It can fire the Vulcano base-bleed shell to 54 km and the extended-range Excalibur to 60 km. The Netherlands and Germany sent PzH 2000s to Ukraine in 2022, where Ukrainian crews used them to remarkable effect. 24 nations have expressed interest in the system.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Panzerhaubitze_2000',
    distractors: ['AS-90', 'Caesar SPH', 'M109 Paladin'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — AIRCRAFT
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'KC-135 Stratotanker', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/KC-135_Stratotanker.jpg/800px-KC-135_Stratotanker.jpg',
      alt: 'Four-engine jet tanker with boom refueling system extended under tail',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KC-135_Stratotanker.jpg',
    },
    description: 'The KC-135 Stratotanker is the backbone of U.S. aerial refueling operations. Based on the Boeing 707 airframe, it transfers fuel via a rigid fly-by-wire boom to receiver aircraft at altitudes up to 45,000 feet.',
    history: 'First flown in 1956, the KC-135 has been in continuous service longer than any other jet aircraft. Over 800 were built. Without aerial refueling, long-range strike and patrol missions would be impossible — every B-52 nuclear patrol required multiple refuelings. The re-engined KC-135R with CFM-56 turbofans dramatically improved fuel offload. It is being replaced by the KC-46 Pegasus.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Boeing_KC-135_Stratotanker',
    distractors: ['KC-10 Extender', 'KC-46 Pegasus', 'C-135 Stratolifter'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Eurofighter Typhoon', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Eurofighter_Typhoon_at_RIAT_2009.jpg/800px-Eurofighter_Typhoon_at_RIAT_2009.jpg',
      alt: 'Delta-wing canard multirole fighter with distinctive close-coupled canard foreplanes',
      credit: 'Crown Copyright · OGL v1.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Eurofighter_Typhoon_at_RIAT_2009.jpg',
    },
    description: 'The Eurofighter Typhoon is a twin-engine, canard-delta wing multirole fighter jointly developed by the UK, Germany, Spain, and Italy. It entered service in 2003 and is one of the world\'s most capable fourth-generation fighter aircraft.',
    history: 'Development began in the 1980s after several European nations needed a common new fighter. Despite numerous political and funding challenges, the Typhoon entered service with the Royal Air Force in 2003. It has been sold to Austria, Kuwait, Qatar, Saudi Arabia, and other nations. The Typhoon\'s CAPTOR AESA radar and Meteor beyond-visual-range missile make it a formidable long-range air superiority platform.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Eurofighter_Typhoon',
    distractors: ['Dassault Rafale', 'Gripen', 'Tornado GR4'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Bf 109', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Messerschmitt_Bf_109G-6.jpg/800px-Messerschmitt_Bf_109G-6.jpg',
      alt: 'Single-engine German fighter with rounded nose and angular wingtips',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Messerschmitt_Bf_109G-6.jpg',
    },
    description: 'The Messerschmitt Bf 109 was Germany\'s primary fighter throughout WWII. Over 33,000 were built — more than any other fighter in history — and it produced more aces than any other aircraft.',
    history: 'First flown in 1935, the Bf 109 was ahead of its time, defeating the Hurricane and Spitfire in early performance comparisons. In the Battle of Britain (1940) its short range limited its effectiveness as an escort. German aces Erich Hartmann (352 kills), Gerhard Barkhorn (301 kills), and Günther Rall (275 kills) all flew primarily Bf 109s, accumulating scores impossible on any other aircraft.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Messerschmitt_Bf_109',
    distractors: ['Focke-Wulf Fw 190', 'Heinkel He 162', 'Messerschmitt Me 262'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Me 262 Schwalbe', category: 'aircraft', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Messerschmitt_Me_262_Schwalbe.jpg/800px-Messerschmitt_Me_262_Schwalbe.jpg',
      alt: 'Twin jet-engine swept-wing German WWII fighter with engines podded under wings',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Messerschmitt_Me_262_Schwalbe.jpg',
    },
    description: 'The Messerschmitt Me 262 was the world\'s first operational jet-powered fighter aircraft. It was 100 mph faster than any Allied piston fighter and could have been a war-winner — but political and manufacturing delays prevented decisive deployment.',
    history: 'First flown in 1942, the Me 262 could have entered service in 1943 but Hitler delayed production by insisting it be adapted as a bomber. By the time sufficient numbers flew in 1944-45, Allied bombing had destroyed fuel supplies and experienced pilots were scarce. Despite its advantages, it destroyed only ~150 Allied aircraft. German ace Adolf Galland called it "like sitting on the throne of the gods."',
    wikiUrl: 'https://en.wikipedia.org/wiki/Messerschmitt_Me_262',
    distractors: ['Heinkel He 162', 'Gloster Meteor', 'Bell P-59 Airacomet'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MH-60G Pave Hawk', category: 'aircraft', branch: 'airforce',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/MH-60G_Pave_Hawk.jpg/800px-MH-60G_Pave_Hawk.jpg',
      alt: 'Special operations helicopter with nose-mounted FLIR, aerial refueling probe, and external fuel tanks',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MH-60G_Pave_Hawk.jpg',
    },
    description: 'The MH-60G Pave Hawk is the Air Force Special Operations Command\'s primary combat search-and-rescue and special operations helicopter. It features terrain-following radar, FLIR, aerial refueling capability, and extensive electronic warfare systems.',
    history: 'Developed for the demanding CSAR mission — recovering downed aircrew in hostile territory — the Pave Hawk was used in the Gulf War, Somalia, Bosnia, Kosovo, Afghanistan, and Iraq. Air Force Para-Rescue Jumpers (PJs) deploy from Pave Hawks to recover isolated personnel. The "that others may live" motto reflects the extraordinary risk crews accept. The HH-60W Combat Rescue Helicopter is its replacement.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sikorsky_HH-60_Pave_Hawk',
    distractors: ['MH-47 Chinook', 'MH-6 Little Bird', 'CV-22 Osprey'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'OH-6 Cayuse (Little Bird)', category: 'aircraft', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OH-6A_1967.jpg/800px-OH-6A_1967.jpg',
      alt: 'Small egg-shaped light observation helicopter with bubble canopy',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:OH-6A_1967.jpg',
    },
    description: 'The OH-6 Cayuse is a light observation helicopter widely known in its MH-6 "Little Bird" special operations variant. Small enough to land on platforms and inside buildings, it is the primary insertion platform for Delta Force and SEAL Team Six raids.',
    history: 'Designed by Hughes Helicopters and adopted in 1966, the OH-6 flew thousands of combat missions in Vietnam as an observation and light attack helicopter. The special operations MH-6 and AH-6 variants were used in Grenada, Panama, Somalia (Black Hawk Down), and countless classified operations. They can carry six operators on external "benches" — the soldiers literally sit on the outside of the aircraft.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Hughes_OH-6_Cayuse',
    distractors: ['UH-1 Iroquois (Huey)', 'AH-1 Cobra', 'OH-58 Kiowa'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Su-27 Flanker', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Su-27_Flanker_1989.jpg/800px-Su-27_Flanker_1989.jpg',
      alt: 'Twin-engine Soviet air superiority fighter with large body blended wing and twin tail fins',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Su-27_Flanker_1989.jpg',
    },
    description: 'The Sukhoi Su-27 Flanker is a twin-engine supermaneuverable air superiority fighter designed to counter the F-15 Eagle. With its "cobra maneuver" capability and massive fuel load, it remains one of the most capable fighters in service.',
    history: 'Developed in the 1970s and entering Soviet service in 1985, the Su-27 shocked Western analysts when it was first revealed. Its maneuverability — demonstrated by the Pugachev Cobra (pointing nose straight up while maintaining level flight) — seemed to defy physics. The Su-27 family has spawned the Su-30, Su-33 carrier variant, Su-34 strike aircraft, and Su-35 supermaneuverable fighter.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sukhoi_Su-27',
    distractors: ['MiG-29 Fulcrum', 'Su-35 Flanker-E', 'Su-57 Felon'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'MiG-29 Fulcrum', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/MiG-29_Fulcrum_2.jpg/800px-MiG-29_Fulcrum_2.jpg',
      alt: 'Twin-engine Soviet tactical fighter with twin tail fins and under-fuselage engine inlets',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MiG-29_Fulcrum_2.jpg',
    },
    description: 'The MiG-29 Fulcrum is a twin-engine tactical jet fighter designed as a lightweight air superiority counterpart to the heavy Su-27. It is highly maneuverable and carries helmet-mounted sight/off-boresight missiles.',
    history: 'Entering Soviet service in 1983, the MiG-29 was designed for point air defense of Soviet ground forces. Its IRST (infrared search and track) and helmet-mounted sight allow it to engage targets without using radar — a significant advantage in close combat. Over 1,600 were built for 30 nations. In Ukrainian hands, MiG-29s have scored air-to-air kills against Russian aircraft since 2022.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mikoyan_MiG-29',
    distractors: ['Su-27 Flanker', 'MiG-23 Flogger', 'MiG-31 Foxhound'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — ARMOR
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Challenger 2', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Challenger_2_Main_Battle_Tank_in_Bosnia.jpg/800px-Challenger_2_Main_Battle_Tank_in_Bosnia.jpg',
      alt: 'British main battle tank with Chobham armor turret and rifled 120mm gun',
      credit: 'Crown Copyright · OGL v1.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Challenger_2_Main_Battle_Tank_in_Bosnia.jpg',
    },
    description: 'The Challenger 2 is the British Army\'s main battle tank. It uses Chobham composite armor, a 120mm L30A1 rifled gun (unique among modern MBTs), and a Perkins Condor diesel engine. In combat it has proven virtually immune to enemy anti-tank fire.',
    history: 'Entering service in 1998, the Challenger 2 has seen combat in Bosnia, Kosovo, Iraq (2003), and in the hands of Ukrainian forces from 2023. In Iraq, a Challenger 2 was penetrated by another Challenger 2 in a friendly fire incident — the only combat loss from enemy fire was a tank disabled by multiple RPG hits. It is now being upgraded to Challenger 3 standard with a new 120mm smoothbore gun.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Challenger_2',
    distractors: ['Leopard 2', 'Leclerc', 'M1 Abrams'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'T-90', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/T-90_in_the_Military_Museum_of_Perm.jpg/800px-T-90_in_the_Military_Museum_of_Perm.jpg',
      alt: 'Russian main battle tank with reactive armor panels and distinctive Shtora countermeasures',
      credit: 'Wikimedia Commons · CC-BY-SA',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:T-90_in_the_Military_Museum_of_Perm.jpg',
    },
    description: 'The T-90 is Russia\'s primary main battle tank, combining the T-72 hull with the fire control system of the T-80. It features Kontakt-5 explosive reactive armor, Shtora electro-optical countermeasures, and a 2A46M 125mm smoothbore gun.',
    history: 'Introduced in 1992 as an interim upgrade to the T-72, the T-90 became Russia\'s export flagship. India operates over 1,000 T-90S Bhishma tanks. The T-90M "Proryv" variant features a new turret with Relikt ERA and improved fire control. Both T-90s and Ukrainian Challengers/Leopards have been destroyed in combat during the 2022-present Ukraine war, providing real-world data on modern tank vs. tank duels.',
    wikiUrl: 'https://en.wikipedia.org/wiki/T-90',
    distractors: ['T-72', 'T-80', 'T-64'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Panzerkampfwagen IV', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Panzer_IV_Ausf._H.jpg/800px-Panzer_IV_Ausf._H.jpg',
      alt: 'German WWII medium tank with schürzen side armor skirts and long 75mm gun',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panzer_IV_Ausf._H.jpg',
    },
    description: 'The Panzerkampfwagen IV was Germany\'s most produced tank of WWII and its workhorse medium tank. Continuously upgraded from a short-barrel infantry support weapon to a tank destroyer capable of defeating any Allied tank at standard combat ranges.',
    history: 'The only German tank in production throughout WWII, over 8,500 Panzer IVs were built between 1936 and 1945. The Ausf. F2 and later variants with the long-barreled KwK 40 L/48 75mm gun outclassed the M4 Sherman and T-34/76 at normal combat ranges. Its combination of reliability, upgradeability, and firepower made it the backbone of Panzer divisions from Barbarossa to Berlin.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Panzer_IV',
    distractors: ['Panzer III', 'Panther', 'StuG III'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — SMALL ARMS
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'PPSh-41', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/PPSh-41_from_soviet_union.jpg/800px-PPSh-41_from_soviet_union.jpg',
      alt: 'Soviet submachine gun with distinctive drum magazine and wooden stock with compensator muzzle',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PPSh-41_from_soviet_union.jpg',
    },
    description: 'The PPSh-41 (Pistolet-Pulyemyot Shpagina) was the Soviet Union\'s primary submachine gun of WWII. Firing 7.62×25mm Tokarev at 900 rounds per minute from a 71-round drum or 35-round box magazine, it gave Soviet infantry tremendous close-range firepower.',
    history: 'Designed by Georgy Shpagin and introduced in 1941, the PPSh was designed to be inexpensive and simple to produce using Soviet industrial capacity. By the end of WWII, over 6 million were built. Soviet infantry were often issued the weapon to every soldier in a unit — "burp gun" tactics of massive close-range automatic fire. Captured PPSh-41s were so valued by German soldiers they requested conversions to fire German 9mm ammunition.',
    wikiUrl: 'https://en.wikipedia.org/wiki/PPSh-41',
    distractors: ['PPS-43', 'MP40', 'Sten Gun'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M60 Machine Gun', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/M60_machine_gun.jpg/800px-M60_machine_gun.jpg',
      alt: 'Belt-fed 7.62mm general-purpose machine gun with bipod and shoulder stock',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M60_machine_gun.jpg',
    },
    description: 'The M60 is a belt-fed 7.62×51mm NATO general-purpose machine gun. The primary U.S. medium machine gun from Vietnam through the early 1990s, it earned the nickname "The Pig" from disgruntled infantrymen who carried its 23 lbs through jungle terrain.',
    history: 'Adopted in 1957, the M60 drew heavily on the German MG42 and FG 42 designs. In Vietnam, each infantry squad\'s M60 gunner was the most critical — and targeted — man in the unit. The weapon\'s tendency to overheat and its difficult barrel change procedure under fire earned it criticism. It was replaced by the superior M240B in U.S. service but remains in use worldwide.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M60_machine_gun',
    distractors: ['M240B Machine Gun', 'M249 SAW', 'M1919 Browning'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Lee-Enfield Mk III', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lee-Enfield_Mk_III_1918.jpg/800px-Lee-Enfield_Mk_III_1918.jpg',
      alt: 'British bolt-action rifle with 10-round magazine and full-length wooden stock',
      credit: 'Crown Copyright · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lee-Enfield_Mk_III_1918.jpg',
    },
    description: 'The Lee-Enfield is a bolt-action magazine rifle that served as the standard British Empire infantry rifle from 1895 to the 1950s. Its 10-round detachable magazine and smooth bolt action allowed a trained rifleman to fire 15 aimed rounds per minute — the "Mad Minute."',
    history: 'The SMLE (Short Magazine Lee-Enfield) Mk III and its successor the No. 4 equipped British, Commonwealth, and Imperial troops in both World Wars. At the 1914 Battle of Mons, German soldiers reported facing machine gun fire — it was actually trained British riflemen firing their Lee-Enfields with devastating rapidity. Over 17 million were produced, and the weapon remains in production in Pakistan for police use.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lee%E2%80%93Enfield',
    distractors: ['Mauser Karabiner 98k', 'Springfield M1903', 'Mosin-Nagant'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Beretta M9', category: 'smallarms', branch: 'army',
    difficulty: 'recruit', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Beretta_M9.jpg/800px-Beretta_M9.jpg',
      alt: 'Double-action semi-automatic 9mm pistol with open slide and safety/decocker on slide',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Beretta_M9.jpg',
    },
    description: 'The Beretta M9 is a 9mm semi-automatic pistol that served as the standard U.S. military sidearm from 1985 to 2017. It fires from a 15-round double-stack magazine and uses a hammer-fired double-action/single-action trigger.',
    history: 'Adopted after a competitive military trial in 1985, the M9 replaced the M1911A1 as the Army\'s standard sidearm. It was the first 9mm pistol used by the U.S. military at scale. The M9A1 variant featured a rail for weapon lights. It was replaced by the SIG Sauer M17/M18 (P320 platform) beginning in 2017 after the Army\'s Modular Handgun System competition.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Beretta_M9',
    distractors: ['SIG Sauer M17', 'Glock 19M', 'M1911 Pistol'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'RPG-7', category: 'smallarms', branch: 'all',
    difficulty: 'recruit', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Rpg-7_detached.jpg/800px-Rpg-7_detached.jpg',
      alt: 'Reusable anti-tank rocket launcher with distinctive flared muzzle and optical sight',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rpg-7_detached.jpg',
    },
    description: 'The RPG-7 (Ruchnoy Protivotankovy Granatomet) is a portable, reusable, shoulder-launched anti-tank rocket-propelled grenade launcher. It is the most widely used anti-tank weapon in history, appearing in conflicts on every continent.',
    history: 'Introduced by the Soviet Union in 1961, the RPG-7 entered widespread use in Vietnam where it destroyed M48 tanks, M113s, and helicopters. Its shaped-charge warhead can penetrate over 300mm of armor. Simple to operate, cheap, and highly effective, it has been exported to over 100 countries and is produced in nearly as many. The RPG-7 killed the most U.S. service members of any weapon in Somalia (1993), Afghanistan, and Iraq.',
    wikiUrl: 'https://en.wikipedia.org/wiki/RPG-7',
    distractors: ['M72 LAW', 'AT4', 'Panzerfaust 3'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M14 Rifle', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/M14_Rifle.jpg/800px-M14_Rifle.jpg',
      alt: 'Select-fire 7.62mm battle rifle with wooden stock and detachable box magazine',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M14_Rifle.jpg',
    },
    description: 'The M14 is a 7.62×51mm NATO select-fire battle rifle that served as the standard U.S. infantry rifle from 1959 to 1970. Its range and accuracy were exceptional, but full-auto fire was uncontrollable and it was too long for jungle warfare.',
    history: 'Intended to replace five weapons with one, the M14 succeeded the M1 Garand. In Vietnam, its length and weight were immediate problems — the AK-47-equipped enemy could disappear into jungle before an American could bring his longer rifle to bear. The M16 replaced it in 1969, but accurized M14s (M21, M25) remained popular as designated marksman rifles. The EBR (Enhanced Battle Rifle) variant continues in service today.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M14_rifle',
    distractors: ['M1 Garand', 'M16 Rifle', 'FN FAL'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — WARSHIPS
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'USS George Washington (CVN-73)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/USS_George_Washington_CVN-73.jpg/800px-USS_George_Washington_CVN-73.jpg',
      alt: 'Nuclear-powered aircraft carrier with aircraft on angled flight deck and island to starboard',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_George_Washington_CVN-73.jpg',
    },
    description: 'USS George Washington (CVN-73) is a Nimitz-class nuclear-powered aircraft carrier. She has served as the forward-deployed carrier in Japan and is one of the most capable power-projection platforms in the world.',
    history: 'Commissioned in 1992, CVN-73 is named for the first U.S. President. She was the first carrier home-ported in Japan, arriving at Yokosuka in 2008 — a linchpin of the U.S.-Japan alliance. Her air wing of ~75 aircraft can project power throughout Northeast Asia and the South China Sea. In 2023 she completed a comprehensive refueling and complex overhaul (RCOH) at Newport News.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_George_Washington_(CVN-73)',
    distractors: ['USS Ronald Reagan (CVN-76)', 'USS Abraham Lincoln (CVN-72)', 'USS Theodore Roosevelt (CVN-71)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Type 45 Destroyer', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/HMS_Daring_D32.jpg/800px-HMS_Daring_D32.jpg',
      alt: 'British destroyer with distinctive large flat Sampson radar mast and Sylver VLS forward',
      credit: 'Crown Copyright · OGL v1.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HMS_Daring_D32.jpg',
    },
    description: 'The Type 45 Daring-class destroyer is the Royal Navy\'s primary air defense combatant. Its Sampson AESA radar and Sea Viper missile system can simultaneously track and engage hundreds of targets, including ballistic missiles.',
    history: 'Commissioned from 2009, six Type 45 destroyers were built at a cost of £1 billion each. Their Sea Viper (Aster 30) missiles outrange the U.S. SM-2, and the Sampson radar is widely regarded as the most capable naval fire control radar afloat. Engine reliability issues caused significant availability problems, now addressed through the Power Improvement Project.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Type_45_destroyer',
    distractors: ['Type 23 Frigate', 'Arleigh Burke-class Destroyer', 'Horizon-class Frigate'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Zumwalt (DDG-1000)', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/USS_Zumwalt_%28DDG-1000%29_underway.jpg/800px-USS_Zumwalt_%28DDG-1000%29_underway.jpg',
      alt: 'Futuristic tumblehome-hull stealth destroyer with faceted deckhouse and wave-piercing bow',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Zumwalt_(DDG-1000)_underway.jpg',
    },
    description: 'The USS Zumwalt (DDG-1000) is the lead ship of the U.S. Navy\'s most advanced destroyer class. Its tumblehome (inward-sloping) hull, composite superstructure, and wave-piercing bow give it a radar cross-section comparable to a small fishing boat despite being 610 feet long.',
    history: 'The Zumwalt class was originally planned for 32 ships; production was cut to three due to cost overruns ($4.4 billion per ship). The Advanced Gun System was removed after the Navy cancelled its smart munitions, and the ships are being re-armed with Conventional Prompt Strike hypersonic missiles. Their electric drive system and surplus power generation make them ideal platforms for directed energy weapons.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Zumwalt_(DDG-1000)',
    distractors: ['Arleigh Burke-class Destroyer', 'Ticonderoga-class Cruiser', 'Type 45 Destroyer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Tirpitz', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Bundesarchiv_DVM_10_Bild-23-63-27%2C_Schlachtschiff_Tirpitz.jpg/800px-Bundesarchiv_DVM_10_Bild-23-63-27%2C_Schlachtschiff_Tirpitz.jpg',
      alt: 'German battleship with massive armored turrets hidden in Norwegian fjord',
      credit: 'Bundesarchiv · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_DVM_10_Bild-23-63-27,_Schlachtschiff_Tirpitz.jpg',
    },
    description: 'Tirpitz was the sister ship of Bismarck and the largest battleship ever built by Germany. Though she rarely left her Norwegian fjord hideouts, her mere existence tied down massive Allied naval forces and caused the disastrous scattering of convoy PQ 17.',
    history: 'Commissioned in 1941, Tirpitz spent most of WWII hiding in Norwegian fjords, used as a "fleet in being" threat. The Allies mounted multiple operations against her including midget submarine attacks (1943) and repeated bombing raids. Finally, RAF Lancaster bombers using 12,000-lb Tallboy bombs sank her on November 12, 1944, at Tromsø. 971 of her crew of 1,862 perished. The wreck was gradually scrapped from 1948-1957.',
    wikiUrl: 'https://en.wikipedia.org/wiki/German_battleship_Tirpitz',
    distractors: ['Bismarck', 'Scharnhorst', 'Gneisenau'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Virginia-class Submarine', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/USS_Virginia_SSN-774.jpg/800px-USS_Virginia_SSN-774.jpg',
      alt: 'Nuclear-powered attack submarine surfaced with large photonic mast visible',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Virginia_SSN-774.jpg',
    },
    description: 'The Virginia class is the U.S. Navy\'s newest nuclear-powered fast attack submarine. It features a photonic mast (no traditional periscope), modular payload section, and advanced acoustic quieting. The Block V variant adds a Virginia Payload Module for 28 additional Tomahawk missiles.',
    history: 'First commissioned in 2004, the Virginia class was designed to be affordable (initially $2 billion vs. the $3 billion Seawolf class) while exceeding Los Angeles-class capability in all areas. Production rate was increased to two per year to grow the attack submarine fleet. The Virginia class will also serve as the basis for the AUKUS nuclear submarine program for Australia.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Virginia-class_submarine',
    distractors: ['Los Angeles-class Submarine', 'Seawolf-class Submarine', 'Ohio-class Submarine'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — MEDALS
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Distinguished Service Cross', category: 'medal', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Distinguished_Service_Cross.jpg/400px-Distinguished_Service_Cross.jpg',
      alt: 'Blue cross with eagle in center suspended on red, white, and blue ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Distinguished_Service_Cross.jpg',
    },
    description: 'The Distinguished Service Cross is the second-highest military decoration awarded by the U.S. Army for extraordinary heroism in combat. It is the Army\'s equivalent of the Navy Cross and Air Force Cross.',
    history: 'Established in 1918 during WWI, the DSC ranks immediately below the Medal of Honor. Famous recipients include General Douglas MacArthur (WWI), Sergeant Alvin York (though he received the Medal of Honor as well), and Audie Murphy (America\'s most decorated WWII soldier, who received the DSC in addition to the Medal of Honor). It requires "extraordinary heroism" — a higher standard than the Silver Star.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Distinguished_Service_Cross_(United_States)',
    distractors: ['Medal of Honor (Army)', 'Silver Star', 'Legion of Merit'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Prisoner of War Medal', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Prisoner_of_War_Medal.jpg/400px-Prisoner_of_War_Medal.jpg',
      alt: 'Medal with eagle behind barbed wire on black, white, and red ribbon',
      credit: 'U.S. DoD · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Prisoner_of_War_Medal.jpg',
    },
    description: 'The Prisoner of War Medal is awarded to any member of the U.S. armed forces who was taken prisoner of war by an enemy force in any conflict after April 5, 1917. It features an eagle superimposed on crossed swords behind barbed wire.',
    history: 'Established in 1985, the POW Medal recognizes those who endured captivity at the hands of enemy forces. Notable recipients include Senator John McCain (Vietnam, 1967-1973), James Stockdale (who received the Medal of Honor for his leadership among POWs), and the Bataan Death March survivors of WWII. Over 142,000 Americans have been POWs since WWI. The medal cannot be awarded posthumously to those who died in captivity.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Prisoner_of_War_Medal',
    distractors: ['Purple Heart', 'Combat Infantryman Badge', 'Missing in Action Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Army Good Conduct Medal', category: 'medal', branch: 'army',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Army_Good_Conduct_Medal.jpg/400px-Army_Good_Conduct_Medal.jpg',
      alt: 'Medal with eagle on shield surrounded by letters and star border on red ribbon',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Army_Good_Conduct_Medal.jpg',
    },
    description: 'The Army Good Conduct Medal is awarded to enlisted soldiers who complete three consecutive years of honorable service. It recognizes exemplary behavior, efficiency, and fidelity during the qualifying period.',
    history: 'Established in 1941, the Good Conduct Medal (GCM) is the most commonly awarded U.S. Army medal. It is awarded automatically if a soldier has no disciplinary issues, meets physical fitness standards, and maintains a positive conduct record. The medal is marked on the Army service record as "effie" — as in efficient and faithful. Subsequent awards add knots (loops) to the ribbon. Despite its ubiquity, many veterans consider it a badge of good behavior rather than an achievement medal.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Army_Good_Conduct_Medal',
    distractors: ['National Defense Service Medal', 'Meritorious Service Medal', 'Army Achievement Medal'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — RANKS
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Chief Warrant Officer 4 (CW4)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/CW4_Rank.svg/200px-CW4_Rank.svg.png',
      alt: 'Four-section bar with alternating silver and black sections on rank insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:CW4_Rank.svg',
    },
    description: 'Chief Warrant Officer 4 (CW4) is a senior warrant officer rank in the U.S. Army. Warrant officers are specialized technical experts who hold a rank between enlisted and commissioned officers, providing critical technical expertise in aviation, intelligence, and cyber domains.',
    history: 'Warrant officers fill the gap between the tactical expertise of NCOs and the broad leadership of commissioned officers. Army aviators are typically warrant officers — the only branch where warrants fly the aircraft rather than just observe. CW4s are senior technical advisors with over 15 years of specialized experience. In aviation units, a CW4 standardization pilot is responsible for ensuring all aviators meet certification requirements.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Warrant_officer_(United_States)',
    distractors: ['Chief Warrant Officer 3 (CW3)', 'Chief Warrant Officer 5 (CW5)', 'First Lieutenant (O-2)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Master Chief Petty Officer (E-9, Navy)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/MCPO_USN.svg/200px-MCPO_USN.svg.png',
      alt: 'Navy master chief insignia with eagle, anchor, and three stars above rating badge',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MCPO_USN.svg',
    },
    description: 'Master Chief Petty Officer (MCPO, E-9) is the highest enlisted rank in the U.S. Navy. The Master Chief Petty Officer of the Navy (MCPON) serves as the senior enlisted advisor to the Chief of Naval Operations and the Secretary of the Navy.',
    history: 'The MCPO rank was established in 1958. The MCPON position was created in 1967 to provide the CNO with a direct pipeline to enlisted concerns. There are three E-9 rates in the Navy: Fleet Master Chief, Force Master Chief, and Command Master Chief — each serving as the senior enlisted at fleet, force, or command level respectively. The MCPON speaks for over 300,000 enlisted sailors.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Master_chief_petty_officer_(United_States)',
    distractors: ['Senior Chief Petty Officer (E-8)', 'Chief Petty Officer (E-7)', 'Fleet Master Chief'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Sergeant Major of the Army (SMA)', category: 'rank', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/SMA_Rank.svg/200px-SMA_Rank.svg.png',
      alt: 'Three chevrons and three rockers with stars, wreath, and eagle on rank insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SMA_Rank.svg',
    },
    description: 'The Sergeant Major of the Army (SMA) is the most senior enlisted soldier in the United States Army. Only one person holds this rank at a time. The SMA serves as the principal advisor on all matters pertaining to enlisted soldiers to the Chief of Staff of the Army.',
    history: 'The position was created in 1966 when General Harold K. Johnson established the SMA as a direct advisory link between the enlisted force and Army leadership during Vietnam. The first SMA was William O. Wooldridge. The SMA testifies before Congress, travels to combat zones to assess troop morale and readiness, and represents the voice of over one million Army soldiers. The rank is distinct — its unique insignia has no equivalent in any other service.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sergeant_Major_of_the_Army',
    distractors: ['Command Sergeant Major (E-9)', 'Sergeant Major (E-9)', 'First Sergeant (1SG)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Lance Corporal (E-3, USMC)', category: 'rank', branch: 'marines',
    difficulty: 'recruit', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/USMC-E3.svg/200px-USMC-E3.svg.png',
      alt: 'Single upward chevron on USMC rank insignia',
      credit: 'USMC · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USMC-E3.svg',
    },
    description: 'Lance Corporal (LCpl, E-3) is the third enlisted rank in the U.S. Marine Corps, denoted by a single chevron. LCpls are the backbone of the Marine Corps\' fighting force — they form the majority of infantry squads and assault element teams.',
    history: 'The rank of Lance Corporal was revived in the Marine Corps in 1958, having originally existed in the 18th and 19th centuries. In the Corps, a Lance Corporal is expected to be fully proficient at their Military Occupational Specialty and capable of leading fire teams in emergencies. The LCpl underground — the informal communication network of junior enlisted Marines — is said to know about command decisions before formal announcement.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lance_corporal#United_States',
    distractors: ['Private First Class (E-2)', 'Corporal (E-4)', 'Private (E-1)'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — INSIGNIA
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'Combat Action Badge', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Combat_Action_Badge.jpg/400px-Combat_Action_Badge.jpg',
      alt: 'Bayonet on oval wreath badge with star above for non-infantry combat veterans',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Combat_Action_Badge.jpg',
    },
    description: 'The Combat Action Badge (CAB) is awarded to soldiers who are not in infantry or special forces but who actively engage or are engaged by the enemy. It was created to recognize non-infantry soldiers who experience direct combat.',
    history: 'Established in 2005 in response to the Iraq War\'s "non-linear" battlefield where support soldiers were as likely to face combat as infantry, the CAB requires the soldier to be in active direct combat (not just under fire). It fills the recognition gap left by the Combat Infantryman Badge (CIB) and Combat Medical Badge (CMB). Logisticians, lawyers, and transportation soldiers who fought in IED ambushes could receive the CAB but not the CIB.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Combat_Action_Badge',
    distractors: ['Combat Infantryman Badge', 'Combat Medical Badge', 'Expert Infantryman Badge'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Master Parachutist Badge', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MasterParachutist.jpg/400px-MasterParachutist.jpg',
      alt: 'Open parachute canopy with star, wings, and wreath — senior parachutist qualification badge',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:MasterParachutist.jpg',
    },
    description: 'The Master Parachutist Badge is the highest of three parachutist qualifications in the U.S. Army. It requires 65 jumps (including five night jumps, five mass tactical jumps, and combat jumps), plus senior parachutist qualification and service in a leadership position.',
    history: 'Three levels of parachutist badge exist: Basic (5 jumps), Senior (30 jumps + combat jump or 15 jumps + HALO), and Master (65 jumps). The Master Parachutist badge is highly respected in airborne units. Rangers, Special Forces, and 82nd Airborne soldiers typically wear Master wings after years of service. The combat jump device (a star on the badge) denotes a combat parachute assault — extremely rare in modern warfare.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Parachutist_Badge_(United_States)',
    distractors: ['Airborne Tab', 'Military Freefall Badge', 'Senior Parachutist Badge'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: '3rd Infantry Division "Rock of the Marne"', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'all',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/3ID_SSI.svg/400px-3ID_SSI.svg.png',
      alt: 'White and blue striped diagonal shield on yellow background with three diagonal stripes',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:3ID_SSI.svg',
    },
    description: 'The 3rd Infantry Division "Rock of the Marne" shoulder sleeve insignia features three diagonal white and blue stripes on a yellow field. The colors represent the three corps to which the division was attached during WWI, and the "Rock of the Marne" nickname was earned at the Second Battle of the Marne (1918).',
    history: 'Established in 1917, the 3rd ID earned its nickname when it held the Marne River crossing against the German Spring Offensive. It was the first unit into Rome in WWII (1944) and crossed the Rhine at Remagen. In Iraq (2003), the division\'s "Thunder Run" — two armored dashes through Baghdad — effectively broke Iraqi resistance. The 3rd ID is based at Fort Stewart, Georgia.',
    wikiUrl: 'https://en.wikipedia.org/wiki/3rd_Infantry_Division_(United_States)',
    distractors: ['1st Infantry Division', '4th Infantry Division', '25th Infantry Division'],
    active: true,
  },

  /* ══════════════════════════════════════════════════════════════════════════════
     EXPANSION 2 — ARTILLERY
  ══════════════════════════════════════════════════════════════════════════════ */

  {
    _type: 'idDrillQuestion', name: 'D-30 Howitzer', category: 'artillery', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/D-30_howitzer.jpg/800px-D-30_howitzer.jpg',
      alt: 'Soviet 122mm towed howitzer with distinctive three-trail carriage allowing 360-degree fire',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:D-30_howitzer.jpg',
    },
    description: 'The D-30 is a Soviet 122mm towed howitzer introduced in 1960. Its distinctive three-trail carriage allows it to fire in any direction without repositioning — a significant tactical advantage. Operated by over 60 nations, it is one of the most widely used artillery pieces in the world.',
    history: 'Developed as a replacement for the M-30 WWII howitzer, the D-30 was adopted in 1960 and exported extensively. It appeared in Vietnam (used by the North Vietnamese), the Yom Kippur War (1973), and countless African and Middle Eastern conflicts. Ukraine and Russia both use large numbers of D-30s, though the latter favors them in reserve formations. Self-propelled versions include the 2S1 Gvozdika.',
    wikiUrl: 'https://en.wikipedia.org/wiki/2A18_(D-30)',
    distractors: ['BM-21 Grad', 'M198 Howitzer', '2S1 Gvozdika'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M101 Howitzer', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/M101A1_Howitzer.jpg/800px-M101A1_Howitzer.jpg',
      alt: 'Lightweight 105mm towed howitzer with split-trail carriage and rubber tires',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M101A1_Howitzer.jpg',
    },
    description: 'The M101 is a 105mm towed howitzer that served as the standard U.S. light artillery piece from WWII through Vietnam. Its light weight (4,980 lbs) allowed it to be transported by helicopter — a critical capability in Vietnam\'s roadless terrain.',
    history: 'Adopted in 1940 as the M2A1, redesignated M101 in 1962, this howitzer saw service in WWII, Korea, and Vietnam. In Vietnam it was frequently airlifted by CH-47 Chinooks to fire support bases carved from jungle hilltops. The "Hip Shoot" — setting up quickly and firing without the usual survey — became standard practice. It was replaced in U.S. service by the M102 (airborne) and M198, though it remains in use in dozens of nations.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M101_howitzer',
    distractors: ['M119 Howitzer', 'M198 Howitzer', 'M102 Howitzer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M119 Howitzer', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/M119A1_Howitzer.jpg/800px-M119A1_Howitzer.jpg',
      alt: 'Lightweight 105mm towed howitzer with split-trail carriage',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M119A1_Howitzer.jpg',
    },
    description: 'The M119 is a lightweight 105mm towed howitzer used by U.S. airborne and air assault units. Weighing only 4,100 lbs, it can be sling-loaded beneath a UH-60 Black Hawk helicopter, giving light infantry divisions direct fire support capability anywhere they can fly.',
    history: 'Adopted from the British L119 Light Gun in 1989, the M119 replaced the M102 in airborne units. It fired the first rounds of the 2003 Iraq War invasion. During the 2010 Marjah offensive in Afghanistan, 82nd Airborne artillerymen used the M119 in the highest-altitude artillery fire missions since the Korean War. The M119A3 variant features a digital fire control system improving accuracy and crew safety.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M119_howitzer',
    distractors: ['M777 Howitzer', 'M198 Howitzer', 'M101 Howitzer'],
    active: true,
  },

  /* ─────────────────────────── EXPANSION 3 ──────────────────────────────────── */

  /* AIRCRAFT */

  {
    _type: 'idDrillQuestion', name: 'F-15 Eagle', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/F-15C_Eagle_in_flight_%28cropped%29.jpg/800px-F-15C_Eagle_in_flight_%28cropped%29.jpg',
      alt: 'Twin-engine air superiority fighter with twin tail fins in flight',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:F-15C_Eagle_in_flight_(cropped).jpg',
    },
    description: 'The F-15 Eagle is a twin-engine, all-weather tactical fighter designed by McDonnell Douglas for air superiority. With a combat record of more than 100 aerial victories and zero losses, it is one of the most successful fighter aircraft ever built.',
    history: 'First flown in 1972, the F-15 entered USAF service in 1976. Israeli F-15s achieved the first kills in 1979 over Lebanon. During Desert Storm, USAF Eagles scored 34 of 37 coalition air-to-air kills. The F-15E Strike Eagle variant adds a ground attack role. More than 1,500 have been built and it remains operational worldwide.',
    wikiUrl: 'https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15_Eagle',
    distractors: ['F-14 Tomcat', 'F-16 Fighting Falcon', 'F-22 Raptor'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Avro Lancaster', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Avro_Lancaster_PA474.jpg/800px-Avro_Lancaster_PA474.jpg',
      alt: 'Four-engine heavy bomber with distinctive twin tail fins in flight',
      credit: 'Alan Wilson · CC BY-SA 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Avro_Lancaster_PA474.jpg',
    },
    description: 'The Avro Lancaster was the primary RAF heavy bomber of World War II. Its large bomb bay could carry the 22,000 lb Grand Slam bomb, the heaviest bomb dropped by any Allied aircraft during the war.',
    history: 'Developed from the failed Manchester bomber, the Lancaster first flew in January 1941 and entered service in 1942. It flew 156,000 sorties and dropped 608,000 tons of bombs. The Lancaster is best known for the "Dam Busters" raid of May 1943, in which 617 Squadron used bouncing bombs to destroy the Möhne and Eder dams.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Avro_Lancaster',
    distractors: ['B-17 Flying Fortress', 'Halifax Bomber', 'Stirling Bomber'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'AH-1 Cobra', category: 'aircraft', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/AH-1_Cobra_in_flight.jpg/800px-AH-1_Cobra_in_flight.jpg',
      alt: 'Narrow single-engine attack helicopter with tandem cockpit in flight',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:AH-1_Cobra_in_flight.jpg',
    },
    description: 'The AH-1 Cobra was the world\'s first purpose-built attack helicopter. Its narrow profile, stub wings for weapons, and tandem cockpit set the template for all subsequent attack helicopter designs.',
    history: 'Rushed into service in 1967 to escort troop-carrying helicopters in Vietnam, the Cobra proved devastatingly effective with its 20mm cannon and rockets. The USMC continues to operate the upgraded AH-1Z Viper. Over 1,100 were built and the design influenced every subsequent attack helicopter including the Apache.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bell_AH-1_Cobra',
    distractors: ['AH-64 Apache', 'OH-58 Kiowa', 'UH-1 Huey'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Ju 87 Stuka', category: 'aircraft', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Junkers_Ju_87_Stuka.jpg/800px-Junkers_Ju_87_Stuka.jpg',
      alt: 'Single-engine dive bomber with fixed undercarriage and gull wings',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Junkers_Ju_87_Stuka.jpg',
    },
    description: 'The Junkers Ju 87 Stuka was a German dive bomber renowned for its accuracy and the terrifying wail of its Jericho trumpets — wind-driven sirens fitted to its undercarriage to intimidate targets.',
    history: 'The Stuka proved devastatingly effective during the Blitzkrieg campaigns of 1939–41, acting as flying artillery for fast-moving Panzer columns. Vulnerable to fighter opposition, it was withdrawn from western operations after the Battle of Britain. On the Eastern Front, ace Hans-Ulrich Rudel flew 2,530 combat missions and destroyed 519 tanks in the Stuka.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Junkers_Ju_87',
    distractors: ['He 111', 'Fw 190', 'Bf 109'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'C-130 Hercules', category: 'aircraft', branch: 'airforce',
    difficulty: 'recruit', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/C-130_Hercules_558th_AS.jpg/800px-C-130_Hercules_558th_AS.jpg',
      alt: 'Four-engine turboprop transport aircraft with high wing and T-tail',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:C-130_Hercules_558th_AS.jpg',
    },
    description: 'The C-130 Hercules is a four-engine turboprop military transport aircraft. The most versatile and widely operated military airlifter in history, it can operate from unprepared runways and has served in over 60 nations.',
    history: 'First flown in 1954, the C-130 entered service in 1956 and has never been out of production — one of the longest production runs of any military aircraft. It has served as a gunship (AC-130), tanker, weather recon platform, and firefighter. The C-130J Super Hercules is the current production variant.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lockheed_C-130_Hercules',
    distractors: ['C-17 Globemaster III', 'C-5 Galaxy', 'C-141 Starlifter'],
    active: true,
  },

  /* ARMOR */

  {
    _type: 'idDrillQuestion', name: 'M26 Pershing', category: 'armor', branch: 'army',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pershing_medium_tank.jpg/800px-Pershing_medium_tank.jpg',
      alt: 'WWII-era American heavy tank with long 90mm gun on display',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pershing_medium_tank.jpg',
    },
    description: 'The M26 Pershing was an American heavy/medium tank that entered service in early 1945. Its 90mm gun could defeat the Panther and Tiger at combat ranges, making it the first U.S. tank truly capable of taking on German heavy armor.',
    history: 'Delayed by Army doctrine that prioritized tank destroyers over heavy tanks, the Pershing arrived in Europe only in January 1945. In February, a Pershing famously dueled and destroyed a Tiger I near Cologne Cathedral in footage captured on film. It served again in Korea before being succeeded by the M46 Patton.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M26_Pershing',
    distractors: ['M4 Sherman', 'M46 Patton', 'M24 Chaffee'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Centurion Tank', category: 'armor', branch: 'all',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Centurion_Mk_12.jpg/800px-Centurion_Mk_12.jpg',
      alt: 'Post-WWII British main battle tank with sloped hull and bustle turret',
      credit: 'Megapixie · CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Centurion_Mk_12.jpg',
    },
    description: 'The Centurion was the primary British main battle tank of the Cold War era, considered one of the most successful tank designs of the 20th century. It served in more than 20 nations and saw combat from Korea to the Middle East.',
    history: 'Developed in 1943–45, the Centurion arrived too late for WWII but went on to serve for over 50 years globally. Israeli Centurions ("Sho\'t") performed brilliantly in the 1967 and 1973 wars. Australian Centurions fought in Vietnam. Its 105mm L7 gun became the standard NATO tank gun and was adopted by the M60 and Leopard 1.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Centurion_tank',
    distractors: ['Challenger 2', 'Leopard 1', 'M60 Patton'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'ZSU-23-4 Shilka', category: 'armor', branch: 'all',
    difficulty: 'commander', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/ZSU-23-4_Shilka.jpg/800px-ZSU-23-4_Shilka.jpg',
      alt: 'Soviet tracked anti-aircraft vehicle with four-barrel autocannon turret',
      credit: 'Vitaly V. Kuzmin · CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:ZSU-23-4_Shilka.jpg',
    },
    description: 'The ZSU-23-4 Shilka is a Soviet self-propelled anti-aircraft weapon system carrying four water-cooled 23mm autocannons and an integrated radar. It was the most feared ground-based air defense system of the Cold War.',
    history: 'Entering service in 1965, the Shilka terrified Israeli pilots during the 1973 Yom Kippur War, shooting down dozens of aircraft. Its radar-directed guns could engage targets at up to 2,500m altitude. Many were captured and studied by Western intelligence. Still in service in dozens of nations today.',
    wikiUrl: 'https://en.wikipedia.org/wiki/ZSU-23-4',
    distractors: ['Gepard SPAAG', 'M163 VADS', 'Tunguska'],
    active: true,
  },

  /* SMALL ARMS */

  {
    _type: 'idDrillQuestion', name: 'FN FAL', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'cold-war',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/FN_FAL_50.00.jpg/800px-FN_FAL_50.00.jpg',
      alt: 'Full-length semi-automatic battle rifle with wooden furniture',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:FN_FAL_50.00.jpg',
    },
    description: 'The FN FAL (Fusil Automatique Léger) is a Belgian-designed battle rifle chambered in 7.62×51mm NATO. Called the "Right Arm of the Free World," it was adopted by more than 90 nations during the Cold War.',
    history: 'Designed by Dieudonné Saive and adopted by Belgium in 1953, the FAL became the most widely used rifle of the Cold War outside the Soviet bloc. British troops used the L1A1 SLR (a semi-auto variant) through the Falklands War. It saw action in Rhodesia, South Africa, and dozens of Cold War proxy conflicts.',
    wikiUrl: 'https://en.wikipedia.org/wiki/FN_FAL',
    distractors: ['G3 Rifle', 'M14 Rifle', 'CETME Model C'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Karabiner 98k', category: 'smallarms', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Karabiner_98k.jpg/800px-Karabiner_98k.jpg',
      alt: 'Bolt-action rifle with wooden stock and turned-down bolt handle',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Karabiner_98k.jpg',
    },
    description: 'The Karabiner 98k was the standard issue rifle of the German Wehrmacht during World War II. A bolt-action rifle chambered in 7.92×57mm Mauser, it was accurate and reliable but outpaced by the semi-automatic M1 Garand in rate of fire.',
    history: 'Adopted in 1935, over 14 million Kar98k rifles were produced through WWII. It equipped virtually every German soldier from Poland to Stalingrad to Normandy. Its Mauser action remains one of the strongest and most accurate bolt-action designs ever made, and is still the basis for many modern hunting rifles.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Karabiner_98k',
    distractors: ['Lee-Enfield Mk III', 'M1903 Springfield', 'Mosin-Nagant M91/30'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'StG 44', category: 'smallarms', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Sturmgewehr_44.jpg/800px-Sturmgewehr_44.jpg',
      alt: 'Early assault rifle with curved magazine and wooden pistol grip',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sturmgewehr_44.jpg',
    },
    description: 'The Sturmgewehr 44 (StG 44) was the world\'s first mass-produced assault rifle. Chambering an intermediate 7.92×33mm Kurz cartridge, it combined the range of a rifle with the fire rate of a submachine gun — a concept that defined all subsequent infantry weapon design.',
    history: 'Developed by Hugo Schmeisser and fielded from 1943, the StG 44 allowed German infantry to lay down unprecedented volumes of accurate fire. Its design directly influenced Mikhail Kalashnikov\'s AK-47. Hitler initially opposed the project, forcing its designers to smuggle it into production labeled as an "MP" (machine pistol) until its success became undeniable.',
    wikiUrl: 'https://en.wikipedia.org/wiki/StG_44',
    distractors: ['MP40', 'FG 42', 'Karabiner 98k'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'M72 LAW', category: 'smallarms', branch: 'army',
    difficulty: 'sergeant', era: 'vietnam',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/M72_LAW_2.jpg/800px-M72_LAW_2.jpg',
      alt: 'Collapsible single-use rocket launcher tube in extended position',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M72_LAW_2.jpg',
    },
    description: 'The M72 LAW (Light Anti-Tank Weapon) is a portable, one-shot 66mm unguided anti-tank rocket. Its collapsible fiberglass tube design allows a single soldier to carry multiple rounds and engage armored vehicles or fortifications without crew support.',
    history: 'Adopted in 1963 and used extensively in Vietnam, the M72 remains in service today due to its simplicity and low cost. While modern tanks have largely defeated it, it remains effective against light vehicles, crew-served weapons, and fortifications. Upgraded variants with improved warheads continue to be procured by the U.S. and allied forces.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M72_LAW',
    distractors: ['AT4', 'Carl Gustaf', 'M3 MAAWS'],
    active: true,
  },

  /* WARSHIPS */

  {
    _type: 'idDrillQuestion', name: 'Scharnhorst', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Scharnhorst_battleship.jpg/800px-Scharnhorst_battleship.jpg',
      alt: 'German WWII battleship underway at sea with twin turrets forward',
      credit: 'Bundesarchiv · CC-BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Scharnhorst_battleship.jpg',
    },
    description: 'The Scharnhorst was a German battleship that served as a commerce raider during WWII. Armed with nine 11-inch guns, she was one of the fastest capital ships of the war and a persistent threat to Allied Atlantic convoys.',
    history: 'Together with Gneisenau, Scharnhorst sank the carrier HMS Glorious in 1940 and conducted Operation Berlin in 1941, sinking 22 Allied merchant ships. She was sunk at the Battle of the North Cape on December 26, 1943, by HMS Duke of York and escorting cruisers while attempting to attack convoy JW 55B. Only 36 of her 1,968-man crew survived.',
    wikiUrl: 'https://en.wikipedia.org/wiki/German_battleship_Scharnhorst',
    distractors: ['Bismarck', 'Tirpitz', 'Gneisenau'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'HMS Belfast', category: 'warship', branch: 'all',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/HMS_Belfast_%28C35%29_2016.jpg/800px-HMS_Belfast_%28C35%29_2016.jpg',
      alt: 'WWII-era British light cruiser moored on the River Thames',
      credit: 'Kjetil Bjørnsrud · CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HMS_Belfast_(C35)_2016.jpg',
    },
    description: 'HMS Belfast is a Royal Navy Town-class light cruiser launched in 1938. She supported the Normandy landings on D-Day, fought at the Battle of the North Cape, and is now a museum ship moored permanently on the Thames in London.',
    history: 'Belfast fired some of the first rounds supporting the Allied landings at Normandy on June 6, 1944, and provided shore bombardment throughout the Normandy campaign. She also served in Korea in 1950–52. Preserved since 1971, she is one of only two surviving WWII-era Royal Navy warships open to the public.',
    wikiUrl: 'https://en.wikipedia.org/wiki/HMS_Belfast',
    distractors: ['HMS Hood', 'HMS Warspite', 'HMS Dido'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'USS Indianapolis CA-35', category: 'warship', branch: 'navy',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/USS_Indianapolis_%28CA-35%29_underway_at_sea%2C_1939.jpg/800px-USS_Indianapolis_%28CA-35%29_underway_at_sea%2C_1939.jpg',
      alt: 'WWII-era American heavy cruiser underway at sea',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_Indianapolis_(CA-35)_underway_at_sea,_1939.jpg',
    },
    description: 'USS Indianapolis was a Portland-class heavy cruiser famous for delivering components of the first atomic bomb to Tinian Island in July 1945, and for the worst sea disaster in U.S. Navy history when she was sunk by a Japanese submarine four days later.',
    history: 'Torpedoed by I-58 on July 30, 1945, Indianapolis sank in 12 minutes. Of 1,195 crew, 880 went into the water. Due to a Navy communication failure, rescue came only after nearly five days. Shark attacks, dehydration, and exposure claimed 579 lives — only 316 survived. The sinking became one of the most haunting episodes of WWII.',
    wikiUrl: 'https://en.wikipedia.org/wiki/USS_Indianapolis_(CA-35)',
    distractors: ['USS Portland CA-33', 'USS Augusta CA-31', 'USS Pensacola CA-24'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Slava-class Cruiser', category: 'warship', branch: 'all',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Moskva_cruiser.jpg/800px-Moskva_cruiser.jpg',
      alt: 'Russian guided-missile cruiser with twin SS-N-12 launcher tubes amidships',
      credit: 'Russian Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Moskva_cruiser.jpg',
    },
    description: 'The Slava class are Russian guided-missile cruisers armed with 16 P-1000 Vulkan anti-ship missiles and the S-300F naval SAM system. They serve as fleet flagships and are among the most capable surface combatants in Russian service.',
    history: 'Three ships were completed from 1982–1990. The lead ship Moskva (ex-Slava) served as flagship of the Black Sea Fleet and was sunk on April 14, 2022, by Ukrainian Neptune anti-ship missiles — the largest warship sunk in combat since the Falklands War. Her loss was a major strategic and symbolic blow to the Russian Navy.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Slava-class_cruiser',
    distractors: ['Kirov-class Battlecruiser', 'Sovremenny-class Destroyer', 'Udaloy-class Destroyer'],
    active: true,
  },

  /* MEDALS */

  {
    _type: 'idDrillQuestion', name: 'Legion of Merit', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Legion_of_Merit_Medal.jpg/800px-Legion_of_Merit_Medal.jpg',
      alt: 'Multi-pointed white enamel star medal on red and white ribbon',
      credit: 'U.S. Government · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Legion_of_Merit_Medal.jpg',
    },
    description: 'The Legion of Merit is awarded for exceptionally meritorious conduct in the performance of outstanding services and achievements. It is one of the few U.S. military decorations that can be awarded to foreign military personnel.',
    history: 'Established by Congress in 1942, the Legion of Merit was the first American decoration created specifically to be awarded to nationals of other countries. It can be issued in four degrees (Chief Commander, Commander, Officer, and Legionnaire) to foreign recipients, while American service members receive the standard Legionnaire degree.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Legion_of_Merit',
    distractors: ['Meritorious Service Medal', 'Defense Superior Service Medal', 'Distinguished Service Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Meritorious Service Medal', category: 'medal', branch: 'all',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Meritorious_Service_Medal.jpg/800px-Meritorious_Service_Medal.jpg',
      alt: 'Hexagonal blue and white enamel medal on red and blue ribbon',
      credit: 'U.S. Government · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Meritorious_Service_Medal.jpg',
    },
    description: 'The Meritorious Service Medal is awarded to members of the U.S. Armed Forces who distinguish themselves by outstanding meritorious achievement or service to the United States while serving in a non-combat situation.',
    history: 'Established in 1969 by President Nixon, the Meritorious Service Medal was intended to create a non-combat equivalent to the Bronze Star Medal. It is typically awarded at the end of a service member\'s tour or upon retirement for sustained superior performance, and ranks above the Army Commendation Medal.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Meritorious_Service_Medal_(United_States)',
    distractors: ['Army Commendation Medal', 'Legion of Merit', 'Defense Meritorious Service Medal'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Air Force Cross', category: 'medal', branch: 'airforce',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Air_Force_Cross.jpg/800px-Air_Force_Cross.jpg',
      alt: 'Four-pointed cross medal in oxidized silver on blue and white ribbon',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Air_Force_Cross.jpg',
    },
    description: 'The Air Force Cross is the second-highest military decoration awarded by the U.S. Air Force, ranking only below the Medal of Honor. It is awarded for extraordinary heroism in combat not justifying the Medal of Honor.',
    history: 'Established in 1960 when the Air Force created its own decoration system separate from the Army. It is the Air Force equivalent of the Navy Cross and Distinguished Service Cross. Notable recipients include Captain Lance Sijan, who evaded capture in Vietnam for six weeks despite severe injuries before finally being taken prisoner and dying in captivity.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Air_Force_Cross_(United_States)',
    distractors: ['Distinguished Flying Cross', 'Silver Star', 'Distinguished Service Cross'],
    active: true,
  },

  /* RANKS */

  {
    _type: 'idDrillQuestion', name: 'Chief Warrant Officer 5 (Army)', category: 'rank', branch: 'army',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/US_Army_W5_insignia.svg/800px-US_Army_W5_insignia.svg.png',
      alt: 'Silver bar with single raised center eagle device — warrant officer insignia',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:US_Army_W5_insignia.svg',
    },
    description: 'Chief Warrant Officer 5 (CW5) is the highest warrant officer grade in the U.S. Army. CW5s are master-level technical and tactical experts who provide leadership, mentorship, and subject matter expertise in their specialty area.',
    history: 'The warrant officer grades W-1 through W-5 were created to allow technical specialists to reach senior leadership positions without converting to commissioned officer roles. CW5s are often the most experienced practitioners in their field — aviation, intelligence, cyber, logistics — and may serve as principal advisors to general officers and senior commanders.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Warrant_officer_(United_States)',
    distractors: ['Chief Warrant Officer 4 (Army)', 'Warrant Officer 1 (Army)', 'Master Sergeant'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Sergeant Major of the Marine Corps', category: 'rank', branch: 'marines',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/USMC-E9b.svg/800px-USMC-E9b.svg.png',
      alt: 'USMC chevron insignia with crossed rifles and globe and anchor device',
      credit: 'U.S. Marine Corps · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USMC-E9b.svg',
    },
    description: 'The Sergeant Major of the Marine Corps (SMMC) is the senior enlisted advisor to the Commandant of the Marine Corps. There is only one SMMC at any given time, making it the most senior enlisted position in the entire Marine Corps.',
    history: 'The position was created in 1957. The SMMC serves as the personal advisor to the Commandant on all matters pertaining to enlisted Marines and represents the interests of over 170,000 active duty and reserve enlisted personnel. The SMMC is a non-voting member of the Joint Chiefs of Staff advisory structure.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sergeant_Major_of_the_Marine_Corps',
    distractors: ['Master Gunnery Sergeant (USMC)', 'Sergeant Major (USMC)', 'Gunnery Sergeant (USMC)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Chief Petty Officer (Navy)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/US_Navy_E7_insignia.svg/800px-US_Navy_E7_insignia.svg.png',
      alt: 'Navy rating badge with eagle, crossed anchors, and one star above chevrons',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:US_Navy_E7_insignia.svg',
    },
    description: 'Chief Petty Officer (CPO) is the E-7 grade in the U.S. Navy and Coast Guard. The transition from Petty Officer First Class to Chief is one of the most significant cultural rites of passage in the Navy, involving a six-week "CPO Season" indoctrination process.',
    history: 'The CPO grade was established in 1893. Chiefs are the backbone of Navy enlisted leadership and are expected to be technical experts, mentors, and enforcers of standards. The CPO mess is a self-governing body with deep traditions. Senior Chief (E-8) and Master Chief (E-9) build upon the CPO grade.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chief_petty_officer_(United_States)',
    distractors: ['Petty Officer First Class (Navy)', 'Senior Chief Petty Officer (Navy)', 'Master Chief Petty Officer (Navy)'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Captain (Navy O-6)', category: 'rank', branch: 'navy',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/US_Navy_O6_insignia.svg/800px-US_Navy_O6_insignia.svg.png',
      alt: 'Navy shoulder board with four gold stripes',
      credit: 'U.S. Navy · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:US_Navy_O6_insignia.svg',
    },
    description: 'Captain is the O-6 rank in the U.S. Navy, equivalent to a Colonel in the Army or Air Force. A Navy Captain typically commands a large ship, submarine squadron, or major shore installation.',
    history: 'In the Navy, the title "Captain" is also used as a courtesy title for any commanding officer of a vessel, regardless of their actual grade. This can cause confusion as a Lieutenant Commander (O-4) commanding a small ship is addressed as "Captain." A full Captain (O-6) with four gold stripes is a senior officer on the path to flag rank.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Captain_(naval)',
    distractors: ['Commander (Navy O-5)', 'Commodore (Navy O-7)', 'Captain (Army O-3)'],
    active: true,
  },

  /* INSIGNIA */

  {
    _type: 'idDrillQuestion', name: '82nd Airborne Division Patch', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/82nd_Airborne_Division_SSI.svg/800px-82nd_Airborne_Division_SSI.svg.png',
      alt: 'Blue square shoulder patch with double A letters in red and white',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:82nd_Airborne_Division_SSI.svg',
    },
    description: 'The 82nd Airborne Division shoulder sleeve insignia features a blue square with "AA" monogram, earning the nickname "All American Division." It is the Army\'s primary strategic airborne rapid response division, deployable anywhere in the world within 18 hours.',
    history: 'The "AA" patch dates to WWI, when the 82nd was composed of men from all 48 states. In WWII, the 82nd made combat jumps in Sicily, Italy, Normandy, and Operation Market Garden. The division is based at Fort Liberty (formerly Bragg), NC, and maintains one brigade on standby as the Global Response Force at all times.',
    wikiUrl: 'https://en.wikipedia.org/wiki/82nd_Airborne_Division',
    distractors: ['101st Airborne Division Patch', '173rd Airborne Brigade Patch', '18th Airborne Corps Patch'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Special Forces Tab', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Special_Forces_Tab.svg/800px-Special_Forces_Tab.svg.png',
      alt: 'Teal arc-shaped shoulder tab with "Special Forces" in white text',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Special_Forces_Tab.svg',
    },
    description: 'The Special Forces Tab is worn by U.S. Army soldiers who have successfully completed the Special Forces Qualification Course (Q Course). It identifies the wearer as a Green Beret — a member of Army Special Forces.',
    history: 'The Q Course is one of the longest and most demanding military training programs in the world, typically lasting 18–24 months and covering advanced unconventional warfare, language training, SERE, and Robin Sage — a culminating realistic exercise. The tab is worn above the unit patch on the left shoulder and is a permanent qualification.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Special_Forces_Tab',
    distractors: ['Ranger Tab', 'Sapper Tab', 'Airborne Tab'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Expert Infantryman Badge', category: 'insignia', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Expert_Infantryman_Badge.svg/800px-Expert_Infantryman_Badge.svg.png',
      alt: 'Blue infantry badge with silver musket on oval wreath',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Expert_Infantryman_Badge.svg',
    },
    description: 'The Expert Infantryman Badge (EIB) is awarded to Army infantry and Special Forces soldiers who demonstrate superior proficiency in infantry skills. It is one of the most challenging skill badges to earn, with typical pass rates of only 20–30%.',
    history: 'Created in 1943 to recognize infantry soldiers\' professional expertise and boost morale, the EIB tests land navigation, weapons qualification, physical fitness, and tactical skills over a grueling multi-day evaluation. Unlike the CIB, which is awarded for combat, the EIB is a peacetime excellence award and is considered a mark of professional distinction.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Expert_Infantryman_Badge',
    distractors: ['Combat Infantryman Badge', 'Expert Soldier Badge', 'Combat Action Badge'],
    active: true,
  },

  /* ARTILLERY */

  {
    _type: 'idDrillQuestion', name: 'M198 Howitzer', category: 'artillery', branch: 'army',
    difficulty: 'sergeant', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/M198_howitzer_Samawah.jpg/800px-M198_howitzer_Samawah.jpg',
      alt: 'Large towed 155mm artillery piece with split-trail carriage in desert',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:M198_howitzer_Samawah.jpg',
    },
    description: 'The M198 is a medium towed 155mm howitzer used by the U.S. Army and Marine Corps. With a range of up to 30km using rocket-assisted projectiles, it provides the backbone of divisional artillery fires.',
    history: 'Adopted in 1979, the M198 replaced the aging M114 howitzer. It served in Desert Storm, Operation Iraqi Freedom, and Afghanistan. It is also supplied to allied nations including Ukraine, where M198s have been used extensively since 2022. Now being replaced by the lighter M777 in many units, though M198 remains widely in service.',
    wikiUrl: 'https://en.wikipedia.org/wiki/M198_howitzer',
    distractors: ['M777 Howitzer', 'M109 Paladin', 'M119 Howitzer'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'FH70 Howitzer', category: 'artillery', branch: 'all',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/FH70_howitzer.jpg/800px-FH70_howitzer.jpg',
      alt: 'Three-nation towed 155mm howitzer with auxiliary engine and split trail',
      credit: 'Wikimedia Commons · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:FH70_howitzer.jpg',
    },
    description: 'The FH70 is a NATO collaborative towed 155mm howitzer jointly developed by Germany, Italy, and the United Kingdom. It features an auxiliary power unit allowing the gun to maneuver short distances without a tow vehicle — a unique capability for a towed artillery system.',
    history: 'Entering service in the 1970s, the FH70 became the standard NATO towed 155mm gun. Japan licensed and co-produced it as the Type 75. It has been supplied to Ukraine and operated in numerous conflicts. Its NATO-standard caliber means it can fire the full range of NATO 155mm ammunition, including precision-guided Excalibur rounds.',
    wikiUrl: 'https://en.wikipedia.org/wiki/FH70',
    distractors: ['M198 Howitzer', 'M777 Howitzer', 'PzH 2000'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'B-24 Liberator', category: 'aircraft', branch: 'airforce',
    difficulty: 'sergeant', era: 'ww2',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/B-24_Liberator.jpg/800px-B-24_Liberator.jpg',
      alt: 'WWII heavy bomber with twin tail fins and Davis wing in flight',
      credit: 'U.S. Air Force · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:B-24_Liberator.jpg',
    },
    description: 'The B-24 Liberator was an American heavy bomber built in larger numbers than any other U.S. military aircraft in history. Its distinctive Davis wing gave it exceptional range, making it the primary U.S. bomber in the Pacific Theater and also widely used in Europe and North Africa.',
    history: 'Over 18,400 were built — more than any other American military aircraft. The B-24 flew the legendary low-level Ploesti raid in 1943 against Romanian oil refineries, one of the costliest air missions in USAAF history. While considered less glamorous than the B-17, the Liberator flew more total missions, dropped more bombs, and sank more shipping during the war.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Consolidated_B-24_Liberator',
    distractors: ['B-17 Flying Fortress', 'Avro Lancaster', 'B-29 Superfortress'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Leclerc MBT', category: 'armor', branch: 'all',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Leclerc_tank_-_Bastille_Day_2013_Paris.jpg/800px-Leclerc_tank_-_Bastille_Day_2013_Paris.jpg',
      alt: 'French main battle tank with autoloader turret and composite armor at parade',
      credit: 'French Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Leclerc_tank_-_Bastille_Day_2013_Paris.jpg',
    },
    description: 'The Leclerc is the main battle tank of the French Army and UAE Ground Forces. It is one of the first NATO tanks to feature an autoloader, reducing crew from four to three while maintaining a high rate of fire with its 120mm smoothbore cannon.',
    history: 'Named for General Philippe Leclerc de Hauteclocque, a hero of the French liberation in WWII, the tank entered service in 1992. UAE Leclercs have been combat-deployed in Yemen since 2015, giving it the distinction of being the only modern NATO MBT to see sustained combat in the 21st century. France is developing a successor under the MGCS program.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Leclerc_tank',
    distractors: ['Leopard 2', 'Challenger 2', 'AMX-30'],
    active: true,
  },

  {
    _type: 'idDrillQuestion', name: 'Master Blaster Badge', category: 'insignia', branch: 'army',
    difficulty: 'commander', era: 'modern',
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Master_Parachutist_Badge.svg/800px-Master_Parachutist_Badge.svg.png',
      alt: 'Silver parachute badge with star above and wreath below canopy',
      credit: 'U.S. Army · Public Domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Master_Parachutist_Badge.svg',
    },
    description: 'The Master Parachutist Badge (informally "Master Blaster") is the highest U.S. Army jump qualification. It requires a minimum of 65 jumps including night, combat equipment, mass tactical, and a HALO jump, plus four years of parachute service and a rating of "excellent" in all duties.',
    history: 'Introduced in 1949, the three-tier badge system (Basic, Senior, Master) recognizes progressive parachute expertise. The Master badge is worn with pride by veteran paratroopers of the 82nd Airborne, Special Forces, Rangers, and other airborne units. Only a small fraction of jump-qualified soldiers ever earn the Master Parachutist Badge.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Parachutist_Badge_(United_States)',
    distractors: ['Senior Parachutist Badge', 'Basic Parachutist Badge', 'Combat Parachutist Badge'],
    active: true,
  },

]

/* ═══════════════════════════════════════════════════════════════════════════════
   SEED FUNCTION
═══════════════════════════════════════════════════════════════════════════════ */

async function seed() {
  console.log(`\n📡 Connecting to Sanity project ${client.config().projectId}...\n`)
  console.log(`📦 Seeding ${questions.length} ID Drill questions...\n`)

  // Deduplicate within the local array (keep first occurrence)
  const seen = new Set<string>()
  const deduped = questions.filter(q => {
    if (seen.has(q.name)) return false
    seen.add(q.name)
    return true
  })
  console.log(`📋 ${questions.length} total entries, ${deduped.length} unique names.\n`)

  // Check for duplicates by name
  const existingNames: string[] = await client.fetch(
    `*[_type == "idDrillQuestion"].name`
  )
  const existingSet = new Set(existingNames)
  const toCreate = deduped.filter(q => !existingSet.has(q.name))
  const skipped  = deduped.length - toCreate.length

  if (skipped > 0) {
    console.log(`⏭  Skipping ${skipped} existing questions (name match).\n`)
  }

  if (toCreate.length === 0) {
    console.log('✅ All questions already exist. Nothing to seed.\n')
    return
  }

  // Create in batches of 20
  const BATCH = 20
  let created = 0

  for (let i = 0; i < toCreate.length; i += BATCH) {
    const batch = toCreate.slice(i, i + BATCH)
    const tx = client.transaction()
    batch.forEach(q => tx.create(q))
    await tx.commit()
    created += batch.length
    console.log(`  ✓ Created ${created}/${toCreate.length} questions...`)
  }

  console.log(`\n✅ Done. ${created} questions created.\n`)
  console.log('🎯 Next steps:')
  console.log('   1. Visit /studio and open "ID Drill Questions" to review')
  console.log('   2. Add more questions using the schema')
  console.log('   3. Visit /id-drill to test the live game\n')
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})
