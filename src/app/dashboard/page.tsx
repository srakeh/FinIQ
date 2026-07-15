import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, BrainCircuit, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/");
  }

  // Sync/Fetch user from the database
  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  // Dummy data for the UI layout before we hook up the live database streams
  const metrics = [
    { title: "Startups Tracked", value: "12", icon: Building2, desc: "+2 added this week", color: "text-blue-500" },
    { title: "AI Pitch Decks Analyzed", value: "48", icon: BrainCircuit, desc: "Avg. Deal Score: 8.4/10", color: "text-emerald-500" },
    { title: "Financial Documents", value: "7", icon: FileText, desc: "Balance sheets & cap tables", color: "text-purple-500" },
  ];

  const recentStartups = [
    { name: "Apex Health AI", sector: "Healthcare IT", stage: "Seed", score: "9.2" },
    { name: "Quantum Ledger", sector: "Fintech / Blockchain", stage: "Pre-Series A", score: "8.1" },
    { name: "Verdant Logistics", sector: "Sustainability SaaS", stage: "Growth", score: "7.6" },
  ];

  return (
    <div className="p-6 space-y-8 bg-zinc-50 min-h-full dark:bg-zinc-950">
      {/* Top Welcome Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {dbUser.firstName || "Investor"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Here is your AI financial intelligence overview.
          </p>
        </div>
      </div>

      {/* 3-Column Metric Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{metric.value}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{metric.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Split Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Startups Card Table (Spans 4 columns) */}
        <Card className="col-span-4 bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">Recent Startup Evaluations</CardTitle>
            <CardDescription>Your latest tracked venture opportunities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStartups.map((startup) => (
                <div key={startup.name} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-50">{startup.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{startup.sector} • {startup.stage}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                      Score: {startup.score}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Actions Shortcut Card (Spans 3 columns) */}
        <Card className="col-span-3 bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">Quick Actions</CardTitle>
            <CardDescription>Run deep financial analysis pipelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/documents" className="block">
              <Button className="w-full justify-start bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                <FileText className="mr-2 h-4 w-4" /> Upload Financial Document
              </Button>
            </Link>
            <Link href="/dashboard/startups" className="block">
              <Button variant="outline" className="w-full justify-start border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                <Building2 className="mr-2 h-4 w-4" /> Track a New Startup
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}