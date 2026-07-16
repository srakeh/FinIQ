"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createStartup(formData: FormData) {
  // 1. Verify the user is authenticated
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2. Find the user's internal database ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!dbUser) throw new Error("User not found");

  // 3. Extract the text from the form fields
  const companyName = formData.get("companyName") as string;
  const industry = formData.get("industry") as string;
  const stage = formData.get("stage") as string;
  const description = formData.get("description") as string;

  // 4. Insert the new startup into the PostgreSQL database
  await prisma.startup.create({
    data: {
      companyName,
      industry,
      stage,
      description,
      userId: dbUser.id, // Tie the startup directly to the logged-in user
    },
  });

  // 5. Refresh the UI to show the new data, then route back to the list
  revalidatePath("/dashboard/startups");
  redirect("/dashboard/startups");
}