'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SERIES_OPTIONS = [
  "Weapons That Shouldn't Have Worked",
  'The Day After',
  'Black Projects',
]

type Phase = 'gate' | 'form' | 'success'

/* ─── Label ──────────────────────────────────────────────────────────────────── */
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-body text-[0.6rem] tracking-[0.22em] uppercase text-mist mb-2"
    >
      {children}
    </label>
  )
}

/* ─── Field wrapper ─────────────────────────────────────────────────────────── */
function Field({ children }: { children: React.ReactNode }) {
  return <div className="mb-8">{children}</div>
}

/* ─── Input ──────────────────────────────────────────────────────────────────── */
const inputClass =
  'w-full bg-transparent border-0 border-b border-rule font-body text-[1.125rem] text-ink pb-2 pt-1 outline-none focus:border-ink transition-colors placeholder:text-mist/50'

/* ─── Password gate ─────────────────────────────────────────────────────────── */
function GatePhase({
  onUnlock,
}: {
  onUnlock: (password: string) => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contributor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        onUnlock(password)
      } else {
        setError('Incorrect password.')
        setPassword('')
      }
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto text-center pt-16 pb-24">
      <p className="era-label mb-6">Contributor Access</p>
      <h1 className="font-headline font-black text-ink text-[2.5rem] leading-tight mb-4">
        Submit an Article
      </h1>
      <p className="font-body text-[1.125rem] text-mist leading-relaxed mb-12">
        Library of War accepts pitches and drafts from qualified contributors.
        Enter the access password to continue.
      </p>

      <form onSubmit={handleSubmit} className="text-left">
        <Field>
          <Label htmlFor="gate-password">Access Password</Label>
          <input
            id="gate-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </Field>

        {error && (
          <p className="font-body text-[0.85rem] text-accent mb-6 tracking-wide">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full font-body text-[0.65rem] tracking-[0.28em] uppercase text-paper bg-ink py-4 px-8 disabled:opacity-40 hover:bg-accent transition-colors duration-200"
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

/* ─── Submission form ───────────────────────────────────────────────────────── */
function FormPhase({
  password,
  onSuccess,
}: {
  password: string
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [series, setSeries] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const formLoadTime = useRef(Date.now())
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    formLoadTime.current = Date.now()
  }, [])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    // Timing anti-bot check (must take at least 3s)
    if (Date.now() - formLoadTime.current < 3000) {
      return
    }

    // Honeypot check
    const form = e.currentTarget
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value
    if (honeypot) return // silent discard — it's a bot

    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('title', title.trim())
      fd.append('series', series)
      fd.append('content', content.trim())
      fd.append('loadTime', String(formLoadTime.current))
      if (image) fd.append('image', image)

      const res = await fetch('/api/contributor/submit', {
        method: 'POST',
        headers: { 'X-Contributor-Password': password },
        body: fd,
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Submission failed. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pt-12 pb-24">
      <div className="rule-heavy mb-1" />
      <div className="rule-top mb-8" />

      <p className="era-label mb-4">Contributor Submission</p>
      <h1 className="font-headline font-black text-ink text-[2.25rem] md:text-[2.75rem] leading-tight mb-3">
        Submit Your Article
      </h1>
      <p className="font-body text-[1.125rem] text-mist leading-relaxed mb-12">
        All submissions are reviewed before publication. Your name will appear
        as the author credit exactly as entered below.
      </p>

      <form onSubmit={handleSubmit} noValidate>

        {/* Honeypot — hidden from humans, visible to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          style={{ display: 'none' }}
        />

        <Field>
          <Label htmlFor="contributor-name">Your Name *</Label>
          <input
            id="contributor-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Full name as it should appear in the byline"
            required
            autoComplete="name"
          />
        </Field>

        <Field>
          <Label htmlFor="article-title">Article Title *</Label>
          <input
            id="article-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Working title"
            required
          />
        </Field>

        <Field>
          <Label htmlFor="article-series">Series</Label>
          <div className="relative">
            <select
              id="article-series"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer pr-8`}
            >
              <option value="">— None / standalone article —</option>
              {SERIES_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0 bottom-3 text-mist text-xs">▾</span>
          </div>
        </Field>

        <Field>
          <Label htmlFor="article-content">Article Content *</Label>
          <p className="font-body text-[0.8rem] text-mist/70 mb-3 leading-relaxed">
            Plain text is fine. Include all sources inline as footnotes or links.
            Minimum 500 words.
          </p>
          <textarea
            id="article-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} resize-y min-h-[320px] border-b-0 border border-rule p-4 leading-relaxed`}
            placeholder="Your article..."
            required
          />
        </Field>

        <Field>
          <Label htmlFor="article-image">Image (optional)</Label>
          <p className="font-body text-[0.8rem] text-mist/70 mb-3 leading-relaxed">
            Public domain only. Include the source/credit in your article text.
            Accepted: JPG, PNG, WebP — max 10 MB.
          </p>

          {imagePreview && (
            <div className="mb-4 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover border border-rule"
              />
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = '' }}
                className="absolute top-2 right-2 font-body text-[0.6rem] tracking-[0.18em] uppercase bg-ink text-paper px-3 py-1 hover:bg-accent transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            id="article-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="font-body text-[0.85rem] text-mist file:mr-4 file:py-2 file:px-4 file:border-0 file:font-body file:text-[0.6rem] file:tracking-[0.18em] file:uppercase file:bg-ghost file:text-ink file:cursor-pointer hover:file:bg-rule/30 cursor-pointer"
          />
        </Field>

        <div className="rule-top mt-8 mb-8" />

        {error && (
          <p className="font-body text-[0.9rem] text-accent mb-6">{error}</p>
        )}

        <p className="font-body text-[0.75rem] text-mist leading-relaxed mb-8">
          By submitting, you confirm this is original work and that any images
          are in the public domain. Library of War retains the right to edit,
          decline, or not publish submitted work. You will receive no automatic
          confirmation — Charlie will be in touch if it advances.
        </p>

        <button
          type="submit"
          disabled={loading || !name || !title || !content}
          className="w-full font-body text-[0.65rem] tracking-[0.28em] uppercase text-paper bg-ink py-4 px-8 disabled:opacity-40 hover:bg-accent transition-colors duration-200"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}

/* ─── Success state ─────────────────────────────────────────────────────────── */
function SuccessPhase() {
  return (
    <div className="max-w-md mx-auto text-center pt-24 pb-32">
      <div className="masthead-rule mb-10 mx-auto w-16" />
      <p className="era-label mb-4">Received</p>
      <h1 className="font-headline font-black text-ink text-[2.25rem] leading-tight mb-6">
        Submission Filed
      </h1>
      <p className="font-body text-[1.125rem] text-mist leading-relaxed">
        Your article is in the queue for review. Charlie will reach out
        directly if it moves forward. There is no automated confirmation.
      </p>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function ContributorPage() {
  const [phase, setPhase] = useState<Phase>('gate')
  const [password, setPassword] = useState('')

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-5 md:px-6 min-h-screen">
        {phase === 'gate' && (
          <GatePhase
            onUnlock={(pw) => {
              setPassword(pw)
              setPhase('form')
            }}
          />
        )}
        {phase === 'form' && (
          <FormPhase
            password={password}
            onSuccess={() => setPhase('success')}
          />
        )}
        {phase === 'success' && <SuccessPhase />}
      </main>
      <Footer />
    </>
  )
}
