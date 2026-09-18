"use client";

import Link from 'next/link'

export default function CTAFooter() {
  return (
    <footer
      id="cta"
      style={{
        background: '#f7f3eb',
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px) 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* CTA Block */}
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(28px, 5vw, 56px)',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#0f172a',
            marginBottom: '24px',
          }}
        >
          READY TO STOP WRITING SCRAPERS?
        </h2>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 400,
            color: '#475569',
            marginBottom: '40px',
            padding: '0 16px',
          }}
        >
          Start with 100 free API calls. No credit card required.
        </p>

        <Link
          href="/signup"
          className="btn-primary"
          style={{ fontSize: 'clamp(16px, 2vw, 18px)', padding: '16px 40px', textDecoration: 'none' }}
        >
          Get Started Free
        </Link>
      </div>

      {/* Footer Links */}
      <div
        style={{
          maxWidth: '1200px',
          margin: 'clamp(60px, 8vw, 100px) auto 0',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '48px 0 0',
        }}
      >
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Source Code Pro', monospace",
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '12px',
              }}
            >
              SCRAPESUITE
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                color: '#64748b',
                lineHeight: 1.6,
              }}
            >
              The smarter way to scrape the web.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="footer-heading">Product</div>
            <Link href="/#features" className="footer-link">Features</Link>
            <Link href="/templates" className="footer-link">Templates</Link>
            <Link href="/#pricing" className="footer-link">Pricing</Link>
            <Link href="/docs" className="footer-link">Docs</Link>
            <Link href="/changelog" className="footer-link">Changelog</Link>
          </div>

          {/* Company */}
          <div>
            <div className="footer-heading">Company</div>
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
            <Link href="/careers" className="footer-link">Careers</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>

          {/* Legal */}
          <div>
            <div className="footer-heading">Legal</div>
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/security" className="footer-link">Security</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: '48px',
            padding: '24px 0',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 400,
              color: '#94a3b8',
            }}
          >
            2026 ScrapeSuite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
