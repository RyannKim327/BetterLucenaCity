"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { report_types } from "@/lib/report-types";
import { Card } from "@/components/ui/card";

type ReportTypeKey = keyof typeof report_types;

interface Props {
  isAuthenticated: boolean;
}

export function ReportForm({ isAuthenticated }: Props) {
  const router = useRouter();
  const [type, setType] = useState<ReportTypeKey | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unauthEmail, setUnauthEmail] = useState("");
  const [reportSource, setReportSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const allowedEntries = Object.entries(report_types).filter(([, v]) => isAuthenticated || v.public) as [
    ReportTypeKey,
    (typeof report_types)[ReportTypeKey],
  ][];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!type) {
      setError("Please select a report type.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Title and details are required.");
      return;
    }
    if (!isAuthenticated && !unauthEmail.trim()) {
      setError("Email is required for guest reports (we use it only for follow-up).");
      return;
    }
    if (!isAuthenticated && unauthEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(unauthEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        type,
        title: title.trim(),
        content: content.trim(),
      };
      if (isAuthenticated) {
        payload.report_source = reportSource.trim() || null;
      } else {
        payload.unauth_email = unauthEmail.trim();
        payload.report_source = reportSource.trim() || null;
      }

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit report.");
        return;
      }
      setSuccess("Report submitted — maintainers will review it. Thank you for your malasakit.");
      setTitle("");
      setContent("");
      setReportSource("");
      if (!isAuthenticated) setUnauthEmail("");
      setType("");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold">File a report</h2>
      <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
        {isAuthenticated
          ? "You are signed in — all report types are available. System vulnerabilities, bias, and racism reports are visible only to maintainers."
          : "You are not signed in — only public report types are available (Data Misinformation, Security Concerns). Sign in to file system vulnerability, racism, or bias reports."}
      </p>

      {!isAuthenticated && (
        <p className="mt-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
          <span className="font-medium text-on-surface">Guest report</span> — your email is kept confidential under RA 10173 and used only for follow-up. It is never shown publicly.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="report-type" className="block text-sm font-medium">
            Report type <span className="text-secondary">*</span>
          </label>
          <select
            id="report-type"
            value={type}
            onChange={(e) => setType(e.target.value as ReportTypeKey)}
            className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a type</option>
            {allowedEntries.map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.name}
                {!meta.public ? " · (authenticated only)" : ""}
              </option>
            ))}
          </select>
          {type && (
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
              {(report_types as Record<string, { description: string }>)[type]?.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="report-title" className="block text-sm font-medium">
            Title <span className="text-secondary">*</span>
          </label>
          <input
            id="report-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary — e.g., Broken dataset link on transparency page"
            className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="report-content" className="block text-sm font-medium">
            Details <span className="text-secondary">*</span>
          </label>
          <textarea
            id="report-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Describe what happened, where (page/thread), when, who was involved, and attach or describe evidence."
            className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="report-source" className="block text-sm font-medium">
            Source / reference link <span className="text-xs font-normal text-on-surface-variant">(optional)</span>
          </label>
          <input
            id="report-source"
            type="url"
            value={reportSource}
            onChange={(e) => setReportSource(e.target.value)}
            placeholder="https://... (screenshot, thread export, or reference URL)"
            className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-on-surface-variant">If you have screenshot/proof, host or describe it here. Evidence is required for fair investigation.</p>
        </div>

        {!isAuthenticated && (
          <div>
            <label htmlFor="unauth-email" className="block text-sm font-medium">
              Your email <span className="text-secondary">*</span>
            </label>
            <input
              id="unauth-email"
              type="email"
              value={unauthEmail}
              onChange={(e) => setUnauthEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-on-surface-variant">Handled under RA 10173 — kept confidential and used only for follow-up.</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-secondary/30 bg-secondary-container/30 px-3 py-2 text-sm text-on-secondary-container">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-primary/30 bg-primary-container/30 px-3 py-2 text-sm text-on-primary-container">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit report"}
        </button>

        <p className="text-center text-xs leading-relaxed text-on-surface-variant">
          By submitting, you agree we handle your data per{" "}
          <span className="font-medium text-on-surface">RA 10173 (Data Privacy Act)</span> and investigate under{" "}
          <span className="font-medium text-on-surface">RA 11313 (Safe Spaces Act)</span> without bias.
        </p>
      </form>
    </Card>
  );
}
