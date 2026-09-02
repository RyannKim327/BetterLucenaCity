"use client";

import { useEffect, useState } from "react";

type PendingUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  user_type: string | null;
  approved: boolean;
  date_added: string;
};

export function PendingList() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/pending");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setUsers(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function setApproved(id: string, approved: boolean) {
    setActing(id);
    setError("");
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setActing(null);
    }
  }

  if (loading) return <p className="animate-pulse text-sm text-on-surface-variant">Loading pending contributors…</p>;
  if (error) return <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</p>;
  if (users.length === 0) return <p className="text-sm text-on-surface-variant">No pending contributors — all requests are approved.</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-on-surface-variant">Pending (approved = false) — review who the contributors are before approving.</p>
      <ul className="divide-y divide-outline-variant/30 rounded-xl border border-outline-variant/40 bg-surface-container-low">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.username)}`}
              alt={u.username}
              className="size-10 rounded-full border border-outline-variant/40 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-on-surface">{u.username}</p>
              <p className="truncate text-xs text-on-surface-variant">{u.email} · {u.user_type ?? "no role"} · {new Date(u.date_added).toLocaleDateString()}</p>
            </div>
            <button
              type="button"
              disabled={acting === u.id}
              onClick={() => setApproved(u.id, true)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-on-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {acting === u.id ? "…" : "Approve"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
