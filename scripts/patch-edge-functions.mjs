#!/usr/bin/env node
/**
 * Patches @cloudflare/next-on-pages output to replace bare 'async_hooks'
 * ESM imports with 'node:async_hooks'.
 *
 * Root cause: @next/request-context uses require('async_hooks'), which
 * @cloudflare/next-on-pages converts to a static ESM import. Cloudflare
 * Workers with nodejs_compat only support the node: prefix for static imports.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const FUNCS_DIR = '.vercel/output/static/_worker.js/__next-on-pages-dist__/functions'

let patched = 0

function patchDir(dir) {
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return }

  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      patchDir(full)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const original = readFileSync(full, 'utf8')
      // Replace bare async_hooks with node: prefixed version
      const updated = original.replaceAll('from"async_hooks"', 'from"node:async_hooks"')
      if (updated !== original) {
        writeFileSync(full, updated, 'utf8')
        console.log(`Patched: ${full.replace(FUNCS_DIR + '/', '')}`)
        patched++
      }
    }
  }
}

patchDir(FUNCS_DIR)
console.log(`\nDone. ${patched} file(s) patched.`)
