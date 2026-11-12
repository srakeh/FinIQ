import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-950 p-4 md:p-6 space-y-4">
      {/* Advisor Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36 bg-zinc-800" />
            <Skeleton className="h-3 w-48 bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg bg-zinc-800" />
      </div>

      {/* Chat Messages Stream Skeleton */}
      <div className="flex-1 overflow-y-auto space-y-6 py-4">
        {/* Assistant Message */}
        <div className="flex gap-3 max-w-2xl">
          <Skeleton className="h-8 w-8 rounded-full bg-emerald-950/40 border border-emerald-500/20 shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900 border border-zinc-800" />
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 max-w-xl ml-auto justify-end">
          <Skeleton className="h-12 w-72 rounded-2xl bg-emerald-500/10 border border-emerald-500/20" />
        </div>

        {/* Assistant Response Message */}
        <div className="flex gap-3 max-w-2xl">
          <Skeleton className="h-8 w-8 rounded-full bg-emerald-950/40 border border-emerald-500/20 shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900 border border-zinc-800" />
          </div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="pt-2 border-t border-zinc-800 flex gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl bg-zinc-900 border border-zinc-800" />
        <Skeleton className="h-12 w-24 rounded-xl bg-emerald-500/20" />
      </div>
    </div>
  );
}
