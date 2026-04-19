import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rule-heavy mb-10 pt-2" />

        <h1 className="font-headline font-black text-ink text-display-sm mb-8">
          Our Mission
        </h1>

        <div className="article-prose">
          <p>
            Library of War is a military history library. One place for documentation, first-hand accounts, and the stories that define armed conflict across every era.
          </p>
          <p>
            Our goal is simple: bring the primary sources, the photographs, and the narratives together so they are accessible, accurate, and completely free to explore &mdash; with no paywalls, now or ever.
          </p>
          <p>
            All material is sourced directly from public archives, declassified documents, official records, and public domain collections. Every claim is thoroughly researched and cross-checked against multiple verifiable primary sources. Every image comes from public domain archives such as the National Archives, Library of Congress, and similar repositories.
          </p>
          <p>
            We have chosen not to include comment sections on articles. This is an archive, not a debate platform. Our focus is on preserving history, not turning it into political discussion.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
