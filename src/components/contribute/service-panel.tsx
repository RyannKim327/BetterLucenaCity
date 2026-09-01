"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { services as initialServices } from "@/lib/data/services";
import type { Service, Process } from "@/types/services";
import { CheckCircle2, Loader2, Plus, Trash2, Briefcase, ListOrdered } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-on-surface";

type ProcessDraft = Process;

const emptyProcess = (): ProcessDraft => ({ name: "", timeEstimation: "", amount: "" });

export function ServicePanel({ userEmail }: { userEmail: string }) {
  const [services, setServices] = useState<Service[]>([...initialServices]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [processes, setProcesses] = useState<ProcessDraft[]>([emptyProcess()]);

  function updateProcess(idx: number, field: keyof ProcessDraft, value: string) {
    setProcesses((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }

  function addProcess() {
    setProcesses((prev) => [...prev, emptyProcess()]);
  }

  function removeProcess(idx: number) {
    setProcesses((prev) => (prev.length === 1 ? [emptyProcess()] : prev.filter((_, i) => i !== idx)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const office = String(data.get("office") ?? "").trim();
    const featured = data.get("featured") === "on";
    const source = String(data.get("source") ?? "").trim();

    if (!name || !description || !office) {
      setStatus("error");
      setErrorMsg("Service name, description, and office are required.");
      return;
    }

    // Clean process array: filter out empty rows where all three are blank
    const cleaned: Process[] = processes
      .map((p) => ({ name: p.name.trim(), timeEstimation: p.timeEstimation.trim(), amount: p.amount.trim() }))
      .filter((p) => p.name || p.timeEstimation || p.amount);

    // Validate that if a row is partially filled, name is required
    for (const p of cleaned) {
      if (!p.name) {
        setStatus("error");
        setErrorMsg("Each process step needs a process name.");
        return;
      }
      if (!p.timeEstimation) p.timeEstimation = "—";
      if (!p.amount) p.amount = "Free";
    }

    const payload = {
      category: "Service Information",
      title: name,
      source,
      details: `Service: ${name} | Office: ${office} | Featured: ${featured ? "yes" : "no"} | ${description} | Process: ${JSON.stringify(cleaned)}`,
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
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setServices((prev) => [{ slug, name, description, office, featured, process: cleaned }, ...prev]);
      setStatus("success");
      form.reset();
      setProcesses([emptyProcess()]);
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
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Contribute service information</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Submitting as <span className="font-medium text-on-surface">{userEmail}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="s-name" className={labelClass}>
                  Service name <span className="text-secondary">*</span>
                </label>
                <input id="s-name" name="name" required placeholder="e.g., Business Permits & Licensing" className={fieldClass} />
              </div>

              <div>
                <label htmlFor="s-office" className={labelClass}>
                  Office / Department <span className="text-secondary">*</span>
                </label>
                <input id="s-office" name="office" required placeholder="e.g., Business Permits and Licensing Office" className={fieldClass} />
              </div>

              <div>
                <label htmlFor="s-desc" className={labelClass}>
                  Description <span className="text-secondary">*</span>
                </label>
                <textarea
                  id="s-desc"
                  name="description"
                  required
                  rows={3}
                  placeholder="What the service provides, who can avail, and key requirements..."
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-sm">
                <input type="checkbox" name="featured" className="h-4 w-4 rounded border-outline text-primary focus:ring-primary/30" />
                <span className="text-on-surface-variant">
                  <span className="font-medium text-on-surface">Featured</span> — highlight on Services page
                </span>
              </label>

              {/* Process array */}
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Process steps — array</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addProcess}
                    className="inline-flex items-center gap-1 rounded-full border border-outline px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/8"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add step
                  </button>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                  Each row is <code className="rounded bg-surface-container-low px-1 py-0.5 text-[11px]">[process name, time estimation, amt to pay or free]</code>. Leave blank to omit the whole array.
                </p>

                <div className="mt-3 space-y-3">
                  {processes.map((p, idx) => (
                    <div key={idx} className="grid gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low p-3 sm:grid-cols-[1.4fr_0.9fr_0.9fr_auto]">
                      <div>
                        <label className="block text-xs font-medium text-on-surface-variant">Process name</label>
                        <input
                          value={p.name}
                          onChange={(e) => updateProcess(idx, "name", e.target.value)}
                          placeholder="e.g., Submit requirements at BPLO window"
                          className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface-variant">Time estimation</label>
                        <input
                          value={p.timeEstimation}
                          onChange={(e) => updateProcess(idx, "timeEstimation", e.target.value)}
                          placeholder="e.g., 15 mins / 3 days"
                          className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface-variant">Amt to pay or Free</label>
                        <input
                          value={p.amount}
                          onChange={(e) => updateProcess(idx, "amount", e.target.value)}
                          placeholder="e.g., Free or ₱500"
                          className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeProcess(idx)}
                          aria-label="Remove step"
                          className="inline-flex size-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-secondary-container/40 hover:text-on-secondary-container"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="s-source" className={labelClass}>
                  Source / Reference link
                </label>
                <input id="s-source" name="source" type="url" placeholder="https://lucena.gov.ph/... or office posting URL" className={fieldClass} />
                <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant">Primary source or official reference link for validation.</p>
              </div>

              {status === "error" && (
                <p className="rounded-xl bg-secondary-container/40 px-4 py-3 text-sm text-on-secondary-container">{errorMsg}</p>
              )}
              {status === "success" && (
                <p className="flex items-center gap-2 rounded-xl bg-primary-container/40 px-4 py-3 text-sm text-on-primary-container">
                  <CheckCircle2 className="h-4 w-4" /> Submitted! It appears on the right immediately and awaits Validator review.
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
                    <Plus className="h-4 w-4" /> Add / Update service
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right: recent list */}
        <div className="flex-1 lg:max-w-[440px]">
          <Card className="sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent services</h3>
              <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-medium text-on-secondary-container">
                {services.length} total
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
              Keys shown: <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">name</code> · <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">office</code> · <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">featured</code> · <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">process[]</code>. New submissions appear at the top.
            </p>
            <ul className="mt-4 space-y-3 max-h-[640px] overflow-auto pr-1">
              {services.map((s, idx) => (
                <li
                  key={`${s.slug}-${idx}`}
                  className={`rounded-xl border px-3.5 py-3 ${s.featured ? "border-primary/20 bg-primary-container/10" : "border-outline-variant/40 bg-surface-container"}`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-snug">{s.name}</p>
                    {s.featured && (
                      <span className="rounded-full bg-primary-container px-2 py-0.5 text-[11px] font-medium text-on-primary-container">Featured</span>
                    )}
                    {idx === 0 && services.length > initialServices.length && (
                      <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-medium text-on-secondary-container">New</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wider text-secondary">{s.office}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant line-clamp-3">{s.description}</p>

                  {s.process && s.process.length > 0 ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant/30">
                      <table className="w-full text-xs">
                        <thead className="bg-surface-container-low">
                          <tr>
                            <th className="px-2 py-1.5 text-left font-semibold text-on-surface-variant">Process</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-on-surface-variant">Time</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-on-surface-variant">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/20">
                          {s.process.map((p, i) => (
                            <tr key={i} className="bg-surface-container">
                              <td className="px-2 py-1.5 text-on-surface">{p.name}</td>
                              <td className="px-2 py-1.5 text-on-surface-variant whitespace-nowrap">{p.timeEstimation}</td>
                              <td className="px-2 py-1.5 font-medium text-primary whitespace-nowrap">{p.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] italic text-on-surface-variant">No process steps yet — add via left form.</p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
              Static services + your just-added entries (pending approval). Please cite official sources.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
