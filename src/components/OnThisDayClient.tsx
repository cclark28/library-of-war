'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

const ERA_LABEL: Record<string, string> = {
  'ancient-medieval':         'Ancient & Medieval',
  'early-modern':             'Early Modern',
  'napoleonic-wars':          'Napoleonic Wars',
  'american-civil-war':       'American Civil War',
  'world-war-i':              'World War I',
  'world-war-ii':             'World War II',
  'korean-war':               'Korean War',
  'vietnam-war':              'Vietnam War',
  'cold-war':                 'Cold War',
  'modern-conflicts':         'Modern Conflicts',
  'technology-weapons':       'Technology & Weapons',
  'intelligence-special-ops': 'Intel & Spec Ops',
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

type OTDEntry = {
  _id: string
  month: number
  day: number
  year: number
  headline: string
  summary: string
  era?: string
  linkedArticle?: { title: string; slug: { current: string } }
}

interface Props {
  entries: OTDEntry[]
  todayIndex: number
}

export default function OnThisDayClient({ entries, todayIndex }: Props) {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [visible, setVisible]           = useState(true)
  const touchStartX                     = useRef<number | null>(null)
  const fadeTimeout                     = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useCallback((nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= entries.length) return
    if (nextIndex === activeIndex) return
    setVisible(false)
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    fadeTimeout.current = setTimeout(() => {
      setActiveIndex(nextIndex)
      setVisible(true)
    }, 120)
  }, [entries.length, activeIndex])

  useEffect(() => {
    return () => { if (fadeTimeout.current) clearTimeout(fadeTimeout.current) }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 48) {
      if (delta < 0) navigate(activeIndex + 1)
      else           navigate(activeIndex - 1)
    }
    touchStartX.current = null
  }

  if (!entries.length) return null

  const entry     = entries[activeIndex]
  const dateLabel = `${MONTH_NAMES[entry.month - 1]} ${entry.day}`
  const isToday   = activeIndex === todayIndex

  return (
    <section
      aria-label="On This Day in Military History"
      className="w-full bg-ink"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-10 md:pt-12">
        <div className="flex items-center gap-6">
          <div className="flex-1 border-t border-white/15" />
          <div className="flex items-center gap-3">
            <span className="font-headline font-bold text-paper text-[2rem] leading-none">On This Day</span>
            <span className="font-headline font-bold text-white/30 text-[2rem] leading-none">—</span>
            <span className="font-headline font-bold text-paper text-[2rem] leading-none">{dateLabel}</span>
          </div>
          <div className="flex-1 border-t border-white/15" />
        </div>
      </div>

      {/* ── Entry + navigation ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-6 pt-6 pb-10 md:pb-12">

        {/* Nav row */}
        <div className="flex items-center justify-end gap-2 mb-5">
          {isToday && (
            <span className="font-body text-[0.5rem] tracking-[0.2em] uppercase text-accent border border-accent/40 px-1.5 py-0.5 leading-none mr-auto">
              Today
            </span>
          )}

          {/* Dots */}
          <div
            className="hidden sm:flex items-center gap-1.5"
            role="tablist"
            aria-label="Navigate entries"
          >
            {entries.map((e, i) => (
              <button
                key={e._id}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`${MONTH_NAMES[e.month - 1]} ${e.day}, ${e.year}${i === todayIndex ? ' (today)' : ''}`}
                onClick={() => navigate(i)}
                className={[
                  'rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50',
                  i === activeIndex
                    ? 'w-2 h-2 bg-accent'
                    : i === todayIndex
                    ? 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => navigate(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous entry"
              className="p-2 text-white/40 hover:text-paper disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M8.5 1.5L3.5 6.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => navigate(activeIndex + 1)}
              disabled={activeIndex === entries.length - 1}
              aria-label="Next entry"
              className="p-2 text-white/40 hover:text-paper disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M4.5 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Entry content — year + tag + headline (3-line max) + optional link */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 120ms ease-in-out',
          }}
        >
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="font-headline font-black text-paper text-3xl md:text-4xl leading-none">
              {entry.year}
            </span>
            {entry.era && (
              <span className="font-body text-[0.5rem] sm:text-[0.55rem] tracking-[0.18em] uppercase text-white/50 border border-white/20 px-2 py-1 leading-none">
                {ERA_LABEL[entry.era] ?? entry.era}
              </span>
            )}
          </div>

          <h3 className="font-headline font-bold text-paper text-xl sm:text-2xl md:text-3xl leading-snug line-clamp-3 max-w-2xl">
            {entry.headline}
          </h3>

          {entry.linkedArticle?.slug?.current && (
            <Link
              href={`/articles/${entry.linkedArticle.slug.current}`}
              className="inline-flex items-center gap-2 mt-4 font-body text-[0.62rem] tracking-[0.22em] uppercase text-white/50 hover:text-paper transition-colors duration-200 border-b border-white/20 hover:border-white/50 pb-px"
            >
              Read full article
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-white/10" />
    </section>
  )
}
