import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Building2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function StartupsPage() {
  // 1. Secure the route
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 2. Get the internal Database ID for this specific user
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) redirect("/");

  // 3. Fetch all startups that belong ONLY to this user
  const startups = await prisma.startup.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-full dark:bg-zinc-950">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Tracked Startups
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage and analyze your venture capital pipeline.
          </p>
        </div>
        
        {/* We will build this form in the next step! */}
        <Link href="/dashboard/startups/new">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Startup
        </Button>
        </Link>
      </div>

      {/* Conditional Rendering: Show a blank state if they have no startups in the DB */}
      {startups.length === 0 ? (
        <Card className="border-dashed shadow-sm bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Building2 className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No startups tracked yet</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              You haven't added any companies to your pipeline. Click the button above to start analyzing your first venture.
            </p>
          </CardContent>
        </Card>
      ) : (
        // If they DO have startups, map over them and display them
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup: any) => (
            <Card key={startup.id} className="bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle>{startup.companyName}</CardTitle>
                <CardDescription>{startup.industry} • {startup.stage}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 line-clamp-3">
                  {startup.description || "No description provided."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}