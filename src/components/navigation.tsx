"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCurrentUser, getToken, removeToken } from "@/lib/auth-client";

interface NavUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
}

const navLinks = [
  { label: "Product", to: "/#features" },
  { label: "Templates", to: "/templates" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Docs", to: "/docs" },
  { label: "Changelog", to: "/changelog" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getCurrentUser().then((res) => {
        if (res.status === "ok" && res.user) setUser(res.user);
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToSection = (hash: string) => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      return true;
    }
    return false;
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { label: string; to: string }
  ) => {
    const isHash = link.to.includes("#");
    if (isHash) {
      e.preventDefault();
      const hash = "#" + link.to.split("#")[1];
      const found = scrollToSection(hash);
      if (!found) {
        setTimeout(() => scrollToSection(hash), 150);
      }
    }
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 40px)",
          background: scrolled
            ? "rgba(11, 15, 26, 0.95)"
            : "rgba(11, 15, 26, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: scrolled ? "0 4px 24px rgba(0, 0, 0, 0.2)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#f59e0b",
            textDecoration: "none",
          }}
        >
          SCRAPESUITE
        </Link>

        {/* Center Links - Desktop */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="nav-link"
                style={{ display: "none" }}
              >
                Dashboard
              </Link>
              <a
                href="/console"
                className="nav-link"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#94a3b8")
                }
              >
                Proxy Console
              </a>
              <a
                href="/dashboard"
                className="nav-link"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#94a3b8")
                }
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                style={{
                  background: "#f59e0b",
                  color: "#0b0f1a",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fbbf24";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f59e0b";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="nav-link"
                style={{ display: "none" }}
              >
                Login
              </Link>
              <a
                href="/login"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#94a3b8")
                }
              >
                Login
              </a>
              <a
                href="/signup"
                style={{
                  background: "#f59e0b",
                  color: "#0b0f1a",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  padding: "10px 24px",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fbbf24";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f59e0b";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span className="nav-cta-text-desktop">Sign Up Free</span>
                <span className="nav-cta-text-mobile">Start</span>
              </a>
            </>
          )}

          {/* Hamburger Button - Mobile Only */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileOpen ? "open" : ""}`}>
        <div
          style={{
            padding: "80px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className="mobile-menu-link"
            >
              {link.label}
            </Link>
          ))}

          <div
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              marginTop: "16px",
              paddingTop: "16px",
            }}
          >
            {user ? (
              <>
                <Link href="/dashboard" className="mobile-menu-link">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="mobile-menu-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="mobile-menu-link">
                  Login
                </Link>
                <Link href="/signup" className="mobile-menu-link">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
