"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  RefreshCw,
} from "lucide-react";
import { generateRecommendations } from "@/actions/recommendation";

interface Recommendation {
  companyName: string;
  industry: string;
  stage: string;
  matchScore: number;
  reasoning: string;
  risks: string;
  opportunity: string;
}

export function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateRecommendations();

      if (!result.success) {
        setError(result.error || "Failed to generate recommendations");
        return;
      }

      setRecommendations(result.recommendations || []);
      setModel(result.model || null);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800";
    if (score >= 75) return "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800";
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            AI-Powered Matches
          </h2>
          <p className="text-sm text-zinc-500">
            Personalized startup recommendations based on your investor profile.
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : recommendations.length > 0 ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? "Analyzing..."
            : recommendations.length > 0
              ? "Refresh"
              : "Generate Recommendations"}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && !error && (
        <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Sparkles className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">
            Click &quot;Generate Recommendations&quot; to get AI-matched startup
            opportunities tailored to your investment profile.
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation Cards */}
      {recommendations.length > 0 && (
        <div className="grid gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {rec.companyName}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {rec.industry} • {rec.stage}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold border ${scoreColor(rec.matchScore)}`}
                >
                  {rec.matchScore}%
                </span>
              </div>

              {/* Reasoning */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-1">
                  <Target className="h-3 w-3" /> WHY THIS MATCHES
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {rec.reasoning}
                </p>
              </div>

              {/* Risks & Opportunity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                    <AlertTriangle className="h-3 w-3" /> KEY RISKS
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {rec.risks}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                    <TrendingUp className="h-3 w-3" /> OPPORTUNITY
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {rec.opportunity}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <p className="text-[10px] text-zinc-400 text-center">
            AI-generated recommendations for educational purposes. Not
            financial advice. Always perform your own due diligence.
          </p>
        </div>
      )}
    </div>
  );
}
