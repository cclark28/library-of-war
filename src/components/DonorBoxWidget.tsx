'use client'

import Script from 'next/script'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dbox-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        campaign?: string
        type?: string
        'enable-auto-scroll'?: string
      }
    }
  }
}

export default function DonorBoxWidget() {
  return (
    <>
      <Script
        src="https://donorbox.org/widgets.js"
        strategy="lazyOnload"
        type="module"
      />
      <dbox-widget
        campaign="library-of-war-operations"
        type="donation_form"
        enable-auto-scroll="true"
      />
    </>
  )
}
