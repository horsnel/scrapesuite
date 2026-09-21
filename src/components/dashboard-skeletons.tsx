"use client";

import { cn } from "@/lib/utils";

/** A single shimmering placeholder block in the dashboard's dark theme. */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/[0.07]", className)}
    />
  );
}

/**
 * Skeleton for the dashboard overview page: heading + 4 stat cards + a
 * recent-activity table. Rendered instantly while background data loads,
 * replacing the old full-screen spinner gate.
 */
export function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-7 w-64" />
        <SkeletonBar className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/5 bg-[#111827] p-6"
          >
            <div className="flex items-center justify-between pb-2">
              <SkeletonBar className="h-4 w-24" />
              <SkeletonBar className="h-4 w-4 rounded-full" />
            </div>
            <SkeletonBar className="h-8 w-16 mt-2" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/5 bg-[#111827]">
        <div className="p-6 pb-2">
          <SkeletonBar className="h-5 w-32" />
        </div>
        <div className="p-6 pt-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1.5 flex-1 max-w-sm">
                <SkeletonBar className="h-4 w-full" />
                <SkeletonBar className="h-3 w-20" />
              </div>
              <SkeletonBar className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Generic inline skeleton used by the keys / history / billing sub-pages. */
export function ContentSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8 space-y-2">
        <SkeletonBar className="h-7 w-40" />
        <SkeletonBar className="h-4 w-72" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-[#111827] px-5 py-4"
          >
            <div className="space-y-1.5 flex-1 max-w-xs">
              <SkeletonBar className="h-4 w-full" />
              <SkeletonBar className="h-3 w-24" />
            </div>
            <SkeletonBar className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
