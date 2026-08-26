import Link from "next/link";
import { Card } from "@/components/ui/card";
import { announcements } from "@/lib/data/announcements";
import { formatDate } from "@/lib/functions";

export default function AnnouncementSection() {
  const latestAnnouncements = announcements.slice(0, 3);

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
              <time dateTime={announcement.date} className="text-xs text-on-surface-variant">
                {formatDate(announcement.date)}
              </time>
              <h3 className="mt-2 text-base font-semibold leading-snug">{announcement.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                {announcement.excerpt}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
