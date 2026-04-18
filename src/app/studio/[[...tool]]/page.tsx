'use client'

/**
 * Sanity Studio embedded at /studio
 * Access at: https://libraryofwar.com/studio (requires auth)
 * Local: http://localhost:3000/studio
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
