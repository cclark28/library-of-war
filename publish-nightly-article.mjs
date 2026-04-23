import { readFileSync } from 'fs'
import { resolve } from 'path'

const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => { try { const e = readFileSync(resolve('.env.local'), 'utf-8'); return e.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim() } catch { return null } })()
if (!TOKEN) { console.error('No SANITY_API_TOKEN'); process.exit(1) }

const PROJECT = 'tifzt4zw', DATASET = 'production'
const BASE = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`
const ASSETS = `https://${PROJECT}.api.sanity.io/v2021-03-25/assets/images/${DATASET}`
const UA = 'LibraryOfWarImageBot/1.0 (hello@libraryofwar.com)', MAX = 1_048_576

let _n = 0
function key() { return `k${(++_n).toString(36)}` }

function block(text) {
  return {
    _type: 'block', _key: key(), style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }]
  }
}

function sourceBlock(label, href) {
  const k = key()
  return {
    _type: 'block', _key: key(), style: 'normal',
    markDefs: [{ _key: k, _type: 'link', href }],
    children: [{ _type: 'span', _key: key(), text: label, marks: [k] }]
  }
}

function headingBlock(text) {
  return {
    _type: 'block', _key: key(), style: 'h2', markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }]
  }
}

async function resolveThumbUrl(f, size = 1200) {
  const r = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(f)}&prop=imageinfo&iiprop=url&format=json`,
    { headers: { 'User-Agent': UA } }
  )
  const d = await r.json(), pages = Object.values(d?.query?.pages || {})
  const url = pages[0]?.imageinfo?.[0]?.url
  if (!url) return null
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)(\/\w\/\w\w\/)(.+)$/)
  if (!m) return null
  return { thumb: `${m[1]}/thumb${m[2]}${m[3]}/${size}px-${m[3]}`, ext: f.split('.').pop().toLowerCase() }
}

function mime(ext) { return ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg' }

async function uploadImage(thumbUrl, mimeType, slug) {
  const head = await fetch(thumbUrl, { method: 'HEAD', headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  const cl = parseInt(head.headers.get('content-length') || '0', 10)
  if (cl > MAX) throw new Error(`Too large: ${(cl / 1024).toFixed(0)}KB`)
  const img = await fetch(thumbUrl, { headers: { 'User-Agent': UA, Referer: 'https://commons.wikimedia.org/' } })
  if (!img.ok) throw new Error(`Download failed: ${img.status}`)
  const buf = await img.arrayBuffer()
  if (buf.byteLength > MAX) throw new Error('Buffer too large after download')
  const r = await fetch(`${ASSETS}?filename=${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { 'Content-Type': mimeType, Authorization: `Bearer ${TOKEN}` },
    body: buf
  })
  const d = await r.json()
  if (!d?.document?._id) throw new Error(`Asset upload failed: ${JSON.stringify(d)}`)
  return d.document._id
}

async function tryUploadWithFallback(imageFile, slug) {
  for (const size of [1200, 800, 600]) {
    const info = await resolveThumbUrl(imageFile, size)
    if (!info) continue
    try {
      const assetRef = await uploadImage(info.thumb, mime(info.ext), slug)
      return assetRef
    } catch (e) {
      if (e.message.includes('large') || e.message.includes('Large')) continue
      throw e
    }
  }
  return null
}

async function publishArticle(article, assetRef, imageData) {
  const blocks = []

  for (const para of (article.paragraphs || [])) {
    if (para.startsWith('## ') || para.startsWith('# ')) {
      blocks.push(headingBlock(para.replace(/^#{1,2}\s+/, '')))
    } else {
      blocks.push(block(para))
    }
  }

  if (article.sources && article.sources.length > 0) {
    blocks.push(block('— Sources —'))
    for (const s of article.sources) {
      blocks.push(sourceBlock(s.label, s.href))
    }
  }

  const doc = {
    _id: article.id,
    _type: 'article',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    excerpt: article.excerpt,
    era: article.era,
    publishedAt: new Date().toISOString(),
    body: blocks,
  }

  if (assetRef && imageData) {
    doc.mainImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetRef },
      alt: imageData.imageAlt,
      caption: imageData.imageCaption,
      sourceUrl: imageData.imageSrc
    }
  }

  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] })
  })
  if (!r.ok) throw new Error(await r.text())
}

// ── Main ────────────────────────────────────────────────────────────────────
const dataPath = resolve('nightly-article-data.json')
let data
try {
  data = JSON.parse(readFileSync(dataPath, 'utf-8'))
} catch (e) {
  console.error(`Cannot read nightly-article-data.json: ${e.message}`)
  process.exit(1)
}

console.log(`\n📰  Library of War — Nightly Publisher\n`)

// Upload shared image once
let assetRef = null
if (data.imageFile) {
  process.stdout.write(`  ↓ Uploading image: ${data.imageFile.slice(0, 70)}\n`)
  try {
    assetRef = await tryUploadWithFallback(data.imageFile, data.longForm?.id || 'nightly')
    if (assetRef) {
      console.log(`  ✓ Image uploaded: ${assetRef}`)
    } else {
      console.log(`  ✗ Image not found or too large — publishing without image`)
    }
  } catch (e) {
    console.log(`  ✗ Image error: ${e.message}`)
  }
  await new Promise(r => setTimeout(r, 600))
}

const articles = [data.longForm, data.shortForm].filter(Boolean)
const results = { ok: [], fail: [] }

for (const article of articles) {
  process.stdout.write(`\n  ▸ [${article.id}] ${article.title}\n`)
  try {
    await publishArticle(article, assetRef, data)
    console.log(`    ✓ Published`)
    results.ok.push(article.id)
  } catch (e) {
    console.log(`    ✗ ${e.message}`)
    results.fail.push(article.id)
  }
  await new Promise(r => setTimeout(r, 800))
}

console.log(`\n── ${results.ok.length} published, ${results.fail.length} failed`)
if (results.fail.length) results.fail.forEach(f => console.log(`  ✗ ${f}`))
console.log()
