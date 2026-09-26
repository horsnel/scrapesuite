"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0E] px-6 text-zinc-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400/80">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          The job failed mid-scrape
        </h1>
        <p className="mt-4 leading-relaxed text-zinc-400">
          An unexpected error occurred while rendering this page. It has been logged —
          try again, and if it keeps happening, head back home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
