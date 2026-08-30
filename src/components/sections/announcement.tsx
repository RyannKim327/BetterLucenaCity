import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/functions";
import { internalApiUrl } from "@/lib/sources/shared";
import axios from "axios";

interface AnnouncementInterface {
  id: number
  title: string
  content: string
  date_added: string
}

async function getLatestAnnouncements(): Promise<AnnouncementInterface[]> {
  try {
    const { data } = await axios.get<AnnouncementInterface[]>(internalApiUrl("/api/announcements"))
    if (Array.isArray(data)) return data.slice(0, 3)
  } catch {
    // fall back to empty list
  }
  return []
}

export default async function AnnouncementSection() {
  const latestAnnouncements = await getLatestAnnouncements()

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="announcements-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="announcements-heading" className="text-2xl font-semibold tracking-tight">
          Latest Announcements
        </h2>
        <Link href="/announcements" className="shrink-0 text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {latestAnnouncements.map((announcement) => (
          <li key={announcement.id}>
            <Card className="h-full">
              <time dateTime={announcement.date_added} className="text-xs text-on-surface-variant">
                {formatDate(announcement.date_added)}
              </time>
              <h3 className="mt-2 text-base font-semibold leading-snug">{announcement.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                {announcement.content}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
