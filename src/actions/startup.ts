"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { StartupInputSchema } from "@/lib/validations";
import { rateLimit, RateLimits } from "@/lib/rate-limit";

export async function createStartup(formData: FormData) {
  // 1. Verify the user is authenticated
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Rate limiting check
  const limitCheck = rateLimit(userId, RateLimits.STARTUP_CREATE);
  if (!limitCheck.success) {
    throw new Error(
      `Rate limit exceeded. Please wait ${Math.ceil(limitCheck.resetMs / 1000)} seconds before adding another startup.`
    );
  }

  // 3. Find the user's internal database ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!dbUser) throw new Error("User not found");

  // 4. Validate form inputs with Zod schema
  const parsed = StartupInputSchema.safeParse({
    companyName: formData.get("companyName"),
    industry: formData.get("industry"),
    stage: formData.get("stage"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Validation error: ${errorMsg}`);
  }

  const { companyName, industry, stage, description } = parsed.data;

  // 5. Insert the new startup into the PostgreSQL database
  await prisma.startup.create({
    data: {
      companyName,
      industry,
      stage,
      description,
      userId: dbUser.id, // Tie the startup directly to the logged-in user
    },
  });

  // 6. Refresh the UI to show the new data, then route back to the list
  revalidatePath("/dashboard/startups");
  redirect("/dashboard/startups");
}

export async function updateStartupStage(startupId: string, newStage: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!dbUser) throw new Error("User not found");

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
  });
  if (!startup || startup.userId !== dbUser.id) {
    throw new Error("Startup not found or unauthorized");
  }

  const updated = await prisma.startup.update({
    where: { id: startupId },
    data: { stage: newStage },
  });

  revalidatePath("/dashboard/startups");
  return { success: true, startup: updated };
}

export async function deleteStartup(startupId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!dbUser) throw new Error("User not found");

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
  });
  if (!startup || startup.userId !== dbUser.id) {
    throw new Error("Startup not found or unauthorized");
  }

  await prisma.startup.delete({
    where: { id: startupId },
  });

  revalidatePath("/dashboard/startups");
  return { success: true };
}
