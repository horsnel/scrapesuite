export default function TermsPage() {
  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// LEGAL</span>
        <h1 className="page-headline">TERMS OF SERVICE</h1>
        <p className="page-subtitle" style={{ marginBottom: '40px' }}>
          Last updated: June 1, 2026
        </p>
        <div className="legal-body">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using ScrapeSuite (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.</p>
          <h2>2. Description of Service</h2>
          <p>ScrapeSuite provides a web scraping API that allows users to extract structured data from websites using natural language prompts and pre-built templates. The Service includes API access, a template marketplace, price monitoring, change detection, and related features.</p>
          <h2>3. User Accounts</h2>
          <p>You must create an account to use the Service. You are responsible for safeguarding your API keys and account credentials. You agree not to share your credentials with third parties. You must be at least 18 years old to create an account.</p>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service for any illegal or unauthorized purpose. You must not attempt to scrape websites that explicitly prohibit scraping in their terms of service or robots.txt. You are responsible for ensuring your use of the Service complies with all applicable laws and regulations.</p>
          <h2>5. Pricing and Payments</h2>
          <p>Paid plans are billed monthly through Paystack. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with 30 days notice. Free tier usage is subject to rate limits as described on our pricing page.</p>
          <h2>6. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are owned by ScrapeSuite and are protected by international copyright, trademark, and other intellectual property laws. Your scraped data belongs to you.</p>
          <h2>7. Limitation of Liability</h2>
          <p>ScrapeSuite shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you in the preceding 12 months.</p>
        </div>
      </div>
    </div>
  );
}
