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

export async function getCurrentUser() {
  try {
    // The /api/auth/me endpoint reads both the Authorization header
    // and the httpOnly cookie automatically sent by the browser
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch("/api/auth/me", {
      headers,
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}
