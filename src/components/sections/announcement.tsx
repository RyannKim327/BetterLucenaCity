import Link from "next/link";
import { AnnouncementsList } from "@/components/data/announcements-list";

export default function AnnouncementSection() {
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

      <div className="mt-8">
        <AnnouncementsList limit={3} />
      </div>
    </section>
  )
}
