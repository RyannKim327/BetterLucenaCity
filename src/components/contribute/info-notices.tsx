"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Info, ShieldCheck, ClipboardCheck, Users, Lock } from "lucide-react";
import Link from "next/link";

type NoticeKey = "gather" | "requirements" | "review" | "validator" | "privacy" | null;

export function InfoNotices() {
  const [active, setActive] = useState<NoticeKey>(null);

  return (
    <>
      <Card>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">Information notices</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Before contributing, review the guidelines. Tap a notice to read details — the same information previously shown on the right side.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActive("gather")}
            className="flex items-start gap-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3.5 py-3 text-left transition-colors hover:bg-primary/8"
          >
            <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium text-on-surface">What you can contribute</span>
              <span className="block text-xs text-on-surface-variant">Gather · Verify · Report</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("requirements")}
            className="flex items-start gap-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3.5 py-3 text-left transition-colors hover:bg-primary/8"
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium text-on-surface">Requirements</span>
              <span className="block text-xs text-on-surface-variant">Valid · Reliable · Documented</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("review")}
            className="flex items-start gap-2 rounded-xl border border-outline-variant/40 bg-surface-container px-3.5 py-3 text-left transition-colors hover:bg-primary/8"
          >
            <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium text-on-surface">How review works</span>
              <span className="block text-xs text-on-surface-variant">Private 3-way discussion</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("validator")}
            className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-container/20 px-3.5 py-3 text-left transition-colors hover:bg-primary-container/30"
          >
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium text-on-surface">Validator roles</span>
              <span className="block text-xs text-on-surface-variant">Research · Non-partisan</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActive("privacy")}
            className="flex items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-3.5 py-3 text-left transition-colors hover:bg-primary/8 sm:col-span-2"
          >
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium text-on-surface">Privacy, respect &amp; anti-harassment</span>
              <span className="block text-xs text-on-surface-variant">RA 11313 · Username only · Report at /report</span>
            </span>
          </button>
        </div>
      </Card>

      <Modal open={active === "gather"} onClose={() => setActive(null)} title="What you can contribute (no code needed)">
        <ul className="space-y-3">
          <li>
            <span className="font-medium text-on-surface">Gather</span> — collect public info on LGU services, fees, hotlines, ordinances, or programs from official sources.
          </li>
          <li>
            <span className="font-medium text-on-surface">Verify &amp; validate</span> — double-check existing details (e.g., office hours, addresses) and flag outdated entries with the correct value + source.
          </li>
          <li>
            <span className="font-medium text-on-surface">Report</span> — share budget data, project status, procurement notices, or advisories with a reference link or document.
          </li>
        </ul>
      </Modal>

      <Modal open={active === "requirements"} onClose={() => setActive(null)} title="Requirements for every report">
        <p>
          Anyone is welcome to share a report — it <span className="font-medium text-on-surface">must be valid, from a reliable source, with source/reference link where possible.</span>
        </p>
        <ul className="mt-3 space-y-2">
          <li>• <span className="font-medium">Reliable source:</span> lucena.gov.ph, City Hall postings, official LGU Facebook pages, DBM / DPWH / PSA / DILG portals, published ordinances, FOI/COA reports, or reputable news that cites the primary document.</li>
          <li>• <span className="font-medium">Source / Reference link:</span> URL to PDF/ordinance/dataset or official reference number + date + issuing office for verification.</li>
          <li>• No secondary-only claims — if you cite news, include the primary reference it mentions. Without any verifiable reference, your submission will be held until validated.</li>
        </ul>
      </Modal>

      <Modal open={active === "review"} onClose={() => setActive(null)} title="How review works">
        <p className="text-xs">
          Routine reports are reviewed by a <span className="font-medium text-on-surface">Data Validator</span> and published with attribution if valid.
        </p>
        <div className="mt-3 rounded-xl border border-outline-variant/40 bg-surface-container px-3 py-3">
          <p className="text-xs font-semibold text-on-surface">
            For data corrections &amp; larger datasets — private 3-way discussion on the website (not GitHub):
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
            To protect your privacy and mental health, this discussion is <span className="font-medium text-on-surface">never a public GitHub Issue</span> — only you, the Validator, and the Head Maintainer can see the thread.
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed">
            <li><span className="font-medium text-on-surface">Source (you)</span> submits via this form — the submission becomes a <span className="font-medium">private</span> discussion thread (not public).</li>
            <li><span className="font-medium text-on-surface">Data Validator</span> checks authenticity &amp; cross-references, then asks for more source/reference links <em>in the thread</em>.</li>
            <li><span className="font-medium text-on-surface">You reply in-thread</span> with clarifications or primary URLs — everything stays on-platform for auditability.</li>
            <li>Validator posts a recommendation (approve / revise / reject).</li>
            <li><span className="font-medium text-on-surface">Head Maintainer</span> reviews the full thread and gives the final decision — publish, return, or reject with a written non-partisan reason.</li>
          </ol>
        </div>
        <p className="mt-3">
          This prevents false information and quiet edits. Accuracy over speed — even one verified correction (e.g., hotline hours with office signage photo + city URL) is credited.
        </p>
      </Modal>

      <Modal open={active === "validator"} onClose={() => setActive(null)} title="Register for Data Gathering & Validator roles">
        <p>You may request:</p>
        <ul className="mt-2 space-y-2">
          <li>• <span className="font-medium text-on-surface">Data Collaborator</span> — for anyone who regularly gathers and submits public reports. No formal credentials needed; reliability is what matters.</li>
          <li>• <span className="font-medium text-on-surface">Data Validator</span> — for reviewers who approve submissions before publication.</li>
        </ul>
        <div className="mt-3 rounded-xl bg-surface-container px-3 py-2.5">
          <p className="text-xs font-semibold text-on-surface">Validator must have:</p>
          <ul className="mt-1.5 space-y-1.5 text-xs">
            <li>• <span className="font-medium">Research knowledge</span> — can trace primary sources, check reference no./seal/date, cross-reference, and spot altered/AI-generated documents.</li>
            <li>• <span className="font-medium">Non-partisan impartiality</span> — must not cherry-pick or suppress data to favor any political party, family, or candidate.</li>
            <li>• Willingness to disclose conflicts, recuse when involved, and correct published entries when new evidence appears.</li>
          </ul>
        </div>
        <p className="mt-3 text-xs">
          To request a role, message the Head Maintainer or a Maintainer privately via the website (not a public Issue) — include the role you want, a brief note on your research experience, and 1–2 sources you&apos;ve verified. Roles are assigned via the <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">user_type</code> enum.
        </p>
      </Modal>

      <Modal open={active === "privacy"} onClose={() => setActive(null)} title="Privacy, respect & anti-harassment">
        <p>
          Keep reports factual, non-partisan, and free of personal opinions. Redact private personal data (IDs, private addresses, personal phone numbers) before submitting. In the spirit of <em>malasakit</em>, we publish only what serves public transparency.
        </p>
        <p className="mt-2">
          You are credited by <span className="font-medium text-on-surface">username only</span> — opt in/out on <Link href="/contributors" className="font-medium text-primary hover:underline">/contributors</Link>. Email is never public; it&apos;s used only for system notifications via the Head Maintainer&apos;s account (validators never email you directly).
        </p>
        <p className="mt-2">
          We follow <span className="font-medium text-on-surface">RA 11313 (Anti-Bastos Law)</span> — we do not disgrace or judge people for who they are. Work professionally and ethically. If harassed, report privately at{" "}
          <Link href="/report" className="font-medium text-primary hover:underline">/report</Link> with screenshot/proof.
        </p>
      </Modal>
    </>
  );
}
