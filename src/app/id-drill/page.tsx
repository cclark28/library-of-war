import type { Metadata } from 'next'
import { createClient } from 'next-sanity'
import IDDrillClient from './IDDrillClient'

export const metadata: Metadata = {
  title: 'ID Drill',
  description: 'Test your military recognition skills. 25 questions. 25 seconds each. Identify aircraft, armor, small arms, warships, ranks, and medals from public domain photographs.',
}

export const revalidate = 60 // 60-second ISR

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const QUERY = `
  *[_type == "idDrillQuestion" && active == true] {
    _id,
    name,
    category,
    branch,
    difficulty,
    era,
    "image": {
      "url":       image.url,
      "alt":       image.alt,
      "credit":    image.credit,
      "sourceUrl": image.sourceUrl,
    },
    description,
    history,
    wikiUrl,
    distractors,
  }
`

export default async function IDDrillPage() {
  let questions: IDDrillQuestion[] = []
  let fetchError = false

  try {
    questions = await client.fetch(QUERY)
  } catch (e) {
    console.error('[ID Drill] Sanity fetch failed:', e)
    fetchError = true
  }

  return <IDDrillClient questions={questions} fetchError={fetchError} />
}

// Shared type — also exported for use in client component
export interface IDDrillQuestion {
  _id:         string
  name:        string
  category:    'aircraft' | 'armor' | 'smallarms' | 'warship' | 'rank' | 'medal' | 'insignia' | 'artillery'
  branch:      'all' | 'army' | 'navy' | 'airforce' | 'marines' | 'coastguard' | 'spaceforce'
  difficulty:  'recruit' | 'sergeant' | 'commander'
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
}
