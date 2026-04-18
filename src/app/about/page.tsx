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
            Library of War is an editorial military history archive. Every article is AI-written and human-edited. Every claim is cited with verifiable open sources. Every image is public domain — sourced from the National Archives, the Library of Congress, DVIDS, and Wikimedia Commons.
          </p>

          <h2>Two House Voices</h2>
          <p>
            Articles are written in one of two house voices, selected by the editorial team based on subject matter and tone.
          </p>
          <p>
            <strong>The Analyst</strong> writes with cold precision. Think classified briefing, not magazine feature. Dense with source references, stripped of sentiment, structured like an intelligence report.
          </p>
          <p>
            <strong>The Correspondent</strong> writes from the ground. Short sentences, human detail, the weight of a dispatch filed under fire. Minimum three verified sources. Maximum emotional honesty.
          </p>

          <h2>Editorial Standards</h2>
          <p>
            Every article requires a minimum of three verifiable open sources. No claim is published without citation. Images are attributed to their archive of origin with direct links to the source record.
          </p>

          <h2>Contact</h2>
          <p>
            <a href="mailto:hello@libraryofwar.com">hello@libraryofwar.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
