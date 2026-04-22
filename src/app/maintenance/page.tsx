import Link from 'next/link'

export const runtime = 'edge'

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 text-center">

      {/* Masthead */}
      <div className="mb-16">
        <Link href="/" className="font-headline font-black text-2xl tracking-wide text-ink">
          Library of War
        </Link>
      </div>

      {/* Status badge */}
      <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-mist mb-6">
        System Status — Temporarily Offline
      </p>

      {/* Headline */}
      <h1 className="font-headline font-black text-ink text-4xl md:text-5xl leading-tight mb-6 max-w-xl">
        Hallowed Ground is taking a brief pause.
      </h1>

      {/* Message */}
      <p className="font-body text-mist text-base leading-relaxed mb-10 max-w-md">
        We&apos;ve hit our monthly data limit for the free tier. The archive will be back online
        automatically once it resets — no action needed on your part.
        The records are safe. Nothing has been lost.
      </p>

      {/* ETA block */}
      <div className="border border-rule px-8 py-6 mb-12 max-w-sm w-full">
        <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-mist mb-3">
          What this means
        </p>
        <ul className="text-left space-y-2">
          {[
            'All 58,000+ records are intact',
            'The site will resume automatically',
            'No data has been lost or altered',
            'Rest of the site is fully available',
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="text-accent mt-px font-mono text-xs">—</span>
              <span className="font-body text-ink text-sm">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/"
          className="font-mono text-[0.7rem] tracking-[0.2em] uppercase border border-ink text-ink px-8 py-3 hover:bg-ink hover:text-paper transition-colors"
        >
          Browse Articles
        </Link>
        <Link
          href="/the-fallen"
          className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-mist hover:text-ink transition-colors"
        >
          Try the map again →
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-20 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-mist/40">
        Library of War · libraryofwar.com · Free public archive
      </p>

    </main>
  )
}
