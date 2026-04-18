import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { client, articleBySlugQuery, articlesQuery } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VoiceBadge from '@/components/VoiceBadge'
import ArticleCard from '@/components/ArticleCard'

export const runtime = 'edge'
export const revalidate = 60

// Portable Text components
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string; sourceUrl?: string } }) => {
      const url = urlFor(value).width(1200).fit('max').url()
      return (
        <figure className="my-10 -mx-4 md:-mx-0">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={600}
            className="w-full object-cover"
          />
          {value.caption && (
            <figcaption className="font-body text-mist text-sm mt-2 text-center">
              {value.caption}
              {value.sourceUrl && (
                <a
                  href={value.sourceUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="ml-2 text-accent hover:underline"
                >
                  ↗ Source
                </a>
              )}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ value, children }: { value?: { href?: string; blank?: boolean }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
}

interface Params { params: Promise<{ slug: string }> }

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const [article, allArticles] = await Promise.all([
    client.fetch(articleBySlugQuery, { slug }).catch(() => null),
    client.fetch(articlesQuery).catch(() => []),
  ])

  if (!article) notFound()

  const related = allArticles
    .filter((a: { _id: string }) => a._id !== article._id)
    .slice(0, 3)

  const heroImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1800).height(800).fit('crop').url()
    : null

  const isAnalyst = article.voice === 'analyst'

  return (
    <>
      <Header />

      <main>
        {/* ── Hero Image ─────────────────────────────────────────────── */}
        {heroImageUrl ? (
          <div className="relative w-full aspect-[21/8] overflow-hidden bg-ink">
            <Image
              src={heroImageUrl}
              alt={article.mainImage?.alt || article.title}
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />

            {article.mainImage?.caption && (
              <p className="absolute bottom-3 right-4 font-body text-mist text-[0.65rem] tracking-wider">
                {article.mainImage.caption}
                {article.mainImage?.sourceUrl && (
                  <a href={article.mainImage.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-accent">
                    ↗
                  </a>
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="h-8 rule-heavy" />
        )}

        {/* ── Article Header ─────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 font-body text-[0.7rem] tracking-[0.15em] uppercase text-mist">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-rule">›</li>
              {article.series && (
                <>
                  <li>
                    <Link href={`/series/${article.series.slug.current}`} className="hover:text-accent transition-colors">
                      {article.series.title}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-rule">›</li>
                </>
              )}
              <li className="text-ink truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          {/* Voice + Category */}
          <div className="flex items-center gap-3 mb-5">
            <VoiceBadge voice={article.voice} />
            {article.categories?.[0] && (
              <Link
                href={`/browse?era=${article.categories[0].slug.current}`}
                className="font-body text-accent text-[0.7rem] tracking-[0.2em] uppercase hover:underline"
              >
                {article.categories[0].title}
              </Link>
            )}
          </div>

          {/* Analyst stamp */}
          {isAnalyst && (
            <div className="mb-6">
              <span
                className="inline-block border-2 border-accent text-accent font-body text-[0.55rem] font-bold tracking-[0.3em] uppercase px-2 py-1 opacity-70"
                style={{ transform: 'rotate(-1.5deg)' }}
                aria-hidden="true"
              >
                Classified — All Sources Verified
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="font-headline font-black text-ink text-display-sm md:text-display leading-tight mb-6 max-w-3xl">
            {article.title}
          </h1>

          {/* Excerpt / lede */}
          {article.excerpt && (
            <p className="font-body text-mist text-body-lg leading-relaxed mb-6 max-w-2xl border-l-2 border-rule pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 pb-6 rule-bottom">
            {article.publishedAt && (
              <time
                dateTime={article.publishedAt}
                className="font-body text-mist text-[0.75rem] tracking-[0.2em] uppercase"
              >
                {formatDate(article.publishedAt)}
              </time>
            )}
            {article.series && (
              <Link
                href={`/series/${article.series.slug.current}`}
                className="font-body text-[0.7rem] tracking-[0.15em] uppercase text-accent hover:underline"
              >
                Series: {article.series.title}
              </Link>
            )}
          </div>
        </div>

        {/* ── Article Body ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          {article.body ? (
            <div className="article-prose">
              <PortableText value={article.body} components={ptComponents} />
            </div>
          ) : (
            <p className="font-body text-mist text-center py-16">Article body not yet available.</p>
          )}
        </div>

        {/* ── Sources ────────────────────────────────────────────────── */}
        {article.sources?.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 mt-4 mb-12">
            <div className="border-t-2 border-ink pt-8">
              {/* Analyst: classified style | Correspondent: plain */}
              <h2 className="font-body text-[0.7rem] tracking-[0.3em] uppercase text-mist mb-6">
                {isAnalyst ? '— Verified Sources —' : 'Sources'}
              </h2>
              <ol className="space-y-3">
                {article.sources.map((source: {
                  title: string
                  publisher?: string
                  url?: string
                  date?: string
                }, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-body text-accent text-[0.8rem] tabular-nums mt-0.5 min-w-[1.5rem]">
                      [{i + 1}]
                    </span>
                    <div>
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank" rel="noopener noreferrer"
                          className="font-body text-base text-ink hover:text-accent transition-colors"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span className="font-body text-base text-ink">{source.title}</span>
                      )}
                      {(source.publisher || source.date) && (
                        <p className="font-body text-mist text-sm">
                          {[source.publisher, source.date].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ── Related Articles ────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-ghost mt-8 py-16" aria-label="Related articles">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 rule-top" />
                <h2 className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">More from the Archive</h2>
                <div className="flex-1 rule-top" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((a: Parameters<typeof ArticleCard>[0]['article']) => (
                  <ArticleCard key={a._id} article={a} size="md" showExcerpt />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
