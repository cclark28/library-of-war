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
  // Preconnect hints injected into <head> for Sanity CDN
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Link', value: '<https://cdn.sanity.io>; rel=preconnect; crossorigin' },
        ],
      },
    ]
  },
}

export default nextConfig
