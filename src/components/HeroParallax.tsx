'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface HeroParallaxProps {
  src: string
  alt: string
  caption?: string
  sourceUrl?: string
}

export default function HeroParallax({ src, alt, caption, sourceUrl }: HeroParallaxProps) {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    const container = inner.parentElement
    if (!container) return

    function onScroll() {
      const rect = container!.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const y = ((progress - 0.5) * 60).toFixed(1)
      inner!.style.transform = `translateY(${y}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="w-full relative overflow-hidden bg-ink mb-0" style={{ aspectRatio: '21/8' }}>
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{ willChange: 'transform', top: '-12%', bottom: '-12%' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {caption && (
        <p className="absolute bottom-3 right-4 z-10 font-body text-paper/35 text-[0.58rem] tracking-wider">
          {caption}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-accent"
            >
              ↗
            </a>
          )}
        </p>
      )}
    </div>
  )
}
