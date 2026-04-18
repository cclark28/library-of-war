import Link from 'next/link'
import Image from 'next/image'
import VoiceBadge from './VoiceBadge'
import { urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

interface HeroArticleProps {
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
      caption?: string
    }
    series?: { title: string; slug: { current: string } }
    categories?: Array<{ title: string; slug: { current: string } }>
  }
}

export default function HeroArticle({ article }: HeroArticleProps) {
  const imageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1800).height(900).fit('crop').url()
    : null

  return (
    <section className="relative w-full" aria-label="Featured article">
      <Link href={`/articles/${article.slug.current}`} className="block group">
        {/* Image container */}
        <div className="relative w-full aspect-[16/8] md:aspect-[21/9] overflow-hidden bg-ink">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt || article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-ink" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 hero-gradient" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8 md:pb-12">
            {/* Voice + Series */}
            <div className="flex items-center gap-3 mb-4">
              <VoiceBadge voice={article.voice} />
              {article.series && (
                <span className="font-body text-paper/60 text-[0.65rem] tracking-[0.2em] uppercase">
                  {article.series.title}
                </span>
              )}
            </div>

            {/* Headline */}
            <h2 className="font-headline font-black text-paper text-display-sm md:text-display lg:text-display-lg max-w-4xl leading-tight mb-4 group-hover:text-paper/90 transition-colors">
              {article.title}
            </h2>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="font-body text-paper/70 text-body max-w-2xl leading-relaxed hidden md:block">
                {article.excerpt}
              </p>
            )}

            {/* Date */}
            {article.publishedAt && (
              <p className="font-body text-paper/40 text-[0.75rem] tracking-[0.2em] uppercase mt-4">
                {formatDate(article.publishedAt)}
              </p>
            )}
          </div>

          {/* Image credit */}
          {article.mainImage?.caption && (
            <p className="absolute top-4 right-4 font-body text-paper/30 text-[0.6rem] tracking-wider">
              {article.mainImage.caption}
            </p>
          )}
        </div>
      </Link>
    </section>
  )
}
