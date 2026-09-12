import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://better-lucena-city.vercel.app";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private / role-gated routes — not for public indexing (kept out of sitemap.xml)
        // Note: /report is public (listing/form); /report/[id] private threads are blocked via auth, not robots wildcard
        disallow: [
          "/admin",
          "/maintainer",
          "/discussion",
          "/contribute",
          "/user",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
