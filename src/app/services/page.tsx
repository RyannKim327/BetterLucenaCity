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
              <Card className="h-full flex flex-col">
                <p className="text-xs uppercase tracking-wider text-secondary">{service.office}</p>
                <h2 className="mt-2 text-base font-semibold">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {service.description}
                </p>
                {service.process.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-outline-variant/30">
                    <table className="w-full text-xs">
                      <thead className="bg-surface-container">
                        <tr>
                          <th className="px-2.5 py-1.5 text-left font-semibold text-on-surface-variant">Process</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold text-on-surface-variant">Time</th>
                          <th className="px-2.5 py-1.5 text-left font-semibold text-on-surface-variant">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {service.process.map((p, i) => (
                          <tr key={i} className="bg-surface-container-low">
                            <td className="px-2.5 py-1.5 text-on-surface">{p.name}</td>
                            <td className="px-2.5 py-1.5 text-on-surface-variant whitespace-nowrap">{p.timeEstimation}</td>
                            <td className="px-2.5 py-1.5 font-medium text-primary whitespace-nowrap">{p.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {service.featured && (
                  <span className="mt-3 inline-flex w-fit rounded-full bg-primary-container px-2.5 py-1 text-xs font-medium text-on-primary-container">Featured</span>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
