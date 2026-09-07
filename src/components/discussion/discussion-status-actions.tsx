"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  discussionId: string
  isOpen: boolean | null
  approvedBy: string | null
  archiveBy: string | null
}

export function DiscussionStatusActions({ discussionId, isOpen, approvedBy, archiveBy }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function act(action: "approve" | "unapprove" | "archive" | "unarchive") {
    setLoading(action)
    setError(null)
    try {
      const res = await fetch(`/api/discussion/${discussionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error ?? "Action failed")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error")
    } finally {
      setLoading(null)
    }
  }

  const isApproved = !!approvedBy
  const isArchived = !!archiveBy && !approvedBy
  const isClosedTemp = isArchived
  const isClosedPerm = isApproved

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-4">
      <h3 className="text-sm font-semibold">Moderation (validator only)</h3>
      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
        <span className="font-medium text-on-surface">Approve</span> = close permanently &amp; publish linked record.{" "}
        <span className="font-medium text-on-surface">Archive</span> = temporarily close (can be reopened).
        Both set <code className="rounded bg-surface-container-low px-1 py-0.5">approved_by</code> / <code className="rounded bg-surface-container-low px-1 py-0.5">archive_by</code> to your user id.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {!isApproved ? (
          <button
            onClick={() => act("approve")}
            disabled={!!loading}
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary/90 disabled:opacity-60"
          >
            {loading === "approve" ? "Approving…" : "Approve & close"}
          </button>
        ) : (
          <button
            onClick={() => act("unapprove")}
            disabled={!!loading}
            className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant bg-surface px-5 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
          >
            {loading === "unapprove" ? "Reopening…" : "Unapprove (reopen)"}
          </button>
        )}

        {!isArchived && !isApproved ? (
          <button
            onClick={() => act("archive")}
            disabled={!!loading}
            className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant bg-surface px-5 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-60"
          >
            {loading === "archive" ? "Archiving…" : "Archive (temp close)"}
          </button>
        ) : null}

        {isArchived ? (
          <button
            onClick={() => act("unarchive")}
            disabled={!!loading}
            className="inline-flex h-9 items-center justify-center rounded-full border border-primary bg-primary-container px-5 text-sm font-medium text-on-primary-container hover:bg-primary-container/80 disabled:opacity-60"
          >
            {loading === "unarchive" ? "Reopening…" : "Unarchive (reopen)"}
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${isOpen === false ? "bg-outline-variant text-on-surface-variant" : "bg-primary-container text-on-primary-container"}`}>
          {isOpen === false ? "Closed" : "Open"}
        </span>
        {isApproved && <span className="rounded-full bg-tertiary-container px-3 py-1 text-xs font-medium text-on-tertiary-container">Approved by {approvedBy!.slice(0, 8)}</span>}
        {isClosedTemp && <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">Archived by {archiveBy!.slice(0, 8)}</span>}
        {isClosedPerm && <span className="rounded-full bg-error-container px-3 py-1 text-xs font-medium text-on-error-container">Permanently closed</span>}
        {isClosedTemp && <span className="rounded-full bg-surface-container-low border border-outline-variant/30 px-3 py-1 text-xs font-medium text-on-surface-variant">Temporarily closed</span>}
      </div>

      {error && <p className="mt-3 rounded-xl bg-secondary-container/40 px-4 py-2 text-sm text-on-secondary-container">{error}</p>}
    </div>
  )
}
