"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Coins,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Layers,
  Percent,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  Building,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface StrategyPreset {
  name: string;
  tagline: string;
  dealCount: number;
  reservePct: number;
  description: string;
  badge: string;
}

const STRATEGY_PRESETS: StrategyPreset[] = [
  {
    name: "Hyper-Diversified (AngelList Index)",
    tagline: "Maximize power-law exposure across 25+ bets",
    dealCount: 25,
    reservePct: 40,
    description:
      "Statistically minimizes probability of total capital loss. Captures high probability of hitting a 30x–100x outlier winner.",
    badge: "Recommended for New Angels",
  },
  {
    name: "Balanced Syndicate (Titan / IAN Style)",
    tagline: "Optimal balance of check size & portfolio breadth",
    dealCount: 16,
    reservePct: 50,
    description:
      "Allows meaningful check size while maintaining a 50% war chest to double down on breakout Series A winners.",
    badge: "Most Popular",
  },
  {
    name: "Concentrated High-Conviction",
    tagline: "8–10 large checks with hands-on advisory",
    dealCount: 8,
    reservePct: 35,
    description:
      "High variance strategy suited for operators who can secure pro-rata rights and actively steer company strategy.",
    badge: "High Variance",
  },
];

export function PortfolioAllocator() {
  // Fund capital in Lakhs INR (e.g. 50 = ₹50,00,000)
  const [totalPoolLakhs, setTotalPoolLakhs] = useState<number>(50);
  const [dealCount, setDealCount] = useState<number>(20);
  const [reservePct, setReservePct] = useState<number>(45); // % for follow-on
  const [unicornMultiple, setUnicornMultiple] = useState<number>(40); // Top winner multiple

  const initialCapitalLakhs = (totalPoolLakhs * (100 - reservePct)) / 100;
  const reserveCapitalLakhs = (totalPoolLakhs * reservePct) / 100;
  const avgCheckSizeLakhs = initialCapitalLakhs / dealCount;

  // Power Law Distribution Model
  const model = useMemo(() => {
    // Breakdown of outcomes based on empirical venture data
    // 60% fail (0x)
    const deadCount = Math.round(dealCount * 0.6);
    // 25% return capital (1.5x avg)
    const zombieCount = Math.round(dealCount * 0.25);
    // 10% modest hit (5x avg)
    const hitCount = Math.max(1, Math.round(dealCount * 0.1));
    // Remaining (top 5%) = Outliers
    const outlierCount = Math.max(1, dealCount - deadCount - zombieCount - hitCount);

    const deadReturn = 0;
    const zombieReturn = zombieCount * avgCheckSizeLakhs * 1.5;
    const hitReturn = hitCount * avgCheckSizeLakhs * 5;
    // Outlier return + reserve deployment leverage (reserve invested at follow-on, e.g. 4x MOIC)
    const outlierReturn = outlierCount * avgCheckSizeLakhs * unicornMultiple;
    const reserveReturn = reserveCapitalLakhs * 3.5; // Blended follow-on return

    const totalProjectedReturnLakhs =
      deadReturn + zombieReturn + hitReturn + outlierReturn + reserveReturn;
    const blendedMOIC = totalProjectedReturnLakhs / totalPoolLakhs;
    // Approximate 7-year IRR: (MOIC ^ (1/7)) - 1
    const projectedIRR = (Math.pow(blendedMOIC, 1 / 7) - 1) * 100;

    return {
      deadCount,
      zombieCount,
      hitCount,
      outlierCount,
      deadReturn,
      zombieReturn,
      hitReturn,
      outlierReturn,
      reserveReturn,
      totalProjectedReturnLakhs,
      blendedMOIC: Number(blendedMOIC.toFixed(2)),
      projectedIRR: Number(projectedIRR.toFixed(1)),
    };
  }, [dealCount, avgCheckSizeLakhs, reserveCapitalLakhs, totalPoolLakhs, unicornMultiple]);

  // Chart data for Capital Allocation Pie
  const capitalChartData = [
    { name: "Initial Checks", value: initialCapitalLakhs, color: "#FF8000" },
    { name: "Follow-On Reserve", value: reserveCapitalLakhs, color: "#3B82F6" },
  ];

  // Chart data for Outcome Histogram
  const outcomeHistogramData = [
    {
      bracket: "0x (Write-offs)",
      deals: model.deadCount,
      returns: 0,
      fill: "#EF4444",
      desc: "Companies shut down or zero return",
    },
    {
      bracket: "1x–2x (Capital Back)",
      deals: model.zombieCount,
      returns: Number(model.zombieReturn.toFixed(1)),
      fill: "#F59E0B",
      desc: "Acqui-hires & low-multiple exits",
    },
    {
      bracket: "3x–8x (Solid Hits)",
      deals: model.hitCount,
      returns: Number(model.hitReturn.toFixed(1)),
      fill: "#10B981",
      desc: "Strong profitable growth companies",
    },
    {
      bracket: `${unicornMultiple}x (Home Runs)`,
      deals: model.outlierCount,
      returns: Number(model.outlierReturn.toFixed(1)),
      fill: "#FF8000",
      desc: "The power-law fund returners",
    },
  ];

  const applyPreset = (preset: StrategyPreset) => {
    setDealCount(preset.dealCount);
    setReservePct(preset.reservePct);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Venture Portfolio Architecture
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Angel Portfolio & Power-Law Allocator
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mt-1">
            Institutional portfolio constructor modeled on Carta and AngelList benchmarks.
            Calculate check sizes, reserve ratios, and power-law outcome distributions across 10–30 bets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/calculator"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold transition-colors"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            Cap Table & SAFE Simulator
          </Link>
          <Link
            href="/dashboard/startups"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-colors"
          >
            <Building className="w-4 h-4" />
            View Deal Pipeline
          </Link>
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-orange-500" />
            Select Angel Strategy Framework
          </h2>
          <span className="text-[11px] text-muted-foreground">Click to auto-calibrate parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STRATEGY_PRESETS.map((preset) => {
            const isSelected =
              dealCount === preset.dealCount && reservePct === preset.reservePct;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`text-left p-4 rounded-xl border transition-all text-sm relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-orange-500/[0.07] border-orange-500 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/40"
                    : "bg-card hover:bg-accent/50 border-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{preset.name}</h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-0.5">
                    {preset.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span>
                    <strong>{preset.dealCount}</strong> Deals
                  </span>
                  <span>
                    <strong>{preset.reservePct}%</strong> Reserve
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Controls & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              Allocation Sliders
            </h2>
            <span className="text-xs text-muted-foreground font-mono">Real-time Model</span>
          </div>

          {/* Slider 1: Total Investment Pool */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-orange-500" />
                Total Allocation Pool
              </label>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-base">
                ₹{totalPoolLakhs} Lakhs
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={totalPoolLakhs}
              onChange={(e) => setTotalPoolLakhs(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>₹10 Lakhs</span>
              <span>₹1.5 Crores</span>
              <span>₹3 Crores</span>
            </div>
          </div>

          {/* Slider 2: Number of Startup Bets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Building className="w-4 h-4 text-orange-500" />
                Target Portfolio Count
              </label>
              <span className="font-mono font-bold text-foreground text-base">
                {dealCount} Companies
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={dealCount}
              onChange={(e) => setDealCount(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>5 (High risk)</span>
              <span>20 (Institutional sweet-spot)</span>
              <span>40 (Max index)</span>
            </div>
          </div>

          {/* Slider 3: Follow-On Reserve Ratio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-500" />
                Follow-on Reserve Ratio
              </label>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                {reservePct}% Reserve
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={65}
              step={5}
              value={reservePct}
              onChange={(e) => setReservePct(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>20% (Light)</span>
              <span>45% (Benchmark standard)</span>
              <span>65% (Heavy)</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Top angel syndicates reserve 40%–50% to exercise pro-rata rights when top companies raise Series A.
            </p>
          </div>

          {/* Slider 4: Unicorn Multiple */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-orange-500" />
                Top Winner Exit Multiple
              </label>
              <span className="font-mono font-bold text-orange-500 text-base">
                {unicornMultiple}x MOIC
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={5}
              value={unicornMultiple}
              onChange={(e) => setUnicornMultiple(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>15x (Conservative)</span>
              <span>40x (Unicorn benchmark)</span>
              <span>100x (Decacorn)</span>
            </div>
          </div>

          {/* Quick Summary Pill Box */}
          <div className="bg-secondary/50 rounded-xl p-4 border border-border/60 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Average First Check:</span>
              <span className="font-mono font-bold text-foreground">
                ₹{avgCheckSizeLakhs.toFixed(2)} Lakhs
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Initial Deployment ({100 - reservePct}%):</span>
              <span className="font-mono font-bold text-foreground">
                ₹{initialCapitalLakhs.toFixed(1)} Lakhs
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Reserve War Chest ({reservePct}%):</span>
              <span className="font-mono font-bold text-blue-500">
                ₹{reserveCapitalLakhs.toFixed(1)} Lakhs
              </span>
            </div>
          </div>
        </div>

        {/* Right Output: Simulation Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Return Telemetry Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Total Projected Return
              </p>
              <p className="text-xl font-extrabold text-foreground font-mono mt-1">
                ₹{(model.totalProjectedReturnLakhs / 100).toFixed(2)} Cr
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                +₹{(model.totalProjectedReturnLakhs - totalPoolLakhs).toFixed(1)}L Net Profit
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Blended Multiple
              </p>
              <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400 font-mono mt-1">
                {model.blendedMOIC}x
              </p>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                Net MOIC on pool
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Estimated IRR (7-yr)
              </p>
              <p className="text-xl font-extrabold text-foreground font-mono mt-1">
                {model.projectedIRR}%
              </p>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                Annualized compound
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                First Check Size
              </p>
              <p className="text-xl font-extrabold text-foreground font-mono mt-1">
                ₹{avgCheckSizeLakhs.toFixed(1)}L
              </p>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                per startup
              </p>
            </div>
          </div>

          {/* Power-Law Distribution Chart */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Simulated Power-Law Return Histogram
                </h3>
                <p className="text-xs text-muted-foreground">
                  How startup outcomes mathematically generate returns across {dealCount} investments
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded bg-secondary font-mono font-medium text-foreground">
                Outlier Multiple: {unicornMultiple}x
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={outcomeHistogramData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <XAxis
                    dataKey="bracket"
                    stroke="currentColor"
                    fontSize={11}
                    tickLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    stroke="currentColor"
                    fontSize={11}
                    tickLine={false}
                    unit="L"
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    formatter={(value: any, name: any, item: any) => [
                      `₹${value} Lakhs (${item.payload.deals} deals)`,
                      "Projected Returns",
                    ]}
                  />
                  <Bar dataKey="returns" radius={[6, 6, 0, 0]}>
                    {outcomeHistogramData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bracket Breakdown Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
              {outcomeHistogramData.map((entry) => (
                <div
                  key={entry.bracket}
                  className="p-2.5 rounded-lg bg-secondary/30 border border-border/40"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <span className="font-bold text-foreground truncate">{entry.bracket}</span>
                  </div>
                  <div className="font-mono text-muted-foreground text-[11px]">
                    {entry.deals} deals → ₹{entry.returns}L
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Split & Reserve Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capitalChartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={24}
                      outerRadius={42}
                      stroke="none"
                    >
                      {capitalChartData.map((entry, index) => (
                        <Cell key={`slice-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-foreground">Capital Deployment Split</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>
                    Initial: ₹{initialCapitalLakhs.toFixed(1)}L ({100 - reservePct}%)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>
                    Reserve: ₹{reserveCapitalLakhs.toFixed(1)}L ({reservePct}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                <Info className="w-4 h-4 shrink-0" />
                The Power Law Truth
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                In venture investing, the single top investment typically returns more than all other investments combined.
                With <strong>{dealCount} companies</strong>, your statistical probability of capturing an outlier exceeds 85%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Angel Guardrails */}
      <div className="border border-border/80 bg-card rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          Institutional Angel Rules of Thumb (Indian Ecosystem)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-muted-foreground">
          <div className="space-y-1.5 p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="text-orange-500">01.</span> Max 10% Liquid Net Worth
            </h4>
            <p className="leading-relaxed">
              Never allocate more than 10%–15% of your total investable net worth into angel deals. Angel equity is 100% illiquid for 5–8 years.
            </p>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="text-orange-500">02.</span> Maintain Follow-On Reserves
            </h4>
            <p className="leading-relaxed">
              The biggest mistake angels make is deploying 100% in first checks. When your breakout winner raises Series A, you want capital ready to avoid dilution.
            </p>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <span className="text-orange-500">03.</span> Synergistic Sector Focus
            </h4>
            <p className="leading-relaxed">
              Invest in sectors where you bring unfair advantage (Fintech, SaaS, DeepTech) so you can assist founders with hiring, GTM, and strategic intros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
