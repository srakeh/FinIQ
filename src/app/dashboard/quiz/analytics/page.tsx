import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import { getQuizAnalytics } from "@/actions/quiz";
import QuizAnalyticsLoading from "./loading";
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

// Dynamically import heavy Recharts client component to optimize initial load
const QuizAnalyticsView = nextDynamic(
  () => import("@/components/features/quiz-analytics-view").then((mod) => mod.QuizAnalyticsView),
  {
    loading: () => <QuizAnalyticsLoading />,
  }
);

export default async function QuizAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await getQuizAnalytics();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/quiz"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Quizzes
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Quiz Performance & Analytics
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Historical score progression, topic mastery breakdown, and personalized learning guidance.
              </p>
            </div>
          </div>
        </div>

        <Link href="/dashboard/quiz">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
            Take New Quiz
          </Button>
        </Link>
      </div>

      {/* Analytics Dashboard Component */}
      <QuizAnalyticsView data={data} />
    </div>
  );
}
