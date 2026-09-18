"use client";

import { useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const bullets = [
  'AI-powered selector detection',
  'Returns structured JSON instantly',
  'Works with JavaScript-rendered pages',
]

const mockResults: Record<string, object> = {
  'amazon': {
    status: 'success',
    data: [
      { title: 'Wireless Bluetooth Headphones', price: 29.99, currency: 'USD', rating: 4.5, availability: 'In Stock' },
      { title: 'USB-C Charging Cable 3-Pack', price: 12.49, currency: 'USD', rating: 4.7, availability: 'In Stock' },
      { title: 'Mechanical Keyboard RGB', price: 79.00, currency: 'USD', rating: 4.3, availability: 'Only 3 left' },
    ],
    credits_used: 1,
    response_time_ms: 420,
  },
  'linkedin': {
    status: 'success',
    data: {
      company: 'Acme Corp',
      industry: 'Software Development',
      employees: 1250,
      headquarters: 'San Francisco, CA',
      website: 'acme.dev',
      founded: 2018,
      recent_funding: '$45M Series B',
    },
    credits_used: 1,
    response_time_ms: 680,
  },
  'zillow': {
    status: 'success',
    data: [
      { address: '742 Evergreen Terrace', price: 485000, beds: 3, baths: 2, sqft: 1650, zestimate: 492000 },
      { address: '1600 Pennsylvania Ave', price: 1250000, beds: 5, baths: 3, sqft: 3200, zestimate: 1290000 },
    ],
    credits_used: 1,
    response_time_ms: 540,
  },
  'default': {
    status: 'success',
    data: {
      page_title: 'Example Product Page',
      items_found: 3,
      products: [
        { name: 'Product Alpha', price: 49.99 },
        { name: 'Product Beta', price: 129.00 },
        { name: 'Product Gamma', price: 34.50 },
      ],
      last_updated: '2026-06-06T10:30:00Z',
    },
    credits_used: 1,
    response_time_ms: 380,
  },
}

function getMockResult(url: string): object {
  const lower = url.toLowerCase()
  if (lower.includes('amazon')) return mockResults['amazon']
  if (lower.includes('linkedin')) return mockResults['linkedin']
  if (lower.includes('zillow')) return mockResults['zillow']
  return mockResults['default']
}

function syntaxHighlightJSON(obj: object): string {
  return JSON.stringify(obj, null, 2)
}

export default function Demo() {
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<object | null>(null)
  const [visibleLines, setVisibleLines] = useState(0)

  const codeLines = [
    { text: '> "Scrape all product titles and prices from this URL"', color: '#06b6d4', indent: 0 },
    { text: '', color: '', indent: 0 },
    { text: '{', color: '#f8fafc', indent: 0 },
    { text: '"status": "success",', color: '#94a3b8', indent: 1 },
    { text: '"data": [', color: '#94a3b8', indent: 1 },
    { text: '{', color: '#f8fafc', indent: 2 },
    { text: '"title": "Wireless Bluetooth Headphones",', color: '#fbbf24', indent: 3 },
    { text: '"price": 29.99,', color: '#4ade80', indent: 3 },
    { text: '"currency": "USD"', color: '#4ade80', indent: 3 },
    { text: '},', color: '#f8fafc', indent: 2 },
    { text: '],', color: '#94a3b8', indent: 1 },
    { text: '"credits_used": 1', color: '#94a3b8', indent: 1 },
    { text: '}', color: '#f8fafc', indent: 0 },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1, y: 0 })
      }
    }, 3000)

    return () => {
      ctx.revert()
      clearTimeout(safetyTimer)
    }
  }, [])

  // Typing animation for static preview
  useEffect(() => {
    if (url.trim()) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let currentLine = 0
          const interval = setInterval(() => {
            currentLine++
            setVisibleLines(currentLine)
            if (currentLine >= codeLines.length) {
              clearInterval(interval)
            }
          }, 60)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [url])

  const handleScrape = () => {
    if (!url.trim()) return
    setLoading(true)
    setOutput(null)

    setTimeout(() => {
      const result = getMockResult(url)
      setOutput(result)
      setLoading(false)
    }, 1200 + Math.random() * 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScrape()
    }
  }

  return (
    <section
      id="demo"
      ref={sectionRef}
      style={{
        background: '#f7f3eb',
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 40px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            // TRY IT NOW
          </span>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#0f172a',
              marginBottom: '16px',
            }}
          >
            SCRAPE ANY WEBSITE
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              fontWeight: 400,
              color: '#475569',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Enter a URL below and see the structured output instantly. No API key required for this demo.
          </p>
        </div>

        {/* Input Box */}
        <div className="demo-input-wrapper" style={{ marginBottom: '20px' }}>
          <input
            ref={inputRef}
            type="text"
            className="demo-input"
            placeholder="Enter a URL to scrape (e.g. amazon.com, linkedin.com, zillow.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="demo-input-btn"
            onClick={handleScrape}
            disabled={!url.trim() || loading}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Scraping...
              </span>
            ) : (
              'Scrape'
            )}
          </button>
        </div>

        {/* Output Area */}
        <div className="demo-output">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Connecting to {url}...</span>
            </div>
          ) : output ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <code dangerouslySetInnerHTML={{
                __html: syntaxHighlightJSON(output)
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"([^"]+)":/g, '<span class="demo-output-key">"$1"</span>:')
                  .replace(/: "([^"]*)"/g, ': <span class="demo-output-string">"$1"</span>')
                  .replace(/: (\d+\.?\d*)/g, ': <span class="demo-output-number">$1</span>')
              }} />
            </pre>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Browser Chrome */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <div style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontFamily: "'Source Code Pro', monospace",
                  fontSize: '11px',
                  color: '#64748b',
                }}>
                  scrapesuite.io/api/v1/scrape
                </div>
              </div>
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: `${line.indent * 20}px`,
                    opacity: i < visibleLines ? 1 : 0,
                    transition: 'opacity 0.1s ease',
                    color: line.color || '#94a3b8',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    minHeight: line.text ? undefined : '12px',
                  }}
                >
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '15px',
                        background: '#06b6d4',
                        marginLeft: '2px',
                        verticalAlign: 'text-bottom',
                        animation: 'typing-cursor 1s step-end infinite',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bullets */}
        <div style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          marginTop: '36px',
          flexWrap: 'wrap',
        }}>
          {bullets.map((bullet) => (
            <div
              key={bullet}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={12} color="#f59e0b" strokeWidth={3} />
              </div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  color: '#334155',
                }}
              >
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
