import { Skeleton } from "@/components/ui/skeleton";

export default function QuizAnalyticsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen max-w-6xl mx-auto">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* 4 Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-5 w-5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <Skeleton className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* 2 Chart Skeletons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <Skeleton className="h-5 w-44 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-3.5 w-64 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-[260px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/40" />
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <Skeleton className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-3.5 w-60 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-[260px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/40" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
        <Skeleton className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
