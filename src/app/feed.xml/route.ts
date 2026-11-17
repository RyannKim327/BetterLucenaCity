import { site } from "@/lib/data/site";
import { markdownToHtml } from "@/lib/markdown";
import { escapeXml, getPublishedAnnouncements, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const FEED_PATH = "/feed.xml";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const baseUrl = getSiteUrl();
  const feedUrl = `${baseUrl}${FEED_PATH}`;
  const announcements = await getPublishedAnnouncements(50);

  const items = announcements
    .map((announcement) => {
      const link = `${baseUrl}/announcements/${announcement.id}`;
      return `    <item>
      <title>${escapeXml(announcement.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${formatDate(announcement.date_added)}</pubDate>
      <description>${cdata(markdownToHtml(announcement.content))}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = announcements[0]
    ? formatDate(announcements[0].date_added)
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Announcements`)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-PH</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
