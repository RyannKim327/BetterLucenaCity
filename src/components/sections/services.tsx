import Link from "next/link";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/data/services";

export default function ServicesSection() {
  const featuredServices = services.filter((s) => s.featured);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="services-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="services-heading" className="text-2xl font-semibold tracking-tight">
            Popular Services
          </h2>
          <p className="mt-1 text-on-surface-variant">
            Mga karaniwang serbisyo ng lungsod
          </p>
        </div>
        <Link href="/services" className="shrink-0 text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredServices.map((service) => (
          <li key={service.slug}>
            <Card className="h-full">
              <p className="text-xs uppercase tracking-wider text-secondary">
                {service.office}
              </p>
              <h3 className="mt-2 text-base font-semibold">{service.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {service.description}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
