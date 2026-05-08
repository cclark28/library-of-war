import Image from 'next/image'
import Link from 'next/link'
import { sanityImage } from '@/lib/sanity'

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  mainImage?: { asset: { _ref: string }; alt?: string; hotspot?: { x: number; y: number } }
  categories?: Array<{ title: string; slug: { current: string } }>
  series?: { title: string; slug: { current: string } }
}

export default function TrendingStrip({ articles }: { articles: Article[] }) {
  const items = articles.filter(a => !!a.mainImage?.asset?._ref).slice(0, 5)
  if (!items.length) return null

  return (
    <section className="border-y border-rule py-10 my-10 bg-ghost/40">
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        {/* ── Header ── */}
        <div className="flex items-center gap-5 mb-8">
          <span className="font-body text-[0.57rem] tracking-[0.32em] uppercase text-mist/60">
            Popular
          </span>
          <div className="flex-1 border-t border-rule" />
        </div>

        {/* ── Numbered list ── */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 divide-y divide-rule sm:divide-y-0 sm:divide-x sm:divide-rule" role="list">
          {items.map((article, i) => {
            const img = sanityImage(article.mainImage!, { w: 320, h: 200, fit: 'crop', q: 75 })
            const cat = article.categories?.[0]?.title

            return (
              <li key={article._id} className="group">
                <Link
                  href={`/articles/${article.slug.current}`}
                  className="flex lg:flex-col gap-4 lg:gap-0 items-start px-0 sm:px-5 py-5 lg:py-0 lg:px-5 hover:bg-ghost transition-colors h-full"
                >
                  {/* Number */}
                  <span
                    className="font-headline font-black text-[2.8rem] leading-none text-rule flex-shrink-0 lg:mb-3 lg:mt-1 select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0 lg:pb-5">
                    {/* Thumbnail — desktop only */}
                    <div className="hidden lg:block relative w-full aspect-[16/9] overflow-hidden bg-ghost mb-2">
                      <Image
                        src={img}
                        alt={article.mainImage?.alt || article.title}
                        fill
                        loading="lazy"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1280px) 20vw, 240px"
                      />
                    </div>

                    {cat && (
                      <span className="font-body text-[0.55rem] tracking-[0.22em] uppercase text-mist block">
                        {cat}
                      </span>
                    )}
                    <h3 className="font-headline font-bold text-ink text-[0.95rem] leading-snug group-hover:text-accent transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>

      </div>
    </section>
  )
}
