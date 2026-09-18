import Link from "next/link";

const posts = [
  {
    slug: "natural-language-scraping",
    title: "Why Natural Language is the Future of Web Scraping",
    excerpt: "CSS selectors break. XPath is brittle. What if you could just describe what you want in English and get structured data back? That is exactly what we built.",
    date: "Jun 5, 2026",
    category: "Engineering",
  },
  {
    slug: "cost-optimizer-deep-dive",
    title: "How Our Cost Optimizer Saves You 60% on API Credits",
    excerpt: "Three-tier caching, content-diff engines, and smart proxy rotation. A deep dive into the architecture that makes ScrapeSuite the most cost-efficient scraping platform.",
    date: "May 28, 2026",
    category: "Product",
  },
  {
    slug: "building-template-marketplace",
    title: "Building the Template Marketplace: 100+ Templates and Counting",
    excerpt: "Battle-tested selectors, built-in retry logic, and automatic pagination. How we built and maintain over 100 community-contributed scraping templates.",
    date: "May 15, 2026",
    category: "Community",
  },
];

export default function BlogPage() {
  return (
    <div className="page-section">
      <div className="page-container">
        <span className="section-label">// BLOG</span>
        <h1 className="page-headline">INSIGHTS & UPDATES</h1>
        <p className="page-subtitle" style={{ marginBottom: '48px' }}>
          Engineering deep dives, product updates, and community stories from the ScrapeSuite team.
        </p>

        <div className="page-grid page-grid-2">
          {posts.map((post) => (
            <div key={post.slug} className="page-card blog-card">
              <span style={{
                fontFamily: "'Source Code Pro', monospace",
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0b0f1a',
                background: '#f59e0b',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '12px',
              }}>
                {post.category}
              </span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#64748b',
                marginTop: '12px',
                display: 'block',
              }}>
                {post.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
