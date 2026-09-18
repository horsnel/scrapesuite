"use client";

import { useEffect, useState } from "react";
import { Check, Zap, Star, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, getToken } from "@/lib/auth-client";

interface DashUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    icon: Zap,
    features: [
      "100 API calls/month",
      "Basic extraction templates",
      "Email support",
      "1 API key",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    icon: Star,
    popular: true,
    features: [
      "10,000 API calls/month",
      "All extraction templates",
      "Priority support",
      "5 API keys",
      "Custom prompts",
      "Webhook callbacks",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$79",
    period: "/mo",
    icon: Building2,
    features: [
      "Unlimited API calls",
      "All templates + custom",
      "24/7 dedicated support",
      "Unlimited API keys",
      "Custom prompts + AI",
      "Batch API + Webhooks",
      "SLA guarantee",
    ],
  },
];

export default function BillingPage() {
  const [user, setUser] = useState<DashUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      if (u) setUser(u);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleUpgrade = async (plan: string) => {
    if (plan === "free") return;

    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    setUpgrading(plan);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ plan }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authorization_url) {
          // In a real app, redirect to Paystack
          // For demo, simulate upgrade
          alert(
            `In production, you'd be redirected to Paystack to complete payment for the ${plan} plan. For now, your plan will be upgraded for demo purposes.`
          );
          // Simulate upgrade
          if (user) {
            setUser({ ...user, plan });
          }
        }
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Billing</h1>
        <p className="text-slate-400 text-sm">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="bg-[#111827] border-white/5 mb-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white capitalize">
                  {user?.plan || "Free"}
                </span>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  Active
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {user?.plan === "free"
                  ? "100 API calls per month"
                  : user?.plan === "pro"
                    ? "10,000 API calls per month"
                    : "Unlimited API calls"}
              </p>
            </div>
            {user?.plan !== "business" && (
              <Button
                onClick={() => handleUpgrade(user?.plan === "free" ? "pro" : "business")}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                Upgrade Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Compare Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          return (
            <Card
              key={plan.id}
              className={`bg-[#111827] ${
                plan.popular
                  ? "border-amber-500 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]"
                  : "border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="bg-amber-500 text-black text-xs font-bold text-center py-1.5 rounded-t-lg">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <plan.icon className="w-5 h-5 text-amber-400" />
                  <CardTitle className="text-white">
                    {plan.name}
                  </CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-400 text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={
                    isCurrent ||
                    upgrading === plan.id
                  }
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full font-semibold ${
                    isCurrent
                      ? "bg-white/5 text-slate-500"
                      : plan.popular
                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                        : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {isCurrent
                    ? "Current Plan"
                    : upgrading === plan.id
                      ? "Processing..."
                      : plan.id === "free"
                        ? "Downgrade"
                        : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
