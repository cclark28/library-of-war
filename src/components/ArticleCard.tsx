'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sanityImage } from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'

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

// Responsive sizes attribute per grid context:
//   sm  → 4-col grid  (max 25vw on desktop)
//   md  → 2-col grid  (max 50vw on desktop)
//   lg  → single col  (max 75vw on desktop)
const SIZES: Record<string, string> = {
  sm:           '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  md:           '(max-width: 768px) 100vw, 50vw',
  lg:           '(max-width: 1024px) 100vw, 75vw',
  'hero-left':  '(max-width: 1024px) 100vw, 60vw',
  'hero-stack': '(max-width: 1024px) 100vw, 40vw',
}

// Pixel dimensions to request from Sanity per size variant
const IMG_DIMS: Record<string, { w: number; h: number }> = {
  sm:           { w: 520,  h: 390 },
  md:           { w: 820,  h: 547 },
  lg:           { w: 1080, h: 607 },
  'hero-left':  { w: 900,  h: 675 },
  'hero-stack': { w: 700,  h: 394 },
}

export default function ArticleCard({ article, size = 'md', showExcerpt = true, layout = 'vertical' }: ArticleCardProps) {
  const router = useRouter()
  const dims = IMG_DIMS[size] ?? IMG_DIMS.md

  const imageUrl = article.mainImage
    ? sanityImage(article.mainImage, { w: dims.w, h: dims.h, fit: 'crop' })
    : null

  const [imgLoaded, setImgLoaded] = useState(false)
  const era = article.categories?.[0]
  const seriesLabel = article.series?.title

  const inner = (
    <article className={`card-lift group ${layout === 'horizontal' ? 'flex gap-4' : ''}`}>
      {/* Image — lazy loaded with shimmer placeholder */}
      {imageUrl && (
        <div className={`relative overflow-hidden bg-ghost flex-shrink-0 ${
          layout === 'horizontal' ? 'w-28 h-20' : `${ASPECT[size]} w-full mb-4`
        }`}>
          {!imgLoaded && <div className="absolute inset-0 img-shimmer" aria-hidden="true" />}
          <Image
            src={imageUrl}
            alt={article.mainImage?.alt || article.title}
            fill
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`object-cover transition-all duration-700 group-hover:scale-[1.03] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes={SIZES[size] ?? SIZES.md}
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
              article.series?.slug?.current ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/series/${article.series!.slug.current}`)
                  }}
                  className="tag-pill tag-pill-accent cursor-pointer hover:opacity-75 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  {seriesLabel}
                </button>
              ) : (
                <span className="tag-pill tag-pill-accent">{seriesLabel}</span>
              )
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

        {/* Publish date */}
        {article.publishedAt && layout !== 'horizontal' && (
          <p className="font-body text-[0.62rem] tracking-[0.18em] uppercase text-mist/60 mt-2">
            {formatDateShort(article.publishedAt)}
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
