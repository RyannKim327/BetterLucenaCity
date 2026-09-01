"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, FileText } from "lucide-react";
import type { ContributeCategory, ContributeFormProps } from "@/types/contribute";

type Status = "idle" | "submitting" | "success" | "error";

const CATEGORIES: ContributeCategory[] = [
  "Announcement",
  "Service Information",
  "Budget / Project",
  "Transparency Data",
  "Data Verification / Correction",
  "Report / Document",
  "Other",
];

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const labelClass = "block text-sm font-medium text-on-surface";
const hintClass = "mt-1.5 text-xs leading-relaxed text-on-surface-variant";

export function ContributeForm({ user }: ContributeFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      category: String(data.get("category") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      source: String(data.get("source") ?? "").trim(),
      supportingDocument: String(data.get("supportingDocument") ?? "").trim(),
      details: String(data.get("details") ?? "").trim(),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-outline-variant/40 bg-surface-container-low p-8 text-center shadow-elevation-1">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-lg font-semibold">Salamat po! (Thank you!)</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
          Your report has been received. Our Data Validators will review the source and supporting documents and
          publish verified information soon. We prioritize accuracy over speed — we&apos;ll follow up if more proof is
          needed.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-outline px-6 text-sm font-medium text-primary transition-colors hover:bg-primary/8"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Intro banner — emphasizes non-code contributions */}
      <div className="rounded-xl border border-primary/20 bg-primary-container/30 px-4 py-3">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-on-surface">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">Anyone can contribute — no coding required.</span> We welcome{" "}
            <span className="font-medium">data gathering, verification, validation, and transparency reports</span>.
            Please make sure your submission is <span className="font-medium">valid, from a reliable source, and includes supporting documents</span> whenever possible (link, PDF, photo, or reference no.).
          </span>
        </p>
      </div>

      <div>
        <label className={labelClass}>Submitting as</label>
        <p className="mt-1.5 rounded-xl border border-outline-variant/60 bg-surface-container px-3.5 py-2.5 text-sm text-on-surface-variant">
          {user.name ? `${user.name} · ` : ""}
          {user.email}
        </p>
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category <span className="text-secondary">*</span>
        </label>
        <select id="category" name="category" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className={hintClass}>
          Choose <em>Data Verification / Correction</em> to flag outdated info, or <em>Report / Document</em> for
          ordinances, budgets, and project reports.
        </p>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Title / Subject <span className="text-secondary">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={160}
          placeholder="e.g., Correction: Business permit fee for sari-sari store is ₱500 (not ₱800)"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="source" className={labelClass}>
          Source / Reference link
        </label>
        <input
          id="source"
          name="source"
          type="url"
          placeholder="https://lucena.gov.ph/... or official FB post URL"
          className={fieldClass}
        />
        <p className={hintClass}>
          Primary source preferred: lucena.gov.ph, City Hall bulletin, DBM/DPWH/PSA/DILG portals, published
          ordinance, or FOI/COA report. News articles should include the primary document they cite.
        </p>
      </div>

      <div>
        <label htmlFor="supportingDocument" className={labelClass}>
          Supporting document
        </label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-3 top-[1.35rem] h-4 w-4 text-on-surface-variant/60" />
          <input
            id="supportingDocument"
            name="supportingDocument"
            type="text"
            placeholder="URL to PDF/photo/scan, or describe: 'Ordinance No. 2026-04, issued 2026-03-10 by Sangguniang Panlungsod'"
            className={`${fieldClass} pl-9`}
          />
        </div>
        <p className={hintClass}>
          Link a document or describe it: reference number, date issued, issuing office, and where it can be verified.
          Photos/scans should show date &amp; venue. Redact private personal data before linking.
        </p>
      </div>

      <div>
        <label htmlFor="details" className={labelClass}>
          Details <span className="text-secondary">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          placeholder="Share what you know, why it matters, and how you verified it. For corrections: state the current (wrong) value, the correct value, and your source."
          className={`${fieldClass} resize-y`}
        />
        <p className={hintClass}>
          Be factual, non-partisan, and specific. If you visited an office, note the date and person/office that confirmed it.
        </p>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-sm text-on-surface-variant">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary/30"
        />
        <span>
          I confirm this information is <span className="font-medium text-on-surface">valid and from a reliable source</span>, with supporting documents linked or described where possible. I understand it will be reviewed and validated before publication, and held if no verifiable reference can be checked.
        </span>
      </label>

      {status === "error" && (
        <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium tracking-wide text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit contribution"
        )}
      </button>
    </form>
  );
}
