import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInvestorSummary } from "@/actions/profile";
import { UserProfileView } from "@/components/features/user-profile-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const summary = await getInvestorSummary();
  if (!summary) redirect("/");

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile & Preferences
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your investor identity, syndicate preferences, currency display, and data sovereignty.
        </p>
      </div>

      <UserProfileView summary={summary} />
    </main>
  );
}
