import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import CheckPermission from "@/lib/roles";
import { report_types } from "@/lib/report-types";
import { ReportStatusToggle, ReportCommentForm } from "@/components/report/report-detail-client";
import { formatDate } from "@/lib/functions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card>
          <p className="text-sm text-on-surface-variant">You must be signed in to view reports.</p>
          <Link href="/report" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            &larr; Back to reports
          </Link>
        </Card>
      </div>
    );
  }

  const canSeeAll =
    (await CheckPermission(user.id, "maintainer").catch(() => false)) ||
    (await CheckPermission(user.id, "admin").catch(() => false));

  const { data: report, error } = await supabase
    .from("report")
    .select("id, user_id, title, content, type, report_source, unauth_email, done")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card>
          <p className="text-sm text-secondary">Failed to load report: {error.message}</p>
        </Card>
      </div>
    );
  }
  if (!report) notFound();

  if (!canSeeAll && report.user_id !== user.id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card>
          <p className="text-sm font-medium">403 — Forbidden</p>
          <p className="mt-1 text-sm text-on-surface-variant">You can only view your own reports.</p>
          <Link href="/report" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            &larr; Back to reports
          </Link>
        </Card>
      </div>
    );
  }

  const meta = report.type ? (report_types as Record<string, { name: string; description: string; public: boolean }>)[report.type] : null;

  const { data: comments } = await supabase
    .from("report_comment")
    .select("id, report_id, user_id, comment, date_added")
    .eq("report_id", id)
    .order("date_added", { ascending: true });

  // enrich usernames for maintainers
  let enrichedComments: Array<{ id: number; comment: string; date_added: string | null; displayName: string }> = [];
  if (comments && comments.length > 0) {
    if (canSeeAll) {
      const ids = [...new Set(comments.map((c) => c.user_id).filter(Boolean))] as string[];
      let map = new Map<string, string>();
      if (ids.length > 0) {
        const { data: users } = await supabase.from("users").select("id, username").in("id", ids);
        map = new Map(users?.map((u) => [u.id, u.username]) ?? []);
      }
      enrichedComments = comments.map((c) => ({
        id: c.id,
        comment: c.comment ?? "",
        date_added: c.date_added,
        displayName: c.user_id ? (map.get(c.user_id) ?? c.user_id.slice(0, 8)) : "Guest",
      }));
    } else {
      enrichedComments = comments.map((c) => ({
        id: c.id,
        comment: c.comment ?? "",
        date_added: c.date_added,
        displayName: c.user_id === user.id ? "You" : c.user_id ? c.user_id.slice(0, 8) : "Guest",
      }));
    }
  }

  const sourceUrl =
    report.report_source && typeof report.report_source === "object" && "url" in (report.report_source as Record<string, unknown>)
      ? String((report.report_source as Record<string, unknown>).url)
      : typeof report.report_source === "string"
        ? report.report_source
        : null;

  const isDone = report.done === true;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/report" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary">
        &larr; Back to reports
      </Link>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          {meta && (
            <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">{meta.name}</span>
          )}
          {meta && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.public ? "bg-primary-container text-on-primary-container" : "bg-outline-variant/40 text-on-surface-variant"}`}>
              {meta.public ? "Public" : "Private"}
            </span>
          )}
          <ReportStatusToggle reportId={report.id} isDone={isDone} canToggle={canSeeAll} />
          <span className="text-xs text-on-surface-variant">#{report.id.slice(0, 8)}</span>
        </div>

        <h1 className="mt-3 text-xl font-semibold leading-snug">{report.title}</h1>
        {meta && <p className="mt-1 text-xs text-on-surface-variant">{meta.description}</p>}

        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-on-surface-variant">{report.content}</div>

        {sourceUrl && (
          <p className="mt-4 text-sm">
            <span className="font-medium">Source:</span>{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {sourceUrl}
            </a>
          </p>
        )}
        {canSeeAll && report.unauth_email && <p className="mt-2 text-xs text-on-surface-variant">Guest email: {report.unauth_email}</p>}
        {canSeeAll && report.user_id && <p className="mt-1 text-xs text-on-surface-variant">Owner: {report.user_id}</p>}
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-semibold">Comments</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          {isDone && !canSeeAll
            ? "This report is marked done — new comments are disabled."
            : canSeeAll
              ? "Maintainers and owner can discuss. You can also toggle status above."
              : "You and maintainers can reply here."}
        </p>

        <div className="mt-4 space-y-3">
          {enrichedComments.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No comments yet.</p>
          ) : (
            enrichedComments.map((c) => (
              <div key={c.id} className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{c.displayName}</span>
                  {c.date_added && <span className="text-xs text-on-surface-variant">{formatDate(c.date_added)}</span>}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{c.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <ReportCommentForm reportId={report.id} disabledReason={isDone && !canSeeAll ? "Closed — marked done by maintainer." : null} />
        </div>
      </Card>
    </div>
  );
}
