import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FinancialChat } from "@/components/features/financial-chat";

export const maxDuration = 60;

export default async function ChatPage({
  searchParams,
}: {
  searchParams?: Promise<{ prompt?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialPrompt = resolvedParams?.prompt;

  return (
    <main className="h-full">
      <FinancialChat initialPrompt={initialPrompt} />
    </main>
  );
}
