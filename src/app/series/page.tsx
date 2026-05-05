import { client, seriesQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import SeriesCard from '@/components/SeriesCard'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function SeriesIndexPage() {
  const series = await client.fetch(seriesQuery).catch(() => [])

  return (
    <>
      <HeaderWrapper />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 rule-top" />
          <h1 className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">All Series</h1>
          <div className="flex-1 rule-top" />
        </div>

        {series.length > 0 ? (
          /*
           * Asymmetric zig-zag grid — 5-col base, alternating 3/2 and 2/3 widths.
           * Row 1: [item 0 — 60%] [item 1 — 40%]
           * Row 2: [item 2 — 40%] [item 3 — 60%]
           * Collapses to single-column on mobile (below md).
           */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
            {series.map((s: Parameters<typeof SeriesCard>[0]['series'], i: number) => {
              const colSpan =
                i % 4 === 0 ? 'md:col-span-3' :
                i % 4 === 1 ? 'md:col-span-2' :
                i % 4 === 2 ? 'md:col-span-2' :
                              'md:col-span-3'
              return (
                <div key={s._id} className={colSpan}>
                  <SeriesCard series={s} index={i} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-rule">
            <p className="era-label mb-4">Archive</p>
            <p className="font-headline font-bold text-ink text-2xl mb-2">No series yet</p>
            <p className="font-body text-mist text-base">Series are added as multi-part investigations are completed.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
