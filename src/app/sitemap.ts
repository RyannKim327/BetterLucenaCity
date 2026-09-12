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

  // NOTE: Only visitor-facing public URLs are included.
  // Excluded (private / role-gated — also disallowed in robots.ts):
  //  - /admin, /maintainer        → Head Maintainer / Maintainer only
  //  - /discussion, /discussion/* → private 3-way (Source ↔ Validator ↔ Head Maintainer)
  //  - /contribute, /contribute/* → requires sign-in + approved role
  //  - /user, /user/*             → authenticated user only
  //  - /report/[id]               → private report threads ( /report listing itself is public )
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
      // Primary navigation (src/lib/data/site.ts » navLinks)
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/services", changeFrequency: "weekly", priority: 0.9 },
      { path: "/transparency", changeFrequency: "daily", priority: 0.9 },
      { path: "/transparency/local-budget", changeFrequency: "weekly", priority: 0.8 },
      { path: "/transparency/procurement", changeFrequency: "weekly", priority: 0.8 },
      { path: "/legal", changeFrequency: "weekly", priority: 0.8 },
      { path: "/legal/fdp", changeFrequency: "monthly", priority: 0.6 },
      { path: "/announcements", changeFrequency: "daily", priority: 0.8 },
      { path: "/contact", changeFrequency: "monthly", priority: 0.7 },

      // Secondary public pages
      { path: "/barangays", changeFrequency: "monthly", priority: 0.6 },
      { path: "/history", changeFrequency: "monthly", priority: 0.6 },
      { path: "/contributors", changeFrequency: "weekly", priority: 0.6 },
      { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
      { path: "/report", changeFrequency: "monthly", priority: 0.5 },

      // Human-readable sitemap page itself
      { path: "/sitemap", changeFrequency: "monthly", priority: 0.4 },
    ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
