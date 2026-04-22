import type { MetadataRoute } from 'next'

export const runtime = 'edge'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
          '/contributor/',
        ],
      },
      {
        // Block AI training crawlers
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Google-Extended',
          'PerplexityBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://libraryofwar.com/sitemap.xml',
    host: 'https://libraryofwar.com',
  }
}
