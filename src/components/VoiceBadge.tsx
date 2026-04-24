export type Voice = 'analyst' | 'correspondent' | 'historian' | 'tactician' | 'archivist'

interface VoiceBadgeProps {
  voice: Voice
  className?: string
}

const VOICE_MAP: Record<Voice, { label: string; cls: string }> = {
  correspondent: { label: 'The Correspondent', cls: 'badge-correspondent' },
  analyst:       { label: 'The Analyst',       cls: 'badge-analyst' },
  historian:     { label: 'The Historian',     cls: 'badge-historian' },
  tactician:     { label: 'The Tactician',     cls: 'badge-tactician' },
  archivist:     { label: 'The Archivist',     cls: 'badge-archivist' },
}

export default function VoiceBadge({ voice, className = '' }: VoiceBadgeProps) {
  const { label, cls } = VOICE_MAP[voice] ?? VOICE_MAP.correspondent
  return (
    <span className={`${cls} ${className}`}>
      {label}
    </span>
  )
}
