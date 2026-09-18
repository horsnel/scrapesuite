"use client";

import { useEffect, useRef } from 'react'
import { useScrambleText } from '@/hooks/useScrambleText'
import Link from 'next/link'

export default function Hero() {
  const scramble = useScrambleText()
  const labelRef = useRef<HTMLSpanElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const delay = 300
    setTimeout(() => {
      if (labelRef.current) scramble(labelRef.current, '// PHASE 1 — NOW LIVE')
    }, delay)

    setTimeout(() => {
      if (line1Ref.current) scramble(line1Ref.current, 'SCRAPE IN')
    }, delay + 200)

    setTimeout(() => {
      if (line2Ref.current) scramble(line2Ref.current, 'PLAIN ENGLISH')
    }, delay + 500)
  }, [scramble])

  const handleScrollDown = () => {
    const logoBar = document.getElementById('logo-bar')
    if (logoBar) {
      logoBar.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 clamp(20px, 6vw, 80px) clamp(60px, 12vw, 120px)',
        zIndex: 1,
        paddingTop: '80px',
      }}
    >
      <div style={{ maxWidth: '640px' }}>
        {/* Accent Label */}
        <span
          ref={labelRef}
          style={{
            display: 'block',
            fontFamily: "'Source Code Pro', monospace",
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#f59e0b',
            marginBottom: '24px',
            minHeight: '16px',
          }}
        />

        {/* Headline */}
        <h1 style={{ marginBottom: '24px' }}>
          <span
            ref={line1Ref}
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(36px, 8vw, 72px)',
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#f8fafc',
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.6)',
            }}
          />
          <span
            ref={line2Ref}
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(36px, 8vw, 72px)',
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#f59e0b',
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.6)',
              marginTop: '8px',
            }}
          />
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            fontWeight: 400,
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '520px',
            marginBottom: '32px',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.
        </p>

        {/* CTA Row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
            Start Scraping Free
          </Link>
          <a href="#demo" className="btn-secondary" onClick={(e) => {
            e.preventDefault()
            document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            View Templates
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.4,
          animation: 'bounce-chevron 2s ease infinite',
        }}
        aria-label="Scroll down"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  )
}
