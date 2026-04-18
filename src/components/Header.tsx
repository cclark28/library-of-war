'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Home',          href: '/' },
  { label: 'Series',        href: '/series' },
  { label: 'Weapons',       href: '/series/weapons-that-shouldnt-have-worked' },
  { label: 'The Day After', href: '/series/the-day-after' },
  { label: 'Ghost Gear',    href: '/series/ghost-gear' },
  { label: 'Browse by Era', href: '/browse' },
  { label: 'About',         href: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-paper">
      {/* ── Top utility bar ────────────────────────────────────────────── */}
      <div className="border-b border-rule px-5 py-2 flex justify-between items-center">
        <Link href="/" aria-label="Library of War home">
          {/* Crest / monogram */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
            <text x="11" y="15.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="bold" fill="currentColor">W</text>
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
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[4px] p-0.5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="w-5 h-px bg-ink block" />
            <span className="w-5 h-px bg-ink block" />
            <span className="w-3 h-px bg-ink block" />
          </button>
        </div>
      </div>

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-rule">
        <Link href="/" className="inline-block group">
          <h1 className="font-headline font-black text-ink leading-none tracking-tight select-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '-0.02em' }}>
            <span>LIBRARY </span>
            <em className="not-italic font-normal" style={{ fontStyle: 'italic', fontWeight: 400 }}>of</em>
            <span> WAR</span>
          </h1>
          <p className="font-body text-mist text-[0.6rem] tracking-[0.35em] uppercase mt-2 group-hover:text-accent transition-colors">
            Editorial Military History Archive
          </p>
        </Link>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav
        className={`bg-paper border-b-2 border-ink ${menuOpen ? 'block' : 'hidden md:block'}`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                font-body text-[0.72rem] tracking-[0.14em] uppercase text-ink hover:text-accent
                transition-colors px-5 py-3 w-full md:w-auto text-center
                ${i < NAV_ITEMS.length - 1 ? 'border-b md:border-b-0 md:border-r border-rule' : ''}
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
