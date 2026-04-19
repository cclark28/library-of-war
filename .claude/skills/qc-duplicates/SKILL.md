# QC: Duplicate Article Check

## When to invoke
Run before any batch publish, after any new article is created, or when the user says "QC", "check for duplicates", "pre-publish check", or "run the agent".

## What it checks
1. Exact title match — hard FAIL, blocks publish
2. Slug collision — hard FAIL, blocks publish
3. Fuzzy title similarity >75% word overlap — WARN, review required
4. Shared main image between similar articles — WARN
5. Excerpt similarity >80% — WARN

## How to run
```bash
# Published articles only
node qc-duplicates.mjs

# Including drafts
node qc-duplicates.mjs --all

# Auto-delete shorter duplicate (keeps longer body)
node qc-duplicates.mjs --fix
```

## Rules
- No two published articles may share an identical title
- No two published articles may share an identical slug
- No two published articles should share >75% title word overlap without explicit review
- Images may be shared only if articles cover meaningfully different topics

## On FAIL
Report which articles conflict. Do not allow publish. Offer --fix to auto-resolve.

## On WARN
Inform user. Ask them to review. Do not block publish automatically.

## Sanity Studio enforcement
title and slug fields in sanity/schemas/article.ts have async validators that query the live dataset and surface errors inside the Studio UI before save.
