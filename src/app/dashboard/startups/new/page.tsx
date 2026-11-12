import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createStartup } from "@/actions/startup";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NewStartupPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 mt-4">
      <div className="space-y-2">
        <Link
          href="/dashboard/startups"
          className="text-xs font-semibold text-muted-foreground hover:text-orange-500 flex items-center mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Pipeline
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
            Pipeline Ingestion
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Track New Startup
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter company fundamentals to generate 5-axis algorithmic scorecards and deal memos.
        </p>
      </div>

      <form
        action={createStartup}
        className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border border-border/80 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider">
            Company Name
          </Label>
          <Input
            id="companyName"
            name="companyName"
            required
            placeholder="e.g. Zepto Delivery, Razorpay, PhysicsWallah"
            className="rounded-xl border-border/80 focus-visible:ring-orange-500 bg-background"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider">
              Industry Sector
            </Label>
            <Input
              id="industry"
              name="industry"
              required
              placeholder="e.g. Quick Commerce, Fintech, AI Infrastructure"
              className="rounded-xl border-border/80 focus-visible:ring-orange-500 bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-xs font-bold uppercase tracking-wider">
              Financing Stage
            </Label>
            <Input
              id="stage"
              name="stage"
              required
              placeholder="e.g. Pre-Seed, Seed, Series A"
              className="rounded-xl border-border/80 focus-visible:ring-orange-500 bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">
            Company Thesis & Moat
          </Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Explain the business model, unit economics, founder pedigree, and unfair advantage..."
            rows={4}
            className="rounded-xl border-border/80 focus-visible:ring-orange-500 bg-background resize-none text-sm"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-[0_0_15px_rgba(255,128,0,0.3)] transition-transform active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Ingest into Deal Pipeline
        </Button>
      </form>
    </div>
  );
}
