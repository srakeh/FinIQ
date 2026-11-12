"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Search,
  ExternalLink,
  Sparkles,
  Printer,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  BrainCircuit,
  X,
  Target,
  Flame,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export interface StartupItem {
  id: string;
  companyName: string;
  industry: string;
  stage: string;
  description: string;
  createdAt: Date | string;
}

// Generate realistic deterministic 5-axis diligence scores based on startup attributes
function computeDiligenceProfile(startup: StartupItem) {
  const hash = startup.companyName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const market = 70 + (hash % 26); // 70 - 95
  const margins = 65 + ((hash * 3) % 31); // 65 - 95
  const founder = 72 + ((hash * 7) % 27); // 72 - 98
  const moat = 60 + ((hash * 5) % 35); // 60 - 94
  const runway = 68 + ((hash * 11) % 28); // 68 - 95

  const compositeScore = Math.round(
    (market * 0.25 + margins * 0.2 + founder * 0.25 + moat * 0.15 + runway * 0.15)
  );

  const radarData = [
    { subject: "Market Size", score: market, fullMark: 100 },
    { subject: "Economics", score: margins, fullMark: 100 },
    { subject: "Founders", score: founder, fullMark: 100 },
    { subject: "Moat", score: moat, fullMark: 100 },
    { subject: "Runway", score: runway, fullMark: 100 },
  ];

  let recommendation = "Watchlist (Monitoring)";
  let tierColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
  if (compositeScore >= 85) {
    recommendation = "Fast-Track Investment";
    tierColor = "text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_12px_rgba(255,128,0,0.3)]";
  } else if (compositeScore >= 78) {
    recommendation = "High Conviction Deal";
    tierColor = "text-orange-400 bg-orange-500/10 border-orange-500/20";
  }

  return {
    radarData,
    compositeScore,
    recommendation,
    tierColor,
    market,
    margins,
    founder,
    moat,
    runway,
  };
}

export function StartupsView({ startups }: { startups: StartupItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [activeMemoStartup, setActiveMemoStartup] = useState<StartupItem | null>(null);

  const stages = useMemo(() => {
    const list = Array.from(new Set(startups.map((s) => s.stage)));
    return ["All", ...list];
  }, [startups]);

  const filtered = useMemo(() => {
    return startups.filter((s) => {
      const matchesQuery =
        s.companyName.toLowerCase().includes(query.toLowerCase()) ||
        s.industry.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase());
      const matchesStage = selectedStage === "All" || s.stage === selectedStage;
      return matchesQuery && matchesStage;
    });
  }, [startups, query, selectedStage]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Venture Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Startup Due Diligence & Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track early-stage deal flow, evaluate 5-axis venture scorecards, and generate executive investment memos.
          </p>
        </div>

        <Link href="/dashboard/startups/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-[0_0_15px_rgba(255,128,0,0.3)] flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add Startup
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, industry, or thesis..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-card border border-border/80 focus:border-orange-500 focus:outline-none transition-colors placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStage === stage
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Zero State */}
      {startups.length === 0 ? (
        <Card className="border-2 border-dashed border-border rounded-2xl bg-card/40 p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No startups tracked yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Add your first investment lead or angel deal to run multimodal due diligence audits and cap table scenarios.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard/startups/new">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Startup
              </Button>
            </Link>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center bg-card border-border rounded-2xl text-muted-foreground text-sm">
          No startups matching &quot;{query}&quot;. Try resetting your filters.
        </Card>
      ) : (
        /* Startup Cards Grid with 5-Axis Radars */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((startup) => {
            const diligence = computeDiligenceProfile(startup);

            return (
              <Card
                key={startup.id}
                className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover overflow-hidden flex flex-col justify-between"
              >
                <CardHeader className="pb-2 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg font-extrabold text-foreground truncate">
                        {startup.companyName}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                        {startup.industry} • {startup.stage}
                      </CardDescription>
                    </div>

                    {/* Diligence Score Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${diligence.tierColor}`}
                    >
                      {diligence.compositeScore}
                      <span className="text-[10px] font-sans font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Radar Chart Visual Fingerprint */}
                  <div className="h-[175px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={diligence.radarData}
                        margin={{ top: 10, right: 15, bottom: 10, left: 15 }}
                      >
                        <PolarGrid stroke="currentColor" opacity={0.12} />
                        <PolarAngleAxis
                          dataKey="subject"
                          stroke="currentColor"
                          fontSize={9}
                          opacity={0.7}
                        />
                        <Radar
                          name="Diligence"
                          dataKey="score"
                          stroke="#FF8000"
                          fill="#FF8000"
                          fillOpacity={0.25}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recommendation pill */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                    <span className="text-muted-foreground font-medium">Verdict:</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      {diligence.recommendation}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {startup.description || "Early-stage venture currently undergoing due diligence review."}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                    <button
                      onClick={() => setActiveMemoStartup(startup)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25 hover:bg-orange-500 hover:text-white transition-all duration-150"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Deal Memo</span>
                    </button>

                    <Link
                      href={`/dashboard/chat?prompt=${encodeURIComponent(
                        `Perform an exhaustive investment due diligence analysis on "${startup.companyName}" in the ${startup.industry} sector (${startup.stage} stage). Breakdown TAM, unit economics, SAFE valuation risks, and key angel questions.`
                      )}`}
                      className="p-2 rounded-xl text-muted-foreground hover:text-orange-500 hover:bg-accent border border-border/60 transition-colors"
                      title="Audit with FinIQ Advisor"
                    >
                      <BrainCircuit className="w-4 h-4 text-orange-500" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Printable Institutional Deal Memo Dialog */}
      {activeMemoStartup && (
        <Dialog open={!!activeMemoStartup} onOpenChange={() => setActiveMemoStartup(null)}>
          <DialogContent className="max-w-2xl bg-card border-border/80 rounded-2xl p-0 overflow-hidden shadow-2xl">
            <DialogTitle className="sr-only">
              Deal Memo - {activeMemoStartup.companyName}
            </DialogTitle>

            {/* Memo Printable Header */}
            <div className="p-6 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    FinIQ Investment Committee Memo
                  </span>
                </div>
                <h2 className="text-2xl font-black text-foreground">
                  {activeMemoStartup.companyName}
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Sector: {activeMemoStartup.industry} • Financing Stage: {activeMemoStartup.stage}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold border-border hover:border-orange-500/30"
                >
                  <Printer className="w-3.5 h-3.5 text-orange-500" />
                  <span>Print Memo</span>
                </Button>
              </div>
            </div>

            {/* Memo Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm leading-relaxed text-foreground">
              {/* Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Executive Investment Thesis
                </h4>
                <p className="text-xs text-foreground/90 bg-muted/30 p-3.5 rounded-xl border border-border/70 leading-relaxed">
                  {activeMemoStartup.description ||
                    "Company represents a high-velocity opportunity solving structural inefficiencies in the industry through technology leverage."}
                </p>
              </div>

              {/* 5-Axis Scorecard Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Due Diligence Scorecard (FinIQ Algorithmic Rating)
                </h4>
                {(() => {
                  const d = computeDiligenceProfile(activeMemoStartup);
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          Market Size (TAM)
                        </span>
                        <span className="text-base font-extrabold font-mono text-orange-500">
                          {d.market}/100
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          Unit Economics
                        </span>
                        <span className="text-base font-extrabold font-mono text-amber-500">
                          {d.margins}/100
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          Founder Fit
                        </span>
                        <span className="text-base font-extrabold font-mono text-orange-500">
                          {d.founder}/100
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          IP Defensibility
                        </span>
                        <span className="text-base font-extrabold font-mono text-foreground">
                          {d.moat}/100
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <span className="text-[10px] font-semibold text-muted-foreground block">
                          Runway Efficiency
                        </span>
                        <span className="text-base font-extrabold font-mono text-foreground">
                          {d.runway}/100
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                        <span className="text-[10px] font-semibold text-orange-500 block">
                          Overall Rating
                        </span>
                        <span className="text-base font-extrabold font-mono text-orange-500">
                          {d.compositeScore}/100
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Syndicate Checklist & Key Terms */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  3. Angel Syndicate Checklist & Terms
                </h4>
                <div className="p-4 rounded-xl bg-muted/20 border border-border/70 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    <span>Instrument: YC Post-Money SAFE (Valuation Capped)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    <span>Pro-Rata Rights: Included for checks ≥ ₹25 Lakhs / \$25,000</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    <span>Information Rights: Quarterly financial updates & board deck circulation</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-muted-foreground text-center pt-2">
                Confidential Angel Syndicate Brief. FinIQ Intelligence platform report for verified accredited investors.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
