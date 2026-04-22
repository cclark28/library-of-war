import { client, articlesByEraQuery, articlesQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'

export const runtime = 'edge'
export const revalidate = 60

/* ── Era metadata map ────────────────────────────────────────────────────────── */

const ERA_META: Record<string, { label: string; years: string; description: string }> = {
  'world-war-i':      { label: 'World War I',       years: '1914–1918',    description: 'The war that was supposed to end all wars. Trenches, gas, and the collapse of empires.' },
  'world-war-ii':     { label: 'World War II',      years: '1939–1945',    description: 'The largest armed conflict in human history. Total war across six continents.' },
  'korean-war':       { label: 'Korean War',        years: '1950–1953',    description: 'The forgotten war. A proxy conflict that never officially ended.' },
  'vietnam-war':      { label: 'Vietnam War',       years: '1955–1975',    description: 'Guerrilla warfare, political fracture, and the limits of American power.' },
  'cold-war':         { label: 'Cold War',          years: '1947–1991',    description: 'Four decades of shadow warfare, nuclear brinkmanship, and ideological confrontation.' },
  'modern-conflicts': { label: 'Modern Conflicts',  years: '1990–Present', description: 'From the Gulf War to asymmetric warfare in the 21st century.' },
  'ancient-medieval': { label: 'Ancient & Medieval', years: 'Antiquity–1500', description: 'Bronze and iron, siege engines and cavalry. War at the dawn of civilization.' },
  'napoleonic':       { label: 'Napoleonic Wars',   years: '1803–1815',    description: 'Napoleon\'s conquest of Europe and the birth of modern total war.' },
  'civil-war':        { label: 'American Civil War', years: '1861–1865',   description: 'Brother against brother. The war that defined the American nation.' },
  'wwi':              { label: 'World War I',        years: '1914–1918',   description: 'The war that was supposed to end all wars. Trenches, gas, and the collapse of empires.' },
  'wwii':             { label: 'World War II',       years: '1939–1945',   description: 'The largest armed conflict in human history. Total war across six continents.' },
  'vietnam':          { label: 'Vietnam War',        years: '1955–1975',   description: 'Guerrilla warfare, political fracture, and the limits of American power.' },
  'modern':           { label: 'Modern Conflicts',   years: '1990–Present', description: 'From the Gulf War to asymmetric warfare in the 21st century.' },
  'technology':       { label: 'Technology & Weapons', years: 'All Eras',  description: 'The instruments of war. From the longbow to the nuclear arsenal.' },
  'intel-specops':    { label: 'Intelligence & Spec Ops', years: 'All Eras', description: 'The secret wars. Spies, saboteurs, and the operations history almost forgot.' },
}

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string; hotspot?: { x: number; y: number } }
  series?: { title: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string } }>
}

interface Props {
  searchParams: Promise<{ era?: string }>
}

export default async function BrowsePage({ searchParams }: Props) {
  const { era } = await searchParams

  const meta = era ? ERA_META[era] : null

  const articles: Article[] = era
    ? await client.fetch(articlesByEraQuery, { era }).catch(() => [])
    : await client.fetch(articlesQuery).catch(() => [])

  const pageTitle = meta?.label ?? 'All Articles'
  const pageYears = meta?.years ?? ''
  const pageDesc  = meta?.description ?? 'The full archive. Every era. Every entry.'

  return (
    <>
      <HeaderWrapper />

      <main>

        {/* ── Era Banner ──────────────────────────────────────────────── */}
        <div className="border-b-2 border-ink bg-paper px-6 py-14 md:py-20 text-center">
          {pageYears && (
            <p className="font-body text-[0.6rem] tracking-[0.35em] uppercase text-mist mb-4">
              {pageYears}
            </p>
          )}
          <h1 className="font-headline font-black text-ink text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-5">
            {pageTitle}
          </h1>
          <div className="w-10 h-px bg-accent mx-auto mb-5" />
          <p className="font-body text-mist text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {pageDesc}
          </p>
        </div>

        {/* ── Era Nav ─────────────────────────────────────────────────── */}
        <div className="border-b border-rule bg-ghost overflow-x-auto">
          <div className="max-w-7xl mx-auto px-6 py-0 flex items-stretch gap-0">
            {[
              { label: 'All',              href: '/browse' },
              { label: 'WWI',              href: '/browse?era=world-war-i' },
              { label: 'WWII',             href: '/browse?era=world-war-ii' },
              { label: 'Korean War',       href: '/browse?era=korean-war' },
              { label: 'Vietnam',          href: '/browse?era=vietnam-war' },
              { label: 'Cold War',         href: '/browse?era=cold-war' },
              { label: 'Modern',           href: '/browse?era=modern-conflicts' },
              { label: 'Ancient & Medieval', href: '/browse?era=ancient-medieval' },
              { label: 'Napoleonic',       href: '/browse?era=napoleonic' },
              { label: 'Civil War',        href: '/browse?era=civil-war' },
            ].map((item) => {
              const isActive = item.href === `/browse?era=${era}` || (!era && item.href === '/browse')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex-shrink-0 px-5 py-3.5
                    font-body text-[0.65rem] tracking-[0.18em] uppercase
                    border-r border-rule last:border-r-0
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-ink text-paper'
                      : 'text-ink hover:text-accent hover:bg-paper/60'
                    }
                  `}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>

        {/* ── Article Grid ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-24">

          {/* Count */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 rule-top" />
            <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">
              {articles.length} {articles.length === 1 ? 'Entry' : 'Entries'}
            </span>
            <div className="flex-1 rule-top" />
          </div>

          {articles.length > 0 ? (
            <>
              {/* Hero row — first article full width, next two side by side */}
              {articles.length >= 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-rule mb-8">
                  {/* Hero left */}
                  <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-rule p-6 md:p-8">
                    <ArticleCard article={articles[0]} size="lg" showExcerpt />
                  </div>

                  {/* Stack right */}
                  <div className="lg:col-span-2 flex flex-col divide-y divide-rule">
                    {articles.slice(1, 3).map((article) => (
                      <div key={article._id} className="p-6">
                        <ArticleCard article={article} size="md" showExcerpt />
                      </div>
                    ))}
                    {articles.length < 2 && (
                      <div className="p-6 flex items-center justify-center h-full">
                        <p className="font-body text-mist/40 text-xs tracking-widest uppercase">More coming</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining articles — 3-col grid */}
              {articles.length > 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {articles.slice(3).map((article) => (
                    <ArticleCard key={article._id} article={article} size="md" showExcerpt />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-28 border border-rule">
              <p className="font-body text-mist text-lg tracking-wider uppercase mb-2">No entries yet</p>
              <p className="font-body text-mist/50 text-sm">
                {era ? `The ${pageTitle} archive is being compiled.` : 'The archive is being assembled.'}
              </p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </>
  )
}
