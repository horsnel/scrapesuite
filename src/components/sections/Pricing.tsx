"use client";

import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const plans = [
  {
    name: 'Free Hook',
    price: '$0',
    period: '/mo',
    features: [
      'Natural Language Scraping API',
      '10 Free Templates',
      '100 API calls / month',
      'Community support',
    ],
    cta: 'Get Started',
    ctaLink: '/signup',
    ctaStyle: 'secondary' as const,
    popular: false,
    accent: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    iconColor: '#818cf8',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: [
      'Full Template Marketplace (100+)',
      'Price Monitoring (50 products)',
      'Change Detection (25 pages)',
      '10,000 API calls / month',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/signup',
    ctaStyle: 'primary' as const,
    popular: true,
    accent: 'rgba(245, 158, 11, 0.10)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    iconColor: '#f59e0b',
  },
  {
    name: 'Business',
    price: '$79',
    period: '/mo',
    features: [
      'Lead Enrichment (5K records)',
      'Cost Optimizer Proxy',
      'Self-Hosted Distribution',
      'Unlimited API calls',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    ctaLink: '/signup',
    ctaStyle: 'secondary' as const,
    popular: false,
    accent: 'rgba(34, 197, 94, 0.10)',
    borderColor: 'rgba(34, 197, 94, 0.25)',
    iconColor: '#4ade80',
  },
]

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.pricing-card')
    if (!cards || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
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
      id="pricing"
      ref={sectionRef}
      style={{
        background: '#0b0f1a',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <span className="section-label">// PRICING</span>
        <h2 className="headline-lg" style={{ marginBottom: 'clamp(32px, 6vw, 64px)' }}>
          START FREE. SCALE AS YOU GROW.
        </h2>

        <div ref={cardsRef} className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="pricing-card"
              style={{
                padding: 'clamp(28px, 4vw, 48px) clamp(20px, 3vw, 40px)',
                borderRadius: '20px',
                position: 'relative',
                textAlign: 'left',
                background: plan.popular
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)'
                  : plan.accent,
                border: `1px solid ${plan.popular ? 'rgba(245, 158, 11, 0.5)' : plan.borderColor}`,
                boxShadow: plan.popular
                  ? '0 0 40px rgba(245, 158, 11, 0.08), 0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 4px 24px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              {plan.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0b0f1a',
                    background: '#f59e0b',
                    padding: '4px 16px',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MOST POPULAR
                </span>
              )}

              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '8px',
                }}
              >
                {plan.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '28px' }}>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(40px, 5vw, 52px)',
                    fontWeight: 900,
                    color: plan.popular ? '#f59e0b' : '#f8fafc',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    color: '#94a3b8',
                    marginLeft: '4px',
                  }}
                >
                  {plan.period}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '36px' }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      marginBottom: '14px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                    }}
                  >
                    <Check size={16} color={plan.iconColor} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink}
                className={plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', fontSize: '14px', padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
