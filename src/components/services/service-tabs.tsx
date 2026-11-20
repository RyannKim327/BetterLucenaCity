import Link from "next/link";
import { servicesCategory } from "@/lib/data/services";

interface Props {
  current: string | null;
  counts: Record<string, number>;
  total: number;
}

export function ServiceTabs({ current, counts, total }: Props) {
  const tabs = [
    { key: null, href: "/services", label: "All", count: total },
    ...servicesCategory.map((category) => ({
      key: category.href,
      href: `/services?category=${category.href}`,
      label: category.name,
      count: counts[category.href] ?? 0,
    })),
  ];

  return (
    <nav aria-label="Service categories" className="mb-8">
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-3">
        {tabs.map((tab) => {
          const active = current === tab.key;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-on-primary shadow-elevation-1"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-outline-variant/40 text-on-surface-variant"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
