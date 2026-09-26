import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrapesuite.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/console",
          "/console/",
          "/proxy",
          "/proxy/",
          "/marketplace",
          "/marketplace/",
          "/jobs",
          "/analytics",
          "/settings",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
