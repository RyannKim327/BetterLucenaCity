import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import DisasterPlanning from "@/components/emergency/planning";
import { getEvacuationCenters } from "@/lib/data/evacuation-centers";

export const metadata: Metadata = {
  title: "Disaster Preparedness",
  description:
    "Taglish preparedness tips for earthquakes, floods, typhoons, and fires, plus Lucena City evacuation centers.",
  keywords: [
    "Lucena City Evacuation Center",
    "Lucena City Emergency Disaster Preparedness",
    "Lucena City Disaster Tips",
  ],
};

export const revalidate = 3600;

export default async function PlanningPage() {
  const centers = await getEvacuationCenters();

  return (
    <div>
      <PageHeader
        eyebrow="Emergency · Preparedness"
        title="Disaster Preparedness"
        description="Mga tip para sa lindol, baha, bagyo, at sunog—kasama ang listahan ng evacuation centers sa Lucena City. Ang handang mamamayan ay mas ligtas na komunidad."
      />
      <DisasterPlanning centers={centers} />
    </div>
  );
}
