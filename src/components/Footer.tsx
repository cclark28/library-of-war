import Link from 'next/link'

const BROWSE_ERAS = [
  { label: 'Ancient & Medieval',       slug: 'ancient-medieval' },
  { label: 'Napoleonic Wars',           slug: 'napoleonic' },
  { label: 'American Civil War',        slug: 'civil-war' },
  { label: 'World War I',               slug: 'wwi' },
  { label: 'World War II',              slug: 'wwii' },
  { label: 'Korean War',                slug: 'korean-war' },
  { label: 'Vietnam',                   slug: 'vietnam' },
  { label: 'Cold War',                  slug: 'cold-war' },
  { label: 'Modern Conflicts',          slug: 'modern' },
  { label: 'Technology & Weapons',      slug: 'technology' },
  { label: 'Intelligence & Spec Ops',   slug: 'intel-specops' },
]

const SERIES = [
  { label: "Weapons That Shouldn't Have Worked", href: '/series/weapons-that-shouldnt-have-worked' },
  { label: 'The Day After',                       href: '/series/the-day-after' },
  { label: 'Black Projects',                      href: '/series/black-projects' },
]

const SOCIAL = [
  { label: 'X',         href: 'https://x.com/libraryofwar' },
  { label: 'Facebook',  href: 'https://facebook.com/libraryxwar' },
  { label: 'Instagram', href: 'https://instagram.com/libraryofwar' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="masthead-rule opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="font-headline text-paper text-2xl font-black uppercase tracking-tight leading-none mb-1">
            Library<br/>of War
          </h2>
          <div className="w-8 h-px bg-accent mt-3 mb-4" />
          <p className="font-body text-paper/50 text-sm leading-relaxed">
            Military History Archive. Every claim cited. Every fact verifiable. Public domain imagery only.
          </p>
          <a
            href="mailto:libraryofwar@gmail.com"
            className="font-body text-paper/30 hover:text-paper/60 transition-colors text-xs mt-5 block"
          >
            libraryofwar@gmail.com
          </a>
          <div className="flex gap-5 mt-4">
            {SOCIAL.map(s => (
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

        {/* Browse by Era — col 1 */}
        <div>
          <h3 className="font-body text-[0.6rem] tracking-[0.28em] uppercase text-paper/30 mb-5">
            Browse by Era
          </h3>
          <ul className="space-y-2">
            {BROWSE_ERAS.slice(0, 6).map((era) => (
              <li key={era.slug}>
                <Link href={`/browse?era=${era.slug}`}
                      className="font-body text-paper/60 hover:text-paper transition-colors text-sm">
                  {era.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Browse by Era — col 2 */}
        <div>
          <h3 className="font-body text-[0.6rem] tracking-[0.28em] uppercase text-paper/30 mb-5">
            &nbsp;
          </h3>
          <ul className="space-y-2">
            {BROWSE_ERAS.slice(6).map((era) => (
              <li key={era.slug}>
                <Link href={`/browse?era=${era.slug}`}
                      className="font-body text-paper/60 hover:text-paper transition-colors text-sm">
                  {era.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Series */}
        <div>
          <h3 className="font-body text-[0.6rem] tracking-[0.28em] uppercase text-paper/30 mb-5">
            Flagship Series
          </h3>
          <ul className="space-y-3">
            {SERIES.map((s) => (
              <li key={s.href}>
                <Link href={s.href}
                      className="font-headline text-paper/70 hover:text-paper transition-colors text-base leading-snug block">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/10 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-paper/25 text-xs">
          © {new Date().getFullYear()} Library of War. All imagery public domain.
        </p>
        <p className="font-body text-paper/15 text-xs tracking-widest uppercase">
          libraryofwar.com
        </p>
      </div>
    </footer>
  )
}
