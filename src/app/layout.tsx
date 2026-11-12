import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <Toaster position="bottom-right" theme="system" />
        </body>
      </html>
    </ClerkProvider>
  );
}
