"use client";

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const phases = [
  {
    phase: 'P1',
    label: 'PHASE 1 — MONTHS 1-2',
    title: 'NL Scraping API + Template Marketplace',
    description: 'Launch with the free hook that gets users in the door. 100 API calls, 10 free templates.',
    status: 'LIVE',
    statusColor: '#22c55e',
  },
  {
    phase: 'P2',
    label: 'PHASE 2 — MONTHS 3-4',
    title: 'Price Monitoring + Change Detection',
    description: 'Launch Pro tier. The three features that complement each other perfectly.',
    status: 'IN PROGRESS',
    statusColor: '#f59e0b',
  },
  {
    phase: 'P3',
    label: 'PHASE 3 — MONTHS 5-6',
    title: 'Lead Enrichment + Cost Optimizer',
    description: 'Launch Business tier. The highest-value features for power users.',
    status: 'UPCOMING',
    statusColor: '#94a3b8',
  },
  {
    phase: 'P4',
    label: 'PHASE 4 — MONTHS 7-9',
    title: 'Self-Hosted Pro + Community Templates',
    description: 'Enterprise segment + community-driven template marketplace.',
    status: 'UPCOMING',
    statusColor: '#94a3b8',
  },
]

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = itemsRef.current?.querySelectorAll('.roadmap-item')
    if (!items || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    const safetyTimer = setTimeout(() => {
      items.forEach((item) => {
        gsap.set(item, { opacity: 1, x: 0 })
      })
    }, 3000)

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 600)

    return () => {
      ctx.revert()
      clearTimeout(safetyTimer)
      clearTimeout(refreshTimer)
    }
  }, [])

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      style={{
        background: '#0b0f1a',
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <span className="section-label">// ROADMAP</span>
        <h2 className="headline-lg" style={{ marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          BUILT IN PUBLIC. SHIPPED IN PHASES.
        </h2>

        <div ref={itemsRef} style={{ position: 'relative' }}>
          {/* Timeline Line */}
          <div className="roadmap-line" />

          {phases.map((phase, i) => (
            <div
              key={phase.phase}
              className="roadmap-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(16px, 3vw, 32px)',
                marginBottom: i < phases.length - 1 ? 'clamp(28px, 5vw, 48px)' : '0',
                position: 'relative',
              }}
            >
              {/* Phase Badge */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Source Code Pro', monospace",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#f59e0b',
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {phase.phase}
              </div>

              {/* Content */}
              <div style={{ paddingLeft: '0px', flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#f59e0b',
                    }}
                  >
                    {phase.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: phase.statusColor,
                      background: `${phase.statusColor}20`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {phase.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(18px, 2.5vw, 24px)',
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '8px',
                  }}
                >
                  {phase.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(14px, 1.5vw, 15px)',
                    fontWeight: 400,
                    color: '#94a3b8',
                    lineHeight: 1.6,
                  }}
                >
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
