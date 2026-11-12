import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Bot, UploadCloud, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Navigation Bar */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/" size="md" />

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {userId ? (
              <Link href="/dashboard">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(255,128,0,0.3)]">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-[0_0_15px_rgba(255,128,0,0.3)]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center justify-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25 shadow-sm">
          <Zap className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
          <span>High-Velocity Angel Investment & Financial Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground">
          Autonomous Intelligence for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            Angel Investors
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Upload balance sheets, payslips, cap tables, and financial statements. Let FinIQ extract key metrics, analyze portfolio risk, and chart actionable financial insights instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href={userId ? "/dashboard" : "/sign-in"}>
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 h-12 shadow-[0_0_25px_rgba(255,128,0,0.35)] flex items-center gap-2 transition-transform active:scale-[0.98]"
            >
              {userId ? "Open Dashboard" : "Start Analyzing for Free"} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/documents">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 border-border hover:border-orange-500/30 hover:bg-accent font-semibold"
            >
              View Sample Documents
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 text-left">
          <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3.5 mclaren-card-hover">
            <div className="h-11 w-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Instant Ingestion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload PDFs, CSVs, or images. FinIQ automatically parses raw financial files securely into your data lake.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3.5 mclaren-card-hover">
            <div className="h-11 w-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Gemini Extraction</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced AI models accurately identify net income, tax deductions, portfolio value, and account details in seconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3.5 mclaren-card-hover">
            <div className="h-11 w-11 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interactive charts and breakdown cards compare income vs taxes with easy one-click CSV report exports.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} FinIQ Platform. High-performance financial intelligence.</p>
      </footer>
    </div>
  );
}
