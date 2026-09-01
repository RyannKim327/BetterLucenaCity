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
          <Link href="/contribute" className="shrink-0 text-sm font-medium text-primary hover:underline">
            Request to be contributor →
          </Link>
        </div>
        <ContributorsGrid limit={8} />
      </section>
    </div>
  );
}
