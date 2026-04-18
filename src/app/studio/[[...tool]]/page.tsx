export const runtime = 'edge'

import { redirect } from 'next/navigation'

/**
 * Studio is hosted at sanity.io — redirect there.
 * Local dev: run `npx sanity dev` in the /sanity directory.
 */
export default function StudioPage() {
  redirect('https://tifzt4zw.sanity.studio/')
}
