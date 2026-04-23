'use client'

import Script from 'next/script'

const ADSENSE_PUB_ID = 'ca-pub-4785900830813173'

export default function AdSense() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
