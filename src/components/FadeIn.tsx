'use client'

import { useRef, useEffect } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: 'fade-up' | 'fade-in' | 'slide-left'
}

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${variant} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
