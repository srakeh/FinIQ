import { PortfolioAllocator } from "@/components/features/portfolio-allocator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Allocator & Power-Law Simulator | FinIQ",
  description:
    "Institutional venture portfolio constructor modeled on Carta and AngelList benchmarks. Calculate check sizes, reserve ratios, and power-law outcome distributions.",
};

export default function AllocatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PortfolioAllocator />
    </div>
  );
}
