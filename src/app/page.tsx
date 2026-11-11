import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Bot, ShieldCheck, TrendingUp, UploadCloud, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Navigation Bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="font-bold text-xl tracking-tight">FinIQ</span>
          </div>

          <div className="flex items-center gap-4">
            {userId ? (
              <Link href="/dashboard">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-in">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center justify-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Bot className="h-3.5 w-3.5" /> Powered by Gemini AI & Financial Intelligence
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-zinc-900 dark:text-zinc-50">
          Intelligent Document Analysis for <span className="text-emerald-500">Modern Finance</span>
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Upload balance sheets, payslips, cap tables, and financial statements. Let FinIQ extract key metrics, analyze portfolio risk, and chart actionable financial insights instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href={userId ? "/dashboard" : "/sign-in"}>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white text-base px-8 h-12 shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              {userId ? "Open Dashboard" : "Start Analyzing for Free"} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/documents">
            <Button size="lg" variant="outline" className="h-12 px-6">
              View Sample Documents
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 text-left">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Instant Ingestion</h3>
            <p className="text-sm text-zinc-500">
              Upload PDFs, CSVs, or images. FinIQ automatically parses raw financial files securely into your data lake.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Gemini Extraction</h3>
            <p className="text-sm text-zinc-500">
              Advanced AI models accurately identify net income, tax deductions, portfolio value, and account details in seconds.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Visual Analytics</h3>
            <p className="text-sm text-zinc-500">
              Interactive charts and breakdown cards compare income vs taxes with easy one-click CSV report exports.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} FinIQ Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
