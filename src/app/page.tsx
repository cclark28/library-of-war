import Link from 'next/link'
import Image from 'next/image'
import { client, liveClient, articlesQuery, seriesQuery, siteSettingsQuery, homepageContentQuery, urlFor } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import FadeIn from '@/components/FadeIn'

// Edge runtime required for Cloudflare Pages.
// force-dynamic ensures every request fetches fresh content from Sanity:
// - Articles use the CDN client (near-instant invalidation on publish)
// - siteSettings uses liveClient (bypasses CDN) so section toggles take
//   effect within seconds of saving in Sanity Studio — no rebuild needed.
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string; caption?: string; hotspot?: { x: number; y: number } }
  author?: { name: string; slug?: { current: string }; role?: string; photo?: { asset: { _ref: string } } }
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

function groupByEra(articles: Article[]): Record<string, Article[]> {
  return articles.reduce<Record<string, Article[]>>((acc, article) => {
    const key = article.categories?.[0]?.title || 'From the Archive'
    if (!acc[key]) acc[key] = []
    acc[key].push(article)
    return acc
  }, {})
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 my-12">
      <div className="flex-1 border-t border-rule" />
      <span className="font-headline font-bold text-ink text-[2rem] leading-none">{label}</span>
      <div className="flex-1 border-t border-rule" />
    </div>
  )
}

function HeroGrid({ hero, stack }: { hero: Article; stack: Article[] }) {
  const heroImg = hero.mainImage
    ? urlFor(hero.mainImage).width(1200).height(800).fit('crop').url()
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
      <Link
        href={`/articles/${hero.slug.current}`}
        className="lg:col-span-3 block group relative overflow-hidden bg-ink"
        style={{ minHeight: '460px' }}
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
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-10">
          <div className="flex items-center gap-3 mb-4">
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
          <h2 className="font-headline font-black text-paper text-3xl md:text-4xl lg:text-5xl leading-tight max-w-xl group-hover:text-paper/90 transition-colors">
            {hero.title}
          </h2>
        </div>
      </Link>

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
              style={{ minHeight: '230px' }}
            >
              {img ? (
                <Image
                  src={img}
                  alt={article.mainImage?.alt || article.title}
                  fill
                  loading="lazy"
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 bg-ghost" />
              )}
              <div className="absolute inset-0 hero-gradient" />
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                {article.categories?.[0] && (
                  <span className="tag-pill mb-2 inline-block" style={{ borderColor: 'rgba(200,184,154,0.35)', color: 'rgba(249,246,240,0.55)' }}>
                    {article.categories[0].title}
                  </span>
                )}
                <h2 className="font-headline font-bold text-paper text-xl leading-snug group-hover:text-paper/85 transition-colors">
                  {article.title}
                </h2>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


type SiteSettings = {
  maintenanceMode?: boolean
  maintenanceTitle?: string
  maintenanceMessage?: string
  maintenanceFact?: string
  logo?: { asset: { _ref: string } }
  sections?: {
    showHero?: boolean
    showLatestDispatches?: boolean
    showFromArchive?: boolean
    showEraGrid?: boolean
    showFlagshipSeries?: boolean
  }
}

type HomepageContent = {
  latestDispatchesLabel?: string
  fromArchiveLabel?: string
  flagshipSeriesLabel?: string
  seeAllLabel?: string
  comingSoonLabel?: string
  filterLabel?: string
  showAllLabel?: string
  sortLabel?: string
  mastTagline?: string
}

export default async function HomePage() {
  const [articles, series, settings, hpContent] = await Promise.all([
    client.fetch(articlesQuery).catch(() => []) as Promise<Article[]>,
    client.fetch(seriesQuery).catch(() => []) as Promise<Series[]>,
    liveClient.fetch(siteSettingsQuery).catch(() => null) as Promise<SiteSettings | null>,
    liveClient.fetch(homepageContentQuery).catch(() => null) as Promise<HomepageContent | null>,
  ])

  const labels = {
    latestDispatches: hpContent?.latestDispatchesLabel ?? 'Latest Dispatches',
    fromArchive:      hpContent?.fromArchiveLabel      ?? 'From the Archive',
    flagshipSeries:   hpContent?.flagshipSeriesLabel   ?? 'Flagship Series',
    seeAll:           hpContent?.seeAllLabel           ?? '— See All Archive Articles —',
    comingSoon:       hpContent?.comingSoonLabel        ?? 'Coming Soon',
    filter:           hpContent?.filterLabel           ?? 'Filter',
    showAll:          hpContent?.showAllLabel           ?? 'Show All',
    sort:             hpContent?.sortLabel              ?? 'Sort By',
  }

  // Section flags — default everything ON if siteSettings not yet configured
  const flags = {
    showHero:              settings?.sections?.showHero              ?? true,
    showLatestDispatches:  settings?.sections?.showLatestDispatches  ?? true,
    showFromArchive:       settings?.sections?.showFromArchive        ?? true,
    showEraGrid:           settings?.sections?.showEraGrid            ?? true,
    showFlagshipSeries:    settings?.sections?.showFlagshipSeries     ?? true,
  }

  if (settings?.maintenanceMode) {
    const logoUrl = settings.logo ? urlFor(settings.logo).width(240).url() : null
    const title   = settings.maintenanceTitle   || 'Back Shortly'
    const message = settings.maintenanceMessage || 'The archive is undergoing maintenance. Check back in a few minutes.'
    const fact    = settings.maintenanceFact

    return (
      <>
        <HeaderWrapper />
        <main className="max-w-2xl mx-auto px-6 py-32 text-center">
          {logoUrl && (
            <div className="flex justify-center mb-10">
              <Image
                src={logoUrl}
                alt="Library of War"
                width={160}
                height={80}
                className="object-contain opacity-80"
              />
            </div>
          )}
          <p className="era-label mb-6">System Status</p>
          <h1 className="font-headline font-black text-ink text-4xl mb-4">
            {title}
          </h1>
          <p className="font-body text-mist text-lg leading-relaxed">
            {message}
          </p>
          {fact && (
            <blockquote className="mt-12 border-l-2 border-rule pl-5 text-left font-body text-mist text-base leading-relaxed italic max-w-lg mx-auto">
              {fact}
            </blockquote>
          )}
        </main>
        <Footer />
      </>
    )
  }

  // ── Featured sections require images — imageless articles appear in archive only ──
  const featuredArticles = articles.filter(a => !!a.mainImage)

  const dayOffset = Math.floor(Date.now() / 86400000) // changes every 24h
  const shuffled = [...featuredArticles].sort((a, b) => {
    // stable daily shuffle using day seed + original index
    const ai = featuredArticles.indexOf(a), bi = featuredArticles.indexOf(b)
    return ((ai + dayOffset) % featuredArticles.length) - ((bi + dayOffset) % featuredArticles.length)
  })
  const heroSlots: Article[] = []
  const usedCats = new Set<string>()
  for (const article of shuffled) {
    const cat = article.categories?.[0]?.title ?? '__none__'
    if (!usedCats.has(cat)) { heroSlots.push(article); usedCats.add(cat) }
    if (heroSlots.length === 3) break
  }
  // Fill remaining slots if not enough category variety
  for (const article of featuredArticles) {
    if (heroSlots.length >= 3) break
    if (!heroSlots.includes(article)) heroSlots.push(article)
  }
  const heroIds = new Set(heroSlots.map(a => a._id))

  const hero  = heroSlots[0] ?? null
  const stack = heroSlots.slice(1, 3)

  // Featured grids also require images
  const featuredMinusHero = featuredArticles.filter(a => !heroIds.has(a._id))
  const grid3 = featuredMinusHero.slice(0, 3)
  const grid4 = featuredMinusHero.slice(3, 7)

  // Era archive sections: all articles not already featured (includes imageless)
  const allFeaturedIds = new Set([
    ...heroIds,
    ...grid3.map(a => a._id),
    ...grid4.map(a => a._id),
  ])
  const remaining = articles.filter(a => !allFeaturedIds.has(a._id))
  const byEra     = groupByEra(remaining)

  return (
    <>
      <HeaderWrapper />

      <main className="max-w-7xl mx-auto px-5 md:px-6">

        {flags.showHero && (hero ? (
          <div className="mt-12"><HeroGrid hero={hero} stack={stack} /></div>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-0 border-b border-rule">
            <div className="lg:col-span-3 animate-pulse bg-ghost" style={{ minHeight: '460px' }} />
            <div className="lg:col-span-2 flex flex-col divide-y divide-rule">
              <div className="flex-1 animate-pulse bg-ghost/60" style={{ minHeight: '230px' }} />
              <div className="flex-1 animate-pulse bg-ghost/40" style={{ minHeight: '230px' }} />
            </div>
          </div>
        ))}

        {flags.showLatestDispatches && (
          <>
            <SectionDivider label={labels.latestDispatches} />
            {grid3.length > 0 ? (
              <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 stagger" variant="fade-up">
                {grid3.map((article) => (
                  <ArticleCard key={article._id} article={article} size="md" showExcerpt />
                ))}
              </FadeIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[0,1,2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/2] bg-ghost w-full mb-4" />
                    <div className="h-5 bg-ghost w-5/6 mb-2" />
                    <div className="h-5 bg-ghost w-2/3" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {flags.showFromArchive && grid4.length > 0 && (
          <>
            <SectionDivider label={labels.fromArchive} />
            <FadeIn className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 stagger" variant="fade-up">
              {grid4.map((article) => (
                <ArticleCard key={article._id} article={article} size="sm" showExcerpt={false} />
              ))}
            </FadeIn>
          </>
        )}

        {flags.showEraGrid && Object.entries(byEra).map(([era, eraArticles]) => (
          <section key={era} aria-label={era}>
            <SectionDivider label={era} />
            <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 stagger" variant="fade-up">
              {eraArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article._id} article={article} size="md" showExcerpt />
              ))}
            </FadeIn>
            {eraArticles.length > 3 && (
              <div className="text-center mt-10">
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

        {flags.showFlagshipSeries && (
          <>
            <SectionDivider label={labels.flagshipSeries} />
            {series.length > 0 ? (
              <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2 stagger" variant="fade-up">
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
                          loading="lazy"
                          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-ink" />
                      )}
                      <div className="absolute inset-0 hero-gradient" />
                      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                        <p className="font-body text-[0.6rem] tracking-[0.22em] uppercase text-white/70 mb-1">Series</p>
                        <h3 className="font-headline font-black text-white text-2xl leading-snug group-hover:text-white/85 transition-colors">
                          {s.title}
                        </h3>
                        {s.description && (
                          <p className="font-body text-white/70 text-sm mt-2 leading-relaxed line-clamp-2">
                            {s.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </FadeIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-2">
                {["Weapons That Shouldn't Have Worked", 'The Day After', 'Ghost Gear'].map((title, i) => (
                  <div key={i} className="border border-rule p-8 aspect-[4/3] flex flex-col justify-end">
                    <p className="era-label mb-2">{labels.comingSoon}</p>
                    <h3 className="font-headline font-bold text-ink text-xl">{title}</h3>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="border-y border-rule py-10 text-center mt-14 mb-2">
          <Link
            href="/browse"
            className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist hover:text-ink transition-colors"
          >
            {labels.seeAll}
          </Link>
        </div>

      </main>

      <Footer />
    </>
  )
}
