"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InvestorProfileSchema } from "@/lib/validations";

// Ensure the internal User record exists (Clerk → Prisma bridge)
export async function ensureDbUser(clerkId: string) {
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    const clerkUser = await currentUser();
    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email:
          clerkUser?.emailAddresses[0]?.emailAddress ||
          `${clerkId}@user.finiq`,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
      },
    });
  }

  return dbUser;
}

export async function getInvestmentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const dbUser = await ensureDbUser(userId);

    const profile = await prisma.investmentProfile.findUnique({
      where: { userId: dbUser.id },
    });

    return profile;
  } catch (error) {
    console.error("Failed to fetch investment profile:", error);
    return null;
  }
}

export async function saveInvestmentProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const riskTolerance = (formData.get("riskTolerance") as string) || "Moderate";
  const preferredStage = (formData.get("preferredStage") as string) || "Seed";
  const interestsRaw = (formData.get("interests") as string) || "";
  const checkSize = (formData.get("checkSize") as string) || "$25k - $50k";
  const targetMarket = (formData.get("targetMarket") as string) || "India & US";
  const bio = (formData.get("bio") as string) || "";

  // Parse comma-separated interests into an array
  const interests = interestsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (interests.length === 0) {
    return { error: "Please select at least one sector interest." };
  }

  const profileValidation = InvestorProfileSchema.safeParse({
    riskTolerance,
    preferredStage,
    checkSize,
    targetMarket,
    interests,
    bio,
  });

  if (!profileValidation.success) {
    return {
      error:
        profileValidation.error.issues[0]?.message ||
        "Invalid profile configuration",
    };
  }

  try {
    const dbUser = await ensureDbUser(userId);

    await prisma.investmentProfile.upsert({
      where: { userId: dbUser.id },
      update: {
        riskTolerance,
        preferredStage,
        interests,
        checkSize,
        targetMarket,
        bio,
      },
      create: {
        userId: dbUser.id,
        riskTolerance,
        preferredStage,
        interests,
        checkSize,
        targetMarket,
        bio,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/recommendations");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Save profile error:", error);
    return { error: error?.message || "Failed to save profile" };
  }
}

export interface InvestorSummaryData {
  user: {
    id: string;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    imageUrl: string;
    createdAt: Date;
  };
  profile: {
    riskTolerance: string;
    preferredStage: string;
    interests: string[];
    checkSize: string;
    targetMarket: string;
    bio: string;
    completionPct: number;
  };
  stats: {
    quizCount: number;
    quizAvgPct: number;
    highestTier: string;
    documentsCount: number;
    startupsCount: number;
  };
  investorBadge: {
    title: string;
    level: string;
    color: string;
  };
}

export async function getInvestorSummary(): Promise<InvestorSummaryData | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const clerkUserPromise = currentUser().catch(() => null);
    const dbUserPromise = ensureDbUser(userId);

    const [clerkUser, dbUser] = await Promise.all([
      clerkUserPromise,
      dbUserPromise,
    ]);

    const [profile, quizAttempts, docCount, startupCount] = await Promise.all([
      prisma.investmentProfile.findUnique({ where: { userId: dbUser.id } }),
      prisma.quizAttempt.findMany({ where: { userId: dbUser.id } }),
      prisma.document.count({ where: { userId } }),
      prisma.startup.count({ where: { userId: dbUser.id } }),
    ]);

    // Calculate quiz stats
    const quizCount = quizAttempts.length;
    let quizAvgPct = 0;
    if (quizCount > 0) {
      const totalPct = quizAttempts.reduce(
        (acc, q) => acc + Math.round((q.score / q.totalScore) * 100),
        0
      );
      quizAvgPct = Math.round(totalPct / quizCount);
    }

    // Determine Investor Tier Badge
    let badgeTitle = "Associate Scout";
    let badgeLevel = "Level 1";
    let badgeColor = "text-zinc-500 border-zinc-500/30 bg-zinc-500/10";

    if (quizAvgPct >= 80 && quizCount >= 3) {
      badgeTitle = "Managing General Partner";
      badgeLevel = "Level 4 (Elite)";
      badgeColor = "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    } else if (quizAvgPct >= 65 || quizCount >= 2) {
      badgeTitle = "Principal Venture Partner";
      badgeLevel = "Level 3 (Advanced)";
      badgeColor = "text-blue-500 border-blue-500/30 bg-blue-500/10";
    } else if (profile || quizCount >= 1) {
      badgeTitle = "Accredited Angel";
      badgeLevel = "Level 2 (Active)";
      badgeColor = "text-purple-500 border-purple-500/30 bg-purple-500/10";
    }

    // Profile completion %
    let completionScore = 0;
    if (profile?.riskTolerance) completionScore += 20;
    if (profile?.preferredStage) completionScore += 20;
    if (profile?.interests && profile.interests.length > 0) completionScore += 20;
    if (profile?.checkSize) completionScore += 20;
    if (profile?.bio) completionScore += 20;

    return {
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        firstName: dbUser.firstName || clerkUser?.firstName || "Investor",
        lastName: dbUser.lastName || clerkUser?.lastName || "",
        fullName:
          `${dbUser.firstName || clerkUser?.firstName || "Investor"} ${
            dbUser.lastName || clerkUser?.lastName || ""
          }`.trim(),
        imageUrl: clerkUser?.imageUrl || "",
        createdAt: dbUser.createdAt,
      },
      profile: {
        riskTolerance: profile?.riskTolerance || "Moderate",
        preferredStage: profile?.preferredStage || "Seed",
        interests: profile?.interests || ["Fintech", "AI / ML"],
        checkSize: profile?.checkSize || "$25k - $50k",
        targetMarket: profile?.targetMarket || "India & US",
        bio: profile?.bio || "",
        completionPct: completionScore,
      },
      stats: {
        quizCount,
        quizAvgPct,
        highestTier: badgeTitle,
        documentsCount: docCount,
        startupsCount: startupCount,
      },
      investorBadge: {
        title: badgeTitle,
        level: badgeLevel,
        color: badgeColor,
      },
    };
  } catch (error) {
    console.error("Failed to build investor summary:", error);
    return null;
  }
}

// Complete Account Export (GDPR / Data Sovereignty compliant)
export async function exportUserDataJson() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await ensureDbUser(userId);

  const [profile, quizAttempts, startups, documents] = await Promise.all([
    prisma.investmentProfile.findUnique({ where: { userId: dbUser.id } }),
    prisma.quizAttempt.findMany({ where: { userId: dbUser.id } }),
    prisma.startup.findMany({ where: { userId: dbUser.id } }),
    prisma.document.findMany({ where: { userId } }),
  ]);

  return {
    exportDate: new Date().toISOString(),
    platform: "FinIQ (https://askfiniq.online)",
    user: {
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      createdAt: dbUser.createdAt,
    },
    investmentProfile: profile,
    quizAttempts,
    trackedStartups: startups,
    financialDocuments: documents.map((d) => ({
      id: d.id,
      title: d.title,
      fileType: d.fileType,
      createdAt: d.createdAt,
      analysis: {
        documentType: d.documentType,
        accountHolder: d.accountHolder,
        netIncome: d.netIncome,
        taxDeductions: d.taxDeductions,
        portfolioValue: d.portfolioValue,
      },
    })),
  };
}
