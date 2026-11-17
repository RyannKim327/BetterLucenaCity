import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
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
