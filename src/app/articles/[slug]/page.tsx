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

/* ── Crest — illustration mark from the logo ──────────────────────────────────── */
function Crest() {
  return (
    <div className="flex justify-center mb-6 mt-2" aria-hidden="true">
      {/* Cropped to just the illustration portion (viewBox 0 0 80 76) */}
      <svg width="48" height="46" viewBox="0 0 80 76" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M70.47,14.28c-.94.24-2.52,1.72-2.52,1.72-.42-.75-1.19-1.04-1.19-1.04,0,0,1.24-1.63.93-2.04-.31-.4-2.67,1.38-2.67,1.38-3.74-.72-6.86-.74-9.48-.24-3.04.66-5.49,2.05-7.45,3.7-.61.55-1.16,1.12-1.65,1.69-2.26,2.76-3.59,6.09-4.57,8.99,0,0,0,0,0,.01-.29-.14-.57-.3-.82-.45-.44-.3-.84-.59-1.17-.83-.02-.02-.03-.03-.03-.03l-.04-.05s.1-.06.12-.12c.02-.08.01-.19,0-.25.11-.45.01-1.59.01-1.59,0,0,.03-.06.05-.14.03-.1.07-.24.05-.31-.03-.13-.44-.21-.6-.2-.05,0-.11,0-.17.02-.14-1.21-.46-2.78-1.13-3.25-.23-.16-.49-.2-.75-.11-.27.08-.46.27-.57.54-.37.9.35,2.72.81,3.73-.07.09-.21.24-.37.44l-5.28-1.1-.12-.93-.3-.35c.35.03,1.31.11,1.89-.05.71-.2,2.42-2.53,2.42-2.53,0,0,2.05-.45,2.75-.96.18-.13.57-.42,1.05-.78,0,0,0,0,0,0l1.79-1.34c.04.06.08.12.14.17l-.14.22-.05-.03c-.06-.03-.13-.02-.16.04-.03.06-.02.13.04.16l.44.27c.06.03.13.02.16-.04.03-.06.02-.13-.04-.16l-.05-.03.14-.22c.35.13.73.03.9-.25.14-.23.11-.52-.06-.76l.15-.25.11.07c.06.04.15.02.18-.04.04-.06.02-.15-.04-.18l-.11-.07v-.02s.1-.12.1-.12c.2.02.71.05.89-.05.22-.12.31-.49.41-.69.09-.17.11-.51.12-.62.06-.01.12-.03.16-.05.08-.03.07-.13.06-.21h.13s.41-.66.41-.66l-.23-.14,6.24-10.05,1.08-3.47-2.58,2.55-6.1,10.14-.23-.14-.41.68.26.41h-.05s-.2-.29-.31-.29-.33.08-.35.18c-.02.1.04.44.04.44-.09.21-.07.37-.05.47-.15.12-.41.3-.7.5-.43.26-.96.55-1.33.65-.1.03-.23.07-.36.11-.85.24-2,.52-2.27.67-.37.21-1.75,1.63-1.75,1.63-1.37,0-4.04,1.12-4.6,1.36-.57-.44-1.94-1.26-3.6-.66l-.68-.68c.97.35,1.64-.38,1.66-.44.02-.05-.11-.28-.11-.28l.03-.25s.11-.02.22-.08c.11-.05.08-.27.08-.27l.25-.12s-.02-.08-.01-.14c.05-.08.1-.16.11-.26l.41-.05-.1-.93-.21-.48.19-.32.19.06s.18-.45.24-1.07c.32.12.71.18.71.18l.04-.12c-.16-.13-.54-.29-.73-.36.03-.99-.31-2.26-2.03-2.85-.04-.11-.07-.19-.07-.19,0,0-.2-.07-.5-.12l.04-1.91c.22,0,1.2.08,1.32,1.8l.8.02.39-.35,2.35-.84c.02-.17.03-.34.02-.51-.11-2.42-2.66-4.28-5.72-4.16h0c-3.05.15-5.44,2.22-5.33,4.65,0,.17.03.34.06.51l2.41.63.42.32.79-.09c-.03-1.57.77-1.85,1.08-1.9l.24,1.82-.4.1-.03.13c-1.7.55-2.31,2.67-2.36,3.38,0,0-2.85-.33-2.97-.24-.12.09.07.18.15.23.07.04,2.99,1.13,3.43,1.29l-.76,2.23s-1.06,2.55-1.03,4.02c.03,1.47.65,3.51,3.77,7.1,0,0-1.28,1.36-1.5,2-.07.17-.17.46-.25.75,0,0,0,0,0,0-.01.04-.03.08-.04.12-.66-.28-1.1-.45-1.1-.45-.66-.17-1.3-.3-1.9-.39-1.16-.13-2.33-.18-3.46-.12-3.71.31-5.75,1.97-5.75,1.97-.2-.07-.38-.15-.56-.25-.72-.33-1.75-1.2-2.37-3.46-1.04-3.77-4.78.3-4.9.76-.11.4.78,2.66,5.37,5.28-.11.16-.21.33-.31.5-3.43,5.57-1.53,9.52-.55,11.11.12.23.2.41.2.59.02.84.6,1.88.6,1.88,0,0-1.02,2.08-1.9,3.08-.88,1-2.24,1.9-3.64,2.42-1.4.52-1.24,2.44-1.34,3-.1.56-.5,1.96-.64,3.46-.14,1.5-1.64,5.75-2.12,6.93-.48,1.18-.12,2.14.6,2.66.72.52.98,1.98.98,1.98,0,0-.8.7-.94,1.02-.14.32.1.76.1.76l.24,1.63s4.18-.02,5-.02c.68,0,.62-.2.62-.2l-1-2.44c.18-.62-.5-1.06-.9-1.36-.4-.3-.82-1.54-.48-2.18.34-.64.2-1.66.02-2.16-.18-.5,1.06-5.33,1.56-6.31.5-.98,1.54-1.72,2.5-2.88.96-1.16,1.92-2.24,3.74-2.9,1.82-.66,3.48-2.92,3.74-3.06.26-.14,1.64-.96,1.64-.96.2.34.94.78.94.78,0,0,0,1.06-.3,1.98-.3.92-1.26,2.2-2,2.8-.74.6-1.68.92-1.74,2.28-.06,1.36,1.84,1.76,2.82,2.58.98.82,1.72,1.24,3.38,2.02,1.66.78,2.92,2.74,3.34,3.58.42.84,1.42.38,1.64.56.22.18.14.6.14.6,0,0-.84.4-1.08.8-.24.4-.04.54-.04.54l-.24,1.7s3.32,1.56,4.04,1.74c.72.18.66-.12.66-.12l.08-2.48c.78-.54.09-1.35.09-1.35.21-1.17-.33-1.86-.6-2.4s-.15-1.2-.33-1.95c-.18-.75-2.73-2.22-4.29-2.91s-2.79-2.1-2.76-3.42c.03-1.32,2.85-2.52,3.6-3,.75-.48,2.94-3.9,2.94-3.9,3.03,2.61,14.03.9,14.27,1.05.24.15.27.84.27.84.27,1.17-.64,5.39-.84,6.15-.2.76-.06,1.04-.1,1.72-.04.68-1.28,4.96-1.56,5.63-.28.68-1.02,1.8-1.1,2.7-.08.9.72,1.28,1.2,1.48.48.2,1.18,1.36,1.18,1.36,0,0-.4.78-.52,1.52-.12.74.48.58.48.58l.26,1.02h4.9c.62,0,.32-.34.32-.34,0,0-1.2-1.38-1-2.06.2-.68-.98-1.06-.98-1.06,0,0-1.22-1.06-1.22-1.58s-.26-1.46-.3-1.96c-.04-.5.4-4.54,1.2-5.12s1.94-2.6,1.94-3.04.06-2.36,1.18-3.86c1.12-1.5,2.42-4.24,2.42-4.24.46-.32.86-.94.86-.94,0,0,.98.1,4.62.08,3.64-.02,7.89-1.68,7.89-1.68,0,0,.92,1.04.96,2,.04.96-.9,3.48-1.24,3.96-.34.48-.58,1.1-.82,1.68-.24.58.14,1.02.14,1.02l-.06.5s-.84-.28-1.28-.24c-.44.04-.94.78-.94.78-.26-.08-.62.08-.62.08,0,0-.28,4.98-.28,5.41s.42.22.42.22l2.54-1.28s.56.3.84,0c.28-.3.74-1.38.74-1.38,0,0,1.9-1.64,2.84-2.84.94-1.2.46-2.68.56-3.98.1-1.3.64-2.7,1.46-4.92.82-2.22-.6-4.52-1.1-4.88-.5-.36-4-.32-5.81-.5-1.82-.18-4.26-1-4.26-1,0,0,.68-.56.76-.96s.28-3.4.16-3.92c-.12-.52-.98-1.5-.98-1.5,0,0,.44-.7,1-2.4.05-.15.09-.33.12-.52.98-.73,1.82-1.45,2.48-2.07.8.2,1.81-.49,1.81-.49,0,0,1,.76,2.24.38,1.24-.38,1.08-1.64,1.08-1.64.8-.28.58-1.22.58-1.22.24-.08.16-.38,0-.68-.16-.3-.08-1.22.14-2.3.22-1.08.06-2.32.08-3.32.02-1,.42-1.46.78-1.92.36-.46,1-1,.78-1.28-.22-.28-.38-1.34-.38-1.34.2-.5.3-1.76.3-1.76l.18.3c.16-.48-.04-1.16-.04-1.16,2.04-.74,2.04-2.82,2.04-2.82Z"/>
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
