export default function SecurityPage() {
  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// SECURITY</span>
        <h1 className="page-headline">SECURITY AT SCRAPESUITE</h1>
        <p className="page-subtitle" style={{ marginBottom: '48px' }}>
          Security is not a feature we add later. It is a foundation we build on from day one.
        </p>

        <div className="page-grid page-grid-2" style={{ marginBottom: '48px' }}>
          <div className="page-card">
            <h3>Encryption</h3>
            <p>All data encrypted in transit (TLS 1.3) and at rest (AES-256). API keys are hashed using bcrypt. Passwords are never stored in plaintext.</p>
          </div>
          <div className="page-card">
            <h3>Authentication</h3>
            <p>JWT tokens stored in httpOnly cookies. CSRF protection on all state-changing requests. Session expiration and forced re-authentication for sensitive operations.</p>
          </div>
          <div className="page-card">
            <h3>Infrastructure</h3>
            <p>Hosted on Vercel with automatic SSL, DDoS protection, and SOC 2 Type II compliance. Database access restricted to authenticated API routes only.</p>
          </div>
          <div className="page-card">
            <h3>Access Control</h3>
            <p>Principle of least privilege. API keys scoped to individual accounts. Role-based access for team features. Audit logs for all administrative actions.</p>
          </div>
          <div className="page-card">
            <h3>Monitoring</h3>
            <p>24/7 uptime monitoring with automated incident response. Real-time alerting for anomalies in API traffic, error rates, and security events.</p>
          </div>
          <div className="page-card">
            <h3>Responsible Disclosure</h3>
            <p>We appreciate security researchers. Report vulnerabilities to security@scrapesuite.io. We respond within 24 hours and offer bounties for confirmed issues.</p>
          </div>
        </div>

        <div className="legal-body">
          <h2>Responsible Disclosure Policy</h2>
          <p>We are committed to working with the security community to verify and address potential vulnerabilities. If you believe you have discovered a security issue, please report it to security@scrapesuite.io with enough detail to reproduce the issue. We ask that you do not publicly disclose the vulnerability until we have had a reasonable time to address it.</p>
        </div>
      </div>
    </div>
  );
}
