import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInvestorSummary, InvestorSummaryData } from "@/actions/profile";
import { UserProfileView } from "@/components/features/user-profile-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let summary: InvestorSummaryData | null = null;
  try {
    summary = await getInvestorSummary();
  } catch (err) {
    console.error("Error loading investor summary:", err);
  }

  // Safe institutional fallback - NEVER redirect authenticated users back to landing page
  if (!summary) {
    const clerkUser = await currentUser().catch(() => null);
    summary = {
      user: {
        id: userId,
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@user.finiq`,
        firstName: clerkUser?.firstName || "Angel",
        lastName: clerkUser?.lastName || "Investor",
        fullName: `${clerkUser?.firstName || "Angel"} ${clerkUser?.lastName || "Investor"}`.trim(),
        imageUrl: clerkUser?.imageUrl || "",
        createdAt: new Date(),
      },
      profile: {
        riskTolerance: "Moderate",
        preferredStage: "Seed",
        interests: ["Fintech", "AI Infrastructure", "SaaS"],
        checkSize: "$25,000 - $50,000",
        targetMarket: "India & US",
        bio: "",
        completionPct: 20,
      },
      stats: {
        quizCount: 0,
        quizAvgPct: 0,
        highestTier: "Associate Scout",
        documentsCount: 0,
        startupsCount: 0,
      },
      investorBadge: {
        title: "Associate Scout",
        level: "Level 1",
        color: "text-orange-500 border-orange-500/30 bg-orange-500/10",
      },
    };
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
            Account Management
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Profile & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your investor identity, syndicate preferences, currency display, and data sovereignty.
        </p>
      </div>

      <UserProfileView summary={summary} />
    </main>
  );
}
