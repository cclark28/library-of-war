'use client'

interface NewsletterFormProps {
  dark?: boolean
}

export default function NewsletterForm({ dark = false }: NewsletterFormProps) {
  return (
    <form
      className="flex items-end justify-center gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Type your email..."
        className="newsletter-input"
        style={dark ? { borderBottomColor: 'rgba(200,184,154,0.3)', color: 'rgba(249,246,240,0.7)' } : {}}
      />
      <button
        type="submit"
        className={`font-body text-[0.62rem] tracking-[0.22em] uppercase pb-0.5 border-b transition-colors whitespace-nowrap ${
          dark
            ? 'text-paper/50 border-paper/20 hover:text-paper hover:border-paper/50'
            : 'text-ink border-ink hover:text-accent hover:border-accent'
        }`}
      >
        Subscribe
      </button>
    </form>
  )
}
