"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { ContributeCategory, ContributeFormProps } from "@/types/contribute";

type Status = "idle" | "submitting" | "success" | "error";

const CATEGORIES: ContributeCategory[] = [
  "Announcement",
  "Service Information",
  "Budget / Project",
  "Transparency Data",
  "Other",
];

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const labelClass = "block text-sm font-medium text-on-surface";

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
          Your contribution has been received. Our team will review the source and
          publish verified information soon.
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
          placeholder="Short summary of the information"
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
          placeholder="https://lucena.gov.ph/..."
          className={fieldClass}
        />
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
          placeholder="Share what you know and why it matters to Lucena."
          className={`${fieldClass} resize-y`}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-on-surface-variant">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary/30"
        />
        <span>
          I confirm this information comes from a reliable source and may be
          reviewed and published by the BetterGov.ph team.
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
