/**
 * EraGrid — Homepage section: "Browse by Era"
 *
 * Placement: after "From the Archive", before the browse CTA link.
 * Controlled by siteSettings.sections.showEraGrid flag (renders nothing when false).
 *
 * Tile states:
 *   1. Populated + image  — image background, gradient overlay, count badge, hover state
 *   2. Populated, no image — solid ink background, no overlay, count badge, hover state
 *   3. Empty (count === 0) — crosshatch fill, "Coming Soon", not a link, no hover
 *
 * Grid: 2-col mobile / 3-col tablet / 4-col desktop
 * Law 1 compliance: tile itself is not an article — Era tile renders even when articles
 * lack images. Law 1 only prevents imageless articles from being the tile's background.
 */

import Link from 'next/link'
import Image from 'next/image'
import { ERA_META, ERA_ORDER } from '@/lib/eras'
import { sanityImage } from '@/lib/sanity'

export type EraGridItem = {
  era: string
  count: number
  /** Present only if at least one article in this era has a valid mainImage asset */
  image?: { asset: { _ref: string }; alt?: string }
}

interface Props {
  data: EraGridItem[]
  /** Section header label. Defaults to "Browse by Era". */
  label?: string
}

/**
 * SVG crosshatch data URI for coming-soon tiles.
 * Diagonal lines on ghost background — matches wireframe spec page 5–6.
 */
const CROSSHATCH_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpath d='M0 0L20 20M20 0L0 20' stroke='%23C8B89A' stroke-width='0.75' opacity='0.4'/%3E%3C/svg%3E\")"

export default function EraGrid({ data, label = 'Browse by Era' }: Props) {
  // Index received data by era slug for O(1) lookup
  const byEra = new Map(data.map(d => [d.era, d]))

  return (
    <section aria-label={label}>

      {/* ── Section divider — mirrors SectionDivider in page.tsx ─────────── */}
      <div className="flex items-center gap-6 my-12">
        <div className="flex-1 border-t border-rule" />
        <span className="font-headline font-bold text-ink text-[2rem] leading-none">
          {label}
        </span>
        <div className="flex-1 border-t border-rule" />
      </div>

      {/* ── Tile grid ─────────────────────────────────────────────────────── */}
      {/* Responsive: 2-col (<640px) / 3-col (640–1023px) / 4-col (≥1024px) */}
      {/* Gap: 8px mobile (gap-2), 12px tablet/desktop (md:gap-3)           */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-14">

        {ERA_ORDER.map((slug) => {
          const meta = ERA_META[slug]
          if (!meta) return null

          const item   = byEra.get(slug)
          const count  = item?.count ?? 0
          const image  = item?.image

          /* ── STATE 3: Empty era — coming soon ──────────────────────────── */
          if (count === 0) {
            return (
              <div
                key={slug}
                role="img"
                aria-label={`${meta.label} — Coming Soon`}
                aria-disabled="true"
                className="relative overflow-hidden bg-ghost"
                style={{
                  aspectRatio: '4 / 2.6',
                  minHeight: '88px',
                  backgroundImage: CROSSHATCH_BG,
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 gap-1">
                  <span className="font-headline font-black text-mist text-[0.7rem] sm:text-[0.8rem] leading-snug">
                    {meta.label}
                  </span>
                  <span className="font-body text-[0.5rem] tracking-[0.18em] uppercase text-mist/60">
                    Coming Soon
                  </span>
                </div>
              </div>
            )
          }

          /* ── STATE 1 + 2: Populated (with or without image) ────────────── */
          const imgUrl = image?.asset?._ref
            ? sanityImage(image, { w: 520, h: 338, fit: 'crop' })
            : null

          return (
            <Link
              key={slug}
              href={`/era/${slug}`}
              className="group relative block overflow-hidden bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
              style={{ aspectRatio: '4 / 2.6', minHeight: '88px' }}
              aria-label={`Browse ${meta.label} articles — ${count} ${count === 1 ? 'entry' : 'entries'}`}
            >

              {/* Background: image (State 1) or solid ink (State 2) */}
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={image?.alt || meta.label}
                  fill
                  loading="lazy"
                  className="object-cover opacity-70 transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                /* State 2: solid dark background — no gradient (nothing to overlay) */
                <div className="absolute inset-0 bg-[#1a1a1a]" />
              )}

              {/* Gradient overlay — image tiles only. Lightens slightly on hover. */}
              {imgUrl && (
                <div
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15,14,12,0.88) 0%, rgba(15,14,12,0.45) 58%, transparent 100%)',
                  }}
                />
              )}

              {/* Article count badge — top-right, accent red */}
              <div className="absolute top-2 right-2 z-10" aria-hidden="true">
                <span className="bg-accent text-white font-body text-[0.48rem] sm:text-[0.52rem] leading-none tracking-[0.1em] uppercase px-1.5 py-[3px]">
                  {count} {count === 1 ? 'article' : 'articles'}
                </span>
              </div>

              {/* Era name + year range + arrow — bottom-left */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 z-10">
                <div className="flex items-end justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-headline font-black text-paper text-[0.72rem] sm:text-[0.82rem] leading-tight truncate">
                      {meta.label}
                    </h3>
                    <p className="font-body text-paper/55 text-[0.52rem] sm:text-[0.58rem] mt-0.5 leading-none">
                      {meta.years}
                    </p>
                  </div>
                  {/* Arrow — appears at full opacity on hover/focus */}
                  <span
                    className="text-paper text-sm shrink-0 opacity-25 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>

            </Link>
          )
        })}

      </div>
    </section>
  )
}
