'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { IDDrillQuestion } from './page'

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const TOTAL_QUESTIONS = 25
const TIMER_SECONDS   = 25
const AUTO_ADVANCE_MS = 6000

/* ─── Types ──────────────────────────────────────────────────────────────────── */
type Screen = 'start' | 'game' | 'feedback' | 'results'
type Branch = 'all' | 'army' | 'navy' | 'airforce' | 'marines' | 'coastguard' | 'spaceforce'
type Difficulty = 'recruit' | 'sergeant' | 'commander'

interface AnswerRecord {
  questionId:   string
  name:         string
  category:     string
  imageUrl:     string
  correct:      boolean
  timeout:      boolean
  playerPick:   string | null
  timeUsed:     number // seconds elapsed when answered
  description:  string
  history?:     string
  wikiUrl:      string
  credit:       string
  sourceUrl?:   string
}

interface GameQuestion extends IDDrillQuestion {
  choices: string[]  // 4 shuffled choices (correct + 3 distractors)
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildGameQueue(
  questions:  IDDrillQuestion[],
  branch:     Branch,
  difficulty: Difficulty,
): GameQuestion[] {
  // Filter by branch and difficulty
  let pool = questions.filter(q => {
    const branchOk = branch === 'all' || q.branch === 'all' || q.branch === branch
    const diffOk   = q.difficulty === difficulty
    return branchOk && diffOk && q.distractors?.length === 3
  })

  // If not enough, relax difficulty to adjacent levels
  if (pool.length < TOTAL_QUESTIONS) {
    const adjDiff: Record<Difficulty, Difficulty[]> = {
      recruit:   ['sergeant'],
      sergeant:  ['recruit', 'commander'],
      commander: ['sergeant'],
    }
    const extras = questions.filter(q => {
      const branchOk = branch === 'all' || q.branch === 'all' || q.branch === branch
      const diffOk   = adjDiff[difficulty].includes(q.difficulty as Difficulty)
      return branchOk && diffOk && !pool.find(p => p._id === q._id) && q.distractors?.length === 3
    })
    pool = [...pool, ...shuffle(extras)]
  }

  // Shuffle and take TOTAL_QUESTIONS
  const selected = shuffle(pool).slice(0, TOTAL_QUESTIONS)

  return selected.map(q => ({
    ...q,
    choices: shuffle([q.name, ...q.distractors]),
  }))
}

function getRankLabel(accuracy: number): string {
  if (accuracy >= 0.96) return 'Five-Star General'
  if (accuracy >= 0.88) return 'General'
  if (accuracy >= 0.76) return 'Colonel'
  if (accuracy >= 0.64) return 'Major'
  if (accuracy >= 0.52) return 'Captain'
  if (accuracy >= 0.40) return 'Sergeant'
  if (accuracy >= 0.28) return 'Corporal'
  return 'Private'
}

const CATEGORY_LABELS: Record<string, string> = {
  aircraft:  'Aircraft',
  armor:     'Armor',
  smallarms: 'Small Arms',
  warship:   'Warship',
  rank:      'Military Rank',
  medal:     'Medal & Decoration',
  insignia:  'Unit Insignia',
  artillery: 'Artillery',
}

const BRANCH_LABELS: Record<Branch, string> = {
  all:        'All Branches',
  army:       'Army',
  navy:       'Navy',
  airforce:   'Air Force',
  marines:    'Marine Corps',
  coastguard: 'Coast Guard',
  spaceforce: 'Space Force',
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  recruit:   'Recruit',
  sergeant:  'Sergeant',
  commander: 'Commander',
}

/* ─── Share buttons component ───────────────────────────────────────────────── */
function ShareButtons({
  score, total, callsign, rankLabel, difficulty,
}: {
  score: number; total: number; callsign: string; rankLabel: string; difficulty: string
}) {
  const [copied, setCopied] = useState(false)
  const url  = 'https://libraryofwar.com/id-drill'
  const text = `${callsign.toUpperCase()} scored ${score}/${total} on the @LibraryOfWar ID Drill — rank: ${rankLabel}. Can you beat it? ${difficulty} difficulty.`

  const xUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback: select text
    }
  }

  const btnBase = 'flex items-center gap-2 border font-body text-[0.6rem] tracking-[0.14em] uppercase px-4 py-2.5 transition-colors'

  return (
    <div className="flex flex-wrap gap-2">
      {/* X / Twitter */}
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} border-ink text-ink hover:bg-ink hover:text-paper`}
      >
        <svg width="13" height="13" viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true">
          <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.163 519.284zm-144.814 168.311-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.063L569.349 687.595z"/>
        </svg>
        Share on X
      </a>

      {/* Facebook */}
      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Share on Facebook
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className={`${btnBase} ${copied ? 'border-olive text-olive' : 'border-rule text-mist hover:border-ink hover:text-ink'}`}
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy Link
          </>
        )}
      </button>
    </div>
  )
}

/* ─── Image proxy — routes Wikimedia URLs through our edge function ──────────── */
function proxied(url: string): string {
  if (!url) return url
  if (url.startsWith('https://upload.wikimedia.org/') || url.startsWith('https://commons.wikimedia.org/')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }
  return url
}

/* ─── Low-res placeholder for images ────────────────────────────────────────── */
const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlNGRlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjODg4MDc4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZyBpbWFnZS4uLjwvdGV4dD48L3N2Zz4='

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function IDDrillClient({
  questions,
  fetchError,
}: {
  questions:  IDDrillQuestion[]
  fetchError: boolean
}) {
  /* ── Settings ──────────────────────────────────────────────────────────────── */
  const [callsign,   setCallsign]   = useState('')
  const [branch,     setBranch]     = useState<Branch>('all')
  const [difficulty, setDifficulty] = useState<Difficulty>('sergeant')

  /* ── Game state ────────────────────────────────────────────────────────────── */
  const [screen,      setScreen]      = useState<Screen>('start')
  const [queue,       setQueue]       = useState<GameQuestion[]>([])
  const [qIndex,      setQIndex]      = useState(0)
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECONDS)
  const [locked,      setLocked]      = useState(false)   // answer chosen or timed out
  const [playerPick,  setPlayerPick]  = useState<string | null>(null)
  const [timedOut,    setTimedOut]    = useState(false)
  const [history,     setHistory]     = useState<AnswerRecord[]>([])
  const [imgLoaded,   setImgLoaded]   = useState(false)
  const [imgError,    setImgError]    = useState(false)

  /* ── Refs ──────────────────────────────────────────────────────────────────── */
  const timerRef      = useRef<NodeJS.Timeout | null>(null)
  const advanceRef    = useRef<NodeJS.Timeout | null>(null)
  const timeUsedRef   = useRef(0)
  const callsignRef   = useRef<HTMLInputElement>(null)
  const gameImgRef    = useRef<HTMLImageElement>(null)

  const currentQ = queue[qIndex]

  /* ── Clear timers ──────────────────────────────────────────────────────────── */
  const clearTimers = useCallback(() => {
    if (timerRef.current)   clearInterval(timerRef.current)
    if (advanceRef.current) clearTimeout(advanceRef.current)
    timerRef.current   = null
    advanceRef.current = null
  }, [])

  /* ── Commit answer ─────────────────────────────────────────────────────────── */
  const commitAnswer = useCallback((
    pick:     string | null,
    isTimeout: boolean,
    elapsed:   number,
  ) => {
    if (!currentQ || locked) return
    clearTimers()
    setLocked(true)
    setPlayerPick(pick)
    setTimedOut(isTimeout)

    const correct = pick === currentQ.name

    const record: AnswerRecord = {
      questionId:  currentQ._id,
      name:        currentQ.name,
      category:    currentQ.category,
      imageUrl:    currentQ.image.url,
      correct,
      timeout:     isTimeout,
      playerPick:  pick,
      timeUsed:    elapsed,
      description: currentQ.description,
      history:     currentQ.history,
      wikiUrl:     currentQ.wikiUrl,
      credit:      currentQ.image.credit,
      sourceUrl:   currentQ.image.sourceUrl,
    }

    setHistory(prev => [...prev, record])
    setScreen('feedback')
  }, [currentQ, locked, clearTimers])

  /* ── Start timer for current question ─────────────────────────────────────── */
  const startTimer = useCallback(() => {
    clearTimers()
    setTimeLeft(TIMER_SECONDS)
    timeUsedRef.current = 0

    timerRef.current = setInterval(() => {
      timeUsedRef.current += 1
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          commitAnswer(null, true, TIMER_SECONDS)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimers, commitAnswer])

  /* ── Advance to next question ──────────────────────────────────────────────── */
  const advance = useCallback(() => {
    clearTimers()
    const next = qIndex + 1
    if (next >= queue.length) {
      setScreen('results')
    } else {
      setQIndex(next)
      setLocked(false)
      setPlayerPick(null)
      setTimedOut(false)
      setImgLoaded(false)
      setImgError(false)
      setScreen('game')
    }
  }, [qIndex, queue.length, clearTimers])

  /* ── No auto-advance — user reads feedback and clicks Next manually ─────────── */

  /* ── Start timer when game screen mounts ───────────────────────────────────── */
  useEffect(() => {
    if (screen === 'game' && !locked) startTimer()
    return () => clearTimers()
  }, [screen, qIndex]) // eslint-disable-line

  /* ── Handle cached images: onLoad won't fire if browser already has it ───── */
  useEffect(() => {
    if (screen !== 'game') return
    const img = gameImgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      setImgLoaded(true)
    }
  }, [screen, qIndex])

  /* ── Keyboard navigation ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (screen !== 'game' || locked) return
    const handler = (e: KeyboardEvent) => {
      if (!currentQ) return
      const keyMap: Record<string, number> = {
        '1': 0, 'a': 0, 'A': 0,
        '2': 1, 'b': 1, 'B': 1,
        '3': 2, 'c': 2, 'C': 2,
        '4': 3, 'd': 3, 'D': 3,
      }
      const idx = keyMap[e.key]
      if (idx !== undefined && currentQ.choices[idx]) {
        handlePick(currentQ.choices[idx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, locked, currentQ]) // eslint-disable-line

  /* ── Handle player picking an answer ──────────────────────────────────────── */
  const handlePick = useCallback((choice: string) => {
    if (locked) return
    commitAnswer(choice, false, timeUsedRef.current)
  }, [locked, commitAnswer])

  /* ── Start game ────────────────────────────────────────────────────────────── */
  const startGame = useCallback(() => {
    if (!callsign.trim()) {
      callsignRef.current?.focus()
      return
    }
    const q = buildGameQueue(questions, branch, difficulty)
    if (q.length === 0) return
    setQueue(q)
    setQIndex(0)
    setHistory([])
    setLocked(false)
    setPlayerPick(null)
    setTimedOut(false)
    setImgLoaded(false)
    setImgError(false)
    setScreen('game')
  }, [callsign, branch, difficulty, questions])

  /* ── Restart with same settings ────────────────────────────────────────────── */
  const restart = useCallback(() => {
    const q = buildGameQueue(questions, branch, difficulty)
    setQueue(q)
    setQIndex(0)
    setHistory([])
    setLocked(false)
    setPlayerPick(null)
    setTimedOut(false)
    setImgLoaded(false)
    setImgError(false)
    setScreen('game')
  }, [questions, branch, difficulty])

  /* ── Derived ───────────────────────────────────────────────────────────────── */
  const score    = history.filter(r => r.correct).length
  const accuracy = history.length > 0 ? score / history.length : 0
  const timerPct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor =
    timeLeft > 12 ? '#8B1A1A' :
    timeLeft >  6 ? '#b45309' :
    '#dc2626'

  /* ─────────────────────────────────────────────────────────────────────────── */
  /* LOGO — always top-left                                                       */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const Logo = () => (
    <Link href="/" className="flex-shrink-0 group" aria-label="Library of War — Home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-horizontal.svg"
        alt="Library of War"
        className="h-8 md:h-10 w-auto transition-opacity duration-200 group-hover:opacity-70"
        onError={e => {
          // Fallback text if SVG not found
          const el = e.currentTarget
          el.style.display = 'none'
          const span = document.createElement('span')
          span.style.cssText = 'font-family:Georgia,serif;font-size:0.85rem;font-weight:900;letter-spacing:0.04em;color:#0F0E0C;'
          span.textContent = 'LIBRARY OF WAR'
          el.parentNode?.insertBefore(span, el.nextSibling)
        }}
      />
    </Link>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: ERROR STATE
  ═══════════════════════════════════════════════════════════════════════════ */
  if (fetchError || (questions.length === 0 && !fetchError)) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col">
        <header className="px-5 py-4 border-b border-rule flex items-center">
          <Logo />
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="text-[0.6rem] tracking-[0.28em] uppercase text-accent mb-4">ID Drill</div>
            <h1 className="font-headline text-[2rem] font-black mb-4">
              {fetchError ? 'Connection Failed' : 'No Questions Found'}
            </h1>
            <p className="font-body text-mist text-body-sm mb-8">
              {fetchError
                ? 'Unable to reach the Sanity database. Check your connection and environment variables.'
                : 'No active ID Drill questions found. Add questions in Sanity Studio at /studio.'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/studio" className="inline-block border border-ink px-6 py-3 font-body text-[0.72rem] tracking-[0.16em] uppercase hover:bg-ink hover:text-paper transition-colors">
                Open Studio
              </Link>
              <Link href="/" className="inline-block border border-rule px-6 py-3 font-body text-[0.72rem] tracking-[0.16em] uppercase text-mist hover:text-ink transition-colors">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const notEnough = buildGameQueue(questions, branch, difficulty).length === 0

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: START SCREEN
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col">

        {/* Top bar */}
        <header className="px-5 md:px-8 py-3 border-b border-rule flex items-center justify-between bg-paper sticky top-0 z-50">
          <Logo />
          <div className="hidden md:flex items-center gap-4">
            <a href="https://x.com/libraryofwar" target="_blank" rel="noopener noreferrer"
              className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ink/40 hover:text-accent transition-colors">X</a>
            <a href="https://instagram.com/libraryofwar" target="_blank" rel="noopener noreferrer"
              className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-ink/40 hover:text-accent transition-colors">Instagram</a>
          </div>
        </header>

        {/* Hero rule */}
        <div className="masthead-rule" />

        {/* Main layout */}
        <main className="flex-1 flex flex-col lg:flex-row">

          {/* Left: Form */}
          <div className="flex-1 px-6 md:px-12 lg:px-16 py-10 lg:py-14 flex flex-col justify-center max-w-[560px] mx-auto lg:mx-0 w-full">

            <div className="mb-8">
              <div className="text-[0.58rem] tracking-[0.32em] uppercase text-accent mb-3 font-body">ID Drill</div>
              <h1 className="font-headline text-[2.2rem] md:text-[2.75rem] font-black leading-[1.08] mb-4">
                Identify What<br />You&apos;re Fighting With.
              </h1>
              <p className="font-body text-mist text-body-sm leading-relaxed max-w-md">
                25 photographs. 25 seconds each. Identify aircraft, armor, small arms, warships, ranks, and medals before the clock runs out.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-ink mb-8" />

            {/* Callsign */}
            <div className="mb-6">
              <label className="block font-body text-[0.62rem] tracking-[0.2em] uppercase text-mist mb-2">
                Callsign
              </label>
              <input
                ref={callsignRef}
                type="text"
                value={callsign}
                onChange={e => setCallsign(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !notEnough) startGame() }}
                placeholder="Enter your callsign…"
                maxLength={24}
                autoComplete="off"
                className="w-full border border-rule bg-transparent font-body text-body-sm text-ink placeholder:text-mist/40 px-4 py-3 focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            {/* Branch */}
            <div className="mb-6">
              <div className="font-body text-[0.62rem] tracking-[0.2em] uppercase text-mist mb-3">Branch</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BRANCH_LABELS) as Branch[]).map(b => (
                  <button
                    key={b}
                    onClick={() => setBranch(b)}
                    className={`font-body text-[0.6rem] tracking-[0.16em] uppercase border px-3 py-1.5 transition-colors ${
                      branch === b
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-rule text-mist hover:border-ink hover:text-ink'
                    }`}
                  >
                    {BRANCH_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-8">
              <div className="font-body text-[0.62rem] tracking-[0.2em] uppercase text-mist mb-3">Difficulty</div>
              <div className="flex gap-2">
                {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 font-body text-[0.62rem] tracking-[0.14em] uppercase border py-3 transition-colors ${
                      difficulty === d
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-rule text-mist hover:border-ink hover:text-ink'
                    }`}
                  >
                    {DIFFICULTY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="mb-8 border border-rule p-5 bg-ghost">
              <div className="font-body text-[0.57rem] tracking-[0.22em] uppercase text-mist mb-4">Rules of Engagement</div>
              <ul className="space-y-2.5">
                {[
                  '25 questions · 25 seconds each · timer never pauses',
                  'Photo-first format — identify from the image alone',
                  'All 4 choices come from the same category',
                  'Running out of time counts as a wrong answer',
                  'After each answer, a full info card is shown',
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-[5px] w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                    <span className="font-body text-[0.75rem] text-ink/70 leading-snug">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            {notEnough ? (
              <div className="border border-rule px-5 py-4 bg-ghost text-center">
                <p className="font-body text-[0.72rem] text-mist">
                  No questions match this branch + difficulty. Try <strong className="text-ink">All Branches</strong> or a different difficulty.
                </p>
              </div>
            ) : (
              <button
                onClick={startGame}
                disabled={!callsign.trim()}
                className={`w-full font-body text-[0.72rem] tracking-[0.2em] uppercase py-4 transition-all duration-200 ${
                  callsign.trim()
                    ? 'bg-accent text-paper hover:bg-accent/90 border border-accent'
                    : 'bg-ghost text-mist border border-rule cursor-not-allowed'
                }`}
              >
                Begin Mission
              </button>
            )}
          </div>

          {/* Right: photo preview grid — desktop only */}
          <div className="hidden lg:grid flex-1 grid-cols-2 gap-px bg-rule max-h-screen overflow-hidden">
            {[
              'https://cdn.sanity.io/images/tifzt4zw/production/4594a3d9a1ace25d5c62757593744096eb27eee0-1796x1297.jpg',
              'https://cdn.sanity.io/images/tifzt4zw/production/22867bf947d9d721aa86df5bfa5cd1fbcfee943e-6612x3719.jpg',
              'https://cdn.sanity.io/images/tifzt4zw/production/3a4d376aebb11a0aa32e7472761c3b5bf93f719a-1000x473.jpg',
              'https://cdn.sanity.io/images/tifzt4zw/production/6311e80f558d4736c1a8ef0d6a5332ba3d766146-2450x950.png',
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden bg-ghost aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proxied(src)}
                  alt="ID Drill preview"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 scale-100 hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>
            ))}
          </div>

        </main>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: GAME SCREEN
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'game' && currentQ) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col select-none">

        {/* HUD bar */}
        <header className="px-4 md:px-8 py-3 border-b border-rule flex items-center justify-between bg-paper sticky top-0 z-50">
          <Logo />
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:block font-body text-[0.6rem] tracking-[0.16em] uppercase text-mist">
              <span className="text-ink font-semibold">{callsign.toUpperCase()}</span>
              &nbsp;·&nbsp;{DIFFICULTY_LABELS[difficulty]}
            </div>
            {/* Timer digit */}
            <div className="text-center min-w-[40px]">
              <div
                className="font-headline font-black text-[1.75rem] leading-none transition-colors duration-300"
                style={{ color: timerColor }}
              >
                {timeLeft}
              </div>
              <div className="font-body text-[0.48rem] tracking-[0.2em] uppercase text-mist">sec</div>
            </div>
            {/* Q count */}
            <div className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-mist">
              Q&nbsp;<span className="text-ink font-bold text-[0.75rem]">{qIndex + 1}</span>&nbsp;/&nbsp;{TOTAL_QUESTIONS}
            </div>
            {/* Score */}
            <div className="hidden md:block font-body text-[0.6rem] tracking-[0.14em] uppercase text-mist">
              Score&nbsp;<span className="text-ink font-bold">{score}</span>
            </div>
          </div>
        </header>

        {/* Timer bar — full width, below nav */}
        <div className="h-1 bg-rule/40">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
          />
        </div>

        {/* Game layout — stacked: photo full-width top, answers below */}
        <main className="flex-1 flex flex-col overflow-auto">

          {/* Photo panel — full width, object-contain, dark bg so full item is always visible */}
          <div
            className="relative w-full bg-[#0F0E0C] flex items-center justify-center flex-shrink-0"
            style={{ height: '52vh', minHeight: '220px', maxHeight: '500px' }}
          >
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 border border-rule/40 rounded-full" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={gameImgRef}
              key={currentQ._id}
              src={proxied(currentQ.image.url) || PLACEHOLDER}
              alt={currentQ.image.alt}
              className={`w-full h-full object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true) }}
              loading="eager"
            />
            {/* Category pill */}
            <div className="absolute bottom-3 left-3">
              <span className="font-body text-[0.54rem] tracking-[0.2em] uppercase bg-ink/70 text-paper px-2 py-1 backdrop-blur-sm">
                {CATEGORY_LABELS[currentQ.category] ?? currentQ.category}
              </span>
            </div>
            {/* Credit */}
            <div className="absolute bottom-3 right-3">
              <span className="font-body text-[0.45rem] tracking-[0.1em] text-paper/40">
                {currentQ.image.credit}
              </span>
            </div>
          </div>

          {/* Answers section — below the photo */}
          <div className="flex-1 px-5 md:px-10 lg:px-14 py-5 md:py-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="font-body text-[0.58rem] tracking-[0.24em] uppercase text-mist mb-1">
                Identify this {(CATEGORY_LABELS[currentQ.category] ?? currentQ.category).toLowerCase()}
              </div>
              <h2 className="font-headline text-[1.1rem] md:text-[1.3rem] font-bold leading-snug mb-4">
                What {currentQ.category === 'rank' ? 'rank is shown?' :
                      currentQ.category === 'medal' ? 'decoration is shown?' :
                      currentQ.category === 'insignia' ? 'insignia is shown?' :
                      'is shown in this photograph?'}
              </h2>

              {/* Answer choices — 2×2 on md+, 1-col on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {currentQ.choices.map((choice, i) => {
                  const letter = ['A', 'B', 'C', 'D'][i]
                  return (
                    <button
                      key={choice}
                      onClick={() => handlePick(choice)}
                      disabled={locked}
                      className={`flex items-center gap-4 border px-4 py-3.5 text-left transition-all duration-150 group ${
                        locked
                          ? 'cursor-not-allowed opacity-50 border-rule'
                          : 'border-rule hover:border-ink hover:bg-ghost cursor-pointer'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-7 h-7 border flex items-center justify-center font-body text-[0.65rem] font-bold tracking-[0.1em] transition-colors ${
                        locked ? 'border-rule text-mist' : 'border-rule text-mist group-hover:border-ink group-hover:text-ink'
                      }`}>
                        {letter}
                      </span>
                      <span className="font-body text-[0.875rem] md:text-body-sm text-ink leading-snug">{choice}</span>
                    </button>
                  )
                })}
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: Math.min(TOTAL_QUESTIONS, queue.length) }).map((_, i) => {
                    const rec = history[i]
                    return (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-colors"
                        style={{
                          background: i === qIndex ? '#8B1A1A' :
                            rec ? (rec.correct ? '#2d7a3a' : '#8B1A1A') :
                            '#C8B89A'
                        }}
                      />
                    )
                  })}
                </div>
                <span className="font-body text-[0.52rem] tracking-[0.16em] uppercase text-mist/60 hidden md:block">
                  1–4 or A–D to select
                </span>
              </div>
            </div>
          </div>

        </main>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: FEEDBACK SCREEN
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'feedback' && currentQ) {
    const isCorrect  = playerPick === currentQ.name
    const statusColor = isCorrect ? '#2d7a3a' : '#8B1A1A'
    const lastRecord  = history[history.length - 1]

    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col">

        {/* HUD */}
        <header className="px-4 md:px-8 py-3 border-b border-rule flex items-center justify-between bg-paper sticky top-0 z-50">
          <Logo />
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:block font-body text-[0.6rem] tracking-[0.16em] uppercase text-mist">
              <span className="text-ink font-semibold">{callsign.toUpperCase()}</span>
              &nbsp;·&nbsp;{DIFFICULTY_LABELS[difficulty]}
            </div>
            <div className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-mist">
              Q&nbsp;<span className="text-ink font-bold text-[0.75rem]">{qIndex + 1}</span>&nbsp;/&nbsp;{TOTAL_QUESTIONS}
            </div>
            <div className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-mist">
              Score&nbsp;<span className="text-ink font-bold">{score}</span>
            </div>
          </div>
        </header>

        {/* Status bar */}
        <div className="h-1" style={{ background: statusColor }} />

        {/* Content — stacked: photo top, info below */}
        <main className="flex-1 flex flex-col overflow-auto">

          {/* Photo panel — full width, object-contain */}
          <div
            className="relative w-full bg-[#0F0E0C] flex items-center justify-center flex-shrink-0"
            style={{ height: '42vh', minHeight: '200px', maxHeight: '420px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proxied(currentQ.image.url) || PLACEHOLDER}
              alt={currentQ.image.alt}
              className="w-full h-full object-contain"
              style={{ filter: isCorrect ? 'none' : 'saturate(0.6)' }}
            />
            {/* Overlay tint */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `${statusColor}10` }} />

            {/* Result badge */}
            <div className="absolute top-4 left-4">
              <span
                className="font-body text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 font-bold"
                style={{ background: statusColor + 'ee', color: 'white' }}
              >
                {timedOut ? '⏱  Time Out' : isCorrect ? '✓  Correct' : '✕  Wrong'}
              </span>
            </div>

            {/* Credit */}
            <div className="absolute bottom-3 right-3">
              <span className="font-body text-[0.45rem] tracking-[0.1em] text-paper/40">
                {currentQ.image.credit}
              </span>
            </div>
          </div>

          {/* Info section — below photo */}
          <div className="px-5 md:px-10 lg:px-14 py-5 md:py-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto flex flex-col gap-5">

            {/* Answer results — 2×2 on md+, 1-col on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentQ.choices.map((choice, i) => {
                const letter = ['A', 'B', 'C', 'D'][i]
                const isCorrectChoice = choice === currentQ.name
                const isPlayerChoice  = choice === playerPick

                let borderColor = '#C8B89A'
                let bgColor     = 'transparent'
                let textColor   = '#888078'
                let opacity     = '0.4'
                let letterBorder = '#C8B89A'
                let letterText   = '#888078'

                if (isCorrectChoice) {
                  borderColor  = '#2d7a3a'
                  bgColor      = '#f0faf2'
                  textColor    = '#2d7a3a'
                  letterBorder = '#2d7a3a'
                  letterText   = '#2d7a3a'
                  opacity      = '1'
                } else if (isPlayerChoice && !isCorrectChoice) {
                  borderColor  = '#8B1A1A'
                  bgColor      = '#fdf5f5'
                  textColor    = '#8B1A1A'
                  letterBorder = '#8B1A1A'
                  letterText   = '#8B1A1A'
                  opacity      = '1'
                }

                return (
                  <div
                    key={choice}
                    className="flex items-center gap-4 border px-4 py-3 transition-all"
                    style={{ borderColor, backgroundColor: bgColor, opacity }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 border flex items-center justify-center font-body text-[0.6rem] font-bold"
                      style={{ borderColor: letterBorder, color: letterText }}
                    >
                      {letter}
                    </span>
                    <span
                      className="font-body text-[0.875rem] font-medium leading-snug"
                      style={{ color: textColor }}
                    >
                      {choice}
                      {isCorrectChoice && !isPlayerChoice && (
                        <span className="ml-2 text-[0.55rem] tracking-[0.12em] uppercase opacity-70">← correct</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-rule" />

            {/* Info card */}
            <div className="bg-ghost border border-rule p-5">
              <div className="mb-4">
                <div className="font-headline text-[1.1rem] md:text-[1.25rem] font-black leading-tight mb-1">
                  {currentQ.name}
                </div>
                <div className="font-body text-[0.55rem] tracking-[0.2em] uppercase text-accent">
                  {CATEGORY_LABELS[currentQ.category] ?? currentQ.category}
                  {lastRecord?.timeUsed ? ` · ${lastRecord.timeUsed}s used` : ''}
                </div>
              </div>

              <p className="font-body text-[0.825rem] text-ink/80 leading-relaxed mb-4">
                {currentQ.description}
              </p>

              {currentQ.history && (
                <>
                  <div className="font-body text-[0.55rem] tracking-[0.2em] uppercase text-mist mb-2">History</div>
                  <p className="font-body text-[0.78rem] text-mist leading-relaxed mb-4">
                    {currentQ.history}
                  </p>
                </>
              )}

              {/* Further Reading */}
              <div className="pt-3 border-t border-rule/50">
                <div className="font-body text-[0.52rem] tracking-[0.22em] uppercase text-mist mb-3">Further Reading</div>
                <div className="flex flex-col gap-2">
                  <a
                    href={currentQ.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group border border-rule px-4 py-2.5 hover:border-ink transition-colors bg-paper"
                  >
                    <div>
                      <div className="font-body text-[0.7rem] font-semibold text-ink group-hover:text-accent transition-colors">
                        {currentQ.name}
                      </div>
                      <div className="font-body text-[0.55rem] tracking-[0.1em] uppercase text-mist/60 mt-0.5">
                        {currentQ.wikiUrl.includes('wikipedia') ? 'Wikipedia' :
                         currentQ.wikiUrl.includes('history.army') ? 'U.S. Army Center of Military History' :
                         currentQ.wikiUrl.includes('navsource') ? 'NavSource Naval History' :
                         currentQ.wikiUrl.includes('history.navy') ? 'Naval History & Heritage Command' :
                         currentQ.wikiUrl.includes('nationalmuseum') ? 'National Museum of the USAF' :
                         new URL(currentQ.wikiUrl).hostname.replace('www.', '')}
                      </div>
                    </div>
                    <span className="text-mist group-hover:text-ink transition-colors text-[0.7rem] flex-shrink-0 ml-3">→</span>
                  </a>

                  {currentQ.image.sourceUrl && (
                    <a
                      href={currentQ.image.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group border border-rule px-4 py-2.5 hover:border-ink transition-colors bg-paper"
                    >
                      <div>
                        <div className="font-body text-[0.7rem] font-semibold text-ink group-hover:text-accent transition-colors">
                          Original Photograph
                        </div>
                        <div className="font-body text-[0.55rem] tracking-[0.1em] uppercase text-mist/60 mt-0.5">
                          {currentQ.image.credit}
                        </div>
                      </div>
                      <span className="text-mist group-hover:text-ink transition-colors text-[0.7rem] flex-shrink-0 ml-3">→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Next CTA */}
            <button
              onClick={advance}
              className="w-full bg-ink text-paper font-body text-[0.72rem] tracking-[0.2em] uppercase py-4 hover:bg-ink/90 transition-colors"
            >
              {qIndex + 1 >= queue.length ? 'See Results →' : 'Next Question →'}
            </button>

          </div>
          </div>
        </main>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: RESULTS SCREEN
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'results') {
    const missed    = history.filter(r => !r.correct)
    const avgTime   = history.length > 0
      ? (history.reduce((s, r) => s + r.timeUsed, 0) / history.length).toFixed(1)
      : '—'

    // Category breakdown
    const categories = Array.from(new Set(history.map(r => r.category)))
    const catStats   = categories.map(cat => {
      const qs      = history.filter(r => r.category === cat)
      const correct = qs.filter(r => r.correct).length
      return { cat, correct, total: qs.length, pct: correct / qs.length }
    }).sort((a, b) => b.pct - a.pct)

    const rankLabel = getRankLabel(accuracy)

    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col">

        {/* Header */}
        <header className="px-5 md:px-8 py-3 border-b border-rule flex items-center justify-between bg-paper">
          <Logo />
          <div className="font-body text-[0.6rem] tracking-[0.18em] uppercase text-mist">Mission Complete</div>
        </header>
        <div className="masthead-rule" />

        <main className="flex-1 px-5 md:px-12 lg:px-20 py-10 md:py-14 max-w-4xl mx-auto w-full">

          {/* Score hero */}
          <div className="text-center mb-10 md:mb-14">
            <div className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-mist mb-4">
              Mission Debrief&nbsp;·&nbsp;{callsign.toUpperCase()}
            </div>
            <div className="font-headline font-black leading-none mb-3">
              <span className="text-[4.5rem] md:text-[5.5rem]">{score}</span>
              <span className="text-[2rem] md:text-[2.5rem] text-mist">&nbsp;/&nbsp;{TOTAL_QUESTIONS}</span>
            </div>
            <div className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-accent mb-6">
              {rankLabel}
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-rule mx-auto" />
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule mb-10">
            {[
              { val: score,   label: 'Correct',    color: '#2d7a3a' },
              { val: TOTAL_QUESTIONS - score, label: 'Wrong', color: '#8B1A1A' },
              { val: avgTime + 's', label: 'Avg. Time', color: '#0F0E0C' },
              { val: Math.round(accuracy * 100) + '%', label: 'Accuracy', color: '#0F0E0C' },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-paper py-6 px-4 text-center">
                <div className="font-headline font-black text-[2rem] md:text-[2.5rem] leading-none mb-1" style={{ color }}>
                  {val}
                </div>
                <div className="font-body text-[0.55rem] tracking-[0.22em] uppercase text-mist">{label}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          {catStats.length > 0 && (
            <div className="mb-10">
              <div className="font-body text-[0.58rem] tracking-[0.24em] uppercase text-mist mb-5">
                Performance by Category
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catStats.map(({ cat, correct, total, pct }) => (
                  <div key={cat} className="border border-rule p-4 bg-ghost">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="font-body text-[0.72rem] font-semibold">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </div>
                      <div
                        className="font-headline font-black text-[1.1rem]"
                        style={{ color: pct >= 0.7 ? '#2d7a3a' : pct >= 0.4 ? '#b45309' : '#8B1A1A' }}
                      >
                        {correct}/{total}
                      </div>
                    </div>
                    <div className="h-1 bg-rule/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct * 100}%`,
                          background: pct >= 0.7 ? '#2d7a3a' : pct >= 0.4 ? '#b45309' : '#8B1A1A'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missed items */}
          {missed.length > 0 && (
            <div className="mb-10">
              <div className="font-body text-[0.58rem] tracking-[0.24em] uppercase text-mist mb-4">
                Study These — {missed.length} missed
              </div>
              <div className="flex flex-col gap-2">
                {missed.map((rec, i) => (
                  <div key={i} className="flex items-center gap-4 border border-rule px-4 py-3 bg-ghost">
                    <div className="flex-shrink-0 w-12 h-9 bg-rule/30 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proxied(rec.imageUrl)}
                        alt={rec.name}
                        className="w-full h-full object-cover opacity-80"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-[0.8rem] font-semibold truncate">{rec.name}</div>
                      <div className="font-body text-[0.58rem] text-mist">
                        {rec.timeout ? 'Time out' : `You picked: ${rec.playerPick}`}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                      <a
                        href={rec.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-[0.55rem] tracking-[0.14em] uppercase border border-rule px-3 py-1.5 hover:border-ink hover:text-ink text-mist transition-colors whitespace-nowrap"
                      >
                        Read More →
                      </a>
                      {rec.sourceUrl && (
                        <a
                          href={rec.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-[0.5rem] tracking-[0.1em] uppercase text-mist/50 hover:text-mist transition-colors whitespace-nowrap"
                        >
                          Photo Source →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share your score */}
          <div className="mb-6">
            <div className="font-body text-[0.58rem] tracking-[0.24em] uppercase text-mist mb-4">Share Your Score</div>
            <ShareButtons
              score={score}
              total={TOTAL_QUESTIONS}
              callsign={callsign}
              rankLabel={rankLabel}
              difficulty={DIFFICULTY_LABELS[difficulty]}
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-rule">
            <button
              onClick={restart}
              className="flex-1 bg-accent text-paper font-body text-[0.72rem] tracking-[0.2em] uppercase py-4 hover:bg-accent/90 transition-colors"
            >
              Run It Again
            </button>
            <button
              onClick={() => setScreen('start')}
              className="flex-1 border border-ink text-ink font-body text-[0.72rem] tracking-[0.2em] uppercase py-4 hover:bg-ink hover:text-paper transition-colors"
            >
              Change Settings
            </button>
            <Link
              href="/"
              className="flex-1 border border-rule text-mist font-body text-[0.72rem] tracking-[0.2em] uppercase py-4 text-center hover:text-ink hover:border-ink transition-colors"
            >
              ← Back to Site
            </Link>
          </div>

        </main>
      </div>
    )
  }

  // Fallback
  return null
}
