import { client, seriesQuery } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeriesCard from '@/components/SeriesCard'

export const revalidate = 60

export default async function SeriesIndexPage() {
  const series = await client.fetch(seriesQuery).catch(() => [])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 rule-top" />
          <h1 className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">All Series</h1>
          <div className="flex-1 rule-top" />
        </div>

        {series.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {series.map((s: Parameters<typeof SeriesCard>[0]['series'], i: number) => (
              <SeriesCard key={s._id} series={s} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center font-body text-mist py-20 tracking-widest uppercase">Series coming soon</p>
        )}
      </main>
      <Footer />
    </>
  )
}
