import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { announcements } from "@/lib/data/announcements";

export const metadata: Metadata = {
  title: "Announcements",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AnnouncementsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga Abiso"
        title="Public Announcements"
        description="Official advisories, notices, and updates from the City Government of Lucena."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id}>
              <Card>
                <time dateTime={announcement.date} className="text-xs text-on-surface-variant">
                  {formatDate(announcement.date)}
                </time>
                <h2 className="mt-1 text-lg font-semibold leading-snug">{announcement.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {announcement.excerpt}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
