import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk now recommends keeping middleware as simple as possible
// and putting the actual security checks inside the pages themselves.
export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};