import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/functions";
import axios from "axios";
import { internalApiUrl } from "@/lib/sources/shared";

export const metadata: Metadata = {
  title: "Announcements",
};

interface AnnouncementInterface {
  id: number
  title: string
  content: string
  date_added: string
}

async function getAnnouncements() {
  try {
    const { data } = await axios.get<AnnouncementInterface[]>(internalApiUrl("api/announcements"))
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function AnnouncementsPage() {
  const [announcements] = await Promise.all([getAnnouncements()])

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
                <time dateTime={announcement.date_added} className="text-xs text-on-surface-variant">
                  {formatDate(announcement.date_added)}
                </time>
                <h2 className="mt-1 text-lg font-semibold leading-snug">{announcement.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {announcement.content}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
