"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellRing,
  CheckCheck,
  Flag,
  Loader2,
  Megaphone,
  MessageSquare,
  UserCog,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/types/notifications";

const TYPE_ICONS: Record<string, typeof Bell> = {
  announcement: Megaphone,
  discussion: MessageSquare,
  report: Flag,
  account: UserCog,
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationBell({ auth }: { auth: boolean }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=20", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        notifications?: AppNotification[];
        unread?: number;
      };
      setItems(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) {
      setItems([]);
      setUnread(0);
      setUserId(null);
      return;
    }
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });
    return () => {
      mounted = false;
    };
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!auth || !userId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth, userId, load]);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  async function markRead(notification: AppNotification) {
    setOpen(false);
    if (!notification.read) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
      setUnread((count) => Math.max(0, count - 1));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notification.id }),
      }).catch(() => null);
      load();
    }
    if (notification.href) router.push(notification.href);
  }

  async function markAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnread(0);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    }).catch(() => null);
    load();
  }

  if (!auth) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) load();
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          unread > 0 ? `Notifications (${unread} unread)` : "Notifications"
        }
        className="relative inline-flex size-11 items-center justify-center rounded-full text-on-surface hover:bg-primary/8"
      >
        {unread > 0 ? (
          <BellRing size={22} aria-hidden />
        ) : (
          <Bell size={22} aria-hidden />
        )}
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-4 text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-2 w-[20rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-high shadow-elevation-3"
        >
          <div className="flex items-center justify-between border-b border-outline-variant/40 px-4 py-3">
            <p className="text-sm font-semibold text-on-surface">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck size={14} aria-hidden />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2
                  size={20}
                  className="animate-spin text-on-surface-variant"
                  aria-hidden
                />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell
                  size={22}
                  className="mx-auto text-on-surface-variant"
                  aria-hidden
                />
                <p className="mt-2 text-sm font-medium text-on-surface">
                  You&apos;re all caught up
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Enable update notifications in settings to hear about new
                  announcements, discussions and reports.
                </p>
              </div>
            ) : (
              <ul>
                {items.map((notification) => {
                  const Icon = TYPE_ICONS[notification.type] ?? Bell;
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => markRead(notification)}
                        className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/8 ${notification.read ? "" : "bg-primary-container/40"
                          }`}
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                          <Icon size={16} strokeWidth={1.8} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm font-medium text-on-surface">
                              {notification.title}
                            </span>
                            <span className="shrink-0 text-[10px] text-on-surface-variant">
                              {timeAgo(notification.date_added)}
                            </span>
                          </span>
                          {notification.body && (
                            <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-on-surface-variant">
                              {notification.body}
                            </span>
                          )}
                        </span>
                        {!notification.read && (
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
