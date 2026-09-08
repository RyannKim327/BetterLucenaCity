"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  reportId: string;
  isDone: boolean;
  canToggle: boolean;
}

export function ReportStatusToggle({ reportId, isDone, canToggle }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canToggle) {
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${isDone ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"}`}>
        {isDone ? "Done" : "Pending"}
      </span>
    );
  }

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/report/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !isDone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDone ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"}`}>
        {isDone ? "Done" : "Pending"}
      </span>
      <button
        onClick={toggle}
        disabled={loading}
        className="rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 text-xs font-medium hover:bg-primary/8 disabled:opacity-60"
      >
        {loading ? "Saving…" : isDone ? "Mark pending" : "Mark done"}
      </button>
      {error && <span className="text-xs text-secondary">{error}</span>}
    </div>
  );
}

export function ReportCommentForm({ reportId, disabledReason }: { reportId: string; disabledReason?: string | null }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/report/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to post comment");
        return;
      }
      setComment("");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (disabledReason) {
    return <p className="rounded-xl bg-surface-container px-3 py-2 text-xs text-on-surface-variant">{disabledReason}</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Add a follow-up or clarification…"
        className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="text-xs text-secondary">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
