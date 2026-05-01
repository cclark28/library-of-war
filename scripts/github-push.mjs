/**
 * scripts/github-push.mjs
 *
 * Pushes specific files to GitHub via the REST API — no git CLI required.
 * Used by the nightly pipeline to commit and push from the sandbox.
 *
 * Usage:
 *   node scripts/github-push.mjs --message "commit msg" file1.js file2.json
 *
 * Required env (in .env.local):
 *   GITHUB_PAT   — Personal Access Token with repo scope
 */

import { readFileSync } from 'fs'
import { resolve, relative } from 'path'

// ── Env ──────────────────────────────────────────────────────────────────────

function loadEnv() {
  try {
    const raw = readFileSync(resolve('.env.local'), 'utf-8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.+)$/)
      if (m) process.env[m[1]] ??= m[2].trim()
    }
  } catch { /* no .env.local */ }
}
loadEnv()

const TOKEN = process.env.GITHUB_PAT
if (!TOKEN) {
  console.error('✗ GITHUB_PAT missing from .env.local')
  process.exit(1)
}

// ── Config ────────────────────────────────────────────────────────────────────

const OWNER  = 'cclark28'
const REPO   = 'library-of-war'
const BRANCH = 'main'
const API    = `https://api.github.com/repos/${OWNER}/${REPO}`
const HEADS  = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }

// ── CLI args ──────────────────────────────────────────────────────────────────

const msgIdx    = process.argv.indexOf('--message')
const message   = msgIdx !== -1 ? process.argv[msgIdx + 1] : 'chore: automated push'
const filePaths = process.argv.slice(2).filter(a => !a.startsWith('--') && process.argv[process.argv.indexOf(a) - 1] !== '--message')

if (!filePaths.length) {
  console.error('✗ No files specified')
  process.exit(1)
}

// ── GitHub API helpers ────────────────────────────────────────────────────────

async function ghGet(path) {
  const r = await fetch(`${API}${path}`, { headers: HEADS })
  if (!r.ok) throw new Error(`GET ${path} → ${r.status}: ${await r.text()}`)
  return r.json()
}

async function ghPost(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { ...HEADS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`POST ${path} → ${r.status}: ${await r.text()}`)
  return r.json()
}

async function ghPatch(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { ...HEADS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`PATCH ${path} → ${r.status}: ${await r.text()}`)
  return r.json()
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`\n  ↑ Pushing ${filePaths.length} file(s) to ${OWNER}/${REPO}@${BRANCH}`)

// 1. Get current HEAD
const ref    = await ghGet(`/git/ref/heads/${BRANCH}`)
const headSha = ref.object.sha

// 2. Get base tree SHA from current commit
const commit  = await ghGet(`/git/commits/${headSha}`)
const treeSha = commit.tree.sha

// 3. Create blobs for each file
const treeItems = []
for (const filePath of filePaths) {
  const absPath  = resolve(filePath)
  const repoPath = relative(resolve('.'), absPath).replace(/\\/g, '/')

  let content
  try {
    content = readFileSync(absPath)
  } catch (e) {
    console.warn(`  ↷ Skipping ${repoPath}: ${e.message}`)
    continue
  }

  // Use base64 for all files (handles binary + text safely)
  const blob = await ghPost('/git/blobs', {
    content:  content.toString('base64'),
    encoding: 'base64'
  })

  treeItems.push({ path: repoPath, mode: '100644', type: 'blob', sha: blob.sha })
  console.log(`  ✓ ${repoPath}`)
}

if (!treeItems.length) {
  console.error('✗ No files were readable')
  process.exit(1)
}

// 4. Create new tree
const newTree = await ghPost('/git/trees', { base_tree: treeSha, tree: treeItems })

// 5. Create commit
const newCommit = await ghPost('/git/commits', {
  message,
  tree:    newTree.sha,
  parents: [headSha]
})

// 6. Update branch ref
await ghPatch(`/git/refs/heads/${BRANCH}`, { sha: newCommit.sha })

console.log(`  ✓ Pushed → ${newCommit.sha.slice(0, 7)}: ${message}\n`)
