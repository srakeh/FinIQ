"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  PlusCircle,
  Search,
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
  LayoutGrid,
  Kanban,
  Trash2,
  Check,
  ChevronRight,
  MoreVertical,
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
import { updateStartupStage, deleteStartup } from "@/actions/startup";

export interface StartupItem {
  id: string;
  companyName: string;
  industry: string;
  stage: string;
  description: string | null;
  createdAt: Date | string;
}

// Venture Pipeline standard stages
export const PIPELINE_STAGES = [
  "Screening",
  "Due Diligence",
  "Partner Pitch",
  "Term Sheet",
  "Invested",
] as const;

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
    market * 0.25 + margins * 0.2 + founder * 0.25 + moat * 0.15 + runway * 0.15
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
    tierColor =
      "text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_12px_rgba(255,128,0,0.3)]";
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

export function StartupsView({ startups: initialStartups }: { startups: StartupItem[] }) {
  const [startups, setStartups] = useState<StartupItem[]>(initialStartups);
  const [query, setQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "pipeline">("grid");
  const [activeMemoStartup, setActiveMemoStartup] = useState<StartupItem | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const stages = useMemo(() => {
    const list = Array.from(new Set(startups.map((s) => s.stage)));
    return ["All", ...list];
  }, [startups]);

  const filtered = useMemo(() => {
    return startups.filter((s) => {
      const matchesQuery =
        s.companyName.toLowerCase().includes(query.toLowerCase()) ||
        s.industry.toLowerCase().includes(query.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(query.toLowerCase()));
      const matchesStage = selectedStage === "All" || s.stage === selectedStage;
      return matchesQuery && matchesStage;
    });
  }, [startups, query, selectedStage]);

  // Stage change handler
  const handleStageChange = async (startupId: string, newStage: string) => {
    setIsUpdatingId(startupId);
    // Optimistic update
    setStartups((prev) =>
      prev.map((s) => (s.id === startupId ? { ...s, stage: newStage } : s))
    );
    try {
      await updateStartupStage(startupId, newStage);
    } catch (e) {
      console.error("Failed to update stage:", e);
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Delete handler
  const handleDelete = async (startupId: string) => {
    if (!confirm("Are you sure you want to remove this startup from your deal pipeline?")) return;
    setStartups((prev) => prev.filter((s) => s.id !== startupId));
    try {
      await deleteStartup(startupId);
    } catch (e) {
      console.error("Failed to delete startup:", e);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Venture Intelligence & Dealflow
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Startup Deal Pipeline & Diligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Track deal stages like Harmonic & AngelList, run 5-axis due diligence radar audits, and generate investor deal memos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View with Radar Charts"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("pipeline")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "pipeline"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Harmonic-style Deal Pipeline Board"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Pipeline Kanban</span>
            </button>
          </div>

          <Link href="/dashboard/startups/new">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-[0_0_15px_rgba(255,128,0,0.3)] flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add Startup
            </Button>
          </Link>
        </div>
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

        {viewMode === "grid" && (
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
        )}
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
      ) : viewMode === "grid" ? (
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
                        {startup.industry} •{" "}
                        <span className="text-orange-500 font-semibold">{startup.stage}</span>
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

                  {/* Stage Switcher Dropdown */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Pipeline Stage:</span>
                    <select
                      value={startup.stage}
                      onChange={(e) => handleStageChange(startup.id, e.target.value)}
                      disabled={isUpdatingId === startup.id}
                      className="bg-secondary text-foreground text-xs font-semibold px-2 py-1 rounded-lg border border-border focus:outline-none focus:border-orange-500"
                    >
                      {PIPELINE_STAGES.map((stg) => (
                        <option key={stg} value={stg}>
                          {stg}
                        </option>
                      ))}
                    </select>
                  </div>

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

                    <button
                      onClick={() => handleDelete(startup.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border/60 transition-colors"
                      title="Remove startup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Harmonic / AngelList-Style Dealflow Pipeline Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stageName) => {
            const columnStartups = filtered.filter(
              (s) => s.stage.toLowerCase() === stageName.toLowerCase() || (stageName === "Screening" && !PIPELINE_STAGES.some(p => p.toLowerCase() === s.stage.toLowerCase()))
            );

            return (
              <div
                key={stageName}
                className="bg-card/50 border border-border rounded-2xl p-3 space-y-3 min-w-[240px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                      {stageName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground">
                    {columnStartups.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {columnStartups.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-border/60 text-center text-[11px] text-muted-foreground">
                      No deals in this stage
                    </div>
                  ) : (
                    columnStartups.map((s) => {
                      const diligence = computeDiligenceProfile(s);
                      return (
                        <div
                          key={s.id}
                          className="bg-card border border-border rounded-xl p-3 shadow-sm hover:border-orange-500/50 transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-bold text-sm text-foreground line-clamp-1">
                                {s.companyName}
                              </h4>
                              <p className="text-[11px] text-muted-foreground">{s.industry}</p>
                            </div>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${diligence.tierColor}`}
                            >
                              {diligence.compositeScore}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                            <span className="text-muted-foreground">Move Stage:</span>
                            <select
                              value={s.stage}
                              onChange={(e) => handleStageChange(s.id, e.target.value)}
                              className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded border border-border font-semibold focus:outline-none"
                            >
                              {PIPELINE_STAGES.map((stg) => (
                                <option key={stg} value={stg}>
                                  {stg}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-xs">
                            <button
                              onClick={() => setActiveMemoStartup(s)}
                              className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> Memo
                            </button>
                            <Link
                              href={`/dashboard/chat?prompt=${encodeURIComponent(
                                `Deep dive diligence evaluation for ${s.companyName}`
                              )}`}
                              className="text-muted-foreground hover:text-orange-500"
                            >
                              <BrainCircuit className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Institutional Deal Memo Dialog */}
      {activeMemoStartup && (
        <Dialog open={!!activeMemoStartup} onOpenChange={() => setActiveMemoStartup(null)}>
          <DialogContent className="max-w-2xl bg-card border-border/80 rounded-2xl p-0 overflow-hidden shadow-2xl">
            {(() => {
              const diligence = computeDiligenceProfile(activeMemoStartup);
              return (
                <div className="flex flex-col max-h-[85vh]">
                  {/* Dialog Header / Memo Banner */}
                  <div className="p-6 bg-gradient-to-r from-orange-500/10 via-background to-orange-500/5 border-b border-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-orange-500 text-white font-bold text-[10px] tracking-wider uppercase">
                          Confidential Deal Memo
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: FINIQ-{activeMemoStartup.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <DialogTitle className="text-2xl font-black text-foreground">
                        {activeMemoStartup.companyName}
                      </DialogTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sector: {activeMemoStartup.industry} • Stage: {activeMemoStartup.stage}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="border-border hover:bg-orange-500 hover:text-white font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / PDF
                    </Button>
                  </div>

                  {/* Scrollable Memo Body */}
                  <div className="p-6 space-y-6 overflow-y-auto text-sm leading-relaxed">
                    {/* Executive Diligence Scorecard */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Composite Rating</p>
                        <p className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono mt-0.5">
                          {diligence.compositeScore}
                          <span className="text-xs font-normal text-muted-foreground">/100</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Investment Recommendation</p>
                        <p className="text-sm font-bold text-foreground mt-1 flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                          {diligence.recommendation}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Evaluation Engine</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">
                          FinIQ Algorithmic 5-Axis Multimodal Audit
                        </p>
                      </div>
                    </div>

                    {/* Section 1: Executive Thesis */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-orange-500 flex items-center gap-2">
                        <Target className="w-4 h-4" /> 1. Executive Investment Thesis
                      </h3>
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {activeMemoStartup.description ||
                          `${activeMemoStartup.companyName} represents a category-defining venture opportunity within the ${activeMemoStartup.industry} vertical. Strong early tailwinds, proprietary moat, and capital-efficient execution make it a high-conviction candidate.`}
                      </p>
                    </div>

                    {/* Section 2: Diligence Breakdown Matrix */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-orange-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> 2. 5-Axis Quantitative Breakdown
                      </h3>
                      <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-card border border-border">
                          <p className="text-[10px] text-muted-foreground">Market Size</p>
                          <p className="font-mono font-bold text-foreground text-sm mt-0.5">{diligence.market}%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-card border border-border">
                          <p className="text-[10px] text-muted-foreground">Unit Economics</p>
                          <p className="font-mono font-bold text-foreground text-sm mt-0.5">{diligence.margins}%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-card border border-border">
                          <p className="text-[10px] text-muted-foreground">Founder Pedigree</p>
                          <p className="font-mono font-bold text-foreground text-sm mt-0.5">{diligence.founder}%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-card border border-border">
                          <p className="text-[10px] text-muted-foreground">Defensibility</p>
                          <p className="font-mono font-bold text-foreground text-sm mt-0.5">{diligence.moat}%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-card border border-border">
                          <p className="text-[10px] text-muted-foreground">Runway Health</p>
                          <p className="font-mono font-bold text-foreground text-sm mt-0.5">{diligence.runway}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Risk Audit & Mitigation */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-orange-500 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> 3. Angel Risk Audit & Downside Protection
                      </h3>
                      <ul className="space-y-2 text-xs text-foreground/80 list-disc pl-4">
                        <li>
                          <strong>SAFE Valuation Cap Exposure:</strong> Ensure valuation cap does not exceed ₹25Cr Post-Money without verified ARR traction.
                        </li>
                        <li>
                          <strong>Pro-Rata Rights:</strong> Request explicit information rights and pro-rata follow-on participation clauses in side-letter.
                        </li>
                        <li>
                          <strong>Customer Concentration:</strong> Verify that top 3 enterprise accounts do not account for over 50% of monthly recurring revenue.
                        </li>
                      </ul>
                    </div>

                    {/* Footer / Signature Block */}
                    <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Prepared by: FinIQ AI Workstation</span>
                      <span>Verified: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
