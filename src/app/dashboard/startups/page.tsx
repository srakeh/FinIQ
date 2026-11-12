import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StartupsView } from "@/components/features/startups-view";

export const dynamic = "force-dynamic";

export default async function StartupsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  let startups: any[] = [];

  try {
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser && clerkUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@user.finiq`,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
        },
      });
    }

    if (dbUser) {
      startups = await prisma.startup.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Error fetching startups:", error);
  }

  return (
    <main className="p-6">
      <StartupsView startups={startups} />
    </main>
  );
}
