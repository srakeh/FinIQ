import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Bot,
  UploadCloud,
  BarChart3,
  Zap,
  ShieldCheck,
  TrendingUp,
  Coins,
  FileText,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
} from "lucide-react";
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

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#pipeline" className="hover:text-foreground transition-colors">
              Pipeline
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#comparison" className="hover:text-foreground transition-colors">
              Comparison
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {userId ? (
              <Link href="/dashboard">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,128,0,0.3)]">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(255,128,0,0.3)]">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center justify-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span>Institutional-Grade Angel Investment & Deal Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground">
            Autonomous Intelligence for{" "}
            <span className="inline-block cursor-pointer papaya-text-glow text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
              Venture Syndicates
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Upload pitch decks, balance sheets, and cap tables. FinIQ parses raw documents in sub-seconds, computes 5-axis algorithmic scorecards, runs SAFE dilution waterfalls, and drafts executive deal memos.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link href={userId ? "/dashboard" : "/sign-in"}>
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 h-12 shadow-[0_0_25px_rgba(255,128,0,0.35)] flex items-center gap-2 transition-transform active:scale-[0.98]"
              >
                {userId ? "Open Angel Workstation" : "Start Analyzing Deals Free"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 border-border/80 hover:border-orange-500/30 hover:bg-accent font-semibold"
              >
                <Coins className="w-4 h-4 mr-2 text-orange-500" /> Model Cap Table Dilution
              </Button>
            </Link>
          </div>

          {/* Interactive Floating Product Telemetry Preview Card */}
          <div className="w-full max-w-4xl pt-10">
            <div className="relative rounded-3xl border border-border/80 bg-card/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl mclaren-glow text-left overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    finiq.workstation://telemetry-live
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Gemini 3.1 Flash-Lite Engine Active
                </div>
              </div>

              {/* Sample Live Telemetry Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-background/60 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Verified Deal Ingestion
                  </span>
                  <p className="text-2xl font-black font-mono text-foreground">₹1,37,50,000</p>
                  <p className="text-[11px] text-orange-500 font-semibold">↑ Sub-second Base64 OCR</p>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Due Diligence Index
                  </span>
                  <p className="text-2xl font-black font-mono text-orange-500">88.4 / 100</p>
                  <p className="text-[11px] text-muted-foreground">Top 5% Venture Percentile</p>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Target MOIC Multiple
                  </span>
                  <p className="text-2xl font-black font-mono text-amber-500">12.4x Exit</p>
                  <p className="text-[11px] text-muted-foreground">At ₹45 Cr Cap Conversion</p>
                </div>
              </div>

              {/* Terminal Query Mock */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-foreground/80">
                  <span className="text-orange-500 font-bold">&gt;</span>
                  <span>FinIQ Advisor: &quot;What are the Section 80C exemptions and SAFE dilution on my last statement?&quot;</span>
                </div>
                <span className="text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Ready in 0.4s
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Venture Pipeline Section */}
        <section id="pipeline" className="border-t border-border/60 py-20 bg-card/30">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                The 3-Step Due Diligence Pipeline
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                From Raw Financials to Signed Term Sheets
              </h2>
              <p className="text-sm text-muted-foreground">
                FinIQ replaces weeks of manual spreadsheet parsing with autonomous, institutional-grade AI intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4 mclaren-card-hover">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-black">
                  01
                </div>
                <h3 className="text-lg font-bold text-foreground">Multimodal Document Ingestion</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drop PDFs, CSVs, or balance sheet scans into the vault. Files are securely ingested into Supabase and parsed by Gemini 3.1 Flash-Lite without manual data entry.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4 mclaren-card-hover">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-black">
                  02
                </div>
                <h3 className="text-lg font-bold text-foreground">5-Axis Algorithmic Diligence</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  FinIQ calculates a comprehensive scorecard analyzing TAM, unit economics, founder pedigree, IP moat, and burn efficiency, plotting a visual radar fingerprint.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4 mclaren-card-hover">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-black">
                  03
                </div>
                <h3 className="text-lg font-bold text-foreground">SAFE Dilution & Printable Memo</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Model post-money valuation caps, option pool dilution, and acquisition waterfall multiples. Export an executive deal memo ready for your investment committee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Core Feature Grid */}
        <section id="features" className="border-t border-border/60 py-20">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Institutional Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Engineered for High-Velocity Angel Syndicates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Sub-Second OCR & Parsing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ingests multi-page PDFs, CSV spreadsheets, and invoices via raw binary Base64 buffers directly into Gemini API.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Grounded AI Advisor Copilot</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Conversational assistant strictly guardrailed to financial advice, referencing your uploaded portfolio numbers for personalized counsel.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <Coins className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">SAFE & Cap Table Simulator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive valuation cap modelers, Series A VC dilution retention, and multi-tier acquisition waterfall charts.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">1-Click Executive Deal Memos</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instant printable investment committee briefs detailing thesis, unit economics, risks, and terms on any tracked startup.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Angel Investing Academy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dynamic 5-question quizzes generated dynamically on SAFEs, 409A valuations, and angel taxes with Recharts analytics.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-sm space-y-3 mclaren-card-hover">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Enterprise Security & Rate Limiting</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zod schema validation, sliding-window in-memory rate limiting, Clerk proxy bridge, and HSTS/CSP hardened headers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Traditional vs FinIQ Comparison Matrix */}
        <section id="comparison" className="border-t border-border/60 py-20 bg-card/30">
          <div className="max-w-4xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Direct Benchmark
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Traditional Due Diligence vs FinIQ Workstation
              </h2>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 bg-muted/40 p-4 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-5">Workflow Dimension</div>
                <div className="col-span-3 text-center">Traditional Way</div>
                <div className="col-span-4 text-center text-orange-500">FinIQ Workstation</div>
              </div>

              <div className="divide-y divide-border/60 text-xs">
                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 font-semibold text-foreground">Turnaround Time</div>
                  <div className="col-span-3 text-center text-muted-foreground">10 – 14 business days</div>
                  <div className="col-span-4 text-center font-bold text-orange-500">Under 1.2 seconds</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 font-semibold text-foreground">Statement Extraction</div>
                  <div className="col-span-3 text-center text-muted-foreground">Manual Excel retyping</div>
                  <div className="col-span-4 text-center font-bold text-orange-500">Multimodal Gemini OCR</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 font-semibold text-foreground">Cap Table Dilution</div>
                  <div className="col-span-3 text-center text-muted-foreground">Fragile formula spreadsheets</div>
                  <div className="col-span-4 text-center font-bold text-orange-500">Interactive SAFE Waterfall</div>
                </div>

                <div className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 font-semibold text-foreground">Committee Deal Memos</div>
                  <div className="col-span-3 text-center text-muted-foreground">Hours writing Word docs</div>
                  <div className="col-span-4 text-center font-bold text-orange-500">1-Click Printable Brief</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" className="border-t border-border/60 py-20">
          <div className="max-w-3xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">What file formats does FinIQ support?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  FinIQ accepts PDFs, CSV spreadsheets, plain text files, and high-resolution images (PNG, JPG, WebP) directly converted into raw Base64 buffers for sub-second parsing.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">How does the SAFE dilution calculator work?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The calculator supports both Y Combinator post-money SAFEs and legacy pre-money SAFEs. It computes your exact post-Series A equity retention factoring in unallocated option pool expansions (ESOP) and projects multi-tier acquisition waterfall returns.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">Is my uploaded financial data kept private?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Yes. All files are securely stored in Supabase private buckets protected by Clerk authentication. Files can be permanently deleted with zero retention at any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* High-Conversion Footer CTA Banner */}
        <section className="border-t border-border/60 py-16 bg-gradient-to-b from-card/40 to-background text-center">
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to Accelerate Your Venture Pipeline?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Join angel syndicates, venture scouts, and high-net-worth investors making smarter early-stage bets with FinIQ.
            </p>
            <div className="pt-2">
              <Link href={userId ? "/dashboard" : "/sign-in"}>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 h-12 shadow-[0_0_25px_rgba(255,128,0,0.35)]"
                >
                  {userId ? "Go to Dashboard" : "Get Started Now"} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-border/60 py-8 bg-card/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" />
            <span>• High-Performance Angel Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Workstation
            </Link>
            <Link href="/dashboard/calculator" className="hover:text-foreground transition-colors">
              SAFE Calculator
            </Link>
            <Link href="/dashboard/chat" className="hover:text-foreground transition-colors">
              AI Advisor
            </Link>
            <Link href="/api/health" className="hover:text-foreground transition-colors">
              System Health
            </Link>
          </div>

          <p>© {new Date().getFullYear()} FinIQ Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
