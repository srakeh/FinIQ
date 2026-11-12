import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CapTableSimulator } from "@/components/features/cap-table-simulator";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="p-6">
      <CapTableSimulator />
    </main>
  );
}
