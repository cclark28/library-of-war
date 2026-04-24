'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { urlFor } from '@/lib/sanity'

interface Article {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  voice?: 'analyst' | 'correspondent' | 'historian' | 'tactician' | 'archivist'
  excerpt?: string
  tags?: string[]
  mainImage?: {
    asset: { _ref: string }
    alt?: string
    hotspot?: { x: number; y: number }
  }
  series?: { title: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string }; era?: string }>
}

interface ArticleCardProps {
  article: Article
  size?: 'sm' | 'md' | 'lg' | 'hero-left' | 'hero-stack'
  showExcerpt?: boolean
  layout?: 'vertical' | 'horizontal'
}

const ASPECT = {
  sm:          'aspect-[4/3]',
  md:          'aspect-[3/2]',
  lg:          'aspect-[16/9]',
  'hero-left': 'aspect-[4/3]',
  'hero-stack':'aspect-[16/9]',
}

const HEADLINE = {
  sm:          'text-lg leading-snug',
  md:          'text-2xl leading-tight',
  lg:          'text-3xl md:text-4xl leading-tight',
  'hero-left': 'text-3xl md:text-4xl leading-tight',
  'hero-stack':'text-xl leading-snug',
}

export default function ArticleCard({ article, size = 'md', showExcerpt = true, layout = 'vertical' }: ArticleCardProps) {
  const router = useRouter()
  const w = size === 'lg' || size === 'hero-left' ? 900 : size === 'hero-stack' ? 700 : 500
  const h = size === 'lg' || size === 'hero-left' ? 600 : 340

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(w).height(h).fit('crop').url()
    : null

  const era = article.categories?.[0]
  const seriesLabel = article.series?.title

  const inner = (
    <article className={`card-lift group ${layout === 'horizontal' ? 'flex gap-4' : ''}`}>
      {/* Image — lazy loaded by default (no priority prop) */}
      {imageUrl && (
        <div className={`relative overflow-hidden bg-ghost flex-shrink-0 ${
          layout === 'horizontal' ? 'w-28 h-20' : `${ASPECT[size]} w-full mb-4`
        }`}>
          <Image
            src={imageUrl}
            alt={article.mainImage?.alt || article.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes={`${w}px`}
          />
        </div>
      )}

      <div className={layout === 'horizontal' ? 'flex flex-col justify-center min-w-0' : ''}>
        {/* Era + Series tags */}
        {(era || seriesLabel) && (
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {era && (
              <span className="tag-pill">{era.title}</span>
            )}
            {seriesLabel && (
              <span
                role={article.series?.slug?.current ? 'link' : undefined}
                tabIndex={article.series?.slug?.current ? 0 : undefined}
                onClick={article.series?.slug?.current ? (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(`/series/${article.series!.slug.current}`)
                } : undefined}
                onKeyDown={article.series?.slug?.current ? (e) => {
                  if (e.key === 'Enter') router.push(`/series/${article.series!.slug.current}`)
                } : undefined}
                className={`tag-pill tag-pill-accent${article.series?.slug?.current ? ' cursor-pointer hover:opacity-75 transition-opacity' : ''}`}
              >
                {seriesLabel}
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <h2 className={`font-headline font-bold text-ink ${HEADLINE[size]} group-hover:text-accent transition-colors mb-3`}>
          {article.title}
        </h2>

        {/* Excerpt */}
        {showExcerpt && article.excerpt && size !== 'sm' && size !== 'hero-stack' && layout !== 'horizontal' && (
          <p className="font-body text-mist text-base leading-relaxed line-clamp-3 mb-2">
            {article.excerpt}
          </p>
        )}
      </div>

    </article>
  )

  return (
    <Link href={`/articles/${article.slug.current}`} className="block">
      {inner}
    </Link>
  )
}
