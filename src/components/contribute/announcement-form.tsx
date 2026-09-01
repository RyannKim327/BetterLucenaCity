"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { CheckCircle2, Loader2, Megaphone } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-on-surface";
const hintClass = "mt-1.5 text-xs leading-relaxed text-on-surface-variant";

export function AnnouncementForm({ userEmail }: { userEmail: string }) {
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
    const contentValue = content.trim();
    const date = String(data.get("date") ?? "").trim();
    const source = String(data.get("source") ?? "").trim();

    if (!title || !contentValue) {
      setStatus("error");
      setErrorMsg("Title and content are required.");
      return;
    }

    const payload = {
      category: "Announcement",
      title,
      source,
      details: `Announcement: ${title}\nDate: ${date || "—"}\nContent (markdown): ${contentValue}`,
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
            Your announcement has been received and will be reviewed by a Validator before publication.
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
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Submit an announcement</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Submitting as <span className="font-medium text-on-surface">{userEmail}</span>. Keep advisories factual, non-partisan, and sourced.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="a-title" className={labelClass}>
              Title <span className="text-secondary">*</span>
            </label>
            <input id="a-title" name="title" required maxLength={160} placeholder="e.g., Traffic rerouting scheme effective Feb 2, 2026" className={fieldClass} />
          </div>

          <div>
            <label htmlFor="a-content" className={labelClass}>
              Content — markdown <span className="text-secondary">*</span>
            </label>
            <div className="mt-1.5">
              <MarkdownEditor
                id="a-content"
                name="content"
                value={content}
                onChange={setContent}
                placeholder="Full advisory (markdown). Use toolbar for **bold**, *italic*, ==highlight==, headings, lists, links. E.g.&#10;&#10;## Traffic Advisory — Feb 2, 2026&#10;==One-way== along Quezon Avenue. Please follow *enforcers* instructions.&#10;&#10;- Affected: Quezon Ave, M.L. Tagarao St&#10;- Hours: **8:00 AM – 5:00 PM**"
                rows={8}
              />
            </div>
            <p className={hintClass}>Highlights with <code>==text==</code>, decor with <code>**bold**</code> <code>*italic*</code> <code>__underline__</code>, headings <code>##</code>, lists <code>-</code>. Preview keeps formatting.</p>
          </div>

          <div>
            <label htmlFor="a-date" className={labelClass}>Date</label>
            <input id="a-date" name="date" type="date" className={fieldClass} />
            <p className={hintClass}>Effective or publication date of the announcement.</p>
          </div>

          <div>
            <label htmlFor="a-source" className={labelClass}>Source / Reference link</label>
            <input id="a-source" name="source" type="url" placeholder="https://lucena.gov.ph/... or official FB post" className={fieldClass} />
            <p className={hintClass}>Primary source or official reference link for validation.</p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-sm text-on-surface-variant">
            <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary/30" />
            <span>
              I confirm this information is <span className="font-medium text-on-surface">valid and from a reliable source</span> with source/reference link where possible.
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
              "Submit announcement"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
