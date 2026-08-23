import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Mga Serbisyo"
        title="City Services"
        description="Everything you need from City Hall, organized by office. Each listing includes where to go and what to prepare."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Card className="h-full">
                <p className="text-xs uppercase tracking-wider text-secondary">{service.office}</p>
                <h2 className="mt-2 text-base font-semibold">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {service.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
