"use client";

import { useState, useEffect } from "react";
import { InvestorSummaryData, exportUserDataJson } from "@/actions/profile";
import { InvestmentProfileForm } from "@/components/features/investment-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  User,
  ShieldCheck,
  Award,
  FileText,
  Building2,
  GraduationCap,
  Download,
  Settings,
  Sliders,
  Database,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
  Globe,
  Bell,
  Cpu,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { UserButton } from "@clerk/nextjs";

interface Props {
  summary: InvestorSummaryData;
}

export function UserProfileView({ summary }: Props) {
  const [activeTab, setActiveTab] = useState<"criteria" | "preferences" | "account">("criteria");
  const [isExporting, setIsExporting] = useState(false);

  // Local display preferences
  const [currency, setCurrency] = useState("INR");
  const [aiDepth, setAiDepth] = useState("concise");
  const [digestFreq, setDigestFreq] = useState("weekly");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("finiq_currency") || "INR";
    const savedAiDepth = localStorage.getItem("finiq_ai_depth") || "concise";
    const savedDigest = localStorage.getItem("finiq_digest") || "weekly";
    setCurrency(savedCurrency);
    setAiDepth(savedAiDepth);
    setDigestFreq(savedDigest);
  }, []);

  const saveLocalPreferences = () => {
    localStorage.setItem("finiq_currency", currency);
    localStorage.setItem("finiq_ai_depth", aiDepth);
    localStorage.setItem("finiq_digest", digestFreq);
    toast.success("Platform display preferences saved!");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await exportUserDataJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FinIQ_Data_Export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Complete profile data archive downloaded!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const joinDate = new Date(summary.user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Identity & Accreditation Hero */}
      <Card className="bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              {summary.user.imageUrl ? (
                <img
                  src={summary.user.imageUrl}
                  alt={summary.user.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold ring-2 ring-emerald-500/30">
                  {summary.user.firstName?.[0] || "I"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {summary.user.fullName}
                </h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${summary.investorBadge.color}`}
                >
                  {summary.investorBadge.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500">{summary.user.email}</p>
              <div className="flex items-center gap-3 pt-1 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Member since {joinDate}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] truncate max-w-[140px]">
                  ID: {summary.user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-xs text-zinc-500">
              Profile Completeness: <span className="font-bold text-emerald-600 dark:text-emerald-400">{summary.profile.completionPct}%</span>
            </div>
            <div className="w-36 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${summary.profile.completionPct}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">
              {summary.investorBadge.level}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Quick Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Investor Mastery</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {summary.stats.quizAvgPct}%
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {summary.stats.quizCount} financial quizzes logged
          </p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Tracked Startups</span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {summary.stats.startupsCount}
          </div>
          <p className="text-xs text-zinc-400 mt-1">In active venture pipeline</p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Documents Ingested</span>
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {summary.stats.documentsCount}
          </div>
          <p className="text-xs text-zinc-400 mt-1">Parsed & OCR analyzed</p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Risk Appetite</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {summary.profile.riskTolerance}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {summary.profile.preferredStage} Focus
          </p>
        </Card>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab("criteria")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "criteria"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Sliders className="h-4 w-4" /> Investment Thesis & Criteria
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "preferences"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Settings className="h-4 w-4" /> Platform Preferences
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "account"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Account & Data Security
        </button>
      </div>

      {/* TAB 1: Investment Criteria */}
      {activeTab === "criteria" && (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Syndicate Profile & Investment Thesis
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              These preferences directly calibrate Gemini's startup recommendation engine and personalized due-diligence questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentProfileForm
              existingProfile={{
                riskTolerance: summary.profile.riskTolerance,
                preferredStage: summary.profile.preferredStage,
                interests: summary.profile.interests,
                checkSize: summary.profile.checkSize,
                targetMarket: summary.profile.targetMarket,
                bio: summary.profile.bio,
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Platform Preferences */}
      {activeTab === "preferences" && (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Platform & Interface Preferences
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Configure how monetary figures, AI responses, and alerts are rendered in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Currency Choice */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" /> Default Currency Display
              </Label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                    currency === "INR"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <p className="font-bold">Indian Rupee (₹ INR)</p>
                  <p className="text-xs opacity-80 mt-0.5">Format: ₹1,50,000 / ₹10 Lakhs</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                    currency === "USD"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <p className="font-bold">US Dollar ($ USD)</p>
                  <p className="text-xs opacity-80 mt-0.5">Format: $150,000 / $1.5M</p>
                </button>
              </div>
            </div>

            {/* AI Advisor Response Depth */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" /> AI Advisory Depth & Tone
              </Label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setAiDepth("concise")}
                  className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                    aiDepth === "concise"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <p className="font-bold">Executive Brief</p>
                  <p className="text-xs opacity-80 mt-0.5">Concise bullet points & fast takeaways</p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiDepth("institutional")}
                  className={`p-3 rounded-lg border text-sm font-medium text-left transition-all ${
                    aiDepth === "institutional"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <p className="font-bold">Institutional Deep-Dive</p>
                  <p className="text-xs opacity-80 mt-0.5">Full cap table & quantitative analysis</p>
                </button>
              </div>
            </div>

            {/* Intelligence Digest Frequency */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-500" /> Intelligence Digest Frequency
              </Label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {["daily", "weekly", "muted"].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setDigestFreq(freq)}
                    className={`p-2.5 rounded-lg border text-xs font-semibold capitalize text-center transition-all ${
                      digestFreq === freq
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {freq === "daily" ? "Daily" : freq === "weekly" ? "Weekly" : "Muted"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                onClick={saveLocalPreferences}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Account & Security */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Clerk Identity Card */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Clerk Authentication & Session
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Managed SSO identity, multi-factor authentication, and connected Google / GitHub accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-zinc-500" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Manage User Account & Credentials
                    </p>
                    <p className="text-xs text-zinc-500">
                      Change password, link Google accounts, or configure 2FA.
                    </p>
                  </div>
                </div>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonTrigger: "px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700",
                    },
                  }}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono">
                  <span className="text-zinc-400 block mb-0.5">Clerk User Identifier</span>
                  <span className="text-blue-500 truncate block">{summary.user.clerkId}</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono">
                  <span className="text-zinc-400 block mb-0.5">PostgreSQL Database UUID</span>
                  <span className="text-emerald-500 truncate block">{summary.user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Health & Infrastructure */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" /> Database & Cloud Infrastructure
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Connected production services backing your FinIQ workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-zinc-500">Database Engine</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Supabase PostgreSQL (Port 6543 Pooler)
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-zinc-500">ORM & Client</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">Prisma ORM 5.22.0 with PgAdapter</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-zinc-500">AI Model Tier</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Google Gemini 3.8 / 3.5 Multimodal Flash</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-zinc-500">Hosting & Runtime</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">Vercel Serverless Edge (Turbopack)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sovereignty & Export */}
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" /> Data Sovereignty & Portability
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Export an encrypted, machine-readable JSON snapshot of all your quiz evaluations, parsed document metadata, and tracked startups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4 text-emerald-500" />
                )}
                Export Full Account JSON
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
