import { liveClient, navigationQuery } from '@/lib/sanity'
import Header, { type NavData } from './Header'

// Server component — fetches nav data fresh on every request (liveClient bypasses CDN).
// Renders the interactive client Header with Sanity-controlled nav copy.
export default async function HeaderWrapper() {
  const navData: NavData | null = await liveClient
    .fetch(navigationQuery)
    .catch(() => null)

  return <Header navData={navData} />
}
