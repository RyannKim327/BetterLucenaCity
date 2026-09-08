"use client";

import { useRouter } from "next/navigation";

export type ReportTabKey = "all" | "pending" | "done";

interface Props {
  counts: { all: number; pending: number; done: number };
  current: ReportTabKey;
}

const TABS: { key: ReportTabKey; label: string; hint: string }[] = [
  { key: "all", label: "All", hint: "All reports" },
  { key: "pending", label: "Pending", hint: "Awaiting resolution" },
  { key: "done", label: "Done", hint: "Resolved / closed" },
];

export function ReportTabs({ counts, current }: Props) {
  const router = useRouter();

  function switchTab(key: ReportTabKey) {
    if (key === "all") router.push("/report");
    else router.push(`/report?tab=${key}`);
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-3">
        {TABS.map((t) => {
          const active = current === t.key;
          const count = counts[t.key] ?? 0;
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
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? "bg-on-primary/20 text-on-primary" : "bg-outline-variant/40 text-on-surface-variant"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
        {current === "pending" && "Pending reports are awaiting review by maintainers / Head Maintainers."}
        {current === "done" && "Done reports have been reviewed and marked as resolved."}
        {current === "all" && "All reports visible to you. Use tabs to filter by resolution state."}
      </p>
    </div>
  );
}
