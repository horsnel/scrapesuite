import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScrapeSuite — Scrape in Plain English",
    short_name: "ScrapeSuite",
    description:
      "Natural Language Scraping API + Template Marketplace. Type what you need. Get structured data.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0E",
    theme_color: "#0A0A0E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
