"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  LayoutDashboard,
  Key,
  BarChart3,
  History,
  CreditCard,
  Globe,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  removeToken,
  getCurrentUser,
  decodeUserFromToken,
  type SessionUser,
} from "@/lib/auth-client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Proxy Console", href: "/console", icon: Globe },
  { label: "API Keys", href: "/dashboard/keys", icon: Key },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  /**
   * NO blocking auth gate here. The edge middleware already verified the JWT
   * before this page could be served, so we can render the shell instantly
   * with the user decoded from the token client-side, then refresh in the
   * background. The old full-screen "Loading..." gate waited on /api/auth/me
   * (which triggered cold-start DB init) and redirected to /login on any
   * failure - colliding with the middleware's authed-user bounce-back into
   * /dashboard and producing an infinite loading loop.
   */
  const [user, setUser] = useState<SessionUser | null>(() =>
    decodeUserFromToken()
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const result = await getCurrentUser();
      if (cancelled) return;

      if (result.status === "ok" && result.user) {
        setUser(result.user);
        return;
      }

      // Redirect ONLY on a definitive 401 from the server. Network failures,
      // timeouts and 5xx keep the session - the middleware has already
      // verified the token, so bouncing to /login here would just ping-pong.
      if (result.status === "unauthorized") {
        removeToken();
        router.push("/login");
      }
    };

    refresh();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore - clearing the client cookie is enough
    }
    removeToken();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <span className="font-mono font-bold text-lg text-amber-400">
              SCRAPESUITE
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Plan</span>
            <span className="text-xs font-medium text-amber-400 uppercase">
              {user?.plan || "Free"}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-slate-400 hover:text-white justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header + Sheet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0b0f1a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="font-mono font-bold text-sm text-amber-400">
              SCRAPESUITE
            </span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-[#0b0f1a] border-white/10 w-72 p-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="font-mono font-bold text-amber-400">
                  SCRAPESUITE
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
