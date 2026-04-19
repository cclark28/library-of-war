'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body style={{ margin: 0, background: '#f9f6f0', fontFamily: 'Georgia, serif' }}>
        <main style={{ maxWidth: '640px', margin: '0 auto', padding: '8rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#999', marginBottom: '1rem' }}>
            500 — Server Error
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Something went wrong.
          </h1>
          <p style={{ color: '#666', marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '1rem' }}>
            The archive encountered an unexpected error. Try again or return to the homepage.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{ background: '#1a1a1a', color: '#f9f6f0', border: 'none', padding: '0.75rem 2rem', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{ background: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a', padding: '0.75rem 2rem', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}
            >
              Return to Archive
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
