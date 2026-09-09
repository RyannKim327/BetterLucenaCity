import { PageHeader } from "@/components/layout/page-header";
import { ContributorsPageClient } from "@/components/contributors/contributors-page-client";

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
