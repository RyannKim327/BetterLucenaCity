import Link from "next/link";
import { Card } from "@/components/ui/card";
import { report_types } from "@/lib/report-types";

export interface ReportRow {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  type: string | null;
  report_source: unknown;
  unauth_email: string | null;
  done: boolean | null;
}

function getTypeMeta(key: string | null) {
  if (!key) return null;
  return (report_types as Record<string, { name: string; description: string; public: boolean }>)[key] ?? null;
}

function getTypeLabel(key: string | null) {
  const meta = getTypeMeta(key);
  if (meta) return meta.name;
  return key ?? "Report";
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + "…";
}

interface Props {
  reports: ReportRow[];
  canSeeAll: boolean;
  currentTab: string;
}

export function ReportList({ reports, canSeeAll, currentTab }: Props) {
  if (reports.length === 0) {
    return (
      <Card>
        <p className="text-sm text-on-surface-variant">
          {currentTab === "done"
            ? canSeeAll
              ? "No done reports yet."
              : "You have no resolved reports yet."
            : currentTab === "pending"
              ? canSeeAll
                ? "No pending reports — all caught up."
                : "You have no pending reports."
              : canSeeAll
                ? "No reports yet."
                : "You have no reports yet. Use the form to file your first report."}
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {reports.map((r) => {
        const meta = getTypeMeta(r.type);
        const isDone = r.done === true;
        return (
          <li key={r.id}>
            <Card className="transition-colors hover:bg-surface-container">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
                  {getTypeLabel(r.type)}
                </span>
                {meta && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.public ? "bg-primary-container text-on-primary-container" : "bg-outline-variant/40 text-on-surface-variant"}`}
                    title={meta.public ? "Public — available to guests" : "Authenticated only"}
                  >
                    {meta.public ? "Public" : "Private"}
                  </span>
                )}
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDone ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container"}`}>
                  {isDone ? "Done" : "Pending"}
                </span>
                {canSeeAll && r.unauth_email && (
                  <span className="text-xs text-on-surface-variant" title={r.unauth_email}>
                    Guest · {r.unauth_email}
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">#{r.id.slice(0, 8)}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug">{r.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">{truncate(r.content, 160)}</p>
              {meta && <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">{truncate(meta.description, 120)}</p>}
              <div className="mt-3 flex items-center justify-between">
                <Link href={`/report/${r.id}`} className="text-xs font-medium text-primary hover:underline">
                  View details &rarr;
                </Link>
                {canSeeAll && r.user_id && <span className="text-xs text-on-surface-variant">owner {r.user_id.slice(0, 8)}…</span>}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
