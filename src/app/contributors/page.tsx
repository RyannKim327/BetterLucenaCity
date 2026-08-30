import { PageHeader } from "@/components/layout/page-header";
import { ContributorsGrid } from "@/components/data/contributors-grid";
import Link from "next/link";

export default function Contributors() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga nagbigay ambag"
        title="Contributors"
        description="People behind this project."
      />
      <section className="flex flex-col gap-4 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex justify-end">
          <Link href="/contribute" className="shrink-0 text-sm font-medium text-primary hover:underline">
            Request to be contributor →
          </Link>
        </div>
        <ContributorsGrid limit={8} />
      </section>
    </div>
  );
}
