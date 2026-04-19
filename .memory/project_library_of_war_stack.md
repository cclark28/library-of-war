---
name: Library of War — Deploy Stack
description: Deployment and hosting setup for the Library of War project
type: project
---

Library of War is deployed via **GitHub + Cloudflare Pages** (not Vercel).

**Why:** Charlie confirmed this explicitly.

**How to apply:** When discussing deploys, pushes, or previews — always reference Cloudflare Pages. After a `git push origin main`, the build is triggered automatically by Cloudflare. Never suggest Vercel preview URLs or Vercel-specific commands.
