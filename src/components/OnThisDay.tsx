import { client, onThisDayQuery, onThisDayWindowQuery } from '@/lib/sanity'
import OnThisDayClient from './OnThisDayClient'

type OTDEntry = {
  _id: string
  month: number
  day: number
  year: number
  headline: string
  summary: string
  era?: string
  linkedArticle?: { title: string; slug: { current: string } }
}

// Server component — fetches today's events (up to 3) for the grid layout.
// Falls back to the most recent window entry if today has no matches.
export default async function OnThisDay() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day   = today.getDate()

  let entries: OTDEntry[] = []

  try {
    const [todayEntries, windowEntries]: [OTDEntry[], OTDEntry[]] = await Promise.all([
      client.fetch(onThisDayQuery, { month, day }).catch(() => []),
      client.fetch(onThisDayWindowQuery).catch(() => []),
    ])

    if (todayEntries?.length) {
      entries = todayEntries.slice(0, 3)
    } else if (windowEntries?.length) {
      entries = windowEntries.slice(0, 1)
    }

    if (!entries.length) return null
  } catch {
    return null
  }

  const today2 = new Date()
  const month2 = today2.getMonth() + 1
  const day2   = today2.getDate()

  return <OnThisDayClient entries={entries} month={month2} day={day2} />
}
