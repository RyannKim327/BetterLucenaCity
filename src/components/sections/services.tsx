import Link from "next/link";
import { Card } from "@/components/ui/card";
import { services, servicesCategory } from "@/lib/data/services";

export default function ServicesSection({ className }: { className?: string }) {
  return (
    <section className="w-full" aria-labelledby="services-heading">
      <h2 id="services-heading" className="sr-only">
        Featured services
      </h2>
      <ul className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-2 ${className ?? ""}`}>
        {servicesCategory.map((category) => {
          if (!category.featured) return null;

          const Icon = category.icon;
          const count = services.filter((service) => service.category === category.href).length;

          return (
            <li key={category.href}>
              <Link href={`/services?category=${category.href}`} className="group block h-full">
                <Card hover className="flex h-full flex-col p-4!">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                      <Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="text-[11px] font-medium text-on-surface-variant">
                      {count} {count === 1 ? "service" : "services"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant">
                    {category.description}
                  </p>
                  <span className="mt-auto pt-3 text-xs font-medium text-primary">
                    Browse category →
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </section >
  );
}
