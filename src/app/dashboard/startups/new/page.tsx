import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createStartup } from "@/actions/startup";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStartupPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 mt-6">
      <div className="space-y-2">
        <Link href="/dashboard/startups" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Startups
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Track New Startup</h1>
        <p className="text-zinc-500">Enter the company details to add them to your analysis pipeline.</p>
      </div>

      {/* The form securely triggers your backend Server Action when submitted */}
      <form action={createStartup} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" name="companyName" required placeholder="e.g. Quantum Ledger" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" required placeholder="e.g. Fintech" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Funding Stage</Label>
            <Input id="stage" name="stage" required placeholder="e.g. Pre-Series A" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Brief Description</Label>
          <Textarea id="description" name="description" placeholder="What does this company do?" rows={4} />
        </div>

        <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
          Save Startup to Database
        </Button>
      </form>
    </div>
  );
}