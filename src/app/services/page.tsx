import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ServiceTabs } from "@/components/services/service-tabs";
import { Card } from "@/components/ui/card";
import { services, servicesCategory } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const active = servicesCategory.find((item) => item.href === category) ?? null;
  const visibleCategories = active ? [active] : servicesCategory;
  const counts = Object.fromEntries(
    servicesCategory.map((item) => [
      item.href,
      services.filter((service) => service.category === item.href).length,
    ]),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Mga Serbisyo"
        title="Services"
        description="Browse Lucena City services by category. Each listing includes where to go, what to prepare, and how the service is processed."
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ServiceTabs current={active?.href ?? null} counts={counts} total={services.length} />
        {visibleCategories.map((item) => {
          const items = services.filter((service) => service.category === item.href);
          if (items.length === 0) return null;

          return (
            <section
              key={item.href}
              aria-labelledby={`category-${item.href}`}
              className="mt-10 first:mt-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 id={`category-${item.href}`} className="text-xl font-semibold tracking-tight">
                  {item.name}
                </h2>
                <span className="shrink-0 text-xs text-on-surface-variant">
                  {items.length} {items.length === 1 ? "service" : "services"}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="group block h-full">
                      <Card hover className="flex h-full flex-col">
                        <p className="text-xs uppercase tracking-wider text-secondary">
                          {service.office}
                        </p>
                        <h3 className="mt-2 text-base font-semibold group-hover:text-primary">
                          {service.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                          {service.description}
                        </p>
                        <span className="mt-auto pt-4 text-sm font-medium text-primary">
                          View details →
                        </span>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </section>
    </div>
  );
}
