import { client, missionPageQuery } from '@/lib/sanity'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import DonorBoxWidget from '@/components/DonorBoxWidget'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// ─── Portable Text types ────────────────────────────────────────────────────
type PTSpan = { _type: 'span'; _key?: string; text?: string; marks?: string[] }
type MarkDef = { _key: string; _type: string; href?: string; blank?: boolean }
type PTBlock = {
  _type: string; _key?: string; style?: string
  children?: PTSpan[]; markDefs?: MarkDef[]
}

function renderSpan(span: PTSpan, markDefs: MarkDef[] = [], idx: number): React.ReactNode {
  let node: React.ReactNode = span.text ?? ''
  for (const mark of (span.marks ?? []).reverse()) {
    const def = markDefs.find(d => d._key === mark)
    if (def) node = <a key={`l-${idx}`} href={def.href} target={def.blank ? '_blank' : undefined} rel="noopener noreferrer">{node}</a>
    else if (mark === 'strong') node = <strong key={`s-${idx}`}>{node}</strong>
    else if (mark === 'em')     node = <em key={`e-${idx}`}>{node}</em>
  }
  return <span key={span._key ?? idx}>{node}</span>
}

function MissionBody({ blocks }: { blocks: PTBlock[] }) {
  return (
    <div className="article-prose">
      {blocks.map((block, i) => {
        const children = block.children?.map((c, j) => renderSpan(c, block.markDefs, j))
        if (block._type === 'block') {
          switch (block.style) {
            case 'h2':         return <h2 key={i}>{children}</h2>
            case 'h3':         return <h3 key={i}>{children}</h3>
            case 'blockquote': return <blockquote key={i}>{children}</blockquote>
            default:           return <p key={i}>{children}</p>
          }
        }
        return null
      })}
    </div>
  )
}

// ─── Fallback content ───────────────────────────────────────────────────────
const FALLBACK_BODY: PTBlock[] = [
  { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Library of War is a military history library. One place for documentation, first-hand accounts, and the stories that define armed conflict across every era.' }] },
  { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Our goal is simple: bring the primary sources, the photographs, and the narratives together so they are accessible, accurate, and completely free to explore — with no paywalls, now or ever.' }] },
  { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'All material is sourced directly from public archives, declassified documents, official records, and public domain collections. Every claim is thoroughly researched and cross-checked against multiple verifiable primary sources.' }] },
  { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'We have chosen not to include comment sections on articles. This is an archive, not a debate platform. Our focus is on preserving history, not turning it into political discussion.' }] },
]

type MissionData = {
  heroHeadline?: string
  body?: PTBlock[]
  donationHeading?: string
  donationSubtext?: string
}

export default async function AboutPage() {
  const data: MissionData | null = await client
    .fetch(missionPageQuery)
    .catch(() => null)

  const headline       = data?.heroHeadline    ?? 'Our Mission'
  const body           = data?.body?.length    ? data.body : FALLBACK_BODY
  const donationHead   = data?.donationHeading ?? 'Support the Library of War'
  const donationSub    = data?.donationSubtext ?? 'This archive is free and will always remain free. Your support keeps it that way.'

  return (
    <>
      <HeaderWrapper />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rule-heavy mb-10 pt-2" />

        <h1 className="font-headline font-black text-ink text-display-sm mb-8">
          {headline}
        </h1>

        <MissionBody blocks={body} />

        {/* Donation Section */}
        <div className="mt-20 pt-12 border-t border-ink/10">
          <h2 className="font-headline font-black text-ink text-3xl mb-2">
            {donationHead}
          </h2>
          <p className="text-ink/60 text-base mb-10">
            {donationSub}
          </p>
          <DonorBoxWidget />
        </div>
      </main>
      <Footer />
    </>
  )
}
