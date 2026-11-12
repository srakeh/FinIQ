"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calculator,
  TrendingUp,
  Percent,
  Coins,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  PieChart as PieIcon,
  Flame,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

export function CapTableSimulator() {
  const [activeTab, setActiveTab] = useState<"safe" | "runway">("safe");

  // ==========================================
  // SAFE & Dilution Parameters
  // ==========================================
  const [investmentAmount, setInvestmentAmount] = useState<number>(5000000); // ₹50 Lakhs
  const [valuationCap, setValuationCap] = useState<number>(45000000); // ₹4.5 Crore
  const [safeType, setSafeType] = useState<"post-money" | "pre-money">("post-money");
  const [discountRate, setDiscountRate] = useState<number>(20); // 20% discount

  // Future Series A Round Parameters
  const [seriesAPreMoney, setSeriesAPreMoney] = useState<number>(150000000); // ₹15 Crore
  const [seriesARaise, setSeriesARaise] = useState<number>(30000000); // ₹3 Crore
  const [esopPoolPct, setEsopPoolPct] = useState<number>(10); // 10% ESOP pool
  const [exitValuation, setExitValuation] = useState<number>(300000000); // ₹30 Crore exit

  // ==========================================
  // Cash Runway & Burn Parameters
  // ==========================================
  const [cashInBank, setCashInBank] = useState<number>(20000000); // ₹2.0 Crore
  const [monthlyBurn, setMonthlyBurn] = useState<number>(1200000); // ₹12 Lakhs gross expenses
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(400000); // ₹4 Lakhs MRR
  const [momGrowthPct, setMomGrowthPct] = useState<number>(10); // 10% MoM revenue growth

  // SAFE Calculations
  const safeCalculations = useMemo(() => {
    let initialOwnershipPct = 0;
    if (safeType === "post-money") {
      initialOwnershipPct = (investmentAmount / valuationCap) * 100;
    } else {
      const postMoney = valuationCap + investmentAmount;
      initialOwnershipPct = (investmentAmount / postMoney) * 100;
    }

    const seriesAPostMoney = seriesAPreMoney + seriesARaise;
    const seriesAInvestorPct = (seriesARaise / seriesAPostMoney) * 100;
    const totalNewDilutionPct = seriesAInvestorPct + esopPoolPct;
    const retentionFactor = (100 - totalNewDilutionPct) / 100;

    const dilutedAngelOwnershipPct = initialOwnershipPct * retentionFactor;
    const founderOwnershipPct =
      100 - dilutedAngelOwnershipPct - seriesAInvestorPct - esopPoolPct;

    const proceedsAtExit = (dilutedAngelOwnershipPct / 100) * exitValuation;
    const moic = investmentAmount > 0 ? proceedsAtExit / investmentAmount : 0;
    const netProfit = proceedsAtExit - investmentAmount;

    const exitScenarios = [
      {
        scenario: "Conservative",
        valuation: Math.round(valuationCap * 1.5),
        angelProceeds: Math.round(
          (dilutedAngelOwnershipPct / 100) * (valuationCap * 1.5)
        ),
      },
      {
        scenario: "Target (3x)",
        valuation: Math.round(valuationCap * 3),
        angelProceeds: Math.round(
          (dilutedAngelOwnershipPct / 100) * (valuationCap * 3)
        ),
      },
      {
        scenario: "Growth (6x)",
        valuation: Math.round(valuationCap * 6),
        angelProceeds: Math.round(
          (dilutedAngelOwnershipPct / 100) * (valuationCap * 6)
        ),
      },
      {
        scenario: "Current Selected",
        valuation: exitValuation,
        angelProceeds: Math.round(proceedsAtExit),
      },
      {
        scenario: "Venture Home Run",
        valuation: Math.round(valuationCap * 20),
        angelProceeds: Math.round(
          (dilutedAngelOwnershipPct / 100) * (valuationCap * 20)
        ),
      },
    ];

    return {
      initialOwnershipPct: Math.min(100, Math.max(0, initialOwnershipPct)),
      dilutedAngelOwnershipPct: Math.min(100, Math.max(0, dilutedAngelOwnershipPct)),
      founderOwnershipPct: Math.min(100, Math.max(0, founderOwnershipPct)),
      seriesAInvestorPct: Math.min(100, Math.max(0, seriesAInvestorPct)),
      proceedsAtExit,
      moic,
      netProfit,
      exitScenarios,
    };
  }, [
    investmentAmount,
    valuationCap,
    safeType,
    discountRate,
    seriesAPreMoney,
    seriesARaise,
    esopPoolPct,
    exitValuation,
  ]);

  // Runway & Default Alive Calculations
  const runwayCalculations = useMemo(() => {
    const netBurn = Math.max(0, monthlyBurn - monthlyRevenue);
    const simpleRunwayMonths =
      netBurn > 0 ? Number((cashInBank / netBurn).toFixed(1)) : 999;

    // Simulate 24-month cash curve with MoM revenue compounding
    let currentCash = cashInBank;
    let rev = monthlyRevenue;
    const timelineData = [];
    let isDefaultAlive = false;
    let breakEvenMonth = -1;

    for (let m = 0; m <= 24; m++) {
      if (m > 0) {
        rev = rev * (1 + momGrowthPct / 100);
        const currentNetBurn = monthlyBurn - rev;
        currentCash = currentCash - currentNetBurn;
        if (rev >= monthlyBurn && breakEvenMonth === -1) {
          breakEvenMonth = m;
        }
      }

      timelineData.push({
        month: `M${m}`,
        cash: Math.max(0, Math.round(currentCash)),
        revenue: Math.round(rev),
        burn: monthlyBurn,
      });

      if (currentCash <= 0 && breakEvenMonth === -1) {
        break;
      }
    }

    if (breakEvenMonth !== -1 && currentCash > 0) {
      isDefaultAlive = true;
    }

    return {
      netBurn,
      runwayMonths: Math.min(simpleRunwayMonths, 120),
      isDefaultAlive,
      breakEvenMonth,
      timelineData,
    };
  }, [cashInBank, monthlyBurn, monthlyRevenue, momGrowthPct]);

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Venture Modeling Suite
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Financial & Dilution Forecaster
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Model SAFE cap conversions, Series A retention, and cash runway break-even trajectories.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl border border-border/80 bg-card p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("safe")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "safe"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SAFE & Cap Table Waterfall
          </button>
          <button
            onClick={() => setActiveTab("runway")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "runway"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cash Runway & Default Alive
          </button>
        </div>
      </div>

      {/* ==============================================================
          TAB 1: SAFE & CAP TABLE DILUTION
          ============================================================== */}
      {activeTab === "safe" && (
        <div className="space-y-8">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Initial SAFE Ownership
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
                {safeCalculations.initialOwnershipPct.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">At {formatINR(valuationCap)} Cap</p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Series A Diluted Stake
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-orange-500">
                {safeCalculations.dilutedAngelOwnershipPct.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">Post {esopPoolPct}% ESOP + Series A</p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Projected Exit Payout
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
                {formatINR(safeCalculations.proceedsAtExit)}
              </p>
              <p className="text-xs text-muted-foreground">Net Profit: {formatINR(safeCalculations.netProfit)}</p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Multiple on Invested Capital
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-amber-500">
                {safeCalculations.moic.toFixed(2)}x
              </p>
              <p className="text-xs text-muted-foreground">MOIC Return on Seed Ticket</p>
            </Card>
          </div>

          {/* Interactive Controls & Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Coins className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    1. Seed / Angel Terms
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Investment Check Size</span>
                      <span className="font-mono text-foreground">{formatINR(investmentAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={20000000}
                      step={500000}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Valuation Cap</span>
                      <span className="font-mono text-foreground">{formatINR(valuationCap)}</span>
                    </div>
                    <input
                      type="range"
                      min={10000000}
                      max={150000000}
                      step={5000000}
                      value={valuationCap}
                      onChange={(e) => setValuationCap(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-muted-foreground">SAFE Structure</span>
                    <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40">
                      <button
                        onClick={() => setSafeType("post-money")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                          safeType === "post-money"
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Post-Money (YC)
                      </button>
                      <button
                        onClick={() => setSafeType("pre-money")}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                          safeType === "pre-money"
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Pre-Money
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    2. Series A Dilution
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Series A Pre-Money Valuation</span>
                      <span className="font-mono text-foreground">{formatINR(seriesAPreMoney)}</span>
                    </div>
                    <input
                      type="range"
                      min={50000000}
                      max={500000000}
                      step={10000000}
                      value={seriesAPreMoney}
                      onChange={(e) => setSeriesAPreMoney(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Capital Raised in Series A</span>
                      <span className="font-mono text-foreground">{formatINR(seriesARaise)}</span>
                    </div>
                    <input
                      type="range"
                      min={10000000}
                      max={100000000}
                      step={5000000}
                      value={seriesARaise}
                      onChange={(e) => setSeriesARaise(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Unallocated ESOP Pool</span>
                      <span className="font-mono text-foreground">{esopPoolPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      step={1}
                      value={esopPoolPct}
                      onChange={(e) => setEsopPoolPct(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    3. Exit Valuation Modeling
                  </h3>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-muted-foreground">Exit Enterprise Value</span>
                    <span className="font-mono text-orange-500 font-bold">
                      {formatINR(exitValuation)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000000}
                    max={1000000000}
                    step={25000000}
                    value={exitValuation}
                    onChange={(e) => setExitValuation(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Post-Series A Cap Table Distribution
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner border border-border/80">
                    <div
                      style={{ width: `${safeCalculations.founderOwnershipPct}%` }}
                      className="bg-zinc-700 dark:bg-zinc-600 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${safeCalculations.dilutedAngelOwnershipPct}%` }}
                      className="bg-orange-500 shadow-[0_0_10px_rgba(255,128,0,0.5)] transition-all duration-300"
                    />
                    <div
                      style={{ width: `${safeCalculations.seriesAInvestorPct}%` }}
                      className="bg-amber-500 transition-all duration-300"
                    />
                    <div
                      style={{ width: `${esopPoolPct}%` }}
                      className="bg-zinc-400 dark:bg-zinc-500 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-background/60 border border-border/70">
                      <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-sm bg-zinc-600" />
                        <span className="font-semibold">Founders</span>
                      </div>
                      <p className="text-base font-extrabold font-mono">
                        {safeCalculations.founderOwnershipPct.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                      <div className="flex items-center gap-1.5 mb-1 text-orange-500">
                        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                        <span className="font-semibold">Your Stake</span>
                      </div>
                      <p className="text-base font-extrabold font-mono text-orange-500">
                        {safeCalculations.dilutedAngelOwnershipPct.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-500">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                        <span className="font-semibold">Series A VCs</span>
                      </div>
                      <p className="text-base font-extrabold font-mono text-amber-500">
                        {safeCalculations.seriesAInvestorPct.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-background/60 border border-border/70">
                      <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-sm bg-zinc-400" />
                        <span className="font-semibold">ESOP Pool</span>
                      </div>
                      <p className="text-base font-extrabold font-mono">
                        {esopPoolPct.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Angel Payout Across Exit Scenarios
                    </h3>
                  </div>
                </div>

                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={safeCalculations.exitScenarios}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="scenario"
                        stroke="currentColor"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        opacity={0.7}
                      />
                      <YAxis
                        stroke="currentColor"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        opacity={0.7}
                        tickFormatter={(v) =>
                          v >= 10000000 ? `${(v / 10000000).toFixed(0)}Cr` : `${(v / 100000).toFixed(0)}L`
                        }
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255, 128, 0, 0.08)" }}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                          fontWeight: 600,
                        }}
                        formatter={(value: any) => [
                          formatINR(Number(value || 0)),
                          "Angel Payout",
                        ]}
                      />
                      <Bar dataKey="angelProceeds" radius={[8, 8, 0, 0]} maxBarSize={55}>
                        {safeCalculations.exitScenarios.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.scenario === "Current Selected"
                                ? "#FF8000"
                                : entry.scenario.includes("Home Run")
                                ? "#FFA033"
                                : "#F59E0B"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: RUNWAY & DEFAULT ALIVE FORECASTER
          ============================================================== */}
      {activeTab === "runway" && (
        <div className="space-y-8">
          {/* Runway KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Runway Remaining
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
                {runwayCalculations.runwayMonths}
                <span className="text-base font-normal text-muted-foreground ml-1">months</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Zero Cash: Month {Math.floor(runwayCalculations.runwayMonths)}
              </p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Net Monthly Burn
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-orange-500">
                {formatINR(runwayCalculations.netBurn)}
              </p>
              <p className="text-xs text-muted-foreground">Expenses minus MRR</p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Venture Status
              </span>
              <div className="flex items-center gap-2 pt-1">
                {runwayCalculations.isDefaultAlive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default Alive
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" /> Default Dead
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Paul Graham Venture Rule</p>
            </Card>

            <Card className="bg-card border-border/70 rounded-2xl shadow-sm mclaren-card-hover p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Break-Even Month
              </span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-amber-500">
                {runwayCalculations.breakEvenMonth === -1
                  ? "N/A"
                  : `Month ${runwayCalculations.breakEvenMonth}`}
              </p>
              <p className="text-xs text-muted-foreground">Cash-flow positive threshold</p>
            </Card>
          </div>

          {/* Controls & Projection Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Hourglass className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Cash & Expense Model
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Current Cash in Bank</span>
                      <span className="font-mono text-foreground">{formatINR(cashInBank)}</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={100000000}
                      step={1000000}
                      value={cashInBank}
                      onChange={(e) => setCashInBank(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Gross Monthly Operating Expenses</span>
                      <span className="font-mono text-foreground">{formatINR(monthlyBurn)}</span>
                    </div>
                    <input
                      type="range"
                      min={200000}
                      max={10000000}
                      step={100000}
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">Current Monthly Revenue (MRR)</span>
                      <span className="font-mono text-foreground">{formatINR(monthlyRevenue)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10000000}
                      step={100000}
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-foreground">MoM Revenue Growth Rate</span>
                      <span className="font-mono text-orange-500 font-bold">{momGrowthPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35}
                      step={1}
                      value={momGrowthPct}
                      onChange={(e) => setMomGrowthPct(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Cash Trajectory Chart */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-card border-border/70 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      24-Month Projected Cash Trajectory
                    </h3>
                  </div>
                </div>

                <div className="h-[320px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={runwayCalculations.timelineData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF8000" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FF8000" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="month" stroke="currentColor" fontSize={11} opacity={0.7} />
                      <YAxis
                        stroke="currentColor"
                        fontSize={11}
                        opacity={0.7}
                        tickFormatter={(v) =>
                          v >= 10000000 ? `${(v / 10000000).toFixed(0)}Cr` : `${(v / 100000).toFixed(0)}L`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                        }}
                        formatter={(val: any) => [formatINR(Number(val || 0)), "Projected Cash"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="cash"
                        stroke="#FF8000"
                        strokeWidth={2.5}
                        fill="url(#cashGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
