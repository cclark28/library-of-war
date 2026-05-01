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

// Server component — fetches at request time, no client JS for the data layer.
// Builds a 7-entry navigation window, always anchoring today's entry at index 0
// when a match exists. Falls back to the window's most-recent entries when today
// has no specific match — section is always visible as long as any entries exist.
export default async function OnThisDay() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day   = today.getDate()

  let entries: OTDEntry[]  = []
  let todayIndex           = -1

  try {
    // Fetch the navigation window (7 most-recent entries) and today's entries in parallel
    const [windowEntries, todayEntries]: [OTDEntry[], OTDEntry[]] = await Promise.all([
      client.fetch(onThisDayWindowQuery).catch(() => []),
      client.fetch(onThisDayQuery, { month, day }).catch(() => []),
    ])

    const todayEntry = todayEntries?.[0] ?? null

    if (!windowEntries?.length && !todayEntry) return null

    entries = windowEntries ?? []

    if (todayEntry) {
      const existingIndex = entries.findIndex(e => e._id === todayEntry._id)
      if (existingIndex !== -1) {
        // Already in window — note its position
        todayIndex = existingIndex
      } else {
        // Prepend today's entry, keep window at 7
        entries    = [todayEntry, ...entries].slice(0, 7)
        todayIndex = 0
      }
    }

    if (!entries.length) return null
  } catch {
    return null
  }

  return <OnThisDayClient entries={entries} todayIndex={todayIndex} />
}
