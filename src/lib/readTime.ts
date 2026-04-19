type PTBlock = {
  _type: string
  children?: Array<{ text?: string }>
}

export function calcReadTime(body: PTBlock[]): number {
  if (!body?.length) return 1
  const text = body
    .filter(b => b._type === 'block')
    .flatMap(b => b.children ?? [])
    .map(c => c.text ?? '')
    .join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 225))
}

export const DIFFICULTY_LABEL: Record<string, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}
