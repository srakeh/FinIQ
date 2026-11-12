"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveInvestmentProfile } from "@/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

const RISK_OPTIONS = ["Conservative", "Moderate", "Aggressive"] as const;

const STAGE_OPTIONS = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth Stage",
] as const;

const CHECK_SIZE_OPTIONS = [
  "<$25K (Micro Angel)",
  "$25K - $50K (Standard)",
  "$50K - $100K (Syndicate)",
  "$100K+ (Super Angel)",
] as const;

const MARKET_OPTIONS = [
  "India & South Asia",
  "United States & Global",
  "Southeast Asia (SEA)",
  "Cross-Border Indo-US",
] as const;

const INTEREST_OPTIONS = [
  "Fintech",
  "HealthTech",
  "EdTech",
  "SaaS",
  "AI / ML",
  "CleanTech",
  "D2C / E-Commerce",
  "Agritech",
  "Logistics",
  "Deep Tech",
  "Web3 / Blockchain",
  "Gaming",
] as const;

interface Props {
  existingProfile?: {
    riskTolerance: string;
    preferredStage: string;
    interests: string[];
    checkSize?: string | null;
    targetMarket?: string | null;
    bio?: string | null;
  } | null;
}

export function InvestmentProfileForm({ existingProfile }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [risk, setRisk] = useState(
    existingProfile?.riskTolerance || "Moderate"
  );
  const [stage, setStage] = useState(
    existingProfile?.preferredStage || "Seed"
  );
  const [checkSize, setCheckSize] = useState(
    existingProfile?.checkSize || "$25K - $50K (Standard)"
  );
  const [targetMarket, setTargetMarket] = useState(
    existingProfile?.targetMarket || "India & South Asia"
  );
  const [bio, setBio] = useState(
    existingProfile?.bio || ""
  );
  const [interests, setInterests] = useState<string[]>(
    existingProfile?.interests || ["Fintech", "AI / ML"]
  );

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!risk || !stage || interests.length === 0) {
      toast.error("Please fill out all fields and select at least one interest.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("riskTolerance", risk);
    formData.set("preferredStage", stage);
    formData.set("interests", interests.join(","));
    formData.set("checkSize", checkSize);
    formData.set("targetMarket", targetMarket);
    formData.set("bio", bio);

    try {
      const result = await saveInvestmentProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Investment preferences updated successfully!");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Risk Tolerance */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Risk Tolerance
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {RISK_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRisk(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                risk === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Stage */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Preferred Investment Stage
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STAGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStage(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                stage === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Size Bracket */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Typical Ticket / Check Size
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {CHECK_SIZE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCheckSize(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
                checkSize === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Target Geography */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Geographic Focus
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTargetMarket(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
                targetMarket === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Interests */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Sector Interests{" "}
          <span className="text-zinc-400 font-normal">(select all that apply)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleInterest(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                interests.includes(option)
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-300 dark:hover:border-emerald-700"
              }`}
            >
              {interests.includes(option) && (
                <CheckCircle2 className="inline h-3 w-3 mr-1" />
              )}
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Investor Thesis / Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Investment Thesis & Syndicate Bio{" "}
          <span className="text-zinc-400 font-normal">(optional)</span>
        </Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="e.g. Backing technical founders in AI Infrastructure and B2B SaaS in India and US corridors with high-velocity product cycles."
          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !risk || !stage || interests.length === 0}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {existingProfile ? "Update Preferences" : "Save Preferences"}
      </Button>
    </form>
  );
}
