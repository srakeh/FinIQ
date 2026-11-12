import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendationsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Thesis Profile Banner */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Matches Grid */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-52 bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800" />
                  <Skeleton className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <Skeleton className="h-7 w-14 rounded-md bg-emerald-500/10" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
                <Skeleton className="h-3 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
