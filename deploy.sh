#!/bin/bash
set -e
cd "/Users/charlieclark/Documents/Claude/Projects/Library of War"

echo "→ Committing changes..."
git add -A
git commit -m "Primary Sources, Read Time, Difficulty, Related by Era carousel, error boundaries"
git push origin main

echo "→ Building for Cloudflare Pages..."
npm run pages:build

echo "→ Setting Sanity API token..."
printf 'sk9WlOh6b4SMr2Ak8BW0TgPFDkPchwxqTT21mYtrzUGGCAt5afYqEXU5gaPl8SMwaQV8AdMAHoVBRHzeDULUMff8SNidkfaC8c6VkZpsWqDWBbozISoXuroN96ayPZDx996RN1FhZD62P7UzrihzcGqtqg3UMCLAeJb3KppAueZIRm74xwvA' | npx wrangler pages secret put SANITY_API_TOKEN --project-name=library-of-war

echo "→ Deploying to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static --project-name=library-of-war --commit-dirty=true

echo ""
echo "✓ Done. Now go to:"
echo "  Cloudflare Dashboard → Pages → library-of-war → Custom domains"
echo "  Add: libraryofwar.com"
echo "  Add: www.libraryofwar.com"
