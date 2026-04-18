import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { client, articleBySlugQuery, articlesQuery, urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VoiceBadge from '@/components/VoiceBadge'
import ArticleCard from '@/components/ArticleCard'

export const runtime = 'edge'
export const revalidate = 60

/* ── Portable Text components ─────────────────────────────────────────────────── */
const ptComponents: PortableTextComponents = {
  block: {
    normal:     ({ children }) => <p>{children}</p>,
    h2:         ({ children }) => <h2>{children}</h2>,
    h3:         ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string; sourceUrl?: string } }) => {
      const url = urlFor(value).width(1200).fit('max').url()
      return (
        <figure className="my-10 -mx-4 md:mx-0">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={600}
            className="w-full object-cover"
          />
          {value.caption && (
            <figcaption className="font-body text-mist text-xs mt-2 text-center tracking-wide">
              {value.caption}
              {value.sourceUrl && (
                <a href={value.sourceUrl} target="_blank" rel="noopener noreferrer"
                   className="ml-2 text-accent hover:underline">↗ Source</a>
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

/* ── Crest SVG ────────────────────────────────────────────────────────────────── */
function Crest() {
  return (
    <div className="flex justify-center mb-6 mt-2">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="20.5" stroke="#C8B89A" strokeWidth="1"/>
        <text x="22" y="28.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18"
              fontWeight="bold" fill="#0F0E0C" letterSpacing="-0.5">W</text>
      </svg>
    </div>
  )
}

interface Params { params: Promise<{ slug: string }> }

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const [article, allArticles] = await Promise.all([
    client.fetch(articleBySlugQuery, { slug }).catch(() => null),
    client.fetch(articlesQuery).catch(() => []),
  ])

  if (!article) notFound()

  const related = (allArticles as { _id: string }[])
    .filter((a) => a._id !== article._id)
    .slice(0, 3)

  const heroImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1600).height(700).fit('crop').url()
    : null

  const isAnalyst = article.voice === 'analyst'

  return (
    <>
      <Header />

      <main>
        {/* ── Crest + Date + Title ────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-6 pt-12 pb-0 text-center">
          <Crest />

          {/* Date */}
          {article.publishedAt && (
            <time
              dateTime={article.publishedAt}
              className="font-body text-mist block text-[0.65rem] tracking-[0.35em] uppercase mb-6"
            >
              {formatDate(article.publishedAt)}
            </time>
          )}

          {/* Headline with ruled lines */}
          <div className="relative border-t border-rule pt-6 pb-6 border-b border-rule mb-6">
            <h1 className="article-headline">
              {article.title}
            </h1>
          </div>

          {/* Meta: voice + category + series breadcrumb */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            <VoiceBadge voice={article.voice} />
            {article.categories?.[0] && (
              <Link
                href={`/browse?era=${article.categories[0].slug.current}`}
                className="tag-pill hover:border-accent hover:text-accent transition-colors"
              >
                {article.categories[0].title}
              </Link>
            )}
            {article.series && (
              <Link
                href={`/series/${article.series.slug.current}`}
                className="tag-pill tag-pill-accent"
              >
                {article.series.title}
              </Link>
            )}
            {isAnalyst && (
              <span
                className="font-body text-[0.52rem] font-bold tracking-[0.28em] uppercase text-accent border border-accent px-2 py-0.5 opacity-70"
                style={{ transform: 'rotate(-1deg)', display: 'inline-block' }}
                aria-hidden="true"
              >
                All Sources Verified
              </span>
            )}
          </div>
        </div>

        {/* ── Hero image ─────────────────────────────────────────────── */}
        {heroImageUrl ? (
          <div className="w-full relative overflow-hidden bg-ink mb-0" style={{ aspectRatio: '21/8' }}>
            <Image
              src={heroImageUrl}
              alt={article.mainImage?.alt || article.title}
              fill
              priority
              className="object-cover opacity-92"
              sizes="100vw"
            />
            {article.mainImage?.caption && (
              <p className="absolute bottom-3 right-4 font-body text-paper/35 text-[0.58rem] tracking-wider">
                {article.mainImage.caption}
                {article.mainImage?.sourceUrl && (
                  <a href={article.mainImage.sourceUrl} target="_blank" rel="noopener noreferrer"
                     className="ml-1 text-accent">↗</a>
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="rule-heavy mx-6" />
        )}

        {/* ── Excerpt / lede ──────────────────────────────────────────── */}
        {article.excerpt && (
          <div className="max-w-2xl mx-auto px-6 pt-10">
            <p className="font-body text-mist text-lg leading-relaxed border-l-2 border-rule pl-5 italic">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-6 py-10">
          {article.body ? (
            <div className="article-prose drop-cap">
              <PortableText value={article.body} components={ptComponents} />
            </div>
          ) : (
            <p className="font-body text-mist text-center py-16 tracking-wider">
              Article body coming soon.
            </p>
          )}
        </div>

        {/* ── Sources ─────────────────────────────────────────────────── */}
        {article.sources?.length > 0 && (
          <div className="max-w-2xl mx-auto px-6 mt-2 mb-14">
            <div className="border-t-2 border-ink pt-8">
              <h2 className="font-body text-[0.62rem] tracking-[0.32em] uppercase text-mist mb-6">
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
                    <span className="font-body text-accent text-sm tabular-nums mt-0.5 min-w-[1.75rem]">
                      [{i + 1}]
                    </span>
                    <div>
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer"
                           className="font-body text-base text-ink hover:text-accent transition-colors">
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

        {/* ── Breadcrumb back ─────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-6 pb-8">
          <nav aria-label="Back navigation">
            <ol className="flex items-center gap-2 font-body text-[0.65rem] tracking-[0.15em] uppercase text-mist">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-rule">›</li>
              {article.series && (
                <>
                  <li>
                    <Link href={`/series/${article.series.slug.current}`}
                          className="hover:text-accent transition-colors">
                      {article.series.title}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-rule">›</li>
                </>
              )}
              <li className="text-ink truncate max-w-[180px]">{article.title}</li>
            </ol>
          </nav>
        </div>

        {/* ── Related ─────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-ghost py-16" aria-label="More from the archive">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-5 mb-10">
                <div className="flex-1 border-t border-rule" />
                <span className="era-label">More from the Archive</span>
                <div className="flex-1 border-t border-rule" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(related as Parameters<typeof ArticleCard>[0]['article'][]).map((a) => (
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
