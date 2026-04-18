import Link from 'next/link'

export default function Header() {
  return (
    <header>
      {/* Top rule */}
      <div className="masthead-rule" aria-hidden="true" />

      {/* Dateline bar */}
      <div className="bg-ink text-paper/70 text-[0.65rem] tracking-[0.2em] uppercase font-body px-6 py-1 flex justify-between items-center">
        <span>libraryofwar.com</span>
        <span suppressHydrationWarning>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span>hello@libraryofwar.com</span>
      </div>

      {/* Masthead */}
      <div className="bg-paper border-b border-rule px-6 py-6 text-center">
        <Link href="/" className="group inline-block">
          <h1 className="font-headline text-[2.75rem] md:text-[4rem] lg:text-[5rem] font-black tracking-[-0.02em] text-ink leading-none uppercase">
            Library of War
          </h1>
          <p className="font-body text-mist text-[0.8rem] tracking-[0.3em] uppercase mt-1">
            Editorial Military History Archive
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="bg-paper border-b-2 border-ink"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-0">
          {[
            { label: 'Home',            href: '/' },
            { label: 'Series',          href: '/series' },
            { label: 'Weapons',         href: '/series/weapons-that-shouldnt-have-worked' },
            { label: 'The Day After',   href: '/series/the-day-after' },
            { label: 'Ghost Gear',      href: '/series/ghost-gear' },
            { label: 'Browse by Era',   href: '/browse' },
            { label: 'About',           href: '/about' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-[0.8rem] tracking-[0.12em] uppercase text-ink hover:text-accent transition-colors px-4 py-3 border-r border-rule last:border-r-0 first:border-l border-l"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
