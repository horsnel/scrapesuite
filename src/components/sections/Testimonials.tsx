"use client";

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    quote: 'We replaced three separate tools with ScrapeSuite. The NL API alone saved our engineering team 20 hours a week. Before, we were writing custom scrapers for every new competitor site — now we just describe what we want in English and the data appears.',
    name: 'Sarah Chen',
    role: 'Lead Data Engineer at Acme Corp',
    initials: 'SC',
    color: '#f59e0b',
  },
  {
    quote: 'The template marketplace is a game-changer. We went from zero to scraping 40 competitor sites in one afternoon. The pre-built selectors handle DOM changes automatically, which means our scrapers keep working even when sites update their layouts.',
    name: 'Marcus Johnson',
    role: 'Growth Lead at Databricks',
    initials: 'MJ',
    color: '#818cf8',
  },
  {
    quote: 'Price monitoring at this scale used to cost us thousands in proxy fees alone. ScrapeSuite\'s Cost Optimizer cut our credit usage by 55% in the first month. The content-diff engine is brilliant — we only pay when prices actually change.',
    name: 'Priya Patel',
    role: 'Head of Pricing at RetailFlow',
    initials: 'PP',
    color: '#4ade80',
  },
]

const stats = [
  { value: 2400, suffix: '+', label: 'Active users' },
  { value: 85, suffix: 'K+', label: 'API calls daily' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
  { value: 60, suffix: '%', label: 'Credit savings' },
]

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 1500
          const stepTime = 16
          const steps = duration / stepTime
          const increment = end / steps

          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, stepTime)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.testimonial-card')
    if (!cards || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    const safetyTimer = setTimeout(() => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 })
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
      ref={sectionRef}
      style={{
        background: '#f7f3eb',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <span
          style={{
            fontFamily: "'Source Code Pro', monospace",
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#f59e0b',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          // TESTIMONIALS
        </span>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#0f172a',
            marginBottom: 'clamp(32px, 6vw, 64px)',
          }}
        >
          BUILT FOR DATA TEAMS
        </h2>

        {/* Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '20px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: 900,
                  color: '#0b0f1a',
                  letterSpacing: '-0.02em',
                  display: 'block',
                }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div ref={cardsRef} className="testimonials-grid">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 40px)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  fontWeight: 400,
                  color: '#334155',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${t.color}20`,
                    border: `2px solid ${t.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: 700,
                    color: t.color,
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#64748b',
                    }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
