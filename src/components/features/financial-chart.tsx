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
      // Shorten long titles so they fit nicely on the X-axis
      name: doc.title.length > 15 ? doc.title.substring(0, 15) + "..." : doc.title,
      Income: parseCurrency(doc.netIncome),
      Taxes: parseCurrency(doc.taxDeductions),
    }))
    .slice(0, 5) // Show only the 5 most recent documents
    .reverse(); 

  // Hide the chart entirely if no documents have extracted numbers yet
  if (chartData.length === 0) {
    return null; 
  }

  return (
    <Card className="mb-8 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-50">Income vs. Taxes</CardTitle>
        <CardDescription className="text-zinc-500">Financial breakdown of recent documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5', borderRadius: '8px' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar dataKey="Taxes" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}