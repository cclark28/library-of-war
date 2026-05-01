'use client'

import { useRef, useEffect } from 'react'

interface AnimatedProseProps {
  children: React.ReactNode
  className?: string
}

// Wraps article body prose and animates each paragraph, heading, and blockquote
// as the reader scrolls. Uses a CSS class (not inline opacity:0) so content is
// fully visible if JS is slow or blocked — no flash of invisible text.
export default function AnimatedProse({ children, className = '' }: AnimatedProseProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Only apply animation class once JS is confirmed running.
    // CSS handles the hidden state — JS just adds the class that enables it.
    el.classList.add('prose-ready')

    const nodes = el.querySelectorAll<HTMLElement>('p, h2, h3, blockquote, figure')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('prose-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -16px 0px' }
    )

    nodes.forEach((node, i) => {
      node.dataset.proseIndex = String(i)
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
