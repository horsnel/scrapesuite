import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "scrapesuite_token";
// Must match the JWT_SECRET fallback in src/lib/auth.ts
const JWT_SECRET = process.env.JWT_SECRET || "scrapesuite-secret-key";

/** Route prefixes that require an authenticated session (the logged-in designs). */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/console",
  "/proxy",
  "/marketplace",
  "/jobs",
  "/analytics",
  "/settings",
];

function base64UrlToBytes(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verify the HS256 JWT issued by /api/auth/login (src/lib/auth.ts).
 * Returns the decoded payload (email, name, plan) or null.
 */
async function verifySessionToken(
  token: string | undefined
): Promise<{ email: string; name?: string; plan?: string } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  // Only accept HS256
  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(headerB64)));
    if (header.alg !== "HS256") return null;
  } catch {
    return null;
  }

  // Check expiry from the payload
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) return null;

    // Verify HMAC-SHA256 signature over `header.payload`
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    );
    const expectedBase64Url = btoa(String.fromCharCode(...new Uint8Array(mac)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    if (signatureB64 !== expectedBase64Url) return null;

    return { email: payload.email, name: payload.name, plan: payload.plan };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const user = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  // Authenticated users hitting the login page go straight to their dashboard.
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  // Unauthenticated visitors are bounced to the visitor design's login page.
  if (isProtected && !user) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/console/:path*",
    "/proxy/:path*",
    "/marketplace/:path*",
    "/jobs/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/login",
  ],
};
