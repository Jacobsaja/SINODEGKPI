"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface p-5 shadow-sm animate-pulse">
      <div className="h-44 w-full rounded-xl bg-slate-200 dark:bg-slate-700/50 mb-4" />
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-20 rounded-full bg-slate-200 dark:bg-slate-700/50" />
        <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700/50" />
      </div>
      <div className="h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700/50 mb-2" />
      <div className="h-4 w-full rounded-md bg-slate-200 dark:bg-slate-700/50 mb-1" />
      <div className="h-4 w-2/3 rounded-md bg-slate-200 dark:bg-slate-700/50" />
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/40">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700/50" />
        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700/50" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
