import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Production fallback — update NEXT_PUBLIC_SITE_URL in env for your deployment
  return "https://betterlucenacity.org";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // NOTE: Administrative and private routes are intentionally excluded:
  //  - /admin            → admin-only (pending contributors, approved=false)
  //  - /discussion       → private 3-way discussion (Source ↔ Validator ↔ Head Maintainer)
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
      // INFO: Primary navigation (src/lib/data/site.ts » navLinks)
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/services", changeFrequency: "weekly", priority: 0.9 },
      { path: "/transparency", changeFrequency: "daily", priority: 0.9 },
      { path: "/legal", changeFrequency: "weekly", priority: 0.8 },
      { path: "/announcements", changeFrequency: "daily", priority: 0.8 },
      { path: "/contact", changeFrequency: "monthly", priority: 0.7 },

      // INFO: Secondary public pages
      { path: "/contributors", changeFrequency: "weekly", priority: 0.6 },
      { path: "/report", changeFrequency: "monthly", priority: 0.5 },

      // INFO: Contributor portal — requires sign-in + approved role with `collect` permission
      // NOTE: Kept in sitemap so contributors can discover the portal; auth layout redirects guests to sign-in.
      { path: "/contribute", changeFrequency: "weekly", priority: 0.7 },
      { path: "/contribute/contacts", changeFrequency: "weekly", priority: 0.6 },
      { path: "/contribute/services", changeFrequency: "weekly", priority: 0.6 },
      { path: "/contribute/transparency", changeFrequency: "weekly", priority: 0.6 },
      { path: "/contribute/announcement", changeFrequency: "weekly", priority: 0.6 },
      { path: "/contribute/ordinances", changeFrequency: "weekly", priority: 0.6 },

      // INFO: Human-readable sitemap page itself
      { path: "/sitemap", changeFrequency: "monthly", priority: 0.4 },
    ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
