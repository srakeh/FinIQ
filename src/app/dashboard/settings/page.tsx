import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInvestmentProfile } from "@/actions/profile";
import { InvestmentProfileForm } from "@/components/features/investment-profile-form";
import { UserButton } from "@clerk/nextjs";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getInvestmentProfile();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Settings
      </h1>

      {/* Account Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Account
        </h2>
        <p className="text-sm text-zinc-500">
          Manage your account settings and authentication.
        </p>
        <div className="pt-2">
          <UserButton
            appearance={{
              elements: {
                rootBox: "w-full",
                userButtonTrigger: "w-full justify-start",
              },
            }}
          />
        </div>
      </div>

      {/* Investment Profile Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Investor Profile
          </h2>
          <p className="text-sm text-zinc-500">
            Configure your investment preferences to receive personalized
            startup recommendations.
          </p>
        </div>
        <InvestmentProfileForm
          existingProfile={
            profile
              ? {
                  riskTolerance: profile.riskTolerance,
                  preferredStage: profile.preferredStage,
                  interests: profile.interests,
                }
              : null
          }
        />
      </div>
    </main>
  );
}
