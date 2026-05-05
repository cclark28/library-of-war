import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Library of War — Military History Archive'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0E0C',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
        }}
      >
        {/* Subtle grain texture via repeating gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* Top rule */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: '#8B1A1A',
          }}
        />

        {/* Accent line above headline */}
        <div
          style={{
            width: '56px',
            height: '2px',
            background: '#8B1A1A',
            marginBottom: '28px',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 900,
            color: '#F5F3F0',
            lineHeight: 1.0,
            letterSpacing: '-3px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Library</span>
          <span>of War</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '18px',
            color: 'rgba(245,243,240,0.38)',
            letterSpacing: '7px',
            textTransform: 'uppercase',
          }}
        >
          Military History Archive
        </div>

        {/* Domain — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '14px',
            color: 'rgba(245,243,240,0.18)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          libraryofwar.com
        </div>
      </div>
    ),
    { ...size }
  )
}
