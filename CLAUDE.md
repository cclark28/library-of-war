# Library of War — Global Project Rules

> **Design Taste Skill active** — `taste-skill/SKILL.md` is loaded for all frontend/UI work in this project. Default dials: DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4. All rules in that file are enforced on every component, page, and artifact.

---

## Frontend & UI Rules (taste-skill — enforced globally)

All frontend code must follow the taste-skill rules at `taste-skill/SKILL.md`. Key non-negotiables:

- **No Inter font.** Use Geist, Outfit, Cabinet Grotesk, or Satoshi.
- **No pure black (`#000000`).** Use Zinc-950, Off-Black, or Charcoal.
- **No AI purple/neon glows.** Neutral bases (Zinc/Slate) + single desaturated accent only.
- **No centered hero H1s** (DESIGN_VARIANCE 8 — force asymmetric or split-screen layouts).
- **No 3-equal-column card rows.** Use Zig-Zag, asymmetric grid, or horizontal scroll.
- **No emojis anywhere** — icons via `@phosphor-icons/react` or `@radix-ui/react-icons`.
- **No `h-screen`** — always `min-h-[100dvh]` for full-height sections.
- **No Unsplash links** — use `https://picsum.photos/seed/{string}/800/600`.
- **No generic placeholder data** — organic names, messy numbers, specific brand names.
- **Framer Motion for UI interactions.** Spring physics: `stiffness: 100, damping: 20`.
- **Animate only `transform` and `opacity`** — never top/left/width/height.
- **All interactive states required:** loading (skeleton), empty, error, tactile feedback.
- **Check `package.json` before any import** — output `npm install` command if missing.
- **`'use client'` isolation** — any animated or interactive component is a leaf Client Component.

Read `taste-skill/SKILL.md` for the full Creative Arsenal, Bento Motion Paradigm, and Pre-Flight checklist before building any UI.

---

## ⚠️ GLOBAL LAWS — Non-Negotiable, Never Bypass

These laws apply to every page, every component, every data query, every future change. No exceptions.

**LAW 1 — No image, no feature block.**
An article without a `mainImage` (with a valid asset reference) must never appear in any feature block: hero, hero stack, Latest Dispatches grid, From the Archive grid, Era Grid sections, or any curated display. Imageless articles may only appear in the full `/browse` archive listing.

**LAW 2 — No article appears twice on the same page.**
A single article (identified by `_id` AND by `slug`) can appear in at most one section per page render. The homepage uses a `globalSeen` Set and a `seenSlugs` Set to enforce this. Never remove or bypass either check.

**LAW 3 — Every source must have a linkable URL.**
Every entry in an article's `sources` array must include a valid `https://` URL. This is enforced at the Sanity Studio schema level (required field with URI validation) and verified by the content-guard webhook (dead-link HEAD checks). An article without linkable sources on every source entry must not be published.

**LAW 4 — No duplicate documents in Sanity.**
The GROQ queries exclude drafts with `!(_id in path("drafts.**"))`. Slug-based deduplication runs at render time. When publishing new articles, always verify no article with the same slug already exists. Run the content-guard daily job to surface any violations.

**LAW 5 — No duplicate articles by subject or slug.**
Before publishing any article, verify that no article covering the same operation, battle, event, or subject already exists in Sanity — not just by slug match, but by topic. Two articles about the same subject are not permitted regardless of title variation. If a duplicate is found, the one without a series assignment and without a mainImage is removed first. The content-guard daily job must check for near-duplicate titles.

**LAW 6 — No duplicate category documents.**
Each category must exist as exactly one Sanity document with a stable `cat-*` prefixed `_id` and a valid slug. Before creating a new category, verify it does not already exist. Duplicate category documents break browse filtering and GROQ category queries. Canonical category IDs follow the pattern `cat-[short-name]` (e.g. `cat-wwii`, `cat-cold-war`). Any new category document that does not follow this pattern must be rejected.

---

## Project Instructions: All Websites

Every website built in this project must follow these rules without exception. Senior Developer and Senior QC are responsible for enforcement.

---

### Stack & Structure

- Tailwind CSS only — no other CSS frameworks.
- Strictly mobile-first with these breakpoints: 360px, 480px, 640px, 768px, 1024px, 1280px, 1536px, 1920px.
- Clean hamburger menu below 768px.
- Stack all sections vertically on mobile — no side-by-side elements below 768px.
- Use clearly labeled HTML section comments: `<!-- Section 1: Header -->`, `<!-- Section 2: Hero -->`, etc.
- Add subtle Framer-style micro-interactions using only Tailwind transitions.
- Support system dark mode.
- Follow an 8-point spacing system.
- Stay lightweight and performant.
- Completely unique colors, typography, and style per website — no design cross-pollination.

---

### Typography & Spacing

- Default body text: 18px.
- Type scale: 14, 16, 18, 20, 22, 24, 28, 34px only.
- Line height: 1.6 for body and helper text, 1.3 for headings.
- Spacing system: 4px units — values 4, 8, 12, 16, 24, 32, 40, 56px only. Applied to all padding, margins, and gaps.
- Buttons and inputs: minimum 18px text, 12px vertical padding, 24px horizontal padding, minimum 44px height.
- Cards: 24px outer padding, 12px internal gaps.
- Sections: 40–56px vertical spacing.
- All layout snaps to the 4px grid. Prioritize legibility and large, comfortable touch targets.

---

### Security & Protection Rules

**Senior Developer and Senior QC must enforce all of the following on every build.**

#### Cloudflare (Free Tier)

- Cloudflare free tier automatically provides unmetered DDoS protection and global CDN caching — no surprise bills for bandwidth or attack traffic. Never bypass this.
- In the Cloudflare dashboard, always enable:
  - **Bot Fight Mode** (or Super Bot Fight Mode if available).
  - **Block AI Scrapers and Crawlers** one-click toggle — prevents ChatGPT, Claude, Perplexity, and other AI tools from training on the site's content.
  - **Security Headers** enforcement.
- Set up one free Rate Limiting rule: block any single IP making more than 30 requests in 10 seconds.

#### Security Headers (must be output by all code)

Every page must emit the following HTTP security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self'; frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Architecture Rules

- Pure static export only — no API routes, no server actions, no dynamic endpoints that could be abused.
- Never serve large files or video directly — use a dedicated CDN or streaming service. Large file delivery triggers Cloudflare's disproportionate bandwidth warning on free tier.

#### Crawler Control

- Always generate a `robots.txt` that disallows AI training crawlers:
  ```
  User-agent: GPTBot
  Disallow: /
  User-agent: ChatGPT-User
  Disallow: /
  User-agent: CCBot
  Disallow: /
  User-agent: anthropic-ai
  Disallow: /
  User-agent: Claude-Web
  Disallow: /
  User-agent: PerplexityBot
  Disallow: /
  User-agent: *
  Allow: /
  ```
- Always generate a `security.txt` at `/.well-known/security.txt`.
- Both files must be generated from Sanity (CMS-controlled) where Sanity is in the stack.

---

### Image Handling

All image delivery rules below are enforced by Senior Developer and Senior QC on every build. These rules extend Law 1 — a valid asset reference is necessary but not sufficient. Images must also meet the quality, format, and dimension standards below.

---

#### Format Policy

- **Default format: WebP.** All images are served as WebP via Sanity's image URL pipeline (`?fm=webp`). WebP is the required baseline — no raw JPEG or PNG may be served to the browser.
- **AVIF is opt-in per image type only.** AVIF is not the default. It may be used for hero images where maximum compression matters and decode performance has been verified. Use `<picture>` with an AVIF `<source>` and a WebP fallback. Never serve AVIF without a WebP fallback.
- **No GIFs.** Animated content must use `<video autoplay loop muted playsinline>` served from a CDN, not inline on the page.

---

#### Sizing & srcset Rules

Every image component must request sizes matched to the layout breakpoints. Use Sanity's `width` URL param to generate each size. Required srcset ladder:

| Breakpoint | Image width requested |
|---|---|
| 360px | 400w |
| 480px | 520w |
| 640px | 680w |
| 768px | 820w |
| 1024px | 800w (two-col) / 1080w (full-bleed) |
| 1280px | 960w (two-col) / 1320w (full-bleed) |
| 1536px | 1100w (two-col) / 1600w (full-bleed) |
| 1920px | 1280w (two-col) / 1920w (full-bleed) |

- Always include a `sizes` attribute matching the layout. Do not use `sizes="100vw"` for card or grid images — that causes the browser to fetch oversized images.
- Hero and full-bleed images use the full-bleed column above. Card, grid, and thumbnail images use the two-col column.

---

#### Max Upload Dimensions

Editors must not upload images larger than these dimensions. The Sanity Studio upload validation rule must enforce a max file size of **4MB**. Images exceeding these limits must be rejected at upload, not resized silently.

| Use case | Max upload dimensions |
|---|---|
| Hero / full-bleed | 3000 × 2000px |
| Article card / grid | 1600 × 1200px |
| Thumbnail / avatar | 800 × 800px |

- Minimum `mainImage` dimensions: **1200 × 630px**. Any `mainImage` below this threshold fails Law 1 and must not be published into a feature block. The content-guard job must check this.
- Aspect ratio for `mainImage`: **16:9 preferred, 3:2 accepted.** Portrait or square crops are not permitted for `mainImage`.

---

#### Quality Settings

- Default Sanity quality param: `?q=80` for all images.
- Hero images: `?q=85`.
- Thumbnails: `?q=75`.
- Never use `?q=100` — it defeats compression without visible improvement at screen resolution.

---

#### Lazy Loading

- **Hero image (above fold): `loading="eager"`, `fetchpriority="high"`.** This is the LCP element. Never lazy-load it.
- **All other images: `loading="lazy"`.** This includes all card grids, archive listings, article body images, and era sections.
- Never add `fetchpriority="high"` to more than one image per page.

---

#### Blur Placeholder

- All images must use a low-resolution blur placeholder while loading. Generate via Sanity's `?w=20&blur=10` params, encode as base64, and pass as the `blurDataURL` prop to `next/image`. This prevents layout shift and improves perceived performance.

---

#### Alt Text

- `mainImage` must include a non-empty `alt` field in Sanity schema. This is a required field — the Studio must reject publication without it.
- Alt text must describe the image content specifically. Generic values like "image", "photo", or the article title verbatim are not acceptable.
- Decorative images (if any) must use `alt=""` explicitly — not omitted.

---

#### Law 1 Extension

Law 1 is now extended: a `mainImage` is only valid for feature block use if ALL of the following are true:
1. A Sanity asset reference exists (`mainImage.asset._ref` is non-null).
2. The image is at least 1200 × 630px.
3. The `alt` field is non-empty.
4. The asset is not a GIF.

The content-guard daily job must verify all four conditions and flag any violations.

---

### What We Are Still Missing (Open Items)

The following areas have not yet been formally defined and should be addressed before the first production launch:

1. **CMS integration rules** — Sanity schema conventions, field naming standards, and content type patterns.
2. **Performance budget** — define max page weight, Core Web Vitals targets (LCP, CLS, FID/INP), and Lighthouse score floor.
3. ~~**Image handling**~~ — ✅ Defined above.
4. **Font loading strategy** — self-hosted vs. Google Fonts, font-display policy, and fallback stack.
5. **Form handling** — how contact/newsletter forms are submitted (static forms service, e.g., Formspree, Basin), spam protection (honeypot vs. Turnstile), and confirmation UX.
6. **Analytics** — which analytics tool, how it is loaded (deferred, consent-gated), and what events are tracked.
7. **Deployment pipeline** — which CI/CD tool, branch protection rules, preview deployments, and production promotion flow.
8. **Accessibility baseline** — WCAG 2.1 AA as the floor, automated audit tooling (e.g., axe-core), and manual keyboard-nav checklist.
9. **Error pages** — custom 404 and 500 designs that match brand.
10. **Content versioning** — how Sanity drafts, history, and rollbacks are managed.
