import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInvestmentProfile } from "@/actions/profile";
import { RecommendationEngine } from "@/components/features/recommendation-engine";
import { InvestmentProfileForm } from "@/components/features/investment-profile-form";
import Link from "next/link";
import { Settings, UserCircle } from "lucide-react";

export const maxDuration = 60;

export default async function RecommendationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getInvestmentProfile();

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Investment Recommendations
        </h1>
        <p className="text-zinc-500 mt-1">
          AI-matched startup opportunities based on your risk profile and sector interests.
        </p>
      </div>

      {!profile ? (
        /* No profile yet — show inline setup */
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
            <UserCircle className="h-5 w-5 shrink-0" />
            <p>
              Set up your investor profile below to get personalized recommendations.
              You can update it anytime from{" "}
              <Link
                href="/dashboard/settings"
                className="underline font-medium hover:text-amber-700"
              >
                Settings
              </Link>
              .
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              Investor Profile
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Tell us your investment preferences so we can match you with the right startups.
            </p>
            <InvestmentProfileForm existingProfile={null} />
          </div>
        </div>
      ) : (
        /* Profile exists — show profile summary + recommendations */
        <div className="space-y-6">
          {/* Profile Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-zinc-500">
                Risk:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profile.riskTolerance}
                </span>
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-zinc-500">
                Stage:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profile.preferredStage}
                </span>
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-zinc-500">
                Interests:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profile.interests.join(", ")}
                </span>
              </span>
            </div>
            <Link
              href="/dashboard/settings"
              className="shrink-0 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" /> Edit Profile
            </Link>
          </div>

          {/* Recommendation Engine */}
          <RecommendationEngine />
        </div>
      )}
    </main>
  );
}
