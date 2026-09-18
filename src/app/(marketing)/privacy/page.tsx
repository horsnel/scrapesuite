export default function PrivacyPage() {
  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// LEGAL</span>
        <h1 className="page-headline">PRIVACY POLICY</h1>
        <p className="page-subtitle" style={{ marginBottom: '40px' }}>
          Last updated: June 1, 2026
        </p>
        <div className="legal-body">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, and payment information when you create an account or make a purchase. We also collect usage data including API calls, scrape requests, and interaction patterns with the Service.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to provide and improve the Service, process payments, send important notifications about your account, respond to support requests, and comply with legal obligations. We do not sell your personal data to third parties.</p>
          <h2>3. Data Storage and Security</h2>
          <p>We implement industry-standard security measures to protect your data. All data is encrypted in transit using TLS and at rest using AES-256 encryption. We regularly audit our security practices and infrastructure.</p>
          <h2>4. API Usage Data</h2>
          <p>When you use our API, we log request metadata (URLs scraped, response times, credit usage) to maintain service quality, enforce rate limits, and detect abuse. We do not store the content of your scraped data beyond the delivery window.</p>
          <h2>5. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We use analytics cookies to understand how users interact with our website. You can disable non-essential cookies through your browser settings.</p>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You can export your data or delete your account at any time through the dashboard. For data deletion requests, contact privacy@scrapesuite.io.</p>
          <h2>7. Contact</h2>
          <p>If you have questions about this Privacy Policy, contact us at privacy@scrapesuite.io.</p>
        </div>
      </div>
    </div>
  );
}
