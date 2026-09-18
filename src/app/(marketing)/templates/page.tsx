"use client";

import { useEffect, useRef } from 'react';
import Navigation from '@/components/navigation';
import MetaballCanvas from '@/components/MetaballCanvas';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Building2, Home, Twitter, Rocket, TrendingUp, Search, Newspaper, MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const templates = [
  {
    name: "Amazon Product",
    category: "E-Commerce",
    icon: ShoppingCart,
    description: "Extract product title, price, rating, reviews, and availability from any Amazon product page.",
    fields: ["title", "price", "rating", "reviews_count", "availability", "images"],
    endpoint: "amazon_product",
  },
  {
    name: "LinkedIn Company",
    category: "Social",
    icon: Building2,
    description: "Scrape company name, industry, size, headquarters, and recent funding from LinkedIn company pages.",
    fields: ["company", "industry", "employees", "headquarters", "funding"],
    endpoint: "linkedin_company",
  },
  {
    name: "Zillow Listing",
    category: "Real Estate",
    icon: Home,
    description: "Get property details including price, beds, baths, square footage, and Zestimate from Zillow.",
    fields: ["address", "price", "beds", "baths", "sqft", "zestimate"],
    endpoint: "zillow_listing",
  },
  {
    name: "Twitter/X Profile",
    category: "Social",
    icon: Twitter,
    description: "Extract profile bio, follower count, following count, and recent tweets from any public profile.",
    fields: ["username", "bio", "followers", "following", "tweet_count"],
    endpoint: "twitter_profile",
  },
  {
    name: "Product Hunt",
    category: "Tech",
    icon: Rocket,
    description: "Scrape product name, tagline, upvote count, and comment count from Product Hunt listings.",
    fields: ["name", "tagline", "upvotes", "comments", "url"],
    endpoint: "producthunt",
  },
  {
    name: "Crunchbase Company",
    category: "Business",
    icon: TrendingUp,
    description: "Get company details, funding rounds, investors, and acquisition data from Crunchbase.",
    fields: ["company", "total_funding", "stages", "investors", "acquisitions"],
    endpoint: "crunchbase_company",
  },
  {
    name: "Google Search Results",
    category: "Search",
    icon: Search,
    description: "Extract search result titles, URLs, and descriptions from Google search result pages.",
    fields: ["title", "url", "description", "position"],
    endpoint: "google_search",
  },
  {
    name: "News Article",
    category: "Media",
    icon: Newspaper,
    description: "Scrape article headline, author, publish date, body text, and images from news sites.",
    fields: ["headline", "author", "date", "body", "image_url"],
    endpoint: "news_article",
  },
  {
    name: "Yelp Business",
    category: "Local",
    icon: MapPin,
    description: "Extract business name, rating, review count, address, and hours from Yelp listing pages.",
    fields: ["name", "rating", "review_count", "address", "hours"],
    endpoint: "yelp_business",
  },
];

export default function TemplatesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.template-card');
    if (!cards || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    const safetyTimer = setTimeout(() => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 });
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
          <span className="section-label">// TEMPLATE MARKETPLACE</span>
          <h1 className="page-headline">100+ READY-MADE TEMPLATES</h1>
          <p className="page-subtitle" style={{ marginBottom: '56px' }}>
            Pre-built scraping templates for popular websites. Copy, paste, run. No selectors needed.
          </p>

          <div ref={cardsRef} className="page-grid page-grid-3">
            {templates.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.name} className="page-card template-card card-glow" style={{ padding: 'clamp(24px, 3vw, 36px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.1)',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}>
                      {t.category}
                    </span>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={18} color="#f59e0b" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '8px' }}>{t.name}</h3>
                  <p style={{ marginBottom: '16px', fontSize: 'clamp(13px, 1.3vw, 14px)' }}>{t.description}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {t.fields.slice(0, 4).map((field) => (
                      <code key={field} style={{
                        fontFamily: "'Source Code Pro', monospace",
                        fontSize: '11px',
                        color: '#f59e0b',
                        background: 'rgba(245, 158, 11, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                      }}>
                        {field}
                      </code>
                    ))}
                    {t.fields.length > 4 && (
                      <code style={{
                        fontFamily: "'Source Code Pro', monospace",
                        fontSize: '11px',
                        color: '#64748b',
                        background: 'rgba(100, 116, 139, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                      }}>
                        +{t.fields.length - 4} more
                      </code>
                    )}
                  </div>

                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: '11px',
                      color: '#64748b',
                    }}>template:</span>
                    <code style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: '12px',
                      color: '#22c55e',
                      background: 'rgba(34, 197, 94, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}>
                      {t.endpoint}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '56px', textAlign: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
              Start Using Templates
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
