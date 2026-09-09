"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { formatDate } from "@/lib/functions";
import type { Announcement } from "@/types/announcements";

type ApiError = { error: string };

function Loading() {
  return (
    <p role="status" className="animate-pulse text-sm text-on-surface-variant">
      Loading announcements…
    </p>
  );
}

function Failed() {
  return <p className="text-sm text-red-600 dark:text-red-400">Unavailable right now. Please try again later.</p>;
}

export function AnnouncementsList({ limit }: { limit?: number }) {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    axios
      .get<Announcement[] | ApiError>("/api/announcements")
      .then((res) => {
        if ("error" in res.data || !Array.isArray(res.data)) {
          setFailed(true);
          return;
        }
        setAnnouncements(res.data);
      })
      .catch(() => setFailed(true));
  }, []);

  const visible = limit ? (announcements ?? []).slice(0, limit) : (announcements ?? []);

  if (failed) return <Failed />;

  if (!announcements) return <Loading />;

  if (announcements.length === 0) {
    return <p className="text-sm text-on-surface-variant">No announcements yet.</p>;
  }

  const isPreview = typeof limit === "number";

  return (
    <ul className="space-y-4">
      {visible.map((announcement) => (
        <li key={announcement.id}>
          <Card className="flex flex-col">
            <time dateTime={announcement.date_added} className="text-xs text-on-surface-variant">
              {formatDate(announcement.date_added)}
            </time>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{announcement.title}</h3>

            {isPreview ? (
              <>
                {/* Landing preview: title + date only, no content excerpt — full markdown on detail page */}
                <div className="mt-4">
                  <Link
                    href={`/announcements/${announcement.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Full list: markdown readable */}
                <div className="mt-3">
                  <Markdown content={announcement.content} />
                </div>
                {Array.isArray(announcement.data_source) && announcement.data_source.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {announcement.data_source.map((u, i) => (
                      <li key={`${u}-${i}`} className="truncate">
                        <a href={u} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                          {u}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <Link
                    href={`/announcements/${announcement.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant px-5 text-sm font-medium text-primary hover:bg-primary/8 transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
