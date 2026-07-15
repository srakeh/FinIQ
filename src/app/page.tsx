import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

// Adding 'async' turns this into a Next.js Server Component
export default async function Home() {
  // We securely check the authentication status directly on the server
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-3xl text-center space-y-8">
        
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to <span className="text-emerald-400">FinIQ</span>
        </h1>
        
        <p className="text-lg text-zinc-400">
          The AI-powered platform for angel investors. Analyze startups, upload financial documents, and test your market knowledge.
        </p>

        <div className="flex justify-center items-center gap-4 pt-4">
          
          {/* If there is a userId, the user is LOGGED IN */}
          {userId ? (
            <div className="flex items-center gap-4">
              <Button size="lg" variant="outline" className="text-black border-zinc-700 hover:bg-zinc-100">
                Go to Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            // If there is NO userId, the user is LOGGED OUT
            <SignInButton mode="modal">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          )}
          
        </div>
      </div>
    </main>
  );
}