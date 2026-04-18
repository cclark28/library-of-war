import { client, articlesQuery, seriesQuery } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroArticle from '@/components/HeroArticle'
import ArticleCard from '@/components/ArticleCard'
import SeriesCard from '@/components/SeriesCard'

export const revalidate = 60

export default async function HomePage() {
  const [articles, series] = await Promise.all([
    client.fetch(articlesQuery).catch(() => []),
    client.fetch(seriesQuery).catch(() => []),
  ])

  const hero       = articles[0]    ?? null
  const secondary  = articles.slice(1, 4)
  const tertiary   = articles.slice(4, 10)

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        {hero ? (
          <HeroArticle article={hero} />
        ) : (
          <div className="bg-ink text-paper/30 text-center py-24 font-body text-lg tracking-widest uppercase">
            Archive loading — publish your first article in Sanity Studio
          </div>
        )}

        {/* ── Secondary grid + Series ────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 mt-12">

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 rule-top" />
            <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">Latest Dispatches</span>
            <div className="flex-1 rule-top" />
          </div>

          {/* 3-column grid */}
          {secondary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {secondary.map((article: typeof articles[0]) => (
                <ArticleCard key={article._id} article={article} size="md" showExcerpt />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/2] bg-ghost mb-4" />
                  <div className="h-3 bg-ghost w-1/4 mb-3" />
                  <div className="h-6 bg-ghost w-3/4 mb-2" />
                  <div className="h-4 bg-ghost w-full mb-1" />
                  <div className="h-4 bg-ghost w-5/6" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Flagship Series ────────────────────────────────────────── */}
        <section className="bg-ink mt-16 py-16" aria-label="Flagship series">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 border-t border-paper/20" />
              <h2 className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-paper/40">
                Flagship Series
              </h2>
              <div className="flex-1 border-t border-paper/20" />
            </div>

            {series.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {series.slice(0, 3).map((s: typeof series[0], i: number) => (
                  <SeriesCard key={s._id} series={s} index={i} />
                ))}
              </div>
            ) : (
              /* Placeholder cards if no series yet */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Weapons That Shouldn\'t Have Worked', href: '/series/weapons-that-shouldnt-have-worked' },
                  { title: 'The Day After',                       href: '/series/the-day-after' },
                  { title: 'Ghost Gear',                          href: '/series/ghost-gear' },
                ].map((s, i) => (
                  <div key={i} className="border border-paper/10 p-6">
                    <p className="font-body text-paper/30 text-[0.65rem] tracking-[0.25em] uppercase mb-2">Coming</p>
                    <h3 className="font-headline text-paper text-xl font-bold">{s.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Tertiary grid ─────────────────────────────────────────── */}
        {tertiary.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 rule-top" />
              <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">From the Archive</span>
              <div className="flex-1 rule-top" />
            </div>

            {/* 2+4 layout: 1 large left, 2x2 right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Large card */}
              <ArticleCard article={tertiary[0]} size="lg" showExcerpt />

              {/* Small 2x2 grid */}
              <div className="grid grid-cols-2 gap-6">
                {tertiary.slice(1, 5).map((article: typeof articles[0]) => (
                  <ArticleCard key={article._id} article={article} size="sm" showExcerpt={false} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Browse CTA ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 mt-16 mb-4">
          <div className="border border-rule p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-headline text-2xl font-bold text-ink">Browse the full archive</h2>
              <p className="font-body text-mist text-base mt-1">60+ deep-dives across eras, theatres, and weapons.</p>
            </div>
            <a
              href="/browse"
              className="inline-block font-body text-[0.75rem] tracking-[0.2em] uppercase bg-ink text-paper px-8 py-3 hover:bg-accent transition-colors"
            >
              Enter Archive
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
