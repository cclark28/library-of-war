/**
 * migrate-images-to-sanity.ts
 *
 * Downloads every Wikimedia image used in idDrillQuestion documents and
 * re-hosts them on Sanity's CDN. Updates each document's image.url in-place.
 *
 * Run:  npx ts-node --esm scripts/migrate-images-to-sanity.ts
 *   or: npx tsx scripts/migrate-images-to-sanity.ts
 */

import { createClient } from '@sanity/client'

const PROJECT_ID  = 'tifzt4zw'
const DATASET     = 'production'
const WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN ||
  'sk7UrlIVTqzhoIlYTLTrxlCiGH48GIZ8bJz8WRtZb02w7Yy3PBI6dEGiitcLTbN6fMCXACArztXgPgUwut3BhrBrJJESQMFMwNMpoTBPgHGRQftJQReptzvAE1QdsAQKIL7fg05V8BANrgo9DxwDkBXtSuQbDAahGKh7H1rfpUc9CYqsvqOM'

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  token:     WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:    false,
})

const DELAY_MS = 1500 // be polite to Wikimedia
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'LibraryOfWarBot/1.0 (https://libraryofwar.com; migrating public domain images to own CDN)',
      'Accept': 'image/jpeg,image/png,image/webp,image/*',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const mimeType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
  const arrayBuffer = await res.arrayBuffer()
  return { buffer: Buffer.from(arrayBuffer), mimeType }
}

async function uploadToSanity(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: mimeType,
  })
  // Return the public CDN URL
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${asset._id.replace('image-', '').replace(/-([a-z]+)$/, '.$1')}`
}

async function run() {
  console.log('Fetching all idDrillQuestion documents…')

  const docs = await client.fetch<Array<{
    _id: string
    name: string
    image: { url: string; alt: string; credit: string; sourceUrl?: string }
  }>>(`*[_type == "idDrillQuestion"] { _id, name, image }`)

  console.log(`Found ${docs.length} documents.\n`)

  let migrated = 0
  let skipped  = 0
  let failed   = 0

  for (const doc of docs) {
    const imgUrl = doc.image?.url
    if (!imgUrl) {
      console.log(`  [SKIP] ${doc.name} — no image.url`)
      skipped++
      continue
    }

    // Already on Sanity CDN
    if (imgUrl.startsWith('https://cdn.sanity.io/')) {
      console.log(`  [SKIP] ${doc.name} — already on Sanity CDN`)
      skipped++
      continue
    }

    console.log(`  [↓] ${doc.name}`)
    console.log(`      src: ${imgUrl.slice(0, 90)}`)

    try {
      await sleep(DELAY_MS)

      // Download
      const { buffer, mimeType } = await fetchImage(imgUrl)

      // Build a clean filename from the URL
      const rawFilename = imgUrl.split('/').pop()?.split('?')[0] ?? `${doc._id}.jpg`
      const filename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_')

      // Upload to Sanity
      const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType: mimeType,
      })

      // The asset URL is deterministic:
      // https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId without "image-" prefix, dashes to dots}
      // But easier to just use asset.url which Sanity provides
      const sanityUrl: string = (asset as unknown as { url: string }).url

      // Patch the document
      await client
        .patch(doc._id)
        .set({ 'image.url': sanityUrl })
        .commit()

      console.log(`      ✓  ${sanityUrl.slice(0, 80)}`)
      migrated++
    } catch (err) {
      console.error(`      ✗  FAILED: ${(err as Error).message}`)
      failed++
    }
  }

  console.log(`\n── Done ──────────────────────────────────────`)
  console.log(`  Migrated : ${migrated}`)
  console.log(`  Skipped  : ${skipped}`)
  console.log(`  Failed   : ${failed}`)
  console.log(`──────────────────────────────────────────────`)
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
