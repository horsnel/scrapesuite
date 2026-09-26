import type { Metadata, Viewport } from "next";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrapesuite.vercel.app";
const TITLE = "ScrapeSuite — Scrape in Plain English";
const DESCRIPTION =
  "Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — ScrapeSuite",
  },
  description: DESCRIPTION,
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
  creator: "ScrapeSuite",
  applicationName: "ScrapeSuite",
  category: "technology",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "ScrapeSuite",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScrapeSuite — Type what you need. Get structured data.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0E",
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
