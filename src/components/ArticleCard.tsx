import Link from 'next/link'
import Image from 'next/image'
import VoiceBadge from './VoiceBadge'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

interface ArticleCardProps {
  article: {
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
    voice: 'analyst' | 'correspondent'
    excerpt?: string
    mainImage?: {
      asset: { _ref: string }
      alt?: string
    }
    series?: { title: string; slug: { current: string } }
    categories?: Array<{ title: string; slug: { current: string } }>
  }
  size?: 'sm' | 'md' | 'lg'
  showExcerpt?: boolean
}

export default function ArticleCard({ article, size = 'md', showExcerpt = true }: ArticleCardProps) {
  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(size === 'lg' ? 900 : 600).height(size === 'lg' ? 540 : 360).fit('crop').url()
    : null

  const headlineSizes = {
    sm: 'text-lg leading-snug',
    md: 'text-2xl leading-tight',
    lg: 'text-3xl md:text-4xl leading-tight',
  }

  return (
    <article className="card-hover group">
      <Link href={`/articles/${article.slug.current}`} className="block">
        {/* Image */}
        {imageUrl && (
          <div className={`relative overflow-hidden bg-ghost mb-4 ${size === 'lg' ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}>
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes={size === 'lg' ? '(max-width: 768px) 100vw, 900px' : '(max-width: 768px) 100vw, 600px'}
            />
            {/* Voice badge overlay */}
            <div className="absolute top-3 left-3">
              <VoiceBadge voice={article.voice} />
            </div>
          </div>
        )}

        {/* Without image: inline badge */}
        {!imageUrl && (
          <div className="mb-2">
            <VoiceBadge voice={article.voice} />
          </div>
        )}

        {/* Category / Series */}
        {(article.series || article.categories?.[0]) && (
          <p className="font-body text-accent text-[0.7rem] tracking-[0.2em] uppercase mb-2">
            {article.series?.title || article.categories?.[0]?.title}
          </p>
        )}

        {/* Headline */}
        <h2 className={`font-headline font-bold text-ink ${headlineSizes[size]} mb-2 group-hover:text-accent transition-colors`}>
          {article.title}
        </h2>

        {/* Excerpt */}
        {showExcerpt && article.excerpt && size !== 'sm' && (
          <p className="font-body text-mist text-base leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Date */}
        {article.publishedAt && (
          <p className="font-body text-mist text-[0.75rem] tracking-widest uppercase mt-3">
            {formatDate(article.publishedAt)}
          </p>
        )}
      </Link>

      {/* Bottom rule */}
      <div className="mt-4 rule-bottom" />
    </article>
  )
}
