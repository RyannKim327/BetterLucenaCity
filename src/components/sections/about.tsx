import { LUCENA } from "@/lib/sources/shared";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="about-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">Lucena City at a Glance</h2>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Population</p>
          <span>{LUCENA.population.male + LUCENA.population.female}</span>
          <span className="text-xs">2024 Census</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Male Population</p>
          <span>{LUCENA.population.male}</span>
          <span className="text-xs">Source: www.citypopulation.de</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Female Population</p>
          <span>{LUCENA.population.female}</span>
          <span className="text-xs">Source: www.citypopulation.de</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Population Density</p>
          <span>{LUCENA.populationDensity}</span>
          <span className="text-xs">Source: www.citypopulation.de</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Annual Population Change</p>
          <span>{LUCENA.annualPopulationChange}</span>
          <span className="text-xs">2020 → 2024</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full group hover:border hover:border-solid hover:border-primary">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Barangay</p>
          <span>{LUCENA.barangays.length} Barangays</span>
          <Link href="barangays" className="hover:underline group-hover:text-primary text-xs">See more →</Link>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Income Classification</p>
          <span>1st Class</span>
          <span className="text-xs">Source: PSA</span>
        </Card>
        <Card className="flex flex-col gap-2 w-full md:w-[calc(25%-1rem)] h-full">
          <p
            className="text-xs uppercase tracking-wider text-secondary">Land Area</p>
          <span>{LUCENA.area}</span>
          <span className="text-xs">Source: www.citypopulation.de</span>
        </Card>
      </div>
    </section>
  )
}
