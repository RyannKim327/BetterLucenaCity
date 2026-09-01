import { PageHeader } from "@/components/layout/page-header";
import { ContributorsGrid } from "@/components/data/contributors-grid";
import Link from "next/link";

export default function Contributors() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga nagbigay ambag"
        title="Contributors"
        description="People behind this project — those who maintain, validate, gather, and secure the platform. Listed by username only for privacy; you may opt in or out of public credit."
      />
      <section className="flex flex-col gap-4 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex justify-between gap-4 text-xs leading-relaxed text-on-surface-variant">
          <p>
            For privacy, we show <span className="font-medium text-on-surface">username only</span> (never email). Public listing is opt-in — see{" "}
            <Link href="/contribute" className="font-medium text-primary hover:underline">CONTRIBUTING.md — Privacy</Link>. Emails are used only for system notifications via the Head Maintainer&apos;s account.
          </p>
          <Link href="/contribute" className="shrink-0 text-sm font-medium text-primary hover:underline">
            Request to be contributor →
          </Link>
        </div>
        <ContributorsGrid limit={8} />
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Feeling harassed by another contributor? Report privately via <Link href="/report" className="font-medium text-primary hover:underline">/report</Link> with screenshot/proof — we follow RA 11313 (Anti-Bastos Law) and investigate without bias before judging.
        </p>
      </section>
    </div>
  );
}
