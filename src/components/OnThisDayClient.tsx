'use client'

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
  month: number
  day: number
}

export default function OnThisDayClient({ entries, month, day }: Props) {
  if (!entries.length) return null

  const dateLabel = `${MONTH_NAMES[month - 1]} ${day}`

  const gridClass =
    entries.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
    entries.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                           'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section aria-label="On This Day in Military History" className="w-full bg-ink">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-14">
        <div className="flex items-center gap-6">
          <div className="flex-1 border-t border-white/15" />
          <span className="font-headline font-bold text-paper text-[2rem] leading-none whitespace-nowrap">
            On This Day
          </span>
          <div className="flex-1 border-t border-white/15" />
        </div>
      </div>

      {/* ── Date — prominent, centered ─────────────────────────────────── */}
      <div className="text-center pt-5 pb-8 md:pb-10">
        <p
          className="font-headline font-black text-paper leading-none"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          {dateLabel}
        </p>
      </div>

      {/* ── Divider + events ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-12 md:pb-14">
        <div className="border-t border-white/10 mb-10" />

        <div className={`grid ${gridClass} divide-y sm:divide-y-0 sm:divide-x divide-white/10`}>
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="py-6 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
            >
              {/* Year + era tag */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-headline font-black text-paper text-3xl md:text-4xl leading-none">
                  {entry.year}
                </span>
                {entry.era && (
                  <span className="font-body text-[0.48rem] tracking-[0.18em] uppercase text-white/50 border border-white/20 px-2 py-1 leading-none">
                    {ERA_LABEL[entry.era] ?? entry.era}
                  </span>
                )}
              </div>

              {/* Headline — 3 lines max */}
              <h3 className="font-headline font-bold text-paper text-lg sm:text-xl leading-snug line-clamp-3">
                {entry.headline}
              </h3>

              {/* Read article link */}
              {entry.linkedArticle?.slug?.current && (
                <Link
                  href={`/articles/${entry.linkedArticle.slug.current}`}
                  className="inline-flex items-center gap-2 mt-4 font-body text-[0.58rem] tracking-[0.22em] uppercase text-white/45 hover:text-paper transition-colors duration-200 border-b border-white/20 hover:border-white/50 pb-px"
                >
                  Read full article <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10" />
    </section>
  )
}
