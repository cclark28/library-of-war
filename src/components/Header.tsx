'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'

/* ── Data ──────────────────────────────────────────────────────────────────── */

const ERAS = [
  { label: 'World War I',       years: '1914–1918',    href: '/browse?era=world-war-i' },
  { label: 'World War II',      years: '1939–1945',    href: '/browse?era=world-war-ii' },
  { label: 'Korean War',        years: '1950–1953',    href: '/browse?era=korean-war' },
  { label: 'Vietnam War',       years: '1955–1975',    href: '/browse?era=vietnam-war' },
  { label: 'Cold War',          years: '1947–1991',    href: '/browse?era=cold-war' },
  { label: 'Modern Conflicts',  years: '1990–Present', href: '/browse?era=modern-conflicts' },
]

const SERIES_ITEMS = [
  { label: "Weapons That Shouldn't Have Worked", href: '/series/weapons-that-shouldnt-have-worked' },
  { label: 'The Day After',                       href: '/series/the-day-after' },
  { label: 'Black Projects',                      href: '/series/black-projects' },
]

/* ── Chevron icon ──────────────────────────────────────────────────────────── */

function ChevronDown({ open }: { open?: boolean }) {
  return (
    <svg
      width="8" height="5" viewBox="0 0 8 5" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      className={`inline ml-1.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="1 1 4 4 7 1" />
    </svg>
  )
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function Header() {
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [mobileEra, setMobileEra]       = useState(false)
  const [mobileSeries, setMobileSeries] = useState(false)
  const [openMenu, setOpenMenu]         = useState<null | 'era' | 'series'>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openFor = useCallback((menu: 'era' | 'series') => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(menu)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const NAV_LINK = 'font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors px-5 py-3 block'

  return (
    <header className="bg-paper relative z-50">

      {/* ── Top utility bar ──────────────────────────────────────────── */}
      <div className="border-b border-rule px-5 py-2 flex justify-between items-center">
        <Link href="/" aria-label="Library of War home">
          <svg width="22" height="21" viewBox="0 0 80 76" fill="currentColor" aria-hidden="true">
            <path d="M70.47,14.28c-.94.24-2.52,1.72-2.52,1.72-.42-.75-1.19-1.04-1.19-1.04,0,0,1.24-1.63.93-2.04-.31-.4-2.67,1.38-2.67,1.38-3.74-.72-6.86-.74-9.48-.24-3.04.66-5.49,2.05-7.45,3.7-.61.55-1.16,1.12-1.65,1.69-2.26,2.76-3.59,6.09-4.57,8.99,0,0,0,0,0,.01-.29-.14-.57-.3-.82-.45-.44-.3-.84-.59-1.17-.83-.02-.02-.03-.03-.03-.03l-.04-.05s.1-.06.12-.12c.02-.08.01-.19,0-.25.11-.45.01-1.59.01-1.59,0,0,.03-.06.05-.14.03-.1.07-.24.05-.31-.03-.13-.44-.21-.6-.2-.05,0-.11,0-.17.02-.14-1.21-.46-2.78-1.13-3.25-.23-.16-.49-.2-.75-.11-.27.08-.46.27-.57.54-.37.9.35,2.72.81,3.73-.07.09-.21.24-.37.44l-5.28-1.1-.12-.93-.3-.35c.35.03,1.31.11,1.89-.05.71-.2,2.42-2.53,2.42-2.53,0,0,2.05-.45,2.75-.96.18-.13.57-.42,1.05-.78,0,0,0,0,0,0l1.79-1.34c.04.06.08.12.14.17l-.14.22-.05-.03c-.06-.03-.13-.02-.16.04-.03.06-.02.13.04.16l.44.27c.06.03.13.02.16-.04.03-.06.02-.13-.04-.16l-.05-.03.14-.22c.35.13.73.03.9-.25.14-.23.11-.52-.06-.76l.15-.25.11.07c.06.04.15.02.18-.04.04-.06.02-.15-.04-.18l-.11-.07v-.02s.1-.12.1-.12c.2.02.71.05.89-.05.22-.12.31-.49.41-.69.09-.17.11-.51.12-.62.06-.01.12-.03.16-.05.08-.03.07-.13.06-.21h.13s.41-.66.41-.66l-.23-.14,6.24-10.05,1.08-3.47-2.58,2.55-6.1,10.14-.23-.14-.41.68.26.41h-.05s-.2-.29-.31-.29-.33.08-.35.18c-.02.1.04.44.04.44-.09.21-.07.37-.05.47-.15.12-.41.3-.7.5-.43.26-.96.55-1.33.65-.1.03-.23.07-.36.11-.85.24-2,.52-2.27.67-.37.21-1.75,1.63-1.75,1.63-1.37,0-4.04,1.12-4.6,1.36-.57-.44-1.94-1.26-3.6-.66l-.68-.68c.97.35,1.64-.38,1.66-.44.02-.05-.11-.28-.11-.28l.03-.25s.11-.02.22-.08c.11-.05.08-.27.08-.27l.25-.12s-.02-.08-.01-.14c.05-.08.1-.16.11-.26l.41-.05-.1-.93-.21-.48.19-.32.19.06s.18-.45.24-1.07c.32.12.71.18.71.18l.04-.12c-.16-.13-.54-.29-.73-.36.03-.99-.31-2.26-2.03-2.85-.04-.11-.07-.19-.07-.19,0,0-.2-.07-.5-.12l.04-1.91c.22,0,1.2.08,1.32,1.8l.8.02.39-.35,2.35-.84c.02-.17.03-.34.02-.51-.11-2.42-2.66-4.28-5.72-4.16h0c-3.05.15-5.44,2.22-5.33,4.65,0,.17.03.34.06.51l2.41.63.42.32.79-.09c-.03-1.57.77-1.85,1.08-1.9l.24,1.82-.4.1-.03.13c-1.7.55-2.31,2.67-2.36,3.38,0,0-2.85-.33-2.97-.24-.12.09.07.18.15.23.07.04,2.99,1.13,3.43,1.29l-.76,2.23s-1.06,2.55-1.03,4.02c.03,1.47.65,3.51,3.77,7.1,0,0-1.28,1.36-1.5,2-.07.17-.17.46-.25.75,0,0,0,0,0,0-.01.04-.03.08-.04.12-.66-.28-1.1-.45-1.1-.45-.66-.17-1.3-.3-1.9-.39-1.16-.13-2.33-.18-3.46-.12-3.71.31-5.75,1.97-5.75,1.97-.2-.07-.38-.15-.56-.25-.72-.33-1.75-1.2-2.37-3.46-1.04-3.77-4.78.3-4.9.76-.11.4.78,2.66,5.37,5.28-.11.16-.21.33-.31.5-3.43,5.57-1.53,9.52-.55,11.11.12.23.2.41.2.59.02.84.6,1.88.6,1.88,0,0-1.02,2.08-1.9,3.08-.88,1-2.24,1.9-3.64,2.42-1.4.52-1.24,2.44-1.34,3-.1.56-.5,1.96-.64,3.46-.14,1.5-1.64,5.75-2.12,6.93-.48,1.18-.12,2.14.6,2.66.72.52.98,1.98.98,1.98,0,0-.8.7-.94,1.02-.14.32.1.76.1.76l.24,1.63s4.18-.02,5-.02c.68,0,.62-.2.62-.2l-1-2.44c.18-.62-.5-1.06-.9-1.36-.4-.3-.82-1.54-.48-2.18.34-.64.2-1.66.02-2.16-.18-.5,1.06-5.33,1.56-6.31.5-.98,1.54-1.72,2.5-2.88.96-1.16,1.92-2.24,3.74-2.9,1.82-.66,3.48-2.92,3.74-3.06.26-.14,1.64-.96,1.64-.96.2.34.94.78.94.78,0,0,0,1.06-.3,1.98-.3.92-1.26,2.2-2,2.8-.74.6-1.68.92-1.74,2.28-.06,1.36,1.84,1.76,2.82,2.58.98.82,1.72,1.24,3.38,2.02,1.66.78,2.92,2.74,3.34,3.58.42.84,1.42.38,1.64.56.22.18.14.6.14.6,0,0-.84.4-1.08.8-.24.4-.04.54-.04.54l-.24,1.7s3.32,1.56,4.04,1.74c.72.18.66-.12.66-.12l.08-2.48c.78-.54.09-1.35.09-1.35.21-1.17-.33-1.86-.6-2.4s-.15-1.2-.33-1.95c-.18-.75-2.73-2.22-4.29-2.91s-2.79-2.1-2.76-3.42c.03-1.32,2.85-2.52,3.6-3,.75-.48,2.94-3.9,2.94-3.9,3.03,2.61,14.03.9,14.27,1.05.24.15.27.84.27.84.27,1.17-.64,5.39-.84,6.15-.2.76-.06,1.04-.1,1.72-.04.68-1.28,4.96-1.56,5.63-.28.68-1.02,1.8-1.1,2.7-.08.9.72,1.28,1.2,1.48.48.2,1.18,1.36,1.18,1.36,0,0-.4.78-.52,1.52-.12.74.48.58.48.58l.26,1.02h4.9c.62,0,.32-.34.32-.34,0,0-1.2-1.38-1-2.06.2-.68-.98-1.06-.98-1.06,0,0-1.22-1.06-1.22-1.58s-.26-1.46-.3-1.96c-.04-.5.4-4.54,1.2-5.12s1.94-2.6,1.94-3.04.06-2.36,1.18-3.86c1.12-1.5,2.42-4.24,2.42-4.24.46-.32.86-.94.86-.94,0,0,.98.1,4.62.08,3.64-.02,7.89-1.68,7.89-1.68,0,0,.92,1.04.96,2,.04.96-.9,3.48-1.24,3.96-.34.48-.58,1.1-.82,1.68-.24.58.14,1.02.14,1.02l-.06.5s-.84-.28-1.28-.24c-.44.04-.94.78-.94.78-.26-.08-.62.08-.62.08,0,0-.28,4.98-.28,5.41s.42.22.42.22l2.54-1.28s.56.3.84,0c.28-.3.74-1.38.74-1.38,0,0,1.9-1.64,2.84-2.84.94-1.2.46-2.68.56-3.98.1-1.3.64-2.7,1.46-4.92.82-2.22-.6-4.52-1.1-4.88-.5-.36-4-.32-5.81-.5-1.82-.18-4.26-1-4.26-1,0,0,.68-.56.76-.96s.28-3.4.16-3.92c-.12-.52-.98-1.5-.98-1.5,0,0,.44-.7,1-2.4.05-.15.09-.33.12-.52.98-.73,1.82-1.45,2.48-2.07.8.2,1.81-.49,1.81-.49,0,0,1,.76,2.24.38,1.24-.38,1.08-1.64,1.08-1.64.8-.28.58-1.22.58-1.22.24-.08.16-.38,0-.68-.16-.3-.08-1.22.14-2.3.22-1.08.06-2.32.08-3.32.02-1,.42-1.46.78-1.92.36-.46,1-1,.78-1.28-.22-.28-.38-1.34-.38-1.34.2-.5.3-1.76.3-1.76l.18.3c.16-.48-.04-1.16-.04-1.16,2.04-.74,2.04-2.82,2.04-2.82Z"/>
          </svg>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 font-body text-[0.65rem] tracking-[0.18em] uppercase text-ink hover:text-accent transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <circle cx="5.5" cy="5.5" r="4.5"/>
              <line x1="9" y1="9" x2="12" y2="12"/>
            </svg>
            Search
          </Link>

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex flex-col gap-[4px] p-0.5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="w-5 h-px bg-ink block" />
            <span className="w-5 h-px bg-ink block" />
            <span className={`h-px bg-ink block transition-all duration-200 ${mobileOpen ? 'w-5' : 'w-3'}`} />
          </button>
        </div>
      </div>

      {/* ── Masthead ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-7 pb-5 text-center border-b border-rule">
        <Link href="/" className="inline-block group">
          <h1 className="sr-only">Library of War</h1>
          <Image
            src="/logo-horizontal.svg"
            alt="Library of War"
            width={520}
            height={122}
            priority
            className="mx-auto w-auto transition-opacity duration-200 group-hover:opacity-80"
            style={{ height: 'clamp(44px, 7vw, 88px)', width: 'auto' }}
          />
          <p className="font-body text-mist text-[0.58rem] tracking-[0.35em] uppercase mt-3 group-hover:text-accent transition-colors">
            Editorial Military History Archive
          </p>
        </Link>
      </div>

      {/* ── Desktop nav ───────────────────────────────────────────────── */}
      <nav
        className="hidden md:block bg-paper border-b-2 border-ink relative"
        aria-label="Main navigation"
      >
        <ul className="max-w-7xl mx-auto px-6 flex items-stretch justify-center list-none m-0 p-0">

          {/* Home */}
          <li className="border-r border-rule flex items-center">
            <Link href="/" className={NAV_LINK}>Home</Link>
          </li>

          {/* Browse by Era — Mega Menu */}
          <li
            className="border-r border-rule flex items-center relative"
            onMouseEnter={() => openFor('era')}
            onMouseLeave={scheduleClose}
          >
            <button
              className={`${NAV_LINK} flex items-center`}
              aria-expanded={openMenu === 'era'}
              aria-haspopup="true"
            >
              Browse by Era
              <ChevronDown open={openMenu === 'era'} />
            </button>
          </li>

          {/* Series — Dropdown */}
          <li
            className="border-r border-rule flex items-center relative"
            onMouseEnter={() => openFor('series')}
            onMouseLeave={scheduleClose}
          >
            <button
              className={`${NAV_LINK} flex items-center`}
              aria-expanded={openMenu === 'series'}
              aria-haspopup="true"
            >
              Series
              <ChevronDown open={openMenu === 'series'} />
            </button>

            {/* Series dropdown panel */}
            {openMenu === 'series' && (
              <div
                className="absolute top-full left-0 bg-paper border border-rule border-t-0 shadow-lg z-50 min-w-[300px]"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                role="menu"
              >
                {SERIES_ITEMS.map(s => (
                  <Link
                    key={s.href}
                    href={s.href}
                    role="menuitem"
                    className="block px-5 py-3.5 font-body text-[0.68rem] tracking-[0.12em] uppercase text-ink hover:text-accent hover:bg-ghost transition-colors border-b border-rule/50 last:border-0"
                    onClick={() => setOpenMenu(null)}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Resources */}
          <li className="border-r border-rule flex items-center">
            <Link href="/resources" className={NAV_LINK}>Resources</Link>
          </li>

          {/* Mission */}
          <li className="flex items-center">
            <Link href="/mission" className={NAV_LINK}>Mission</Link>
          </li>

        </ul>

        {/* Browse by Era — Mega Menu panel (full-width, below nav) */}
        {openMenu === 'era' && (
          <div
            className="absolute top-full left-0 right-0 bg-paper border-b-2 border-ink z-40 shadow-md"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="menu"
            aria-label="Browse by Era"
          >
            <div className="max-w-7xl mx-auto px-6 py-0 grid grid-cols-3">
              {ERAS.map((era, i) => (
                <Link
                  key={era.href}
                  href={era.href}
                  role="menuitem"
                  onClick={() => setOpenMenu(null)}
                  className={`
                    group flex flex-col gap-1 px-6 py-5
                    hover:bg-ghost transition-colors
                    ${i % 3 !== 2 ? 'border-r border-rule' : ''}
                    ${i < 3 ? 'border-b border-rule' : ''}
                  `}
                >
                  <span className="font-headline font-bold text-ink text-[0.95rem] leading-tight group-hover:text-accent transition-colors">
                    {era.label}
                  </span>
                  <span className="font-body text-mist text-[0.58rem] tracking-[0.18em] uppercase">
                    {era.years}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile nav ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav className="md:hidden bg-paper border-b-2 border-ink" aria-label="Main navigation mobile">

          <Link href="/" onClick={() => setMobileOpen(false)}
            className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors border-b border-rule">
            Home
          </Link>

          {/* Browse by Era accordion */}
          <div>
            <button
              onClick={() => setMobileEra(v => !v)}
              className="w-full flex justify-between items-center px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink border-b border-rule"
            >
              Browse by Era
              <ChevronDown open={mobileEra} />
            </button>
            {mobileEra && (
              <div className="bg-ghost border-b border-rule">
                {ERAS.map(era => (
                  <Link
                    key={era.href}
                    href={era.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-8 py-3 font-body text-[0.65rem] tracking-[0.12em] uppercase text-ink hover:text-accent border-b border-rule/40 last:border-0 transition-colors"
                  >
                    <span>{era.label}</span>
                    <span className="text-mist text-[0.55rem] tracking-wider">{era.years}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Series accordion */}
          <div>
            <button
              onClick={() => setMobileSeries(v => !v)}
              className="w-full flex justify-between items-center px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink border-b border-rule"
            >
              Series
              <ChevronDown open={mobileSeries} />
            </button>
            {mobileSeries && (
              <div className="bg-ghost border-b border-rule">
                {SERIES_ITEMS.map(s => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-8 py-3 font-body text-[0.65rem] tracking-[0.12em] uppercase text-ink hover:text-accent border-b border-rule/40 last:border-0 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/resources" onClick={() => setMobileOpen(false)}
            className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors border-b border-rule">
            Resources
          </Link>

          <Link href="/mission" onClick={() => setMobileOpen(false)}
            className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors">
            Mission
          </Link>

        </nav>
      )}

    </header>
  )
}
