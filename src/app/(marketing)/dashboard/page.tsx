"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  Activity,
  CreditCard,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, fetchWithTimeout } from "@/lib/auth-client";
import { DashboardSkeleton } from "@/components/dashboard-skeletons";

interface DashUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
}

interface ScrapeRecord {
  id: string;
  url: string;
  status: string;
  creditsUsed: number;
  responseMs: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashUser | null>(null);
  const [recentScrapes, setRecentScrapes] = useState<ScrapeRecord[]>([]);
  const [stats, setStats] = useState({
    totalScrapes: 0,
    creditsUsed: 0,
    remaining: 100,
    limit: 100,
  });

  const [ready, setReady] = useState(false);

  const loadData = useCallback(async () => {
    // /api/auth/me answers from the JWT alone - fast on any cold start.
    const { status, user: u } = await getCurrentUser();
    if (status === "ok" && u) setUser(u);

    // Fetch scrape history with a hard timeout so a hung request can never
    // leave the page blank; on failure the empty state simply stays.
    try {
      const res = await fetchWithTimeout("/api/dashboard/history", {
        credentials: "include",
      });
      if (res && res.ok) {
        const data = await res.json();
        setRecentScrapes((data.history || []).slice(0, 5));
        setStats({
          totalScrapes: data.history?.length || 0,
          creditsUsed: data.history?.reduce(
            (sum: number, h: ScrapeRecord) => sum + h.creditsUsed,
            0
          ) || 0,
          remaining:
            (u?.plan === "free"
              ? 100
              : u?.plan === "pro"
                ? 10000
                : 999999) -
            (data.history?.length || 0),
          limit:
            u?.plan === "free"
              ? 100
              : u?.plan === "pro"
                ? 10000
                : 999999,
        });
      }
    } catch {
      // Silently handle - dashboard API might not exist yet
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  if (!ready) {
    // Branded skeleton instead of a spinner - matches the final layout so
    // there is no jarring swap when the data arrives.
    return <DashboardSkeleton />;
  }

  const planLabel =
    user?.plan === "pro"
      ? "Pro"
      : user?.plan === "business"
        ? "Business"
        : "Free";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {displayName}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here&apos;s what&apos;s happening with your ScrapeSuite account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Scrapes
            </CardTitle>
            <Activity className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalScrapes}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Credits Used
            </CardTitle>
            <Zap className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.creditsUsed}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Credits Remaining
            </CardTitle>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.remaining < 0 ? 0 : stats.remaining}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Current Plan
            </CardTitle>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                {planLabel}
              </span>
              {user?.plan === "free" && (
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                  Upgrade
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#111827] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentScrapes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No scrape activity yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Make your first API call to see activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScrapes.map((scrape) => (
                <div
                  key={scrape.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      {scrape.url}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(scrape.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        scrape.status === "success"
                          ? "border-green-500/30 text-green-400"
                          : "border-red-500/30 text-red-400"
                      }
                    >
                      {scrape.status}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {scrape.responseMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
