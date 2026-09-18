import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScrapeSuite — Scrape in Plain English",
  description:
    "Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.",
  keywords: [
    "web scraping",
    "API",
    "natural language",
    "data extraction",
    "ScrapeSuite",
    "scraping API",
    "template marketplace",
  ],
  authors: [{ name: "ScrapeSuite" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ScrapeSuite — Scrape in Plain English",
    description:
      "Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.",
    url: "https://scrapesuite.com",
    siteName: "ScrapeSuite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrapeSuite — Scrape in Plain English",
    description:
      "Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sourceCodePro.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
