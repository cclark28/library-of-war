/**
 * import-articles.mjs
 * Parses all 24 s*.html article files and imports them into Sanity CMS.
 * Run: node import-articles.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { parse } from 'node-html-parser';
import crypto from 'crypto';

const TOKEN = process.env.SANITY_API_TOKEN ||
  'sk9WlOh6b4SMr2Ak8BW0TgPFDkPchwxqTT21mYtrzUGGCAt5afYqEXU5gaPl8SMwaQV8AdMAHoVBRHzeDULUMff8SNidkfaC8c6VkZpsWqDWBbozISoXuroN96ayPZDx996RN1FhZD62P7UzrihzcGqtqg3UMCLAeJb3KppAueZIRm74xwvA';
const PROJECT_ID = 'tifzt4zw';
const DATASET = 'production';
const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data`;

const SERIES_MAP = {
  's1': 'series-weapons-that-shouldnt-have-worked',
  's2': 'series-the-day-after',
  's3': 'series-ghost-gear',
};

function key() {
  return 'k' + crypto.randomBytes(6).toString('hex');
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Walk a paragraph's child nodes → array of Portable Text spans
function parseInlineNodes(node) {
  const spans = [];
  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      // Text node
      const t = child.text;
      if (t) spans.push({ _type: 'span', _key: key(), text: t, marks: [] });
    } else if (child.rawTagName === 'em') {
      const t = child.innerText;
      if (t) spans.push({ _type: 'span', _key: key(), text: t, marks: ['em'] });
    } else if (child.rawTagName === 'strong') {
      const t = child.innerText;
      if (t) spans.push({ _type: 'span', _key: key(), text: t, marks: ['strong'] });
    } else if (child.rawTagName === 'sup') {
      // Skip citation superscripts entirely
    } else if (child.rawTagName === 'a') {
      const t = child.innerText;
      if (t) spans.push({ _type: 'span', _key: key(), text: t, marks: [] });
    } else {
      // Recurse for any other inline wrapper
      spans.push(...parseInlineNodes(child));
    }
  }
  return spans;
}

function htmlToBlocks(html) {
  const root = parse(html);
  const bodyDiv = root.querySelector('.low-article-body');
  if (!bodyDiv) return [];

  const blocks = [];
  for (const child of bodyDiv.childNodes) {
    if (child.nodeType !== 1) continue;
    const tag = child.rawTagName?.toLowerCase();

    if (tag === 'p') {
      const children = parseInlineNodes(child);
      // Merge consecutive spans with same marks and clean up whitespace
      const merged = [];
      for (const span of children) {
        const prev = merged[merged.length - 1];
        if (prev && JSON.stringify(prev.marks) === JSON.stringify(span.marks)) {
          prev.text += span.text;
        } else {
          merged.push({ ...span });
        }
      }
      const cleaned = merged
        .map(s => ({ ...s, text: s.text.replace(/\s+/g, ' ') }))
        .filter(s => s.text.trim());

      if (cleaned.length === 0) continue;
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: cleaned,
      });
    } else if (tag === 'aside') {
      // Patent box → preserve as a blockquote block
      const text = child.innerText.replace(/\s+/g, ' ').trim();
      if (text) {
        blocks.push({
          _type: 'block',
          _key: key(),
          style: 'blockquote',
          markDefs: [],
          children: [{ _type: 'span', _key: key(), text, marks: [] }],
        });
      }
    }
  }
  return blocks;
}

function parseSources(root) {
  const items = root.querySelectorAll('.low-article-sources li');
  return items.map(li => {
    const raw = li.innerText.replace(/\s+/g, ' ').trim();
    const urlMatch = raw.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0].replace(/[.,)\]]+$/, '') : undefined;
    const textWithoutUrl = raw.replace(/https?:\/\/[^\s]+/, '').trim().replace(/[.\s]+$/, '');

    // Try to parse publisher from the citation text
    // Common pattern: "Author/Institution. 'Title.' Publisher. Date. URL"
    let title = textWithoutUrl;
    let publisher = '';
    let date = '';

    const quotedTitle = textWithoutUrl.match(/["""]([^"""]+)["""]/);
    if (quotedTitle) {
      title = quotedTitle[1];
      const afterTitle = textWithoutUrl.slice(textWithoutUrl.indexOf(quotedTitle[0]) + quotedTitle[0].length).replace(/^[\s.,]+/, '');
      const parts = afterTitle.split(/\.\s+/).filter(Boolean);
      if (parts.length >= 1) publisher = parts[0].replace(/[.,]$/, '');
      if (parts.length >= 2) date = parts[1].replace(/[.,]$/, '');
    } else {
      // No quoted title — use whole text as title
      const parts = textWithoutUrl.split(/\.\s+/).filter(Boolean);
      if (parts.length >= 1) title = parts[0];
      if (parts.length >= 2) publisher = parts[1];
    }

    const src = {
      _type: 'source',
      _key: key(),
      title: title.substring(0, 300),
    };
    if (publisher) src.publisher = publisher.substring(0, 200);
    if (url) src.url = url;
    if (date) src.date = date.substring(0, 50);
    return src;
  });
}

// Attempt to upload image to Sanity from external URL; returns asset _id or null
async function uploadImage(imageUrl, filename) {
  try {
    console.log(`  📷 Fetching image: ${imageUrl.substring(0, 60)}...`);
    const imgRes = await fetch(imageUrl, {
      headers: { 'User-Agent': 'LibraryOfWar/1.0 (content import)' },
    });
    if (!imgRes.ok) {
      console.log(`  ⚠️  Image fetch failed: ${imgRes.status}`);
      return null;
    }
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await imgRes.arrayBuffer();
    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const uploadUrl = `https://api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}.${ext}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': contentType,
      },
      body: buffer,
    });
    const uploadData = await uploadRes.json();
    if (uploadData.document?._id) {
      console.log(`  ✅ Image uploaded: ${uploadData.document._id}`);
      return uploadData.document._id;
    }
    console.log(`  ⚠️  Image upload response:`, JSON.stringify(uploadData).substring(0, 200));
    return null;
  } catch (err) {
    console.log(`  ⚠️  Image upload error: ${err.message}`);
    return null;
  }
}

async function parseFile(filePath) {
  const html = readFileSync(filePath, 'utf8');
  const root = parse(html);

  // --- Meta ---
  const titleEl = root.querySelector('.low-article-title');
  const deckEl = root.querySelector('.low-article-deck');
  const seriesLabelEl = root.querySelector('.low-series-label');
  const titleTag = root.querySelector('title');

  const title = titleEl?.innerText?.trim() || titleTag?.innerText?.split('|')[0]?.trim() || '';
  const excerpt = deckEl?.innerText?.trim() || '';

  // --- Image ---
  const imgEl = root.querySelector('.low-article-hero img');
  const figcaptionEl = root.querySelector('.low-article-hero figcaption');
  const imageUrl = imgEl?.getAttribute('src') || '';
  const imageAlt = imgEl?.getAttribute('alt') || '';
  const imageCaption = figcaptionEl?.innerText?.replace(/\s+/g, ' ')?.trim() || '';
  // Extract source URL from figcaption link
  const figLink = figcaptionEl?.querySelector('a');
  const imageSourceUrl = figLink?.getAttribute('href') || '';

  // --- Body → Portable Text ---
  const body = htmlToBlocks(html);

  // --- Sources ---
  const sources = parseSources(root);

  // --- Series ---
  const filename = filePath.split('/').pop().replace('.html', '');
  const seriesKey = filename.split('-')[0]; // s1, s2, s3
  const seriesRef = SERIES_MAP[seriesKey];

  // --- Slug ---
  const slug = slugify(title);

  // --- Tags from series + title words ---
  const seriesTagMap = {
    's1': ['weapons', 'technology', 'engineering', 'World War II'],
    's2': ['aftermath', 'history', 'military history'],
    's3': ['espionage', 'intelligence', 'Cold War', 'spy technology'],
  };
  const tags = seriesTagMap[seriesKey] || [];

  // --- Primary sources (patents, declassified docs) ---
  const primarySources = [];
  const asideEl = root.querySelector('.low-patent-box');
  if (asideEl) {
    const patText = asideEl.innerText.replace(/\s+/g, ' ').trim();
    const patNumMatch = patText.match(/(?:UK patent|patent|Patent)\s*(?:no\.?\s*)?([A-Z0-9,\s]+)/i);
    const patUrlMatch = patText.match(/https?:\/\/[^\s]+/);
    primarySources.push({
      _type: 'primarySource',
      _key: key(),
      type: 'patent',
      title: patText.substring(0, 200),
      identifier: patNumMatch ? patNumMatch[1].trim() : undefined,
      url: patUrlMatch ? patUrlMatch[0].replace(/[.,)]+$/, '') : undefined,
      archive: 'UK Intellectual Property Office / Google Patents',
    });
  }

  return {
    filename,
    title,
    slug,
    excerpt,
    imageUrl,
    imageAlt,
    imageCaption,
    imageSourceUrl,
    body,
    sources,
    primarySources,
    seriesRef,
    tags,
  };
}

async function importAll() {
  const dir = '/sessions/trusting-zen-newton/mnt/Library of War';
  const files = readdirSync(dir)
    .filter(f => f.match(/^s[123]-a\d+-/))
    .sort()
    .map(f => `${dir}/${f}`);

  console.log(`\n📚 Found ${files.length} article files to import\n`);

  // Check for already-imported articles
  const existingRes = await fetch(
    `${API}/query/${DATASET}?query=${encodeURIComponent('*[_type=="article"]{slug}[].slug.current')}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  const existingData = await existingRes.json();
  const existingSlugs = new Set(existingData.result || []);
  console.log(`📋 ${existingSlugs.size} articles already in Sanity\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const article = await parseFile(filePath);
    const { filename, title, slug, excerpt, imageUrl, imageAlt, imageCaption, imageSourceUrl,
            body, sources, primarySources, seriesRef, tags } = article;

    console.log(`\n→ [${filename}] "${title}"`);

    if (existingSlugs.has(slug)) {
      console.log(`  ⏭️  Already exists (slug: ${slug}), skipping.`);
      skipped++;
      continue;
    }

    // Upload image
    let mainImage = undefined;
    if (imageUrl) {
      const assetId = await uploadImage(imageUrl, slug);
      if (assetId) {
        mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: imageAlt,
          caption: imageCaption.substring(0, 500),
          sourceUrl: imageSourceUrl || undefined,
        };
      }
    }

    // Build Sanity document
    const doc = {
      _type: 'article',
      _id: `article-series-${filename}`,
      title,
      slug: { _type: 'slug', current: slug },
      status: 'published',
      voice: 'analyst',
      difficulty: 'intermediate',
      publishedAt: new Date().toISOString(),
      excerpt: excerpt.substring(0, 299),
      body,
      sources: sources.length >= 3 ? sources : [...sources, ...(sources.length < 3 ? [{ _type: 'source', _key: key(), title: 'See inline citations' }] : [])],
      tags,
    };

    if (mainImage) doc.mainImage = mainImage;
    if (seriesRef) doc.series = { _type: 'reference', _ref: seriesRef };
    if (primarySources.length > 0) doc.primarySources = primarySources;

    // Create via Sanity mutations API
    const mutRes = await fetch(`${API}/mutate/${DATASET}?returnIds=true`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: doc }],
      }),
    });

    const mutData = await mutRes.json();
    if (mutData.results?.[0]?.id || mutData.transactionId) {
      console.log(`  ✅ Imported → ${slug}`);
      imported++;
    } else {
      console.log(`  ❌ Failed:`, JSON.stringify(mutData).substring(0, 300));
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`${'─'.repeat(50)}\n`);
}

importAll().catch(console.error);
