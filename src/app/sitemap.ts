import type { MetadataRoute } from "next";
import { getPublishedAnnouncements, getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
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
      { path: "/transparency/national-projects", changeFrequency: "daily", priority: 0.8 },
      { path: "/transparency/procurement", changeFrequency: "weekly", priority: 0.8 },
      { path: "/legal", changeFrequency: "weekly", priority: 0.8 },
      { path: "/legal/fdp", changeFrequency: "monthly", priority: 0.6 },
      { path: "/announcements", changeFrequency: "daily", priority: 0.8 },
      { path: "/emergency/hotlines", changeFrequency: "monthly", priority: 0.7 },
      { path: "/emergency/planning", changeFrequency: "monthly", priority: 0.7 },

      // Secondary public pages
      { path: "/barangays", changeFrequency: "monthly", priority: 0.6 },
      { path: "/history", changeFrequency: "monthly", priority: 0.6 },
      { path: "/contributors", changeFrequency: "weekly", priority: 0.6 },
      { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
      { path: "/report", changeFrequency: "monthly", priority: 0.5 },

      // Human-readable sitemap page itself
      { path: "/sitemap", changeFrequency: "monthly", priority: 0.4 },
    ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const announcements = await getPublishedAnnouncements(1000);
  const announcementEntries: MetadataRoute.Sitemap = announcements.map((a) => ({
    url: `${baseUrl}/announcements/${a.id}`,
    lastModified: new Date(a.date_added),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...announcementEntries];
}
