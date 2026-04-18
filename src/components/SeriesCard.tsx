import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface SeriesCardProps {
  series: {
    _id: string
    title: string
    slug: { current: string }
    description?: string
    coverImage?: {
      asset: { _ref: string }
      alt?: string
    }
  }
  index: number
}

const ordinals = ['I', 'II', 'III', 'IV', 'V']

export default function SeriesCard({ series, index }: SeriesCardProps) {
  const imageUrl = series.coverImage
    ? urlFor(series.coverImage).width(800).height(500).fit('crop').url()
    : null

  return (
    <Link href={`/series/${series.slug.current}`} className="group block card-hover">
      <article className="relative overflow-hidden bg-ink">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={series.coverImage?.alt || series.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04] opacity-80"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-olive to-ink" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

          {/* Series number */}
          <div className="absolute top-4 left-4 font-headline text-paper/20 text-6xl font-black leading-none select-none">
            {ordinals[index] || String(index + 1)}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-body text-paper/40 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
              Flagship Series
            </p>
            <h3 className="font-headline font-bold text-paper text-xl md:text-2xl leading-tight group-hover:text-paper/90 transition-colors">
              {series.title}
            </h3>
            {series.description && (
              <p className="font-body text-paper/60 text-sm mt-2 line-clamp-2">
                {series.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-accent">
              <span className="font-body text-[0.7rem] tracking-[0.15em] uppercase">Read Series</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
