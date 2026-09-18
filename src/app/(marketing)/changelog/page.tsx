"use client";

import { useEffect, useRef } from 'react';
import Navigation from '@/components/navigation';
import MetaballCanvas from '@/components/MetaballCanvas';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const entries = [
  {
    date: "June 2026",
    version: "v1.2.0",
    title: "Full SaaS Launch",
    badge: "LATEST",
    changes: [
      "User authentication with JWT and httpOnly cookies",
      "API key management with create, copy, and delete",
      "Paystack payment integration for Pro and Business tiers",
      "Dashboard with usage analytics, scrape history, and billing",
      "Rate limiting tied to pricing tiers",
    ],
  },
  {
    date: "May 2026",
    version: "v1.1.0",
    title: "Interactive Demo & Pricing",
    badge: "SHIPPED",
    changes: [
      "Added interactive URL scraping demo on landing page",
      "Three pricing tiers: Free, Pro ($29/mo), Business ($79/mo)",
      "Animated stat counters with scroll-triggered animations",
      "GSAP ScrollTrigger for staggered card reveals",
      "WebGL Metaball background with Three.js and bloom post-processing",
    ],
  },
  {
    date: "April 2026",
    version: "v1.0.0",
    title: "Initial Launch",
    badge: "LIVE",
    changes: [
      "Landing page with Hero, Features, Testimonials, Roadmap",
      "Natural Language API concept and mock demo",
      "ScrambleText animation for hero heading",
      "Source Code Pro monospace label design system",
      "Responsive mobile navigation with animated hamburger",
    ],
  },
];

export default function ChangelogPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const entries = cardsRef.current?.querySelectorAll('.changelog-entry');
    if (!entries || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(entries,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    const safetyTimer = setTimeout(() => {
      entries.forEach((entry) => {
        gsap.set(entry, { opacity: 1, x: 0 });
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
        <div className="page-container" style={{ maxWidth: '800px' }}>
          <span className="section-label">// CHANGELOG</span>
          <h1 className="page-headline">WHAT WE&apos;VE SHIPPED</h1>
          <p className="page-subtitle" style={{ marginBottom: '56px' }}>
            Built in public. Every feature, every fix, every phase.
          </p>

          <div ref={cardsRef}>
            {entries.map((entry) => (
              <div key={entry.version} className="changelog-entry card-glow" style={{ padding: 'clamp(28px, 4vw, 40px)', borderRadius: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#f59e0b',
                    letterSpacing: '0.04em',
                  }}>
                    {entry.version}
                  </span>
                  <span style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.15)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                  }}>
                    {entry.badge}
                  </span>
                  <span style={{
                    fontFamily: "'Source Code Pro', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    background: 'rgba(148, 163, 184, 0.1)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                  }}>
                    {entry.date}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '20px',
                }}>
                  {entry.title}
                </h2>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {entry.changes.map((change, i) => (
                    <li key={i} style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(14px, 1.5vw, 15px)',
                      color: '#94a3b8',
                      lineHeight: 1.7,
                      marginBottom: '8px',
                      paddingLeft: '24px',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#f59e0b',
                        fontFamily: "'Source Code Pro', monospace",
                        fontWeight: 700,
                      }}>+</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
              Start Building Today
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
