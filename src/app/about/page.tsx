import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rule-heavy mb-10 pt-2" />

        <h1 className="font-headline font-black text-ink text-display-sm mb-8">
          About
        </h1>

        <div className="article-prose">
          <p>
            Library of War is a military history library. One place for documentation, first-hand accounts, and the stories that define armed conflict across every era. The goal is simple: bring the primary sources, the photographs, and the narratives together so they&apos;re accessible, accurate, and free to explore.
          </p>
          <p>
            Every claim is cited with verifiable open sources. Every image is public domain, sourced from the National Archives, the Library of Congress, DVIDS, and Wikimedia Commons.
          </p>

          <h2>Editorial Standards</h2>
          <p>
            Every article requires a minimum of three verifiable open sources. No claim is published without citation. Images are attributed to their archive of origin with direct links to the source record.
          </p>

          <h2>Comments &amp; Discussion</h2>
          <p>
            Comments are disabled on all articles and leader profiles to keep the library focused and respectful. For questions, corrections, or to discuss any topic, reach out at{' '}
            <a href="mailto:libraryofwar@gmail.com">libraryofwar@gmail.com</a>{' '}
            or send a message on Facebook.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
