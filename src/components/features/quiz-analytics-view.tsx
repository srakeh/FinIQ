"use client";

import {
  QuizAnalyticsData,
} from "@/actions/quiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const STUDY_GUIDE_MAP: Record<string, { advice: string; focusPoints: string[] }> = {
  "Angel Investing 101": {
    advice: "Focus on standard SAFE mechanics, pre-money valuation caps, and founder vesting cliffs.",
    focusPoints: [
      "Review post-money SAFE conversion math during Series A",
      "Understand why 4-year vesting with a 1-year cliff protects angel investors",
      "Master pro-rata rights and when to exercise them in follow-on rounds",
    ],
  },
  "Valuation & Cap Tables": {
    advice: "Sharpen your cap table modeling: pre vs post-money dilution and pre-money ESOP unallocated pools.",
    focusPoints: [
      "Practice Post-Money = Pre-Money + Investment Amount formulas",
      "Study how pre-money option pool expansions dilute founders rather than incoming investors",
      "Understand 1x non-participating liquidation preference thresholds",
    ],
  },
  "Indian Startup Taxation & Regulation": {
    advice: "Keep up-to-date with Budget 2024 abolitions and unlisted share holding periods.",
    focusPoints: [
      "Section 56(2)(viib) angel tax was fully abolished for all investor classes in Budget 2024",
      "Unlisted equities require 24 months holding for Long-Term Capital Gains (LTCG) treatment",
      "Review Section 80-IAC 3-year tax holidays for eligible DPIIT startups",
    ],
  },
  "Venture Capital Due Diligence": {
    advice: "Focus on sustainable unit economics, CAC payback cycles, and net revenue retention (NRR).",
    focusPoints: [
      "Target LTV:CAC >= 3:1 for sound unit economics",
      "Analyze CAC Payback Period: under 12 months for top-tier B2B SaaS",
      "Scrutinize unvested founder equity or single-point dependency risks",
    ],
  },
};

export function QuizAnalyticsView({ data }: { data: QuizAnalyticsData }) {
  if (data.totalAttempts === 0) {
    return (
      <Card className="max-w-2xl mx-auto p-12 text-center bg-white dark:bg-zinc-900 border-dashed border-2 border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mb-4">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          No Quiz Data Yet
        </h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-2 mb-6">
          Take your first 5-question financial quiz to unlock personalized mastery analytics, score progression charts, and due-diligence recommendations.
        </p>
        <Link href="/dashboard/quiz">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
            Take Your First Quiz <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </Card>
    );
  }

  const weakestGuide =
    data.weakestTopic && STUDY_GUIDE_MAP[data.weakestTopic]
      ? STUDY_GUIDE_MAP[data.weakestTopic]
      : null;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Quizzes */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500">
              Quizzes Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {data.totalAttempts}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Evaluations logged</p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500">
              Average Mastery
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {data.averageScorePct}%
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Best score: {data.bestScorePct}%
            </p>
          </CardContent>
        </Card>

        {/* Strongest Topic */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500">
              Strongest Domain
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
              {data.bestTopic || "N/A"}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              Top accuracy
            </p>
          </CardContent>
        </Card>

        {/* Weakest Topic */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500">
              Growth Focus
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
              {data.weakestTopic || "None — Great Balance!"}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
              Suggested review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Score Progression Timeline (Spans 4 columns) */}
        <Card className="lg:col-span-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm min-w-0">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Score Progression Over Time
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Track your financial accuracy % across consecutive quiz sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.timeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    stroke="#a1a1aa"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#a1a1aa"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                      color: "#f4f4f5",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, _name: any, item: any) => [
                      `${value}% (${item.payload.score}/${item.payload.totalScore})`,
                      item.payload.topic,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Topic Mastery Bar Chart (Spans 3 columns) */}
        <Card className="lg:col-span-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm min-w-0">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Domain Mastery Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Average accuracy percentage per financial topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topicBreakdown.map((t) => ({
                    name:
                      t.topic.length > 14 ? t.topic.slice(0, 14) + "..." : t.topic,
                    fullName: t.topic,
                    accuracy: t.averageScorePct,
                    attempts: t.attempts,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="name"
                    stroke="#a1a1aa"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#a1a1aa"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                      color: "#f4f4f5",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any, _name: any, item: any) => [
                      `${value}% avg (${item.payload.attempts} attempts)`,
                      item.payload.fullName,
                    ]}
                  />
                  <Bar
                    dataKey="accuracy"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation / Study Notes if growth area exists */}
      {weakestGuide && data.weakestTopic && (
        <Card className="bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-zinc-900 border-emerald-500/30">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> AI Study Recommendations
            </div>
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Leveling Up: {data.weakestTopic}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              {weakestGuide.advice}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-3">
              {weakestGuide.focusPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2"
                >
                  <BookOpen className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Link href="/dashboard/quiz">
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  Practice {data.weakestTopic} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Attempts History Table */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Historical Attempts
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Comprehensive log of all completed investor knowledge assessments.
            </CardDescription>
          </div>
          <Link href="/dashboard/quiz">
            <Button
              size="sm"
              variant="outline"
              className="border-zinc-300 dark:border-zinc-700 text-xs"
            >
              Take Another Quiz
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="py-3.5 flex items-center justify-between gap-4 text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                    {attempt.topic}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(attempt.completedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      attempt.percentage >= 80
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : attempt.percentage >= 60
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {attempt.score} / {attempt.totalScore} ({attempt.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
