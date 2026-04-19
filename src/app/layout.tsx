import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
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

export const metadata: Metadata = {
  title: {
    default: 'Library of War',
    template: '%s | Library of War',
  },
  description: 'Editorial military history archive. Every claim cited. Every fact verifiable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://libraryofwar.com'),
  openGraph: {
    siteName: 'Library of War',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'https://libraryofwar.com/feed/', title: 'Library of War' },
      ],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
