import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen max-w-5xl mx-auto">
      {/* Hero Profile Banner Skeleton */}
      <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-4 w-60 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* 4 KPI summary cards inside banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs List Skeleton */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <Skeleton className="h-9 w-44 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-9 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-9 w-44 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Form Content Skeleton */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-24 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="flex justify-end pt-2">
          <Skeleton className="h-10 w-36 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
