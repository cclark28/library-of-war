# Library of War

Editorial military history archive. Newspaper-style. Every claim cited. Every fact verifiable.

**Domain:** libraryofwar.com  
**Contact:** hello@libraryofwar.com  
**Social:** facebook.com/libraryxwar · instagram.com/libraryofwar

---

## Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 (App Router) |
| CMS | Sanity (free tier) |
| Hosting | Cloudflare Pages |
| Social | Meta Graph API via Sanity webhook |
| Images | Public domain only — National Archives, Library of Congress, DVIDS, Wikimedia Commons PD |

## House Voices

- **The Analyst** — cold, clinical, source-dense, classified-briefing tone
- **The Correspondent** — short, punchy, human detail, three-source minimum

## Flagship Series

1. Weapons That Shouldn't Have Worked
2. The Day After
3. Ghost Gear

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values. Minimum required to run locally: `NEXT_PUBLIC_SANITY_PROJECT_ID`.

### 3. Create a Sanity project

```bash
npx sanity init --bare
```

Copy the project ID into `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Studio available at: `http://localhost:3000/studio`

### 5. Deploy to Cloudflare Pages

```bash
npm run pages:build
npm run pages:deploy
```

Or connect the GitHub repo to Cloudflare Pages with:
- **Build command:** `npx @cloudflare/next-on-pages`
- **Build output directory:** `.vercel/output/static`
- **Node.js version:** 20

---

## Folder Structure

```
/
├── assets/logos/          Logo assets — all formats and sizes
├── public/                Static files served at root
├── src/
│   ├── app/               Next.js App Router pages
│   │   └── studio/        Sanity Studio (embedded)
│   ├── components/        React components
│   └── lib/               Sanity client, GROQ queries, utilities
└── sanity/
    ├── sanity.config.ts   Studio configuration
    └── schemas/           Document type schemas
```

---

## Content Guidelines

- Minimum 3 verifiable sources per article
- Public domain imagery only — always credit the archive
- AI-written, human-edited
- WCAG AA accessibility — 20px minimum body, semantic HTML
