import Link from 'next/link'
import Image from 'next/image'
import { client, articlesQuery, seriesQuery, urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import VoiceBadge from '@/components/VoiceBadge'
import NewsletterForm from '@/components/NewsletterForm'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  voice: 'analyst' | 'correspondent'
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string; caption?: string; hotspot?: { x: number; y: number } }
  series?: { title: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string }; era?: string }>
}

type Series = {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  coverImage?: { asset: { _ref: string }; alt?: string }
}

// Group articles by their first category title
function groupByEra(articles: Article[]): Record<string, Article[]> {
  return articles.reduce<Record<string, Article[]>>((acc, article) => {
    const key = article.categories?.[0]?.title || 'From the Archive'
    if (!acc[key]) acc[key] = []
    acc[key].push(article)
    return acc
  }, {})
}

/* ── Section divider ─────────────────────────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 my-10">
      <div className="flex-1 border-t border-rule" />
      <span className="era-label">{label}</span>
      <div className="flex-1 border-t border-rule" />
    </div>
  )
}

/* ── Hero block: large left + 2 stacked right ────────────────────────────────── */
function HeroGrid({ hero, stack }: { hero: Article; stack: Article[] }) {
  const heroImg = hero.mainImage
    ? urlFor(hero.mainImage).width(1200).height(800).fit('crop').url()
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-b border-rule">
      {/* Large left */}
      <Link
        href={`/articles/${hero.slug.current}`}
        className="lg:col-span-3 block group relative overflow-hidden bg-ink"
        style={{ minHeight: '420px' }}
      >
        {heroImg ? (
          <Image
            src={heroImg}
            alt={hero.mainImage?.alt || hero.title}
            fill
            priority
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
        <div className="absolute inset-0 hero-gradient" />

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <VoiceBadge voice={hero.voice} />
            {hero.categories?.[0] && (
              <span className="tag-pill" style={{ borderColor: 'rgba(200,184,154,0.4)', color: 'rgba(249,246,240,0.6)' }}>
                {hero.categories[0].title}
              </span>
            )}
            {hero.series && (
              <span className="tag-pill tag-pill-accent" style={{ borderColor: 'rgba(139,26,26,0.6)', color: 'rgba(249,246,240,0.7)' }}>
                {hero.series.title}
              </span>
            )}
          </div>
          <h2 className="font-headline font-black text-paper text-2xl md:text-3xl lg:text-4xl leading-tight max-w-xl mb-3 group-hover:text-paper/90 transition-colors">
            {hero.title}
          </h2>
          {hero.excerpt && (
            <p className="font-body text-paper/60 text-sm leading-relaxed max-w-md hidden md:block line-clamp-2">
              {hero.excerpt}
            </p>
          )}
          {hero.publishedAt && (
            <p className="font-body text-paper/35 text-[0.6rem] tracking-[0.2em] uppercase mt-3">
              {formatDate(hero.publishedAt)}
            </p>
          )}
        </div>
      </Link>

      {/* Stacked right */}
      <div className="lg:col-span-2 flex flex-col divide-y divide-rule">
        {stack.slice(0, 2).map((article) => {
          const img = article.mainImage
            ? urlFor(article.mainImage).width(700).height(420).fit('crop').url()
            : null
          return (
            <Link
              key={article._id}
              href={`/articles/${article.slug.current}`}
              className="group flex-1 flex flex-col relative overflow-hidden bg-ghost"
              style={{ minHeight: '210px' }}
            >
              {img ? (
                <Image
                  src={img}
                  alt={article.mainImage?.alt || article.title}
                  fill
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 bg-ghost" />
              )}
              <div className="absolute inset-0 hero-gradient" />
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  {article.categories?.[0] && (
                    <span className="tag-pill" style={{ borderColor: 'rgba(200,184,154,0.35)', color: 'rgba(249,246,240,0.55)' }}>
                      {article.categories[0].title}
                    </span>
                  )}
                </div>
                <h2 className="font-headline font-bold text-paper text-lg leading-snug group-hover:text-paper/85 transition-colors">
                  {article.title}
                </h2>
                {article.publishedAt && (
                  <p className="font-body text-paper/30 text-[0.58rem] tracking-widest uppercase mt-1.5">
                    {formatDate(article.publishedAt)}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ── Newsletter strip ─────────────────────────────────────────────────────────── */
function NewsletterStrip() {
  return (
    <div className="border-y border-rule py-10 text-center my-0">
      <p className="era-label mb-1">Newsletter</p>
      <p className="font-headline font-bold text-ink text-xl md:text-2xl mb-5">
        Be up to date with the newest dispatches
      </p>
      <NewsletterForm />
    </div>
  )
}

/* ── Filter bar ───────────────────────────────────────────────────────────────── */
function FilterBar() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-rule text-[0.62rem] font-body tracking-[0.18em] uppercase">
      <div className="flex items-center gap-4">
        <button className="text-ink hover:text-accent transition-colors flex items-center gap-1">
          Filter <span className="text-mist">+</span>
        </button>
        <span className="text-rule">|</span>
        <span className="text-mist">Show All</span>
      </div>
      <button className="text-mist hover:text-ink transition-colors flex items-center gap-1">
        Sort By <span>+</span>
      </button>
    </div>
  )
}

/* ── Placeholder card ─────────────────────────────────────────────────────────── */
function PlaceholderCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className="animate-pulse">
      <div className={`bg-ghost w-full mb-3 ${tall ? 'aspect-[3/2]' : 'aspect-[16/9]'}`} />
      <div className="h-2 bg-ghost w-1/4 mb-2" />
      <div className="h-5 bg-ghost w-5/6 mb-1" />
      <div className="h-5 bg-ghost w-2/3 mb-3" />
      <div className="h-3 bg-ghost w-1/3" />
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const [articles, series] = await Promise.all([
    client.fetch(articlesQuery).catch(() => []) as Promise<Article[]>,
    client.fetch(seriesQuery).catch(() => []) as Promise<Series[]>,
  ])

  const hero      = articles[0] ?? null
  const stack     = articles.slice(1, 3)
  const grid3     = articles.slice(3, 6)
  const grid4     = articles.slice(6, 10)
  const remaining = articles.slice(10)

  // Group remaining articles by era for section-based display
  const byEra = groupByEra(remaining)

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-5 md:px-6">

        {/* ── Filter bar ─────────────────────────────────────────────── */}
        <FilterBar />

        {/* ── Hero grid ──────────────────────────────────────────────── */}
        {hero ? (
          <HeroGrid hero={hero} stack={stack} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border-b border-rule">
            <div className="lg:col-span-3 animate-pulse bg-ghost" style={{ minHeight: '420px' }} />
            <div className="lg:col-span-2 flex flex-col divide-y divide-rule">
              <div className="flex-1 animate-pulse bg-ghost/60" style={{ minHeight: '210px' }} />
              <div className="flex-1 animate-pulse bg-ghost/40" style={{ minHeight: '210px' }} />
            </div>
          </div>
        )}

        {/* ── 3-column grid ──────────────────────────────────────────── */}
        <SectionDivider label="Latest Dispatches" />

        {grid3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {grid3.map((article) => (
              <ArticleCard key={article._id} article={article} size="md" showExcerpt />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[0,1,2].map((i) => <PlaceholderCard key={i} tall />)}
          </div>
        )}

        {/* ── Newsletter ─────────────────────────────────────────────── */}
        <div className="mt-14">
          <NewsletterStrip />
        </div>

        {/* ── 4-column grid ──────────────────────────────────────────── */}
        {grid4.length > 0 && (
          <>
            <SectionDivider label="From the Archive" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {grid4.map((article) => (
                <ArticleCard key={article._id} article={article} size="sm" showExcerpt={false} />
              ))}
            </div>
          </>
        )}

        {/* ── Era-grouped sections ────────────────────────────────────── */}
        {Object.entries(byEra).map(([era, eraArticles]) => (
          <section key={era} aria-label={era}>
            <SectionDivider label={era} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {eraArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article._id} article={article} size="md" showExcerpt />
              ))}
            </div>
            {eraArticles.length > 3 && (
              <div className="text-center mt-8">
                <Link
                  href={`/browse?era=${eraArticles[0]?.categories?.[0]?.slug?.current ?? ''}`}
                  className="era-label hover:text-ink transition-colors border-b border-rule pb-px"
                >
                  More {era} →
                </Link>
              </div>
            )}
          </section>
        ))}

        {/* ── Flagship Series ─────────────────────────────────────────── */}
        <SectionDivider label="Flagship Series" />

        {series.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
            {series.slice(0, 3).map((s) => {
              const img = s.coverImage
                ? urlFor(s.coverImage).width(700).height(420).fit('crop').url()
                : null
              return (
                <Link
                  key={s._id}
                  href={`/series/${s.slug.current}`}
                  className="group block relative overflow-hidden bg-ink aspect-[4/3]"
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={s.coverImage?.alt || s.title}
                      fill
                      className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-ink" />
                  )}
                  <div className="absolute inset-0 hero-gradient" />
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                    <p className="era-label text-paper/40 mb-1">Series</p>
                    <h3 className="font-headline font-black text-paper text-xl leading-snug group-hover:text-paper/85 transition-colors">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="font-body text-paper/50 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
            {[
              'Weapons That Shouldn\'t Have Worked',
              'The Day After',
              'Ghost Gear',
            ].map((title, i) => (
              <div key={i} className="border border-rule p-8 aspect-[4/3] flex flex-col justify-end">
                <p className="era-label mb-2">Coming Soon</p>
                <h3 className="font-headline font-bold text-ink text-xl">{title}</h3>
              </div>
            ))}
          </div>
        )}

        {/* ── See all CTA ─────────────────────────────────────────────── */}
        <div className="border-y border-rule py-8 text-center mt-12 mb-2">
          <Link
            href="/browse"
            className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist hover:text-ink transition-colors"
          >
            — See All Archive Articles —
          </Link>
        </div>

      </main>

      <Footer />
    </>
  )
}
