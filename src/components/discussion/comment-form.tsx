"use client"

import { useState } from "react"

export function CommentForm({ discussionId }: { discussionId: string }) {
  const [comment, setComment] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle")
  const [error, setError] = useState<string>("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) {
      setError("Comment is required")
      setStatus("error")
      return
    }
    setStatus("submitting")
    setError("")
    try {
      const res = await fetch(`/api/discussion/${discussionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Failed to post comment")
      }
      setComment("")
      setStatus("idle")
      // reload to show new comment
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <label htmlFor="comment" className="block text-sm font-medium text-on-surface">Add a comment</label>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        required
        maxLength={2000}
        placeholder="Ask for source, confirm seal/date, note discrepancy — keep it factual and sourced."
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <p className="text-xs text-on-surface-variant">Your comment is posted as your user. Contributors can only comment on their own threads; validators can comment on any.</p>
      {status === "error" && error && <p className="rounded-xl bg-secondary-container/40 px-4 py-2 text-sm text-on-secondary-container">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Posting…" : "Post comment"}
      </button>
    </form>
  )
}
