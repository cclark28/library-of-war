import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    // Serve modern formats — WebP/AVIF for faster load
    formats: ['image/avif', 'image/webp'],
    // Limit unnecessary device sizes to reduce CDN variants
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },
  // Security + preconnect headers on every response
  async headers() {
    // Content Security Policy
    // - 'unsafe-inline' for script-src: required by Next.js inline hydration scripts and AdSense
    // - Google ad domains: pagead2, doubleclick, adservice needed for AdSense to render
    // - donorbox.org: DonorBoxWidget iframe
    // - Sanity API + CDN: image delivery and GROQ queries
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://adservice.google.com https://partner.googleadservices.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.sanity.io https://tifzt4zw.api.sanity.io https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com",
      "frame-src https://donorbox.org https://googleads.g.doubleclick.net https://www.google.com https://tpc.googlesyndication.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          // Performance hints
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Link',                   value: '<https://cdn.sanity.io>; rel=preconnect; crossorigin' },
          // Security headers (required by project rules)
          { key: 'Content-Security-Policy',   value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ]
  },
}

export default nextConfig
