import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

/**
 * Answers purely from the verified JWT — no database access at all.
 *
 * The token payload already carries id/email/name/plan, which is everything
 * the dashboard needs. This keeps /api/auth/me instant even on Vercel cold
 * starts (previously it triggered full SQLite init + seeding, which froze
 * the dashboard behind a loading screen for many seconds and could fail on
 * a fresh lambda instance, causing a /login <-> /dashboard redirect loop).
 */
export async function GET(request: Request) {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      plan: user.plan ?? "free",
    },
  });
}
