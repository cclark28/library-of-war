type Voice = 'analyst' | 'correspondent'

interface VoiceBadgeProps {
  voice: Voice
  className?: string
}

export default function VoiceBadge({ voice, className = '' }: VoiceBadgeProps) {
  const label = voice === 'analyst' ? 'The Analyst' : 'The Correspondent'
  const cls   = voice === 'analyst' ? 'badge-analyst' : 'badge-correspondent'
  return (
    <span className={`${cls} ${className}`}>
      {label}
    </span>
  )
}
