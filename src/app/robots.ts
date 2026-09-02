import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://betterlucenacity.org";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // INFO: Administrative / private routes — not for public indexing
        disallow: ["/admin", "/discussion"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
