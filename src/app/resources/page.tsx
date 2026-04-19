import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ARCHIVES = [
  {
    name: 'National Archives (USA)',
    url: 'https://www.archives.gov',
    description: 'The official repository of U.S. government records. Military records, unit histories, declassified intelligence documents, and official photographs dating to the Revolutionary War.',
  },
  {
    name: 'Library of Congress',
    url: 'https://www.loc.gov',
    description: 'The largest library in the world. Holds millions of photographs, maps, manuscripts, and periodicals covering every major conflict in American history.',
  },
  {
    name: 'Imperial War Museums',
    url: 'https://www.iwm.org.uk',
    description: 'The UK\'s primary repository for war records. First-hand accounts, photography, film, and official documents spanning WWI through modern conflicts.',
  },
  {
    name: 'Bundesarchiv (German Federal Archives)',
    url: 'https://www.bundesarchiv.de',
    description: 'German state archives holding military records from the Imperial period through the Second World War, including Wehrmacht documentation and Luftwaffe records.',
  },
  {
    name: 'National Security Archive',
    url: 'https://nsarchive.gwu.edu',
    description: 'Declassified U.S. government documents obtained through FOIA requests. Essential for Cold War intelligence, nuclear policy, and covert operations research.',
  },
  {
    name: 'Avalon Project (Yale Law School)',
    url: 'https://avalon.law.yale.edu',
    description: 'Primary source documents in law, history, and diplomacy. Includes treaties, war crimes tribunal records, and key diplomatic correspondence from multiple eras.',
  },
]

const PHOTOGRAPHY = [
  {
    name: 'NARA Still Pictures',
    url: 'https://www.archives.gov/research/military/pictures',
    description: 'Millions of public domain military photographs from U.S. National Archives. Covers both World Wars, Korea, Vietnam, and beyond.',
  },
  {
    name: 'Wikimedia Commons — Military',
    url: 'https://commons.wikimedia.org/wiki/Category:Military_history',
    description: 'Aggregated public domain and open-license military photography, maps, and illustrations from archives around the world.',
  },
  {
    name: 'Signal Corps Photo Archive',
    url: 'https://www.archives.gov/research/military/ww2/photos',
    description: 'The U.S. Army Signal Corps documented WWII more comprehensively than any prior conflict. Hundreds of thousands of images, all public domain.',
  },
]

const RESEARCH = [
  {
    name: 'Combined Arms Research Library',
    url: 'https://cgsc.contentdm.oclc.org',
    description: 'The research library of the U.S. Army Command and General Staff College. Extensive collection of military doctrine, unit histories, and strategic studies.',
  },
  {
    name: 'HyperWar Foundation',
    url: 'https://www.ibiblio.org/hyperwar',
    description: 'Digitized WWII-era official histories, unit records, and government publications. One of the most comprehensive online archives of the Second World War.',
  },
  {
    name: 'RAND Corporation — Historical Research',
    url: 'https://www.rand.org/pubs/historical.html',
    description: 'Declassified RAND research reports spanning Cold War strategy, Vietnam-era analysis, and nuclear doctrine. Free access to older publications.',
  },
]

function Section({ title, items }: { title: string; items: typeof ARCHIVES }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-6 mb-8">
        <div className="flex-1 border-t border-rule" />
        <h2 className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-mist">{title}</h2>
        <div className="flex-1 border-t border-rule" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-rule p-6 hover:border-ink transition-colors"
          >
            <p className="font-headline font-bold text-ink text-base group-hover:text-accent transition-colors mb-2 leading-snug">
              {item.name}
            </p>
            <p className="font-body text-mist text-sm leading-relaxed">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-14 md:py-20">

        {/* Header */}
        <div className="border-b-2 border-ink pb-10 mb-14 text-center">
          <h1 className="font-headline font-black text-ink text-4xl md:text-6xl leading-none tracking-tight mb-5">
            Research Resources
          </h1>
          <div className="w-10 h-px bg-accent mx-auto mb-5" />
          <p className="font-body text-mist text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Primary source archives, official photograph collections, and research repositories used in compiling Library of War. All sources are publicly accessible.
          </p>
        </div>

        <Section title="Primary Archives" items={ARCHIVES} />
        <Section title="Photography Collections" items={PHOTOGRAPHY} />
        <Section title="Research Repositories" items={RESEARCH} />

        {/* Note */}
        <div className="border-t border-rule pt-10 mt-4">
          <p className="font-body text-mist/60 text-xs leading-relaxed max-w-2xl">
            Library of War does not endorse any specific viewpoint represented in external archives. All linked repositories are official institutional or government sources. Content availability may change over time as archives update their digital collections.
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
