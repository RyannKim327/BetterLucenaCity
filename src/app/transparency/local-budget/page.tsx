import { PageHeader } from "@/components/layout/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Budget",
  keywords: [
    "Lucena City Local Budget",
  ],
  authors: [
    {
      name: "RyannKim327",
      url: "https://github.com/RyannKim327"
    }
  ]
};

export default function LocalBudget() {
  return (
    <div>
      <PageHeader
        eyebrow="Kagastusan"
        title="Budget & Spending"
        description="Annual budget allocations, appropriations, and summaries of city expenditures." />
    </div>
  )
}
