import type { Metadata } from 'next'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions governing use of the Library of War archive.',
}

export const runtime = 'edge'

export default function TermsPage() {
  return (
    <>
      <HeaderWrapper />
      <main className="max-w-3xl mx-auto px-6 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 border-t border-rule" />
          <p className="era-label">Legal</p>
          <div className="flex-1 border-t border-rule" />
        </div>

        <h1 className="font-headline font-black text-ink text-4xl md:text-5xl leading-tight mb-4">
          Terms of Use
        </h1>
        <p className="font-body text-mist text-sm tracking-wide mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="article-prose">
          <p>
            By accessing libraryofwar.com you agree to the following terms. If you do not agree, please
            do not use the site.
          </p>

          <h2>Use of content</h2>
          <p>
            Articles, editorial writing, series introductions, and original analysis published on Library
            of War are the intellectual property of Library of War unless otherwise stated. You may share
            links and quote brief passages with attribution, but reproduction of full articles without
            written permission is prohibited.
          </p>
          <p>
            Primary source documents, public domain images, and declassified materials reproduced on this
            site remain in the public domain. We make no copyright claim over those materials.
          </p>

          <h2>Accuracy and citations</h2>
          <p>
            Library of War makes reasonable efforts to ensure factual accuracy and requires cited sources
            on all published articles. However, historical interpretation is inherently contested. We do
            not warrant that all content is free from error. Corrections can be requested by contacting us.
          </p>

          <h2>Contributor submissions</h2>
          <p>
            By submitting content via the Contributor page, you represent that you own or have the rights
            to the material and grant Library of War a non-exclusive licence to publish it on the site with
            attribution. We reserve the right to edit submissions for length, clarity, and accuracy.
          </p>

          <h2>Prohibited conduct</h2>
          <p>
            You may not use this site to scrape content for AI training, reproduce articles in bulk, or
            misrepresent Library of War content as your own work. Automated access that exceeds normal
            browsing behaviour may be blocked.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            Library of War is provided &ldquo;as is.&rdquo; We are not liable for any damages arising from
            use of the site, reliance on its content, or temporary unavailability of the service.
          </p>

          <h2>External links</h2>
          <p>
            We link to primary sources and third-party references. These links do not constitute endorsement.
            We are not responsible for the content or availability of external sites.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may revise these terms at any time. The &ldquo;Last updated&rdquo; date above reflects the
            most recent revision. Continued use of the site constitutes acceptance of the current terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions can be directed to{' '}
            <a href="mailto:libraryofwar@gmail.com">libraryofwar@gmail.com</a>.
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
