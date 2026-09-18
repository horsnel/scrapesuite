export default function AboutPage() {
  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// ABOUT</span>
        <h1 className="page-headline">BUILT BY DATA PEOPLE, FOR DATA PEOPLE</h1>
        <div className="page-body">
          <p>ScrapeSuite was born from a simple frustration: writing scrapers sucks. Every time a site changes its DOM, your selectors break. Every new competitor site means hours of custom code. We thought there had to be a better way.</p>
          <p>Our founding team spent a combined 15 years building data pipelines at companies like Stripe, Databricks, and Google. We wrote thousands of scrapers, maintained hundreds of fragile selectors, and watched our monitoring dashboards light up every time a website pushed a layout update at 2 AM.</p>
          <p>ScrapeSuite flips the model. Instead of telling the computer HOW to scrape (with selectors and XPath), you tell it WHAT you want in plain English. Our AI pipeline handles the rest: intent classification, selector generation, output validation, and structured JSON delivery.</p>
          <h2>Our Mission</h2>
          <p>Make web data accessible to everyone. No PhD in CSS selectors required. No maintaining fragile scraping code at 3 AM. Just describe what you need and get structured data back.</p>
          <h2>The Team</h2>
          <p>We are a remote-first team of engineers, designers, and data scientists spread across Lagos, San Francisco, London, and Bangalore. We are backed by Y Combinator and angel investors who share our vision of democratizing web data access.</p>
        </div>
      </div>
    </div>
  );
}
