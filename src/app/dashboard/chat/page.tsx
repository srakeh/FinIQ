import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FinancialChat } from "@/components/features/financial-chat";

export const maxDuration = 60;

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="h-full">
      <FinancialChat />
    </main>
  );
}
