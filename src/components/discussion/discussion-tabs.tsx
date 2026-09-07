"use client"

import { useRouter } from "next/navigation"

export type TabKey = "all" | "open" | "approved" | "archived"

interface Props {
  counts: { all: number; open: number; approved: number; archived: number }
  current: TabKey
}

const TABS: { key: TabKey; label: string; hint: string }[] = [
  { key: "all", label: "All", hint: "All threads" },
  { key: "open", label: "Open", hint: "Awaiting validation" },
  { key: "approved", label: "Approved", hint: "Closed permanently" },
  { key: "archived", label: "Archived", hint: "Temporarily closed" },
]

export function DiscussionTabs({ counts, current }: Props) {
  const router = useRouter()

  function switchTab(key: TabKey) {
    if (key === "all") router.push(`/discussion`)
    else router.push(`/discussion?tab=${key}`)
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-3">
        {TABS.map((t) => {
          const active = current === t.key
          const count = counts[t.key] ?? 0
          return (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-on-primary shadow-elevation-1"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
              aria-pressed={active}
              title={t.hint}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? "bg-on-primary/20 text-on-primary" : "bg-outline-variant/40 text-on-surface-variant"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-on-surface-variant">
        {current === "approved" && "Approved discussions are permanently closed and their linked records are published."}
        {current === "archived" && "Archived discussions are temporarily closed — a validator can unarchive to reopen."}
        {current === "open" && "Open discussions are awaiting validation — validators and the owner can comment."}
        {current === "all" && "All threads. Use tabs to filter by moderation state."}
      </p>
    </div>
  )
}
