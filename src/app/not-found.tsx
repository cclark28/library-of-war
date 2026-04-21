import Link from 'next/link'
import { liveClient, notFoundPageQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type Fact = { text: string; attribution?: string }
type NotFoundData = {
  headline?: string
  message?: string
  ctaLabel?: string
  ctaHref?: string
  facts?: Fact[]
}

export default async function NotFound() {
  const data: NotFoundData | null = await liveClient
    .fetch(notFoundPageQuery)
    .catch(() => null)

  const headline = data?.headline ?? 'Page not found.'
  const message  = data?.message  ?? 'This dispatch has been redacted, relocated, or never existed. Return to the archive.'
  const ctaLabel = data?.ctaLabel ?? 'Return to Archive'
  const ctaHref  = data?.ctaHref  ?? '/'

  // Pick a random fact server-side — different on every visit
  const facts = data?.facts ?? []
  const fact: Fact | null = facts.length
    ? facts[Math.floor(Math.random() * facts.length)]
    : null

  return (
    <>
      <HeaderWrapper />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist mb-4">
          404 — Not Found
        </p>
        <h1 className="font-headline font-black text-ink text-display-sm mb-6">
          {headline}
        </h1>
        <p className="font-body text-mist text-body mb-10 max-w-md mx-auto">
          {message}
        </p>

        {fact && (
          <div className="border border-rule p-8 mb-10 text-left max-w-xl mx-auto">
            <p className="font-body text-[0.55rem] tracking-[0.28em] uppercase text-mist mb-4">
              From the Archive
            </p>
            <blockquote className="font-body text-ink text-base leading-relaxed italic mb-4">
              &ldquo;{fact.text}&rdquo;
            </blockquote>
            {fact.attribution && (
              <p className="font-body text-mist text-[0.75rem] tracking-wide">
                &mdash; {fact.attribution}
              </p>
            )}
          </div>
        )}

        <Link
          href={ctaHref}
          className="inline-block font-body text-[0.75rem] tracking-[0.2em] uppercase bg-ink text-paper px-8 py-3 hover:bg-accent transition-colors"
        >
          {ctaLabel}
        </Link>
      </main>
      <Footer />
    </>
  )
}
