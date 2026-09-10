"use client";

import { useState } from "react";
import Link from "next/link";
import { ContributorsGrid } from "@/components/data/contributors-grid";
import { Modal } from "@/components/ui/modal";
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

export function ContributorsPageClient() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
        {/* Want to contribute — as modal trigger */}
        <div className="flex flex-col gap-4 rounded-card border border-primary/20 bg-primary-container/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <HeartHandshake className="h-5 w-5 text-primary" />
              Want to contribute?
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-on-surface-variant">
              Join the community — gather, verify, and share public information for Lucena City.
              No coding required. Learn what is needed and how review works before you register.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90"
          >
            Want to contribute
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Public contributors */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Public contributors
            </h3>
            <span className="text-xs text-on-surface-variant">Username only · opt-in · approved</span>
          </div>
          <div className="mt-4">
            <ContributorsGrid limit={50} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
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

        <p className="text-xs leading-relaxed text-on-surface-variant">
          Showing up to 50 approved public contributors who opted in to be listed. Pending contributors are hidden until a
          Maintainer approves them. Update your visibility in{" "}
          <Link href="/user/settings" className="font-medium text-primary hover:underline">
            Settings
          </Link>
          .
        </p>
      </section>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Want to contribute?">
        <div className="space-y-5">
          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-on-surface">No coding needed.</span> You can{" "}
                <span className="font-medium text-on-surface">gather, verify, validate, and share</span>{" "}
                information — hotlines, services, ordinances, budgets, advisories.
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
                <li>
                  • <span className="font-medium text-on-surface">Gather</span> — collect public info
                  from official sources
                </li>
                <li>
                  • <span className="font-medium text-on-surface">Verify</span> — flag outdated entries
                  with correct value + source
                </li>
                <li>
                  • <span className="font-medium text-on-surface">Report</span> — share budget,
                  procurement, or advisories with reference
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-on-surface">Requirements</h4>
              </div>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                <li>
                  • Must be{" "}
                  <span className="font-medium text-on-surface">valid & from a reliable source</span>
                </li>
                <li>• lucena.gov.ph, City Hall, DBM/DPWH/PSA/DILG, ordinances, FOI/COA</li>
                <li>
                  • Include <span className="font-medium text-on-surface">supporting document</span>:
                  link, PDF, photo, or ref. no.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-on-surface">How review works</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed">
              Routine reports → <span className="font-medium text-on-surface">Data Validator</span>{" "}
              reviews and publishes if valid.{" "}
              <span className="font-medium text-on-surface">Corrections & large datasets</span> →
              private 3-way discussion (you · Validator · Head Maintainer) before publication. Never a
              public GitHub Issue.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-on-surface">Roles you can request</h4>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>
                • <span className="font-medium text-on-surface">Data Collaborator</span> — gather &amp;
                submit reports. Strictly non-partisan.
              </li>
              <li>
                • <span className="font-medium text-on-surface">Data Validator</span> — review
                submissions. Requires research knowledge & non-partisan stance.
              </li>
              <li>
                • <span className="font-medium text-on-surface">Tester</span> — test features &amp;
                report bugs.
              </li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed">
              Request via{" "}
              <Link href="/contribute" className="font-medium text-primary hover:underline">
                /contribute
              </Link>{" "}
              after sign-in — your request will remain pending until approved by a Maintainer.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface">
                Privacy, respect &amp; anti-harassment
              </h4>
              <p className="mt-1 text-xs leading-relaxed">
                Credited by <span className="font-medium text-on-surface">username only</span> — opt
                in/out anytime. Email never public. We follow{" "}
                <span className="font-medium text-on-surface">RA 11313</span>. Harassed? Report at{" "}
                <Link href="/report" className="font-medium text-primary hover:underline">
                  /report
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/contribute"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4" />
              Register as contributor
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-outline bg-surface-container-low px-6 text-sm font-medium text-on-surface hover:bg-surface-container"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
