import { PageHeader } from "@/components/layout/page-header";
import { ContributorsPageClient } from "@/components/contributors/contributors-page-client";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Contributors",
  description: "People who publicly show up as contributor of Better Lucena City",
  keywords: [
    "Join Better Lucena City",
    "How to Contribute to Better Lucena City",
    "Better Lucena City Contributors",
  ],
  authors: [
    {
      name: "RyannKim327",
      url: "https://github.com/RyannKim327"
    }
  ]
};

export default function Contributors() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga nagbigay ambag"
        title="Contributors"
        description="People behind this project — those who maintain, validate, gather, and secure the platform. Listed by username only for privacy; you may opt in or out of public credit."
      />
      <ContributorsPageClient />
    </div>
  );
}
