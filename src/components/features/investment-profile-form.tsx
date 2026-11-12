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
  } | null;
}

export function InvestmentProfileForm({ existingProfile }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [risk, setRisk] = useState(
    existingProfile?.riskTolerance || ""
  );
  const [stage, setStage] = useState(
    existingProfile?.preferredStage || ""
  );
  const [interests, setInterests] = useState<string[]>(
    existingProfile?.interests || []
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

    try {
      const result = await saveInvestmentProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Investment profile saved!");
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
        <Label className="text-sm font-medium">Risk Tolerance</Label>
        <div className="grid grid-cols-3 gap-2">
          {RISK_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRisk(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                risk === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Stage */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Preferred Investment Stage</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STAGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStage(option)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                stage === option
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Interests */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
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
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-300"
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
        {existingProfile ? "Update Profile" : "Save Profile"}
      </Button>
    </form>
  );
}
