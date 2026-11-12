"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FinancialChart({ documents }: { documents: any[] }) {
  // 1. Helper to clean currency strings (e.g. "₹ 50,000" or "$5,000" -> 50000)
  const parseCurrency = (val: string | null | undefined) => {
    if (!val || val === "N/A") return 0;
    const cleanNumber = val.replace(/[^0-9.-]+/g, "");
    return Number(cleanNumber) || 0;
  };

  // 2. Map the documents to structured chart data
  const chartData = documents
    .filter(doc => parseCurrency(doc.netIncome) > 0 || parseCurrency(doc.taxDeductions) > 0)
    .map(doc => ({
      name: doc.title.length > 15 ? doc.title.substring(0, 15) + "..." : doc.title,
      Income: parseCurrency(doc.netIncome),
      Taxes: parseCurrency(doc.taxDeductions),
    }))
    .slice(0, 5)
    .reverse(); 

  if (chartData.length === 0) {
    return null; 
  }

  return (
    <Card className="mb-8 bg-card border-border/70 rounded-2xl shadow-sm min-w-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
          <CardTitle className="text-foreground text-lg font-bold">Income vs. Taxes Breakdown</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-xs">
          Financial performance ratio of recent documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" vertical={false} opacity={0.12} />
              <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} />
              <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 128, 0, 0.06)' }}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  borderWidth: '1px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
                formatter={(value: any) => [
                  `₹${Number(value || 0).toLocaleString("en-IN")}`,
                  undefined,
                ]}
              />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}/>
              <Bar dataKey="Income" name="Net Income" fill="#FF8000" radius={[6, 6, 0, 0]} maxBarSize={50} />
              <Bar dataKey="Taxes" name="Tax Deductions" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
