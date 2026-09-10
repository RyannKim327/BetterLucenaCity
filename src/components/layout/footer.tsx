"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks, site } from "@/lib/data/site";
import { hotlines } from "@/lib/data/hotlines";
import { Modal } from "@/components/ui/modal";
import { ContributorsGrid } from "@/components/data/contributors-grid";
import {
  HeartHandshake,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Lock,
  Eye,
  UserPlus,
} from "lucide-react";

export function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="mt-20 border-t border-outline-variant/40 bg-surface-container">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold">
            {site.name} — {site.locality}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-surface-variant">
            {site.description}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            {site.cityHallAddress}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Navigate
          </p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-on-surface hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/report" className="text-sm text-on-surface hover:text-primary">
                Report
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-on-surface hover:text-primary">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            Emergency Hotlines
          </p>
          <ul className="mt-3 space-y-2">
            {hotlines.map((hotline) => (
              <li key={hotline.name} className="text-sm">
                <span className="text-on-surface-variant">{hotline.name}: </span>
                <a href={`tel:${hotline.dial.join(" ").replace(/[^+\d]/g, "")}`} className="font-medium hover:text-primary">
                  {hotline.dial.join(" | ")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant/40 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mx-auto max-w-6xl px-4 text-xs text-on-surface-variant sm:px-6">
          <p>© {new Date().getFullYear()} {site.name} · {site.tagline}</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="font-medium text-on-surface-variant hover:text-primary hover:underline">
              Privacy Policy
            </Link>
            <span className="text-outline-variant">·</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-medium text-primary hover:underline"
            >
              Be one of us? Be a contributor?
            </button>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Want to contribute?" size="lg">
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-on-surface">No coding needed.</span> You can{" "}
                <span className="font-medium text-on-surface">gather, verify, validate, and share</span>{" "}
                information that makes Lucena City more transparent — hotlines, services, ordinances,
                budgets, and advisories.
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
              <span className="font-medium text-on-surface">Corrections & large datasets</span> → private
              3-way discussion on the website among{" "}
              <span className="font-medium text-on-surface">you (Source) · Validator · Head Maintainer</span>{" "}
              before publication. Never a public GitHub Issue — for privacy and mental health.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary-container/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-on-surface">Roles you can request</h4>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              <li>
                • <span className="font-medium text-on-surface">Data Collaborator</span> — regularly
                gather & submit reports. No credentials needed; strictly non-partisan.
              </li>
              <li>
                • <span className="font-medium text-on-surface">Data Validator</span> — review
                submissions before publication. Requires research knowledge & non-partisan stance.
              </li>
              <li>
                • <span className="font-medium text-on-surface">Tester</span> — help test features &
                report bugs.
              </li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed">
              Request via{" "}
              <Link href="/contribute" className="font-medium text-primary hover:underline">
                /contribute
              </Link>{" "}
              after sign-in — your request will be pending until a Maintainer reviews and approves it.
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface">Privacy, respect & anti-harassment</h4>
              <p className="mt-1 text-xs leading-relaxed">
                Credited by <span className="font-medium text-on-surface">username only</span> — opt
                in/out anytime. Email never public; used only for system notifications via Head
                Maintainer. We follow <span className="font-medium text-on-surface">RA 11313</span>.
                Harassed? Report privately at{" "}
                <Link href="/report" className="font-medium text-primary hover:underline">
                  /report
                </Link>{" "}
                with proof.
              </p>
            </div>
          </div>

          {/* Public contributors preview */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                Public contributors
              </h4>
              <span className="text-xs text-on-surface-variant">Username only · opt-in</span>
            </div>
            <div className="mt-3">
              <ContributorsGrid limit={4} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/contributors"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-outline bg-surface-container-low px-6 text-sm font-medium text-primary transition-colors hover:bg-surface-container"
            >
              <Eye className="h-4 w-4" />
              Show all contributors
            </Link>
            <Link
              href="/contribute"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-elevation-1 transition-colors hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4" />
              Register as contributor
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </footer>
  );
}
