"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0A0A0E", color: "#F4F4F5", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div style={{ maxWidth: "480px", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#F87171",
              }}
            >
              Critical error
            </p>
            <h1 style={{ marginTop: "12px", fontSize: "32px", fontWeight: 700 }}>
              ScrapeSuite hit a snag
            </h1>
            <p style={{ marginTop: "16px", lineHeight: 1.6, color: "#A1A1AA" }}>
              A critical error prevented the app from loading{error?.digest ? ` (ref: ${error.digest})` : ""}.
              Try again — if the problem persists, reload the page.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: "32px",
                height: "44px",
                padding: "0 20px",
                borderRadius: "8px",
                background: "#FBBF24",
                color: "#09090B",
                fontWeight: 600,
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
