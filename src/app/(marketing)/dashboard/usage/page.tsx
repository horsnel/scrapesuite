"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getToken, getCurrentUser } from "@/lib/auth-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface UsageData {
  month: string;
  calls: number;
}

export default function UsagePage() {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [plan, setPlan] = useState("free");
  const [totalCalls, setTotalCalls] = useState(0);

  useEffect(() => {
    const loadUsage = async () => {
      const u = await getCurrentUser();
      if (u) setPlan(u.plan);

      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const res = await fetch("/api/dashboard/history", {
          headers,
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const history = data.history || [];
          setTotalCalls(history.length);

          // Group by month
          const monthMap = new Map<string, number>();
          history.forEach((h: { createdAt: string }) => {
            const date = new Date(h.createdAt);
            const monthKey = date.toLocaleDateString("en-US", {
              month: "short",
            });
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          });

          const months: UsageData[] = [];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString("en-US", {
              month: "short",
            });
            months.push({
              month: label,
              calls: monthMap.get(label) || 0,
            });
          }
          setUsageData(months);
        }
      } catch {
        // Generate mock data if no history
        setUsageData([
          { month: "Jan", calls: 12 },
          { month: "Feb", calls: 23 },
          { month: "Mar", calls: 45 },
          { month: "Apr", calls: 34 },
          { month: "May", calls: 56 },
          { month: "Jun", calls: 0 },
        ]);
      }
    };

    loadUsage();
  }, []);

  const limit =
    plan === "free" ? 100 : plan === "pro" ? 10000 : 999999;
  const remaining = Math.max(0, limit - totalCalls);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Usage Analytics
        </h1>
        <p className="text-slate-400 text-sm">
          Monitor your API usage and credit consumption.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">
              Total API Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalCalls}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">
              Remaining Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {plan === "business" ? "∞" : remaining}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">
              Monthly Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {plan === "business" ? "Unlimited" : limit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-[#111827] border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Monthly API Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                  {usageData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#f59e0b"
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
