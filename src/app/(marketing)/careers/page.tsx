export default function CareersPage() {
  const roles = [
    { title: "Senior Backend Engineer", location: "Remote", team: "Engineering" },
    { title: "AI/ML Engineer — NLP", location: "Remote", team: "AI" },
    { title: "Frontend Engineer — React/Next.js", location: "Remote", team: "Engineering" },
    { title: "Developer Advocate", location: "Remote", team: "Community" },
    { title: "Product Designer", location: "Remote", team: "Design" },
  ];

  return (
    <div className="page-section">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <span className="section-label">// CAREERS</span>
        <h1 className="page-headline">HELP US BUILD THE FUTURE OF WEB DATA</h1>
        <p className="page-subtitle" style={{ marginBottom: '48px' }}>
          Remote-first. Async-friendly. Building tools that thousands of developers rely on every day.
        </p>

        <div className="page-body" style={{ marginBottom: '48px' }}>
          <p>We are a small, focused team that ships fast and cares deeply about developer experience. Every line of code we write helps someone extract the data they need without wrestling with broken selectors at 3 AM.</p>
          <p>We offer competitive salaries, equity, unlimited PTO, and a culture that respects deep work. No meetings that could have been emails. No standups that could have been Slack threads.</p>
        </div>

        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(20px, 2.5vw, 28px)',
          fontWeight: 700,
          color: '#f8fafc',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
        }}>
          Open Positions
        </h2>

        <div className="page-grid" style={{ gap: '16px' }}>
          {roles.map((role) => (
            <div key={role.title} className="page-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3>{role.title}</h3>
                <p style={{ marginBottom: 0 }}>{role.team}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'Source Code Pro', monospace",
                  fontSize: '11px',
                  color: '#64748b',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}>
                  {role.location}
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#f59e0b',
                  cursor: 'pointer',
                }}>
                  Apply →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
