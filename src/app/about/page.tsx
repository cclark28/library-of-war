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
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'Library of War is a free military history archive. Every era, every conflict, every operation — documented, sourced, and accessible to anyone. No subscription. No paywall. No exceptions.' }]
  },
  {
    _type: 'block', style: 'h2',
    children: [{ _type: 'span', text: 'How We Work' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'Every article on this site is researched using primary sources, declassified government documents, official military records, and public domain archives. All citations are linked and verifiable. If a claim cannot be sourced, it does not appear here.' }]
  },
  {
    _type: 'block', style: 'h2',
    children: [{ _type: 'span', text: 'AI Assistance' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'We use AI tools to assist with research, drafting, and image generation. We are transparent about this because we think you deserve to know. All AI-assisted content is reviewed, fact-checked against primary sources, and corrected before publication. The AI does not determine what is true — the sources do.' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'Images without documented historical photographs are generated using AI, styled to match the era and tone of the story. We do not present AI images as historical photographs.' }]
  },
  {
    _type: 'block', style: 'h2',
    children: [{ _type: 'span', text: 'No Comments' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'There are no comment sections on this site. This is an archive, not a debate platform. History is not a poll. The articles speak for themselves and the sources are linked — readers who want to go deeper have everything they need to do so.' }]
  },
  {
    _type: 'block', style: 'h2',
    children: [{ _type: 'span', text: 'How We Are Funded' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'This site runs on advertising and voluntary donations. Ads help cover hosting, infrastructure, and the time it takes to research and maintain this archive. If you find value here and want to support the work directly, donations are welcomed and appreciated — but never required.' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'Advertisers do not influence editorial decisions. What gets published is determined by historical significance, source quality, and what we think is worth telling — not by what generates clicks or what sponsors prefer.' }]
  },
  {
    _type: 'block', style: 'h2',
    children: [{ _type: 'span', text: 'Contribute' }]
  },
  {
    _type: 'block', style: 'normal',
    children: [{ _type: 'span', text: 'If you are a historian, researcher, veteran, or specialist with knowledge you think belongs here, we want to hear from you. This archive grows through collaboration. Reach out at libraryofwar@gmail.com.' }]
  },
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
  const donationHead   = data?.donationHeading ?? 'Support the Archive'
  const donationSub    = data?.donationSubtext ?? 'Free now, free always. Your support keeps it that way.'

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
