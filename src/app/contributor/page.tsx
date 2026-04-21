import { client, liveClient, contributorPageQuery, seriesQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ContributorClient from './ContributorClient'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type ContributorCopy = {
  gateLabel?: string
  gateHeadline?: string
  gateSubtext?: string
  gateCtaLabel?: string
  formLabel?: string
  formHeadline?: string
  formSubtext?: string
  guidelines?: string
  submitCtaLabel?: string
  successLabel?: string
  successHeadline?: string
  successMessage?: string
}

type SeriesItem = { title: string }

export default async function ContributorPage() {
  const [copy, seriesData] = await Promise.all([
    liveClient.fetch(contributorPageQuery).catch(() => null) as Promise<ContributorCopy | null>,
    client.fetch(seriesQuery).catch(() => []) as Promise<SeriesItem[]>,
  ])

  const seriesOptions: string[] = seriesData.length
    ? seriesData.map((s) => s.title)
    : ["Weapons That Shouldn't Have Worked", 'The Day After', 'Black Projects']

  return (
    <>
      <HeaderWrapper />
      <ContributorClient copy={copy ?? {}} seriesOptions={seriesOptions} />
      <Footer />
    </>
  )
}
