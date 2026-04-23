import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

// Playfair Display — headlines, bylines, pull quotes
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

// Source Serif 4 — body copy, WCAG AA, 20px minimum
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['300', '400', '600'],
})

const SITE_URL = 'https://libraryofwar.com'
const SITE_NAME = 'Library of War'
const SITE_DESC = 'Military history archive. Every claim cited. Every fact verifiable. Primary sources, official photography, and first-hand accounts covering every major conflict.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'military history', 'war archive', 'World War II', 'World War I', 'Vietnam War',
    'Korean War', 'Cold War', 'military photography', 'declassified documents',
    'battle history', 'warfare', 'military strategy', 'primary sources',
  ],
  authors: [{ name: 'Library of War', url: SITE_URL }],
  creator: 'Library of War',
  publisher: 'Library of War',
  category: 'History',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESC,
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Library of War — Military History Archive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@libraryofwar',
    creator: '@libraryofwar',
    title: SITE_NAME,
    description: SITE_DESC,
    images: [`${SITE_URL}/og-default.jpg`],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: `${SITE_URL}/feed/`, title: SITE_NAME },
      ],
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'google-adsense-account': 'ca-pub-4785900830813173',
  },
}

// JSON-LD structured data for the site
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-horizontal.svg`,
  sameAs: [
    'https://x.com/libraryofwar',
    'https://instagram.com/libraryofwar',
    'https://facebook.com/libraryxwar',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable}`}
    >
      <head>
        {/* AdSense — must be in static <head> so crawlers see it */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4785900830813173"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
      <body>{children}</body>
    </html>
  )
}
