/**
 * /era/[slug] — Dedicated era landing page
 *
 * Route: /era/world-war-ii, /era/cold-war, etc.
 * All 13 era slugs in ERA_ORDER are valid. Any other slug returns 404.
 *
 * Structure:
 *   1. Full-width hero — representative image (most recent article with mainImage),
 *      era name, year range, editorial description.
 *   2. Entry count divider.
 *   3. Article grid — all published articles in this era, md:grid-cols-3.
 *   4. Era navigation — prev/next era links following ERA_ORDER sequence.
 *
 * Law 1: This page is a full archive listing (not a feature block), so imageless
 * articles are allowed to appear in the grid. The hero image is only shown when
 * a valid mainImage exists — otherwise fallback gradient is used.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { client, articlesByEraQuery, sanityImage } from '@/lib/sanity'
import { ERA_META, ERA_ORDER } from '@/lib/eras'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface Params { params: Promise<{ slug: string }> }

type Article = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  mainImage?: { asset: { _ref: string }; alt?: string; caption?: string; hotspot?: { x: number; y: number } }
  author?: { name: string; slug?: { current: string }; role?: string; photo?: { asset: { _ref: string } } }
  series?: { title: string; slug: { current: string } }
  categories?: Array<{ title: string; slug: { current: string } }>
}

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const meta = ERA_META[slug]
  if (!meta) return {}
  return {
    title: `${meta.label} (${meta.years}) | Library of War`,
    description: meta.description,
    openGraph: {
      title: `${meta.label} | Library of War`,
      description: meta.description,
      type: 'website',
    },
  }
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function EraPage({ params }: Params) {
  const { slug } = await params

  // Validate era slug — any unknown slug is a hard 404
  const meta = ERA_META[slug]
  if (!meta) notFound()

  // Fetch all published articles in this era, newest first
  const articles: Article[] = await client
    .fetch(articlesByEraQuery, { era: slug })
    .catch(() => [])

  // Representative hero image — most recent article with a valid mainImage asset
  const heroArticle = articles.find(a => !!a.mainImage?.asset?._ref)
  const heroImageUrl = heroArticle?.mainImage
    ? sanityImage(heroArticle.mainImage, { w: 1800, h: 600, fit: 'crop', q: 85 })
    : null

  // Era navigation — prev/next following ERA_ORDER sequence
  const currentIndex = (ERA_ORDER as readonly string[]).indexOf(slug)
  const prevSlug = currentIndex > 0 ? ERA_ORDER[currentIndex - 1] : null
  const nextSlug = currentIndex < ERA_ORDER.length - 1 ? ERA_ORDER[currentIndex + 1] : null
  const prevMeta = prevSlug ? ERA_META[prevSlug] : null
  const nextMeta = nextSlug ? ERA_META[nextSlug] : null

  return (
    <>
      <HeaderWrapper />

      <main>

        {/* ── Section 1: Hero ───────────────────────────────────────────── */}
        <div className="relative w-full aspect-[21/6] overflow-hidden bg-ink">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={heroArticle?.mainImage?.alt || meta.label}
              fill
              priority
              className="object-cover opacity-70"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-olive to-ink" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10">
            {/* Year range as eyebrow */}
            <p className="font-body text-paper/45 text-[0.65rem] tracking-[0.3em] uppercase mb-2">
              {meta.years}
            </p>
            <h1 className="font-headline font-black text-paper text-display-sm md:text-display leading-tight">
              {meta.label}
            </h1>
            <p className="font-body text-paper/70 text-body mt-3 max-w-2xl">
              {meta.description}
            </p>
          </div>
        </div>

        {/* ── Section 2: Article count divider ─────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 rule-top" />
            <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist">
              {articles.length} {articles.length === 1 ? 'Entry' : 'Entries'}
            </span>
            <div className="flex-1 rule-top" />
          </div>
        </div>

        {/* ── Section 3: Article grid ───────────────────────────────────── */}
        {/* Law 1: full archive listing — imageless articles are permitted here */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  size="md"
                  showExcerpt
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-rule">
              <p className="font-body text-mist text-lg tracking-wider uppercase">
                Dispatches incoming
              </p>
              <p className="font-body text-mist/60 text-base mt-2">
                First entry in this era coming soon.
              </p>
            </div>
          )}
        </div>

        {/* ── Section 4: Era navigation ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-stretch justify-between border-t border-rule pt-10 gap-8">

            {/* Previous era */}
            {prevMeta && prevSlug ? (
              <Link
                href={`/era/${prevSlug}`}
                className="group flex items-center gap-4 text-mist hover:text-ink transition-colors duration-200"
              >
                <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                  ←
                </span>
                <div>
                  <p className="font-body text-[0.55rem] tracking-[0.22em] uppercase text-mist/60 mb-1">
                    Previous Era
                  </p>
                  <p className="font-headline font-bold text-base leading-snug">
                    {prevMeta.label}
                  </p>
                  <p className="font-body text-[0.65rem] text-mist/70 mt-0.5">
                    {prevMeta.years}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next era */}
            {nextMeta && nextSlug ? (
              <Link
                href={`/era/${nextSlug}`}
                className="group flex items-center gap-4 text-right text-mist hover:text-ink transition-colors duration-200 ml-auto"
              >
                <div>
                  <p className="font-body text-[0.55rem] tracking-[0.22em] uppercase text-mist/60 mb-1">
                    Next Era
                  </p>
                  <p className="font-headline font-bold text-base leading-snug">
                    {nextMeta.label}
                  </p>
                  <p className="font-body text-[0.65rem] text-mist/70 mt-0.5">
                    {nextMeta.years}
                  </p>
                </div>
                <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                  →
                </span>
              </Link>
            ) : (
              <div />
            )}

          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
