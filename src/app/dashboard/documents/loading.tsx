import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Header and Upload button skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-96 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Grid of document card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
                <Skeleton className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Skeleton className="h-3 w-full bg-zinc-200 dark:bg-zinc-800" />
              <Skeleton className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
