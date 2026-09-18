"use client";

import { useEffect, useRef } from 'react';
import Navigation from '@/components/navigation';
import MetaballCanvas from '@/components/MetaballCanvas';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Key, MessageSquare, LayoutGrid, Gauge, Webhook } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const topics = [
  {
    icon: Zap,
    title: 'Quick Start',
    description: 'Get up and running in under 5 minutes. Create an API key, make your first request, and parse the response.',
    endpoint: 'POST /v1/scrape',
  },
  {
    icon: Key,
    title: 'Authentication',
    description: 'Authenticate requests using your API key in the Authorization header. All requests require a valid key.',
    endpoint: 'Authorization: Bearer sk_...',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language API',
    description: 'Send a URL and a natural language prompt. Our AI extracts exactly the data you describe in plain English.',
    endpoint: 'POST /v1/scrape',
  },
  {
    icon: LayoutGrid,
    title: 'Template API',
    description: 'Use pre-built templates for popular sites like Amazon, LinkedIn, and Zillow. Just pass the template ID and URL.',
    endpoint: 'POST /v1/template',
  },
  {
    icon: Gauge,
    title: 'Rate Limiting',
    description: 'Free tier: 100 requests/month. Pro: 10,000/month. Business: unlimited. Rate limit headers included in every response.',
    endpoint: 'X-RateLimit-Remaining',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Configure webhook endpoints to receive real-time notifications when scraping jobs complete or data changes.',
    endpoint: 'POST /v1/webhooks',
  },
];

export default function DocsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.doc-card');
    if (!cards || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animate code blocks
      const codeBlocks = codeRef.current?.querySelectorAll('.docs-code-block');
      if (codeBlocks) {
        gsap.fromTo(codeBlocks,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: codeRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    const safetyTimer = setTimeout(() => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
      const codeBlocks = codeRef.current?.querySelectorAll('.docs-code-block');
      codeBlocks?.forEach((block) => {
        gsap.set(block, { opacity: 1, y: 0 });
      });
    }, 3000);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      ctx.revert();
      clearTimeout(safetyTimer);
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <MetaballCanvas />
      <Navigation />
      <div className="page-section" ref={sectionRef}>
        <div className="page-container">
          <span className="section-label">// DOCUMENTATION</span>
          <h1 className="page-headline">API DOCUMENTATION</h1>
          <p className="page-subtitle" style={{ marginBottom: '56px' }}>
            Everything you need to integrate ScrapeSuite into your workflow.
          </p>

          <div ref={cardsRef} className="page-grid page-grid-2" style={{ marginBottom: '56px' }}>
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div key={topic.title} className="page-card card-glow doc-card" style={{ padding: 'clamp(28px, 4vw, 40px)' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <Icon size={24} color="#f59e0b" strokeWidth={1.5} />
                  </div>
                  <h3>{topic.title}</h3>
                  <p style={{ marginBottom: '16px' }}>{topic.description}</p>
                  <code style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '12px',
                    color: '#f59e0b',
                    background: 'rgba(245, 158, 11, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}>
                    {topic.endpoint}
                  </code>
                </div>
              );
            })}
          </div>

          <div ref={codeRef}>
            <div style={{ marginBottom: '32px' }}>
              <span className="section-label" style={{ marginBottom: '20px' }}>// EXAMPLE REQUEST</span>
              <div className="docs-code-block card-glow">
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}>POST</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                    https://api.scrapesuite.io/v1/scrape
                  </span>
                </div>
{`curl -X POST https://api.scrapesuite.io/v1/scrape \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://amazon.com/dp/B09...",
    "prompt": "Get product title, price, and rating"
  }'`}
              </div>
            </div>

            <div>
              <span className="section-label" style={{ marginBottom: '20px' }}>// EXAMPLE RESPONSE</span>
              <div className="docs-code-block card-glow">
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}>200 OK</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>application/json</span>
                </div>
{`{
  "status": "success",
  "data": {
    "title": "Wireless Bluetooth Headphones",
    "price": 29.99,
    "currency": "USD",
    "rating": 4.5,
    "availability": "In Stock"
  },
  "credits_used": 1,
  "response_time_ms": 420
}`}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '56px', textAlign: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
              Get Your API Key
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
