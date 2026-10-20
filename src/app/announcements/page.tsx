import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AnnouncementsList } from "@/components/data/announcements-list";

export const metadata: Metadata = {
  title: "Announcements",
};

export default function AnnouncementsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga Abiso at Balita"
        title="News & Announcements"
        description="Official advisories, notices, news, and updates from the City Government of Lucena."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <AnnouncementsList />
      </section>
    </div>
  );
}
