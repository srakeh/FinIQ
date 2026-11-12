import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserQuizHistory } from "@/actions/quiz";
import { QuizEngine } from "@/components/features/quiz-engine";
import { GraduationCap, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const history = await getUserQuizHistory();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Financial Quizzes
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Master angel investing mechanics, term sheets, taxation, and due diligence through AI-powered evaluations.
              </p>
            </div>
          </div>
        </div>

        <Link href="/dashboard/quiz/analytics">
          <Button variant="outline" className="border-zinc-300 dark:border-zinc-700">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
            Performance Analytics
          </Button>
        </Link>
      </div>

      {/* Main Quiz Engine */}
      <QuizEngine initialHistory={history} />
    </div>
  );
}
