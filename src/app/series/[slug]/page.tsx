import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client, seriesBySlugQuery, seriesQuery } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 60

export async function generateStaticParams() {
  const series = await client.fetch(seriesQuery).catch(() => [])
  return series.map((s: { slug: { current: string } }) => ({ slug: s.slug.current }))
}

interface Params { params: Promise<{ slug: string }> }

export default async function SeriesPage({ params }: Params) {
  const { slug } = await params
  const series = await client.fetch(seriesBySlugQuery, { slug }).catch(() => null)

  if (!series) notFound()

  const imageUrl = series.coverImage
    ? urlFor(series.coverImage).width(1800).height(600).fit('crop').url()
    : null

  return (
    <>
      <Header />

      <main>
        {/* ── Series Hero ─────────────────────────────────────────────── */}
        <div className="relative w-full aspect-[21/6] overflow-hidden bg-ink">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={series.coverImage?.alt || series.title}
              fill
              priority
              className="object-cover opacity-70"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-olive to-ink" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10">
            <p className="font-body text-paper/40 text-[0.65rem] tracking-[0.3em] uppercase mb-2">Flagship Series</p>
            <h1 className="font-headline font-black text-paper text-display-sm md:text-display leading-tight">
              {series.title}
            </h1>
            {series.description && (
              <p className="font-body text-paper/70 text-body mt-3 max-w-2xl">{series.description}</p>
            )}
          </div>
        </div>

        {/* ── Article Grid ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 rule-top" />
            <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">
              {series.articles?.length ?? 0} {series.articles?.length === 1 ? 'Entry' : 'Entries'}
            </span>
            <div className="flex-1 rule-top" />
          </div>

          {series.articles?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {series.articles.map((article: Parameters<typeof ArticleCard>[0]['article']) => (
                <ArticleCard key={article._id} article={article} size="md" showExcerpt />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-rule">
              <p className="font-body text-mist text-lg tracking-wider uppercase">Dispatches incoming</p>
              <p className="font-body text-mist/60 text-base mt-2">First entry in this series coming soon.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
