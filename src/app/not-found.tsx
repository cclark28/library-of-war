import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-mist mb-4">404 — Not Found</p>
        <h1 className="font-headline font-black text-ink text-display-sm mb-6">
          Page not found.
        </h1>
        <p className="font-body text-mist text-body mb-10 max-w-md mx-auto">
          This dispatch has been redacted, relocated, or never existed. Return to the archive.
        </p>
        <Link
          href="/"
          className="inline-block font-body text-[0.75rem] tracking-[0.2em] uppercase bg-ink text-paper px-8 py-3 hover:bg-accent transition-colors"
        >
          Return to Archive
        </Link>
      </main>
      <Footer />
    </>
  )
}
