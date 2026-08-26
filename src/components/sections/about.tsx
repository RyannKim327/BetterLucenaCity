import { LUCENA } from "@/lib/sources/shared";
import { Card } from "@/components/ui/card";

export default function AboutSection() {
  return (

    <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="about-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">Lucena City at a Glance</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-0.5rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Population</p>
          <span>280,331</span>
          <span className="text-xs">2024 Census</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-0.5rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Barangay</p>
          <span>{LUCENA.barangays.length} Barangays</span>
          <span className="text-xs text-transparent">. </span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-0.5rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Income Classification</p>
          <span>1st Class</span>
          <span className="text-xs">Source: PSA</span>

        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-0.5rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Land Area</p>
          <span>80.21 km²</span>
          <span className="text-xs text-transparent">. </span>
        </Card>

      </div>
    </section>
  )
}
