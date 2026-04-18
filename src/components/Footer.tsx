import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-24">
      <div className="masthead-rule opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h2 className="font-headline text-paper text-2xl font-black uppercase tracking-tight mb-3">
            Library of War
          </h2>
          <p className="font-body text-paper/60 text-base leading-relaxed">
            Editorial military history archive. AI-written, human-edited. Every claim cited. Every fact verifiable. Public domain imagery only.
          </p>
          <p className="font-body text-paper/40 text-sm mt-4">
            hello@libraryofwar.com
          </p>
        </div>

        {/* Series */}
        <div>
          <h3 className="font-body text-[0.7rem] tracking-[0.25em] uppercase text-paper/40 mb-4">Flagship Series</h3>
          <ul className="space-y-2">
            {[
              { label: 'Weapons That Shouldn\'t Have Worked', href: '/series/weapons-that-shouldnt-have-worked' },
              { label: 'The Day After',                       href: '/series/the-day-after' },
              { label: 'Ghost Gear',                          href: '/series/ghost-gear' },
            ].map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="font-headline text-paper/80 hover:text-paper transition-colors text-lg"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Browse + Social */}
        <div>
          <h3 className="font-body text-[0.7rem] tracking-[0.25em] uppercase text-paper/40 mb-4">Browse</h3>
          <ul className="space-y-1 mb-8">
            {['World War II', 'Vietnam', 'Cold War', 'Korea', 'World War I'].map((era) => (
              <li key={era}>
                <Link
                  href={`/browse?era=${era.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-paper/70 hover:text-paper transition-colors text-base"
                >
                  {era}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-body text-[0.7rem] tracking-[0.25em] uppercase text-paper/40 mb-3">Follow</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/libraryxwar"
              target="_blank" rel="noopener noreferrer"
              className="font-body text-paper/70 hover:text-paper transition-colors text-sm tracking-wider uppercase"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/libraryofwar"
              target="_blank" rel="noopener noreferrer"
              className="font-body text-paper/70 hover:text-paper transition-colors text-sm tracking-wider uppercase"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 px-6 py-5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-paper/30 text-sm">
          © {new Date().getFullYear()} Library of War. All imagery public domain.
        </p>
        <p className="font-body text-paper/20 text-xs tracking-wider uppercase">
          libraryofwar.com
        </p>
      </div>
    </footer>
  )
}
