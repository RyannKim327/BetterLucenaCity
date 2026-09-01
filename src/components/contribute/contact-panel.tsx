"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { hotlines as initialHotlines } from "@/lib/data/hotlines";
import { CheckCircle2, Loader2, Plus, Phone, Trash2 } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-on-surface";
const hintClass = "mt-1.5 text-xs leading-relaxed text-on-surface-variant";

type HotlineLocal = { name: string; dial: string[]; head: boolean };

export function ContactPanel({ userEmail }: { userEmail: string }) {
  const [hotlines, setHotlines] = useState<HotlineLocal[]>([...initialHotlines] as HotlineLocal[]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dials, setDials] = useState<string[]>([""]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const head = data.get("head") === "on";
    const source = String(data.get("source") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    const dial = dials.map((d) => d.trim()).filter(Boolean);

    if (!name || dial.length === 0) {
      setStatus("error");
      setErrorMsg("Name and at least one phone number are required.");
      return;
    }

    const payload = {
      category: "Service Information",
      title: name,
      source,
      details: `Contact: ${name} | dial: ${dial.join(", ")} | head: ${head ? "yes" : "no"} | ${details}`,
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
      // Add to local recent list for immediate feedback ("they may also add one if ever")
      setHotlines((prev) => [{ name, dial, head }, ...prev]);
      setStatus("success");
      form.reset();
      setDials([""]);
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: form */}
        <div className="flex-1">
          <Card>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Contribute contact information</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Submitting as <span className="font-medium text-on-surface">{userEmail}</span>. Add or correct a hotline or office contact. Include source / reference link where possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="c-name" className={labelClass}>
                  Office / Hotline name <span className="text-secondary">*</span>
                </label>
                <input id="c-name" name="name" required placeholder="e.g., Lucena City PNP" className={fieldClass} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Phone number(s) <span className="text-secondary">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setDials((prev) => [...prev, ""])}
                    className="inline-flex items-center gap-1 rounded-full border border-outline px-3 py-1 text-xs font-medium text-primary hover:bg-primary/8"
                  >
                    <Plus className="h-3 w-3" /> Add number
                  </button>
                </div>
                <div className="mt-1.5 space-y-2">
                  {dials.map((value, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={value}
                        onChange={(e) => setDials((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))}
                        required={idx === 0}
                        placeholder={idx === 0 ? "e.g., (042) 373-7249" : "e.g., 0970 128 5078"}
                        className={`${fieldClass} mt-0 flex-1`}
                        aria-label={`Phone number ${idx + 1}`}
                      />
                      {dials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDials((prev) => prev.filter((_, i) => i !== idx))}
                          aria-label={`Remove phone number ${idx + 1}`}
                          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-secondary-container/40 hover:text-on-secondary-container"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className={hintClass}>Tap <span className="font-medium text-on-surface">+ Add number</span> to add another line — each number is stored separately and shown as a clickable tel: link.</p>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-sm">
                <input type="checkbox" name="head" className="h-4 w-4 rounded border-outline text-primary focus:ring-primary/30" />
                <span className="text-on-surface-variant">
                  <span className="font-medium text-on-surface">Head office</span> — primary/emergency hotline (shown prominently)
                </span>
              </label>

              <div>
                <label htmlFor="c-source" className={labelClass}>Source / Reference link</label>
                <input id="c-source" name="source" type="url" placeholder="https://lucena.gov.ph/... or official FB post" className={fieldClass} />
                <p className={hintClass}>Primary source or official reference link for validation.</p>
              </div>

              <div>
                <label htmlFor="c-details" className={labelClass}>Details / Verification note</label>
                <textarea
                  id="c-details"
                  name="details"
                  rows={3}
                  placeholder="How did you verify this contact? e.g., visited office, photo of signage, official website"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              {status === "error" && (
                <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">{errorMsg}</p>
              )}
              {status === "success" && (
                <p className="flex items-center gap-2 rounded-xl bg-primary-container/40 px-4 py-3 text-sm text-on-primary-container">
                  <CheckCircle2 className="h-4 w-4" /> Submitted! It appears on the right immediately and will be reviewed by a Validator before publication.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 hover:bg-primary/90 disabled:opacity-70"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add / Update contact
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right: recent information list */}
        <div className="flex-1 lg:max-w-[420px]">
          <Card className="sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent contacts</h3>
              <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-medium text-on-secondary-container">
                {hotlines.length} total
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              Live list of hotlines and office contacts. New submissions you add appear at the top and are flagged for validation. You may add one anytime via the form on the left.
            </p>
            <ul className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1">
              {hotlines.map((h, idx) => (
                <li
                  key={`${h.name}-${idx}`}
                  className={`rounded-xl border px-3.5 py-3 ${h.head ? "border-primary/20 bg-primary-container/15" : "border-outline-variant/40 bg-surface-container"}`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{h.name}</p>
                    {h.head && (
                      <span className="rounded-full bg-primary-container px-2 py-0.5 text-[11px] font-medium text-on-primary-container">Head</span>
                    )}
                    {idx === 0 && hotlines.length > initialHotlines.length && (
                      <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-medium text-on-secondary-container">New</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {h.dial.map((n, i) => (
                      <a
                        key={`${i}-${n}`}
                        href={`tel:${n.replace(/[^+\d]/g, "")}`}
                        className="rounded-full bg-surface-container-low px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/8 hover:underline"
                      >
                        {n}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
              Source: static hotlines + your just-added entries (pending Validator approval). Edits require a verifiable source.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
