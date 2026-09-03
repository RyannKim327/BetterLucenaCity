import BarangayData from "@/components/data/barangay-data";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Barangay Information",
};

export default function BarangayPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Pagkilala"
        title="Barangays"
        description="Information for each barangay."
      />
      <section className="mx-auto max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2">
        <BarangayData />
      </section>
    </div>
  );
}
