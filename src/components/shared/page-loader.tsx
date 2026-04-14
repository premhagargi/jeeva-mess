"use client";

import { useStore } from "@/hooks/use-store";

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-7 w-48" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border p-4 space-y-3">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-6 w-12" />
            <Shimmer className="h-2 w-28" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-border p-4 space-y-3">
            <div className="flex justify-between">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-16" />
            </div>
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function useDataReady() {
  const { dataLoading, authLoading } = useStore();
  return !dataLoading && !authLoading;
}
