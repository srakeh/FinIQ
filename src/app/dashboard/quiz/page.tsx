import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserQuizHistory } from "@/actions/quiz";
import { QuizEngine } from "@/components/features/quiz-engine";
import { GraduationCap } from "lucide-react";

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
      </div>

      {/* Main Quiz Engine */}
      <QuizEngine initialHistory={history} />
    </div>
  );
}
