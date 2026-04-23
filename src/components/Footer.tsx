import Link from 'next/link'
import { liveClient, footerQuery } from '@/lib/sanity'

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_SOCIAL = [
  { label: 'X',         href: 'https://x.com/libraryofwar' },
  { label: 'Facebook',  href: 'https://facebook.com/libraryxwar' },
  { label: 'Instagram', href: 'https://instagram.com/libraryofwar' },
]

const FALLBACK_COLUMNS = [
  {
    heading: 'Browse by Era',
    links: [
      { label: 'World War I',          href: '/browse?era=world-war-i' },
      { label: 'World War II',         href: '/browse?era=world-war-ii' },
      { label: 'Korean War',           href: '/browse?era=korean-war' },
      { label: 'Vietnam War',          href: '/browse?era=vietnam-war' },
      { label: 'Cold War',             href: '/browse?era=cold-war' },
      { label: 'Modern Conflicts',     href: '/browse?era=modern-conflicts' },
    ],
  },
  {
    heading: '',
    links: [
      { label: 'Ancient & Medieval',      href: '/browse?era=ancient-medieval' },
      { label: 'Napoleonic Wars',         href: '/browse?era=napoleonic-wars' },
      { label: 'American Civil War',      href: '/browse?era=american-civil-war' },
      { label: 'Technology & Weapons',    href: '/browse?era=technology-weapons' },
      { label: 'Intelligence & Spec Ops', href: '/browse?era=intelligence-special-ops' },
      { label: 'Black Projects',          href: '/browse?era=black-projects' },
    ],
  },
  {
    heading: 'Flagship Series',
    links: [
      { label: "Weapons That Shouldn't Have Worked", href: '/series/weapons-that-shouldnt-have-worked' },
      { label: 'The Day After',                       href: '/series/the-day-after' },
      { label: 'MACV-SOG',                            href: '/series/macvsog' },
    ],
  },
  {
    heading: 'Archive',
    links: [
      { label: 'All Articles',  href: '/browse' },
      { label: 'Sitemap',       href: '/sitemap.xml' },
      { label: 'Mission',       href: '/about' },
      { label: 'Contributor',   href: '/contributor' },
    ],
  },
]

type FooterData = {
  tagline?: string
  contactEmail?: string
  copyrightText?: string
  domainLabel?: string
  socialLinks?: Array<{ label: string; href: string }>
  columns?: Array<{
    heading: string
    links: Array<{ label: string; href: string }>
  }>
}

export default async function Footer() {
  const data: FooterData | null = await liveClient
    .fetch(footerQuery)
    .catch(() => null)

  const email       = data?.contactEmail ?? 'libraryofwar@gmail.com'
  const social      = data?.socialLinks  ?? FALLBACK_SOCIAL
  const columns     = data?.columns      ?? FALLBACK_COLUMNS
  const domainLabel = data?.domainLabel  ?? 'libraryofwar.com'
  const copyright   = (data?.copyrightText ?? '© {year} Library of War. All imagery public domain.')
    .replace('{year}', String(new Date().getFullYear()))

  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="masthead-rule opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">

        {/* ── Brand column ────────────────────────────────────────────── */}
        <div className="md:col-span-1">
          <h2 className="font-headline text-paper text-2xl font-black uppercase tracking-tight leading-none mb-1">
            Library<br/>of War
          </h2>
          <div className="w-8 h-px bg-accent mt-3 mb-4" />
          <p className="font-body text-paper/50 text-sm leading-relaxed">
            Military History Archive.
          </p>
          <a
            href={`mailto:${email}`}
            className="font-body text-paper/30 hover:text-paper/60 transition-colors text-xs mt-5 block"
          >
            {email}
          </a>
          <div className="flex gap-5 mt-4">
            {social.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-paper/40 hover:text-paper transition-colors text-xs tracking-widest uppercase"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── CMS-managed columns ─────────────────────────────────────── */}
        {columns.map((col, i) => (
          <div key={i}>
            <h3 className="font-body text-[0.6rem] tracking-[0.28em] uppercase text-paper/30 mb-5">
              {col.heading || <>&nbsp;</>}
            </h3>
            <ul className="space-y-2">
              {col.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-paper/60 hover:text-paper transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="border-t border-paper/10 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-paper/25 text-xs">{copyright}</p>
        <p className="font-body text-paper/15 text-xs tracking-widest uppercase">{domainLabel}</p>
      </div>
    </footer>
  )
}
