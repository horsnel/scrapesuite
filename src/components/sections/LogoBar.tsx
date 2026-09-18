"use client";

export default function LogoBar() {
  const logos = ['ACME CORP', 'DATABRICKS', 'STRIPE', 'LINEAR', 'NOTION']

  return (
    <section
      id="logo-bar"
      style={{
        background: '#f7f3eb',
        padding: '40px 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <p
        style={{
          fontFamily: "'Source Code Pro', monospace",
          fontSize: '11px',
          color: '#64748b',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        TRUSTED BY DATA TEAMS AT
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px',
          flexWrap: 'wrap',
          padding: '0 24px',
        }}
      >
        {logos.map((logo) => (
          <span
            key={logo}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#94a3b8',
              opacity: 0.6,
              letterSpacing: '0.05em',
            }}
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  )
}
