'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/* ── Nav data type ─────────────────────────────────────────────────────────── */

export type NavData = {
  homeLabel?: string
  browseLabel?: string
  seriesLabel?: string
  resourcesLabel?: string
  idDrillLabel?: string
  missionLabel?: string
  searchLabel?: string
  searchPlaceholder?: string
  mastTagline?: string
  eraItems?: Array<{ label: string; years?: string; href: string; visible?: boolean }>
  seriesItems?: Array<{ label: string; href: string; visible?: boolean }>
  socialLinks?: Array<{ label: string; href: string }>
}

/* ── Fallback data (used if Sanity document not yet created) ───────────────── */

const FALLBACK_ERAS: Array<{ label: string; years?: string; href: string; visible?: boolean }> = [
  { label: 'World War I',        years: '1914–1918',      href: '/browse?era=world-war-i' },
  { label: 'World War II',       years: '1939–1945',      href: '/browse?era=world-war-ii' },
  { label: 'Korean War',         years: '1950–1953',      href: '/browse?era=korean-war' },
  { label: 'Vietnam War',        years: '1955–1975',      href: '/browse?era=vietnam-war' },
  { label: 'Cold War',           years: '1947–1991',      href: '/browse?era=cold-war' },
  { label: 'Modern Conflicts',   years: '1990–Present',   href: '/browse?era=modern-conflicts' },
  { label: 'Ancient & Medieval', years: 'Antiquity–1500', href: '/browse?era=ancient-medieval' },
  { label: 'Napoleonic Wars',    years: '1803–1815',      href: '/browse?era=napoleonic' },
  { label: 'American Civil War', years: '1861–1865',      href: '/browse?era=civil-war' },
]

const FALLBACK_SERIES: Array<{ label: string; href: string; visible?: boolean }> = [
  { label: "Weapons That Shouldn't Have Worked", href: '/series/weapons-that-shouldnt-have-worked' },
  { label: 'The Day After',                       href: '/series/the-day-after' },
  { label: 'Black Projects',                      href: '/series/black-projects' },
]

const FALLBACK_SOCIAL = [
  { label: 'X',         href: 'https://x.com/libraryofwar' },
  { label: 'Instagram', href: 'https://instagram.com/libraryofwar' },
  { label: 'Facebook',  href: 'https://facebook.com/libraryxwar' },
]

/* ── Chevron ───────────────────────────────────────────────────────────────── */

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

export default function Header({ navData }: { navData?: NavData | null }) {
  const router = useRouter()

  // Merge Sanity data with fallbacks, filter hidden items
  const ERAS         = (navData?.eraItems    ?? FALLBACK_ERAS).filter(e => e.visible !== false)
  const SERIES_ITEMS = (navData?.seriesItems ?? FALLBACK_SERIES).filter(s => s.visible !== false)
  const SOCIAL       = navData?.socialLinks ?? FALLBACK_SOCIAL
  const labels = {
    home:      navData?.homeLabel      ?? 'Home',
    browse:    navData?.browseLabel    ?? 'Browse by Era',
    series:    navData?.seriesLabel    ?? 'Series',
    resources: navData?.resourcesLabel ?? 'Resources',
    idDrill:   navData?.idDrillLabel   ?? 'ID Drill',
    mission:   navData?.missionLabel   ?? 'Mission',
    search:    navData?.searchLabel    ?? 'Search',
    searchPH:  navData?.searchPlaceholder ?? 'Search the archive…',
    tagline:   navData?.mastTagline    ?? 'Military History Archive',
  }
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [mobileEra, setMobileEra]       = useState(false)
  const [mobileSeries, setMobileSeries] = useState(false)
  const [openMenu, setOpenMenu]         = useState<null | 'era' | 'series'>(null)
  const [searchOpen, setSearchOpen]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [scrolled, setScrolled]         = useState(false)
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* focus search input on open */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 60)
  }, [searchOpen])

  /* escape closes search */
  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen])

  /* body scroll lock when mobile open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const openFor = useCallback((menu: 'era' | 'series') => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(menu)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/browse?q=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const NAV_LINK = 'font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors px-5 py-3 block'

  return (
    <>
      {/* ── Search overlay ──────────────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center"
          style={{
            background: 'rgba(249,246,240,0.97)',
            backdropFilter: 'blur(6px)',
            paddingTop: 'clamp(80px, 18vh, 200px)',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl px-6"
            style={{ animation: 'search-drop 0.28s cubic-bezier(0.16,1,0.3,1) both' }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
                <svg width="20" height="20" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-mist flex-shrink-0" aria-hidden="true">
                  <circle cx="5.5" cy="5.5" r="4.5"/>
                  <line x1="9" y1="9" x2="12" y2="12"/>
                </svg>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={labels.searchPH}
                  className="w-full bg-transparent font-headline text-[1.75rem] text-ink placeholder:text-mist/40 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-mist hover:text-ink transition-colors flex-shrink-0 p-1"
                  aria-label="Close search"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="1" y1="1" x2="12" y2="12"/>
                    <line x1="12" y1="1" x2="1" y2="12"/>
                  </svg>
                </button>
              </div>
              <p className="mt-4 font-body text-[0.56rem] tracking-[0.24em] uppercase text-mist/50">
                Press Enter to search · Escape to close
              </p>
            </form>
          </div>
        </div>
      )}

      <header className={`bg-paper relative z-50 transition-shadow duration-400 ${scrolled ? 'shadow-[0_1px_24px_rgba(10,8,6,0.07)]' : ''}`}>

        {/* ── Top utility bar ──────────────────────────────────────────── */}
        <div className="border-b border-rule px-5 py-2 flex justify-between items-center">

          {/* Social — left */}
          <div className="flex items-center gap-4">
            {SOCIAL.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ink/40 hover:text-accent transition-colors duration-150"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Right: search + hamburger */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 font-body text-[0.65rem] tracking-[0.18em] uppercase text-ink hover:text-accent transition-colors"
              aria-label="Open search"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <circle cx="5.5" cy="5.5" r="4.5"/>
                <line x1="9" y1="9" x2="12" y2="12"/>
              </svg>
              {labels.search}
            </button>

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="flex flex-col gap-[4px] p-0.5 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span
                className="w-5 h-px bg-ink block transition-all duration-300 origin-center"
                style={mobileOpen ? { transform: 'translateY(5px) rotate(45deg)' } : {}}
              />
              <span className={`w-5 h-px bg-ink block transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span
                className="h-px bg-ink block transition-all duration-300 origin-center"
                style={mobileOpen
                  ? { width: '20px', transform: 'translateY(-5px) rotate(-45deg)' }
                  : { width: '12px' }
                }
              />
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
              {labels.tagline}
            </p>
          </Link>
        </div>

        {/* ── Desktop nav ───────────────────────────────────────────────── */}
        <nav
          className="hidden md:block bg-paper border-b-2 border-ink relative"
          aria-label="Main navigation"
        >
          <ul className="max-w-7xl mx-auto px-6 flex items-stretch justify-center list-none m-0 p-0">

            <li className="border-r border-rule flex items-center">
              <Link href="/" className={NAV_LINK}>{labels.home}</Link>
            </li>

            <li
              className="border-r border-rule flex items-center relative"
              onMouseEnter={() => openFor('era')}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`${NAV_LINK} flex items-center`}
                aria-expanded={openMenu === 'era'}
                aria-haspopup="true"
                onClick={() => { setOpenMenu(null); router.push('/browse') }}
              >
                {labels.browse}
                <ChevronDown open={openMenu === 'era'} />
              </button>
            </li>

            <li
              className="border-r border-rule flex items-center relative"
              onMouseEnter={() => openFor('series')}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`${NAV_LINK} flex items-center`}
                aria-expanded={openMenu === 'series'}
                aria-haspopup="true"
                onClick={() => { setOpenMenu(null); router.push('/series') }}
              >
                {labels.series}
                <ChevronDown open={openMenu === 'series'} />
              </button>

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

            <li className="border-r border-rule flex items-center">
              <Link href="/resources" className={NAV_LINK}>{labels.resources}</Link>
            </li>

            <li className="border-r border-rule flex items-center">
              <Link href="/id-drill" className={NAV_LINK}>{labels.idDrill}</Link>
            </li>

            <li className="flex items-center">
              <Link href="/about" className={NAV_LINK}>{labels.mission}</Link>
            </li>

          </ul>

          {/* Browse by Era — Mega Menu */}
          {openMenu === 'era' && (
            <div
              className="absolute top-full left-0 right-0 bg-paper border-b-2 border-ink z-40 shadow-md"
              style={{ animation: 'menu-drop 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
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
          <nav
            className="md:hidden bg-paper border-b-2 border-ink"
            style={{ animation: 'menu-drop 0.22s cubic-bezier(0.16,1,0.3,1) both' }}
            aria-label="Main navigation mobile"
          >
            {/* Mobile social */}
            <div className="flex gap-5 px-6 py-3 border-b border-rule">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ink/40 hover:text-accent transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors border-b border-rule">
              {labels.home}
            </Link>

            <div>
              <button
                onClick={() => setMobileEra(v => !v)}
                className="w-full flex justify-between items-center px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink border-b border-rule"
              >
                {labels.browse}
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

            <div>
              <button
                onClick={() => setMobileSeries(v => !v)}
                className="w-full flex justify-between items-center px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink border-b border-rule"
              >
                {labels.series}
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
              {labels.resources}
            </Link>

            <Link href="/id-drill" onClick={() => setMobileOpen(false)}
              className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors border-b border-rule">
              {labels.idDrill}
            </Link>

            <Link href="/about" onClick={() => setMobileOpen(false)}
              className="block px-6 py-3.5 font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent transition-colors">
              {labels.mission}
            </Link>

          </nav>
        )}

      </header>
    </>
  )
}
