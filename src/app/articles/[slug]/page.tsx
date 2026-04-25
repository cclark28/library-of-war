import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, articleBySlugQuery, relatedArticlesQuery, urlFor } from '@/lib/sanity'
import { calcReadTime, DIFFICULTY_LABEL } from '@/lib/readTime'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import FadeIn from '@/components/FadeIn'

export const runtime = 'edge'
export const revalidate = 60

/* ── Portable Text types ──────────────────────────────────────────────────────── */
type MarkDef = { _key: string; _type: string; href?: string; blank?: boolean }
type PTSpan = { _type: 'span'; _key?: string; text?: string; marks?: string[] }
type PTBlock = {
  _type: string
  _key?: string
  style?: string
  children?: PTSpan[]
  markDefs?: MarkDef[]
  asset?: { _ref: string }
  alt?: string
  caption?: string
  sourceUrl?: string
}

/* ── Edge-safe Portable Text renderer ────────────────────────────────────────── */
function renderSpan(span: PTSpan, markDefs: MarkDef[] = [], idx: number) {
  let node: React.ReactNode = span.text ?? ''
  const marks = span.marks ?? []
  for (const mark of [...marks].reverse()) {
    const def = markDefs.find(d => d._key === mark)
    if (def) {
      node = (
        <a key={`link-${idx}`} href={def.href} target={def.blank ? '_blank' : undefined}
           rel={def.blank ? 'noopener noreferrer' : undefined}>
          {node}
        </a>
      )
    } else if (mark === 'strong') {
      node = <strong key={`s-${idx}`}>{node}</strong>
    } else if (mark === 'em') {
      node = <em key={`e-${idx}`}>{node}</em>
    } else if (mark === 'underline') {
      node = <u key={`u-${idx}`}>{node}</u>
    } else if (mark === 'code') {
      node = <code key={`c-${idx}`}>{node}</code>
    }
  }
  return <span key={span._key ?? idx}>{node}</span>
}

function renderChildren(block: PTBlock) {
  if (!block.children) return null
  return block.children.map((child, i) => renderSpan(child, block.markDefs, i))
}

function PortableTextBody({ blocks }: { blocks: PTBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = block._key ?? i

        if (block._type === 'image') {
          const imgUrl = urlFor(block as Parameters<typeof urlFor>[0]).width(1200).fit('max').url()
          return (
            <figure key={key} className="my-12 -mx-4 md:mx-0">
              <Image
                src={imgUrl}
                alt={block.alt ?? ''}
                width={1200}
                height={600}
                loading="lazy"
                className="w-full object-cover"
              />
              {block.caption && (
                <figcaption className="font-body text-mist text-sm mt-3 text-center tracking-wide">
                  {block.caption}
                  {block.sourceUrl && (
                    <a href={block.sourceUrl} target="_blank" rel="noopener noreferrer"
                       className="ml-2 text-accent hover:underline">↗ Source</a>
                  )}
                </figcaption>
              )}
            </figure>
          )
        }

        if (block._type !== 'block') return null
        const children = renderChildren(block)

        switch (block.style) {
          case 'h2':         return <h2 key={key}>{children}</h2>
          case 'h3':         return <h3 key={key}>{children}</h3>
          case 'blockquote': return <blockquote key={key}>{children}</blockquote>
          default:           return <p key={key}>{children}</p>
        }
      })}
    </>
  )
}


const SITE_URL = 'https://libraryofwar.com'

interface Params { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug }).catch(() => null)
  if (!article) return {}

  const title = article.seo?.title || article.title
  const description = article.seo?.description || article.excerpt || ''
  const canonicalUrl = `${SITE_URL}/articles/${slug}/`

  // Use Sanity CDN image transforms — zero cost, no workers, no extra infra
  const ogImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).fit('crop').url()
    : `${SITE_URL}/og-default.jpg`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.mainImage?.alt || title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const article = await client.fetch(articleBySlugQuery, { slug }).catch(() => null)

  if (!article) notFound()

  const categoryIds = (article.categories ?? []).map((c: { _id?: string }) => c._id).filter(Boolean)
  const related = categoryIds.length > 0
    ? await client.fetch(relatedArticlesQuery, { id: article._id, categoryIds }).catch(() => [])
    : []

  const heroImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1600).height(700).fit('crop').url()
    : null

  const readTime = calcReadTime(article.body ?? [])
  const difficulty = DIFFICULTY_LABEL[article.difficulty ?? 'intermediate'] ?? 'Intermediate'

  return (
    <>
      <HeaderWrapper />

      <main>
        {/* ── Title ───────────────────────────────────────────── */}
        <FadeIn className="max-w-2xl mx-auto px-6 pt-8 pb-0 text-center" variant="fade-in">
          <div className="relative pb-8 border-b border-rule mb-8">
            <h1 className="article-headline">
              {article.title}
            </h1>
            <p className="font-body text-[0.62rem] tracking-[0.18em] uppercase text-mist mt-4">
              {readTime} min read&ensp;·&ensp;{difficulty}
            </p>
          </div>

          {/* Category + series tags */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
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
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
              {(article.tags as string[]).map((tag: string) => (
                <span
                  key={tag}
                  className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-mist border border-rule/60 px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </FadeIn>

        {/* ── Hero image ─────────────────────────────────────────────── */}
        {heroImageUrl ? (
          <div className="w-full relative overflow-hidden bg-ink mb-0" style={{ aspectRatio: '21/8' }}>
            <Image
              src={heroImageUrl}
              alt={article.mainImage?.alt || article.title}
              fill
              priority
              className="object-cover"
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
          <FadeIn className="max-w-2xl mx-auto px-6 pt-12" variant="fade-up">
            <p className="font-body text-mist text-xl leading-relaxed border-l-2 border-rule pl-6 italic">
              {article.excerpt}
            </p>
          </FadeIn>
        )}

        {/* ── Body ────────────────────────────────────────────────────── */}
        <FadeIn className="max-w-2xl mx-auto px-6 py-12" variant="fade-up" delay={80}>
          {article.body ? (
            <div className="article-prose drop-cap">
              <PortableTextBody blocks={article.body as PTBlock[]} />
            </div>
          ) : (
            <p className="font-body text-mist text-center py-16 tracking-wider">
              Article body coming soon.
            </p>
          )}
        </FadeIn>

        {/* ── Primary Sources ─────────────────────────────────────────── */}
        {article.primarySources?.length > 0 && (
          <FadeIn className="max-w-2xl mx-auto px-6 mt-2 mb-10" variant="fade-up">
            <div className="border-t-2 border-ink pt-10">
              <h2 className="font-body text-[0.62rem] tracking-[0.32em] uppercase text-mist mb-8">
                — Primary Sources —
              </h2>
              <div className="space-y-0">
                {article.primarySources.map((doc: {
                  type: 'patent' | 'declassified' | 'newspaper' | 'government'
                  title: string
                  identifier?: string
                  url?: string
                  date?: string
                  archive?: string
                }, i: number) => {
                  const TYPE_CONFIG = {
                    patent:       { label: 'Patent',               icon: '⬡' },
                    declassified: { label: 'Declassified',         icon: '◈' },
                    newspaper:    { label: 'Newspaper',            icon: '▤' },
                    government:   { label: 'Gov. Report',          icon: '⬛' },
                  }
                  const config = TYPE_CONFIG[doc.type] ?? { label: doc.type, icon: '·' }
                  return (
                    <div
                      key={i}
                      className="flex gap-5 py-5 border-b border-rule/40 last:border-0"
                    >
                      {/* Type badge */}
                      <div className="flex-shrink-0 pt-0.5">
                        <span className="font-body text-[0.55rem] tracking-[0.18em] uppercase text-mist border border-rule/60 px-2 py-1 whitespace-nowrap">
                          {config.label}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-[0.95rem] text-ink leading-snug hover:text-accent transition-colors"
                          >
                            {doc.title}
                            <span className="ml-1.5 text-mist text-[0.7rem] no-underline">↗</span>
                          </a>
                        ) : (
                          <span className="font-body text-[0.95rem] text-ink leading-snug">
                            {doc.title}
                          </span>
                        )}

                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {doc.identifier && (
                            <span className="font-body text-[0.65rem] tracking-[0.1em] text-accent uppercase">
                              {doc.identifier}
                            </span>
                          )}
                          {doc.archive && (
                            <span className="font-body text-[0.65rem] text-mist">
                              {doc.archive}
                            </span>
                          )}
                          {doc.date && (
                            <span className="font-body text-[0.65rem] text-mist">
                              {doc.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Sources ─────────────────────────────────────────────────── */}
        {article.sources?.length > 0 && (
          <FadeIn className="max-w-2xl mx-auto px-6 mt-2 mb-16" variant="fade-up">
            <div className="border-t-2 border-ink pt-10">
              <h2 className="font-body text-[0.62rem] tracking-[0.32em] uppercase text-mist mb-8">
                — Sources —
              </h2>
              <ol className="space-y-4">
                {article.sources.map((source: {
                  title: string
                  publisher?: string
                  url?: string
                  date?: string
                }, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-body text-accent text-sm tabular-nums mt-0.5 min-w-[1.75rem]">
                      [{i + 1}]
                    </span>
                    <div>
                      {source.url ? (
                        <a href={source.url} target="_blank" rel="noopener noreferrer"
                           className="font-body text-base text-ink hover:text-accent transition-colors leading-snug">
                          {source.title}
                        </a>
                      ) : (
                        <span className="font-body text-base text-ink leading-snug">{source.title}</span>
                      )}
                      {(source.publisher || source.date) && (
                        <p className="font-body text-mist text-sm mt-0.5">
                          {[source.publisher, source.date].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        )}

        {/* ── Breadcrumb back ─────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-6 pb-10">
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

        {/* ── Related by Era carousel ─────────────────────────────────── */}
        {related.length > 0 && (
          <section className="py-16 border-t-2 border-ink" aria-label="More from this era">
            <div className="max-w-7xl mx-auto px-6">
              {/* Header */}
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <p className="font-body text-[0.58rem] tracking-[0.28em] uppercase text-mist mb-1">
                    Continue Reading
                  </p>
                  <h2 className="font-headline font-bold text-ink text-2xl leading-none">
                    More from{' '}
                    <span className="text-accent">
                      {article.categories?.[0]?.title ?? 'This Era'}
                    </span>
                  </h2>
                </div>
                {article.categories?.[0] && (
                  <Link
                    href={`/browse?era=${article.categories[0].slug.current}`}
                    className="font-body text-[0.62rem] tracking-[0.18em] uppercase text-mist hover:text-accent transition-colors hidden sm:block"
                  >
                    View all →
                  </Link>
                )}
              </div>

              {/* Horizontal scroll carousel */}
              <div className="overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-6" style={{ width: 'max-content' }}>
                  {(related as Parameters<typeof ArticleCard>[0]['article'][]).map((a) => (
                    <div key={a._id} style={{ width: '280px', flexShrink: 0 }}>
                      <ArticleCard article={a} size="sm" showExcerpt={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
