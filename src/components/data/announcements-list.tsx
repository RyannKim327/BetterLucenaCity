"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
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

  return (
    <ul className="space-y-4">
      {visible.map((announcement) => (
        <li key={announcement.id}>
          <Card>
            <time dateTime={announcement.date_added} className="text-xs text-on-surface-variant">
              {formatDate(announcement.date_added)}
            </time>
            <h3 className="mt-1 text-lg font-semibold leading-snug">{announcement.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{announcement.content}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
