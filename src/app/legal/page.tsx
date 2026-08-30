import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { LegalList } from "@/components/data/legal-list";

export const metadata: Metadata = {
  title: "Laws & Ordinances",
};

export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType = type ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Batas at mga Ordinansa"
        title="Laws & City Ordinances"
        description="The legal foundations of Lucena City — from its 1961 charter to city-level ordinances, resolutions, executive orders, and memoranda."
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <LegalList activeType={activeType} />
      </section>
    </div>
  );
}
