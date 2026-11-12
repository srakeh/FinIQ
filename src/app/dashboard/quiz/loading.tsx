import { Skeleton } from "@/components/ui/skeleton";

export default function QuizLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-80 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Topic Selection Pill Skeletons */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>

      {/* Question Card Skeleton */}
      <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-7 w-5/6 bg-zinc-200 dark:bg-zinc-800" />

        {/* 4 Choice Skeletons */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
          ))}
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-11 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
