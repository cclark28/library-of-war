import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  // Required for Cloudflare Pages via @cloudflare/next-on-pages
  // Uncomment when deploying to Cloudflare:
  // experimental: {
  //   runtime: 'edge',
  // },
}

export default nextConfig
