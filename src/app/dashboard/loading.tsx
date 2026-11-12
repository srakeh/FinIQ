import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Header bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-80 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* 3 KPI metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <Skeleton className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Split grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent evaluations column */}
        <div className="col-span-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800" />
                  <Skeleton className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions column */}
        <div className="col-span-3 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
