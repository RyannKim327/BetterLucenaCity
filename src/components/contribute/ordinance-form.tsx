"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { CheckCircle2, Loader2, Scale } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-on-surface";
const hintClass = "mt-1.5 text-xs leading-relaxed text-on-surface-variant";

const DOC_TYPES = [
  { id: "national_law", label: "National Law" },
  { id: "city_ordinance", label: "City Ordinance" },
  { id: "city_resolution", label: "City Resolution" },
  { id: "executive_order", label: "Executive Order" },
  { id: "memorandum", label: "Memorandum" },
] as const;

export function OrdinanceForm({ userEmail }: { userEmail: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const reference = String(data.get("reference") ?? "").trim();
    const summary = String(data.get("summary") ?? "").trim();
    const contentValue = content.trim();
    const date = String(data.get("date") ?? "").trim();
    const sourceUrl = String(data.get("sourceUrl") ?? "").trim();
    const sourceName = String(data.get("sourceName") ?? "").trim();

    if (!title || !type || !summary) {
      setStatus("error");
      setErrorMsg("Title, type, and summary are required.");
      return;
    }

    const payload = {
      category: "Report / Document",
      title,
      source: sourceUrl || reference,
      details: `Ordinance/Legal: ${title}\nType: ${type}\nReference: ${reference || "—"}\nDate: ${date || "—"}\nSummary: ${summary}\nContent (markdown): ${contentValue}\nSource/Reference: ${sourceName} ${sourceUrl || reference}`,
      consent: true,
    };

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to submit.");
      }
      setStatus("success");
      form.reset();
      setContent("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Card className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Salamat po!</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
            Your ordinance/legal document has been received. A Validator will check the reference, date, seal, and source before publication.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-outline px-6 text-sm font-medium text-primary hover:bg-primary/8"
          >
            Submit another
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Card>
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Submit an ordinance or legal document</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Submitting as <span className="font-medium text-on-surface">{userEmail}</span>. Include reference number, date, and source URL for verification.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="o-title" className={labelClass}>
              Title <span className="text-secondary">*</span>
            </label>
            <input
              id="o-title"
              name="title"
              required
              placeholder="e.g., An Ordinance Authorizing Traffic Rerouting Scheme in Lucena City"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="o-type" className={labelClass}>
                Document type <span className="text-secondary">*</span>
              </label>
              <select id="o-type" name="type" required defaultValue="" className={fieldClass}>
                <option value="" disabled>
                  Select type
                </option>
                {DOC_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="o-date" className={labelClass}>Proclamation / Effectivity date</label>
              <input id="o-date" name="date" type="date" className={fieldClass} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="o-ref" className={labelClass}>Reference number</label>
              <input id="o-ref" name="reference" placeholder="e.g., Ordinance No. 2915" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="o-source-name" className={labelClass}>Source name</label>
              <input id="o-source-name" name="sourceName" placeholder="e.g., Sangguniang Panlungsod - Lucena City" className={fieldClass} />
            </div>
          </div>

          <div>
            <label htmlFor="o-summary" className={labelClass}>
              Summary <span className="text-secondary">*</span>
            </label>
            <textarea
              id="o-summary"
              name="summary"
              required
              rows={3}
              placeholder="Brief summary of the ordinance — purpose and key provisions."
              className={`${fieldClass} resize-y`}
            />
            <p className={hintClass}>Will be shown as the card summary on the Legal page.</p>
          </div>

          <div>
            <label htmlFor="o-content" className={labelClass}>Full content / Details — markdown</label>
            <div className="mt-1.5">
              <MarkdownEditor
                id="o-content"
                name="content"
                value={content}
                onChange={setContent}
                placeholder="Full text (markdown). Use toolbar for **bold**, *italic*, ==highlight==, headings, lists, links. E.g.&#10;&#10;## Section 1 — Coverage&#10;This ordinance ==requires== all establishments to ...&#10;&#10;- Penalty: **₱400** for third offense&#10;- Effective: *Feb 2, 2026*"
                rows={8}
              />
            </div>
            <p className={hintClass}>Highlights with <code>==text==</code>, decor with <code>**bold**</code> <code>*italic*</code> <code>__underline__</code>, headings <code>##</code>, lists <code>-</code>. Preview keeps formatting.</p>
          </div>

          <div>
            <label htmlFor="o-source" className={labelClass}>Source URL</label>
            <input id="o-source" name="sourceUrl" type="url" placeholder="https://... official source or LawPhil link" className={fieldClass} />
            <p className={hintClass}>Primary source preferred. News articles should include the primary document they cite.</p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-sm text-on-surface-variant">
            <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary/30" />
            <span>
              I confirm this information is <span className="font-medium text-on-surface">valid and from a reliable source</span> and I have included reference details for validation.
            </span>
          </label>

          {status === "error" && <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit ordinance"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
