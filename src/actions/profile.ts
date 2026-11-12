"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Ensure the internal User record exists (Clerk → Prisma bridge)
async function ensureDbUser(clerkId: string) {
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

  const riskTolerance = formData.get("riskTolerance") as string;
  const preferredStage = formData.get("preferredStage") as string;
  const interestsRaw = formData.get("interests") as string;

  if (!riskTolerance || !preferredStage || !interestsRaw) {
    return { error: "All fields are required." };
  }

  // Parse comma-separated interests into an array
  const interests = interestsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (interests.length === 0) {
    return { error: "Please select at least one interest." };
  }

  try {
    const dbUser = await ensureDbUser(userId);

    await prisma.investmentProfile.upsert({
      where: { userId: dbUser.id },
      update: { riskTolerance, preferredStage, interests },
      create: {
        userId: dbUser.id,
        riskTolerance,
        preferredStage,
        interests,
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/recommendations");
    return { success: true };
  } catch (error: any) {
    console.error("Save profile error:", error);
    return { error: error?.message || "Failed to save profile" };
  }
}
