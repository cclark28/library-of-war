/**
 * Shared era metadata used by EraGrid (homepage), era/[slug] pages, and BrowseClient.
 * All 13 slugs must exactly match the `article.era` field in Sanity.
 */

export const ERA_META: Record<string, { label: string; years: string; description: string }> = {
  'world-war-ii': {
    label: 'World War II',
    years: '1939–1945',
    description: 'The largest armed conflict in human history. Total war across six continents.',
  },
  'world-war-i': {
    label: 'World War I',
    years: '1914–1918',
    description: 'The war that was supposed to end all wars. Trenches, gas, and the collapse of empires.',
  },
  'cold-war': {
    label: 'Cold War',
    years: '1947–1991',
    description: 'Four decades of shadow warfare, nuclear brinkmanship, and ideological confrontation.',
  },
  'vietnam-war': {
    label: 'Vietnam War',
    years: '1955–1975',
    description: 'Guerrilla warfare, political fracture, and the limits of American power.',
  },
  'korean-war': {
    label: 'Korean War',
    years: '1950–1953',
    description: 'The forgotten war. A proxy conflict that never officially ended.',
  },
  'modern-conflicts': {
    label: 'Modern Conflicts',
    years: '1990–Present',
    description: 'From the Gulf War to asymmetric warfare in the 21st century.',
  },
  'ancient-medieval': {
    label: 'Ancient & Medieval',
    years: 'Antiquity–1500',
    description: 'Bronze and iron, siege engines and cavalry. War at the dawn of civilization.',
  },
  'early-modern': {
    label: 'Early Modern',
    years: '1500–1800',
    description: 'Gunpowder, empire, and the age of European global dominance.',
  },
  'napoleonic-wars': {
    label: 'Napoleonic Wars',
    years: '1803–1815',
    description: "Napoleon's conquest of Europe and the birth of modern total war.",
  },
  'american-civil-war': {
    label: 'American Civil War',
    years: '1861–1865',
    description: 'Brother against brother. The war that defined the American nation.',
  },
  'technology-weapons': {
    label: 'Technology & Weapons',
    years: 'All Eras',
    description: 'The instruments of war. From the longbow to the nuclear arsenal.',
  },
  'intelligence-special-ops': {
    label: 'Intelligence & Spec Ops',
    years: 'All Eras',
    description: 'The secret wars. Spies, saboteurs, and the operations history almost forgot.',
  },
  'black-projects': {
    label: 'Black Projects',
    years: 'All Eras',
    description: 'Classified, denied, and compartmentalised. The programs that never officially existed.',
  },
}

/**
 * Canonical display order for the Era Grid (spec page 4, top-left → bottom-right).
 * Row 1: WWII, WWI, Cold War, Vietnam
 * Row 2: Korean, Modern Conflicts, Ancient & Medieval, Early Modern
 * Row 3: Napoleonic, American Civil War, Technology & Weapons, Intel & Spec Ops
 * Row 4: Black Projects (sole tile, left-aligned)
 */
export const ERA_ORDER = [
  'world-war-ii',
  'world-war-i',
  'cold-war',
  'vietnam-war',
  'korean-war',
  'modern-conflicts',
  'ancient-medieval',
  'early-modern',
  'napoleonic-wars',
  'american-civil-war',
  'technology-weapons',
  'intelligence-special-ops',
  'black-projects',
] as const

export type EraSlug = typeof ERA_ORDER[number]
