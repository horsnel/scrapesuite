import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0E] px-6 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Zap className="h-8 w-8 text-amber-400" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400/80">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          This page got scraped off the map
        </h1>
        <p className="mt-4 leading-relaxed text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or was moved. Double-check the
          URL — or head back and try another route.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/console"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4" />
            Open Proxy Console
          </Link>
        </div>
      </div>
    </main>
  );
}
