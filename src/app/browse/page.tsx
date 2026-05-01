import { client, articlesQuery, searchArticlesQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import BrowseClient from '@/components/BrowseClient'

export const runtime   = 'edge'
export const revalidate = 60

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  era?: string
  tags?: string[]
  mainImage?: { asset: { _ref: string }; alt?: string; hotspot?: { x: number; y: number } }
  series?: { title: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string } }>
}

interface Props {
  searchParams: Promise<{ era?: string; q?: string }>
}

export default async function BrowsePage({ searchParams }: Props) {
  const { era, q } = await searchParams
  const searchQuery = q?.trim() ?? ''

  // ── Search path — server-rendered, separate from era browsing ──────────────
  if (searchQuery) {
    const results: Article[] = await client
      .fetch(searchArticlesQuery, { q: searchQuery })
      .catch(() => [])

    return (
      <>
        <HeaderWrapper />
        <main>
          {/* Banner */}
          <div className="border-b-2 border-ink bg-paper px-6 py-14 md:py-20 text-center">
            <h1 className="font-headline font-black text-ink text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-5">
              Search: &ldquo;{searchQuery}&rdquo;
            </h1>
            <div className="w-10 h-px bg-accent mx-auto mb-5" />
            <p className="font-body text-mist text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>

          {/* Grid */}
          <div className="max-w-7xl mx-auto px-6 mt-12 mb-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 rule-top" />
              <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">
                {results.length} {results.length === 1 ? 'Entry' : 'Entries'}
              </span>
              <div className="flex-1 rule-top" />
            </div>

            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-rule mb-8">
                  <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-rule p-6 md:p-8">
                    <ArticleCard article={results[0]} size="lg" showExcerpt />
                  </div>
                  <div className="lg:col-span-2 flex flex-col divide-y divide-rule">
                    {results.slice(1, 3).map((article) => (
                      <div key={article._id} className="p-6">
                        <ArticleCard article={article} size="md" showExcerpt />
                      </div>
                    ))}
                  </div>
                </div>
                {results.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {results.slice(3).map((article) => (
                      <ArticleCard key={article._id} article={article} size="md" showExcerpt />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-28 border border-rule">
                <p className="font-body text-mist text-lg tracking-wider uppercase mb-2">No results</p>
                <p className="font-body text-mist/50 text-sm">
                  Try a different search term or browse by era.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Era browsing — fetch all articles, filter client-side with animation ───
  const allArticles: Article[] = await client
    .fetch(articlesQuery)
    .catch(() => [])

  return (
    <>
      <HeaderWrapper />
      <main>
        <BrowseClient
          allArticles={allArticles}
          initialEra={era ?? null}
        />
      </main>
      <Footer />
    </>
  )
}
