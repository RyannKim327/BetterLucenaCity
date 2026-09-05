import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { NationalBudgetSection } from "@/components/transparency/national-budget-section";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Transparency",
};

export const revalidate = 3600;

const transparencyAreas = [
  {
    title: "Budget & Spending",
    description:
      "Annual budget allocations, appropriations, and summaries of city expenditures.",
    status: "View information",
    href: "transparency/local-budget"
  },
  {
    title: "National Budget",
    description:
      "How the national appropriations (GAA FY2020–2026) fund programs reaching Lucena City, powered by the BetterGov.ph Budget Data API.",
    status: "View live data",
    href: "#national-budget",
  },
  {
    title: "Procurement",
    description:
      "Public bidding notices, awarded contracts, and supplier information.",
    status: "View biddings",
    href: "procurement"
  },
  {
    title: "Ordinances & Resolutions",
    description:
      "Enacted ordinances and resolutions from the Sangguniang Panlungsod, plus the national laws that shaped Lucena City.",
    status: "View collection",
    href: "/legal",
  },
  {
    title: "Full Disclosure Policy",
    description:
      "DILG-mandated disclosure documents posted for public viewing.",
    status: "Read the policy",
    href: "/legal/fdp"
  },
];

export default function TransparencyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Transparency"
        title="Open Books, Open Government"
        description="Public funds belong to the people. Track how Lucena City budgets, spends, and decides."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {transparencyAreas.map((area) => (
            <li key={area.title}>
              <Card className="h-full">
                {"href" in area && area.href ? (
                  <Link
                    href={area.href}
                    className="inline-flex items-center rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container hover:bg-primary-container/80"
                  >
                    {area.status} →
                  </Link>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
                    {area.status}
                  </span>
                )}
                <h2 className="mt-3 text-base font-semibold">{area.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {area.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <NationalBudgetSection />

    </div>
  );
}
