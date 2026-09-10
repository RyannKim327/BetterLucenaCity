"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { ContributorsGrid } from "@/components/data/contributors-grid";
import {
  HeartHandshake,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Lock,
  ArrowRight,
  Eye,
  UserPlus,
} from "lucide-react";

export default function WantToContributeSection({ limit = 4 }: { limit?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
        aria-labelledby="want-to-contribute-heading"
      >
        {/* Header: Want to contribute trigger */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-secondary">
              Pakikibahagi · Bayanihan
            </p>
            <h2
              id="want-to-contribute-heading"
              className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Want to contribute?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              Help make Lucena City governance more transparent — gather, verify,
              and share information from reliable sources. No coding required.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90"
          >
            <HeartHandshake className="h-4 w-4" />
            Want to contribute
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Public contributors preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Public contributors
            </h3>
            <span className="text-xs text-on-surface-variant">
              Shown by username only · opt-in
            </span>
          </div>
          <div className="mt-4">
            <ContributorsGrid limit={limit} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contributors"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-outline bg-surface-container-low px-6 text-sm font-medium text-primary transition-colors hover:bg-surface-container"
          >
            <Eye className="h-4 w-4" />
            Show all contributors
          </Link>
          <Link
            href="/contribute"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Register as contributor
          </Link>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
          Contributors are credited by <span className="font-medium text-on-surface">username only</span> (opt in/out on{" "}
          <Link href="/contributors" className="font-medium text-primary hover:underline">
            /contributors
          </Link>
          ). Email is never public — used only for system notifications via the Head Maintainer.
        </p>
      </section>

      {/* Modal: Want to contribute details */}
      <Modal open={open} onClose={() => setOpen(false)} title="Want to contribute?">
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-on-surface">No coding needed.</span> You can <span className="font-medium text-on-surface">gather, verify, validate, and share</span> information that makes Lucena City more transparent — hotlines, services, ordinances, budgets, and advisories.
              </span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-on-surface">What you can do</h4>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                <li>• <span className="font-medium text-on-surface">Gather</span> — collect public info from official sources</li>
                <li>• <span className="font-medium text-on-surface">Verify</span> — flag outdated entries with correct value + source</li>
                <li>• <span className="font-medium text-on-surface">Report</span> — share budget, procurement, or advisories with reference</li>
              </ul>
            </div>

            <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-on-surface">Requirements</h4>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                <li>• Must be <span className="font-medium text-on-surface">valid & from a reliable source</span></li>
                <li>• lucena.gov.ph, City Hall, DBM/DPWH/PSA/DILG, ordinances, FOI/COA</li>
                <li>• Include <span className="font-medium text-on-surface">supporting document</span>: link, PDF, photo, or ref. no.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-on-surface">How review works</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed">
              Routine reports → <span className="font-medium text-on-surface">Data Validator</span> reviews and publishes if valid. <span className="font-medium text-on-surface">Corrections & large datasets</span> → private 3-way discussion on the website among <span className="font-medium text-on-surface">you (Source) · Validator · Head Maintainer</span> before publication. Never a public GitHub Issue — for privacy and mental health.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-on-surface">Roles you can request</h4>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>• <span className="font-medium text-on-surface">Data Collaborator</span> — regularly gather & submit reports. No credentials needed; reliability & <span className="font-medium">strictly non-partisan</span> gathering.</li>
              <li>• <span className="font-medium text-on-surface">Data Validator</span> — review submissions before publication. Requires research knowledge & strictly non-partisan stance.</li>
              <li>• <span className="font-medium text-on-surface">Tester</span> — help test features & report bugs.</li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed">
              Request via <Link href="/contribute" className="font-medium text-primary hover:underline">/contribute</Link> after sign-in — your request will remain pending until approved by a Maintainer.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface">Privacy, respect & anti-harassment</h4>
              <p className="mt-1 text-xs leading-relaxed">
                Credited by <span className="font-medium text-on-surface">username only</span> — opt in/out anytime. Email never public; used only for system notifications via Head Maintainer. We follow <span className="font-medium text-on-surface">RA 11313</span>. Harassed? Report privately at <Link href="/report" className="font-medium text-primary hover:underline">/report</Link> with proof.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contribute"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4" />
              Register as contributor
            </Link>
            <Link
              href="/contributors"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-outline bg-surface-container-low px-6 text-sm font-medium text-on-surface hover:bg-surface-container"
            >
              <Eye className="h-4 w-4" />
              Show all contributors
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
