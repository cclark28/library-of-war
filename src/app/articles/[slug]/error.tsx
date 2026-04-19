'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect } from 'react'

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist mb-4">
          Error — Dispatch Unavailable
        </p>
        <h1 className="font-headline font-black text-ink text-4xl mb-6 leading-tight">
          This article failed to load.
        </h1>
        <p className="font-body text-mist text-base leading-relaxed mb-10 max-w-md mx-auto">
          The archive encountered an error retrieving this dispatch. Try again or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="font-body text-[0.72rem] tracking-[0.2em] uppercase bg-ink text-paper px-8 py-3 hover:bg-accent transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="font-body text-[0.72rem] tracking-[0.2em] uppercase border border-ink text-ink px-8 py-3 hover:border-accent hover:text-accent transition-colors"
          >
            Return to Archive
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
