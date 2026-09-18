export default function ContactPage() {
  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// CONTACT</span>
        <h1 className="page-headline">GET IN TOUCH</h1>
        <p className="page-subtitle" style={{ marginBottom: '48px' }}>
          Questions, feedback, or partnership inquiries? We would love to hear from you.
        </p>

        <div className="page-grid page-grid-2" style={{ marginBottom: '48px' }}>
          <div className="page-card">
            <h3>General Inquiries</h3>
            <p>hello@scrapesuite.io</p>
          </div>
          <div className="page-card">
            <h3>Enterprise Sales</h3>
            <p>sales@scrapesuite.io</p>
          </div>
          <div className="page-card">
            <h3>Technical Support</h3>
            <p>support@scrapesuite.io</p>
          </div>
          <div className="page-card">
            <h3>Partnerships</h3>
            <p>partners@scrapesuite.io</p>
          </div>
        </div>

        <div className="page-card" style={{ maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '24px' }}>Send us a message</h3>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@company.com" />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Subject</label>
            <input className="form-input" type="text" placeholder="How can we help?" />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={5} placeholder="Tell us more..." style={{ resize: 'vertical' }} />
          </div>
          <button className="btn-primary" style={{ width: '100%' }}>Send Message</button>
        </div>
      </div>
    </div>
  );
}
