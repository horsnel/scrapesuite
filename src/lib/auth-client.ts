export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
}

export function setToken(token: string) {
  document.cookie = `scrapesuite_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=lax`;
}

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((c) => c.startsWith("scrapesuite_token="));
  if (!tokenCookie) return null;
  return tokenCookie.split("=").slice(1).join("=");
}

export function removeToken() {
  document.cookie = "scrapesuite_token=; path=/; max-age=0";
}

/**
 * Decode the JWT payload client-side WITHOUT verification.
 * Safe for instant UI hydration: the server-side middleware already verified
 * the signature before the page was served, so anything this returns about an
 * authenticated page view is trustworthy. The authoritative check still
 * happens server-side on every API call.
 */
export function decodeUserFromToken(): SessionUser | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payloadB64 = token.split(".")[1];
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json) as {
      id?: string;
      email?: string;
      name?: string | null;
      plan?: string;
      exp?: number;
    };
    if (!payload.id || !payload.email) return null;
    if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name ?? null,
      plan: payload.plan ?? "free",
    };
  } catch {
    return null;
  }
}

/**
 * fetch with a hard timeout so a hung serverless function can never freeze
 * the UI behind an endless spinner. Retries once on network failure /
 * timeout (Vercel cold starts occasionally drop the first connection).
 * Returns null when the request ultimately fails.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      // A definitive server answer (even 4xx/5xx) is returned as-is.
      return res;
    } catch {
      // Network error or abort - retry once, then give up.
      if (attempt === 1) return null;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export interface MeResult {
  /** null = network failure / timeout; "unauthorized" = definitively logged out */
  status: "ok" | "unauthorized" | "unreachable";
  user: SessionUser | null;
}

export async function getCurrentUser(): Promise<MeResult> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetchWithTimeout("/api/auth/me", {
    headers,
    credentials: "include",
  });

  if (!res) return { status: "unreachable", user: null };
  if (res.status === 401) return { status: "unauthorized", user: null };
  if (!res.ok) return { status: "unreachable", user: null };

  try {
    const data = await res.json();
    return { status: "ok", user: data.user || null };
  } catch {
    return { status: "unreachable", user: null };
  }
}
