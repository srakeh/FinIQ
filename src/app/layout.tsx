import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://askfiniq.online"),
  title: {
    default: "FinIQ — AI Angel Investment & Financial Due Diligence Intelligence",
    template: "%s | FinIQ",
  },
  description:
    "Production-grade financial platform for startup angel investors: multimodal AI document ingestion, conversational financial advisory, portfolio deal flow, and interactive education.",
  keywords: [
    "angel investing",
    "startup due diligence",
    "financial intelligence",
    "AI financial advisor",
    "SAFE notes",
    "cap table analysis",
    "venture capital",
    "portfolio management",
  ],
  authors: [{ name: "FinIQ Engineering Team", url: "https://askfiniq.online" }],
  creator: "FinIQ",
  openGraph: {
    title: "FinIQ — AI Angel Investment & Financial Due Diligence Intelligence",
    description:
      "Multimodal document analysis, AI financial advisory, deal flow matching, and angel investor learning engine.",
    url: "https://askfiniq.online",
    siteName: "FinIQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinIQ — AI Financial Intelligence Platform",
    description:
      "Multimodal financial document parsing, angel investing advisory, and startup deal analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased min-h-screen selection:bg-orange-500/20 selection:text-orange-500`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" theme="system" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
