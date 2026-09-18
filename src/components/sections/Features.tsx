"use client";

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, LayoutGrid, TrendingDown, Eye, UserPlus, Zap } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function AnimatedStat({ end, suffix = '' }: { end: number; suffix?: string }) {
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
          const duration = 1200
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

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language API',
    description: "Type 'scrape all product prices from this URL' and get structured JSON. No selectors. No code.",
    detail: 'Our AI pipeline classifies your intent, generates optimal CSS selectors, validates output against expected schemas, and returns clean typed JSON — all in under 2 seconds per request.',
    stat: { value: 96, suffix: '%', label: 'Intent accuracy' },
  },
  {
    icon: LayoutGrid,
    title: 'Template Marketplace',
    description: '100+ pre-built scraping templates for Amazon, LinkedIn, Zillow, and more. Copy, paste, run.',
    detail: 'Every template includes battle-tested selectors, built-in retry logic for anti-bot challenges, automatic pagination handling, and structured output schemas. Contributors earn 10% revenue share.',
    stat: { value: 100, suffix: '+', label: 'Ready-made templates' },
  },
  {
    icon: TrendingDown,
    title: 'Price Monitoring',
    description: 'Track competitor pricing across 50+ products. Get alerted when prices drop or change.',
    detail: 'Distributed monitoring engine checks prices every 15 minutes across 2M+ residential proxies. Smart scheduling avoids burst patterns, and debounced alerts prevent notification fatigue on flash sales.',
    stat: { value: 50, suffix: 'K', label: 'Products tracked live' },
  },
  {
    icon: Eye,
    title: 'Change Detection',
    description: 'Monitor any web page for visual or content changes. Diff view with side-by-side comparison.',
    detail: 'Field-level content diffing detects exactly which data fields changed, not just that something changed. Get granular change events with old value, new value, and timestamp — perfect for compliance monitoring and competitive tracking.',
    stat: { value: 99, suffix: '.2%', label: 'Detection reliability' },
  },
  {
    icon: UserPlus,
    title: 'Lead Enrichment',
    description: 'Upload a list of domains. Get decision-maker emails, titles, and social profiles automatically.',
    detail: 'Bulk-enrich up to 5,000 domains per run. We cross-reference LinkedIn, Crunchbase, and company websites to find verified decision-makers with their roles, emails, and social profiles — ready for your CRM.',
    stat: { value: 5, suffix: 'K', label: 'Records per batch' },
  },
  {
    icon: Zap,
    title: 'Cost Optimizer',
    description: 'Smart proxy rotation and caching that reduces your API credit usage by up to 60%.',
    detail: 'Three-tier caching architecture: in-memory LRU for instant repeat hits, persistent RocksDB for up to 24h snapshots, and a content-diff engine that only charges credits when significant fields actually change.',
    stat: { value: 60, suffix: '%', label: 'Average credit savings' },
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.feature-card')
    if (!cards || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
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
      id="features"
      ref={sectionRef}
      style={{
        background: '#0b0f1a',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <span className="section-label">// CORE FEATURES</span>
        <h2 className="headline-lg" style={{ marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          ONE PLATFORM, SEVEN CAPABILITIES
        </h2>

        <div ref={cardsRef} className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="feature-card card-glow"
                style={{ padding: 'clamp(28px, 4vw, 44px)' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} color="#f59e0b" strokeWidth={1.5} />
                </div>

                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '8px',
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(14px, 1.5vw, 15px)',
                    fontWeight: 400,
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                  }}
                >
                  {feature.description}
                </p>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(12px, 1.2vw, 13px)',
                    fontWeight: 400,
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {feature.detail}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(24px, 3vw, 32px)',
                      fontWeight: 900,
                      color: '#f59e0b',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    <AnimatedStat end={feature.stat.value} suffix={feature.stat.suffix} />
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {feature.stat.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
