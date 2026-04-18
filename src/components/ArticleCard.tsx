import Link from 'next/link'
import Image from 'next/image'
import VoiceBadge from './VoiceBadge'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

interface Article {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  voice: 'analyst' | 'correspondent'
  excerpt?: string
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
  sm:          'text-base leading-snug',
  md:          'text-xl leading-tight',
  lg:          'text-2xl md:text-3xl leading-tight',
  'hero-left': 'text-2xl md:text-3xl lg:text-4xl leading-tight',
  'hero-stack':'text-lg leading-snug',
}

export default function ArticleCard({ article, size = 'md', showExcerpt = true, layout = 'vertical' }: ArticleCardProps) {
  const w = size === 'lg' || size === 'hero-left' ? 900 : size === 'hero-stack' ? 700 : 500
  const h = size === 'lg' || size === 'hero-left' ? 600 : 340

  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(w).height(h).fit('crop').url()
    : null

  const era = article.categories?.[0]
  const seriesLabel = article.series?.title

  const inner = (
    <article className={`card-hover group ${layout === 'horizontal' ? 'flex gap-4' : ''}`}>
      {/* Image */}
      {imageUrl && (
        <div className={`relative overflow-hidden bg-ghost flex-shrink-0 ${
          layout === 'horizontal' ? 'w-28 h-20' : `${ASPECT[size]} w-full mb-3`
        }`}>
          <Image
            src={imageUrl}
            alt={article.mainImage?.alt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={`${w}px`}
          />
        </div>
      )}

      <div className={layout === 'horizontal' ? 'flex flex-col justify-center min-w-0' : ''}>
        {/* Meta row: date + tags */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {article.publishedAt && (
            <time className="font-body text-mist text-[0.6rem] tracking-[0.18em] uppercase">
              {formatDate(article.publishedAt)}
            </time>
          )}
          {era && (
            <span className="tag-pill">{era.title}</span>
          )}
          {seriesLabel && (
            <span className="tag-pill tag-pill-accent">{seriesLabel}</span>
          )}
        </div>

        {/* Headline */}
        <h2 className={`font-headline font-bold text-ink ${HEADLINE[size]} group-hover:text-accent transition-colors mb-2`}>
          {article.title}
        </h2>

        {/* Excerpt */}
        {showExcerpt && article.excerpt && size !== 'sm' && size !== 'hero-stack' && layout !== 'horizontal' && (
          <p className="font-body text-mist text-sm leading-relaxed line-clamp-2 mb-2">
            {article.excerpt}
          </p>
        )}

        {/* Voice badge */}
        {size !== 'sm' && (
          <div className="mt-1">
            <VoiceBadge voice={article.voice} />
          </div>
        )}
      </div>

      {/* Bottom rule */}
      {layout === 'vertical' && <div className="mt-4 rule-bottom" />}
    </article>
  )

  return (
    <Link href={`/articles/${article.slug.current}`} className="block">
      {inner}
    </Link>
  )
}
