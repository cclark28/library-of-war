# Library of War — Global Project Rules

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

### What We Are Still Missing (Open Items)

The following areas have not yet been formally defined and should be addressed before the first production launch:

1. **CMS integration rules** — Sanity schema conventions, field naming standards, and content type patterns.
2. **Performance budget** — define max page weight, Core Web Vitals targets (LCP, CLS, FID/INP), and Lighthouse score floor.
3. **Image handling** — srcset rules, WebP/AVIF policy, lazy loading standards, and max image dimensions.
4. **Font loading strategy** — self-hosted vs. Google Fonts, font-display policy, and fallback stack.
5. **Form handling** — how contact/newsletter forms are submitted (static forms service, e.g., Formspree, Basin), spam protection (honeypot vs. Turnstile), and confirmation UX.
6. **Analytics** — which analytics tool, how it is loaded (deferred, consent-gated), and what events are tracked.
7. **Deployment pipeline** — which CI/CD tool, branch protection rules, preview deployments, and production promotion flow.
8. **Accessibility baseline** — WCAG 2.1 AA as the floor, automated audit tooling (e.g., axe-core), and manual keyboard-nav checklist.
9. **Error pages** — custom 404 and 500 designs that match brand.
10. **Content versioning** — how Sanity drafts, history, and rollbacks are managed.
