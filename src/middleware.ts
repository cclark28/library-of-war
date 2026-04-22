/**
 * Library of War — Edge Middleware
 * ─────────────────────────────────
 * Runs on every request at the Cloudflare edge.
 *
 * Responsibilities:
 *  1. Health-check Supabase on map routes (/the-fallen).
 *     If Supabase is paused or unreachable → redirect to /maintenance.
 *  2. Pass all other routes through unchanged.
 *
 * Health check is cached for 60 seconds per edge node so it
 * never adds meaningful latency to normal page loads.
 */

import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/the-fallen'],
}

// Simple in-process cache per edge node instance — resets on cold start
let lastCheck   = 0
let lastHealthy = true
const CACHE_MS  = 60_000 // re-check at most once per minute

async function isSupabaseHealthy(supabaseUrl: string, anonKey: string): Promise<boolean> {
  const now = Date.now()
  if (now - lastCheck < CACHE_MS) return lastHealthy

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/soldiers?select=id&limit=1`,
      {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(4000), // 4s timeout
      }
    )
    lastHealthy = res.ok
  } catch {
    lastHealthy = false
  }

  lastCheck = Date.now()
  return lastHealthy
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Can't check without env vars — let the page handle its own errors
  if (!supabaseUrl || !anonKey) return NextResponse.next()

  // Already on maintenance — don't loop
  if (request.nextUrl.pathname === '/maintenance') return NextResponse.next()

  const healthy = await isSupabaseHealthy(supabaseUrl, anonKey)

  if (!healthy) {
    const url = request.nextUrl.clone()
    url.pathname = '/maintenance'
    return NextResponse.redirect(url, { status: 302 })
  }

  return NextResponse.next()
}
