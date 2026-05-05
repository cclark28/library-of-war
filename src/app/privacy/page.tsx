import type { Metadata } from 'next'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Library of War collects, uses, and protects your information.',
}

export const runtime = 'edge'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="font-body text-mist text-sm tracking-wide mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="article-prose">
          <p>
            Library of War (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates libraryofwar.com. This page
            describes how we handle information when you visit the site.
          </p>

          <h2>Information we collect</h2>
          <p>
            We do not require account registration or collect personal information to access the archive.
            When you visit the site, standard server logs may record your IP address, browser type, referring
            URL, and pages visited. This data is used solely for security and aggregate analytics.
          </p>
          <p>
            If you submit a contributor inquiry via the Contributor page, we collect the name, email address,
            and content you provide. This information is used only to evaluate and respond to your submission.
          </p>

          <h2>Analytics</h2>
          <p>
            We use Google Analytics to understand how visitors use the site in aggregate. Google Analytics
            collects anonymised usage data. You can opt out using the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>.
          </p>

          <h2>Advertising</h2>
          <p>
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on
            your prior visits to this site or other sites. You can opt out of personalised advertising at{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              google.com/settings/ads
            </a>.
          </p>

          <h2>Cookies</h2>
          <p>
            We do not set first-party cookies beyond those set automatically by Google Analytics and Google
            AdSense. You can control cookie behaviour through your browser settings.
          </p>

          <h2>Third-party links</h2>
          <p>
            Articles link to primary sources on third-party websites. We are not responsible for the privacy
            practices of those sites and encourage you to review their policies directly.
          </p>

          <h2>Data retention</h2>
          <p>
            Contributor submissions are retained only as long as necessary to process your inquiry. Server
            logs are retained for a maximum of 90 days.
          </p>

          <h2>Your rights</h2>
          <p>
            If you have submitted a contributor inquiry and wish to have your information removed, contact us
            at{' '}
            <a href="mailto:libraryofwar@gmail.com">libraryofwar@gmail.com</a> and we will delete it within
            30 days.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy occasionally. Material changes will be reflected in the &ldquo;Last
            updated&rdquo; date above. Continued use of the site constitutes acceptance of the revised policy.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy can be directed to{' '}
            <a href="mailto:libraryofwar@gmail.com">libraryofwar@gmail.com</a>.
          </p>
        </div>

      </main>
      <Footer />
    </>
  )
}
