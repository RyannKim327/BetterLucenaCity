import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { services, servicesCategory } from "@/lib/data/services";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const service = services.find((item) => item.slug === name.toLowerCase());
  return { title: service ? `${service.name} — Services` : "Services" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { name } = await params;
  const service = services.find((item) => item.slug === name.toLowerCase());

  if (!service) notFound();

  const category = servicesCategory.find((item) => item.href === service.category);
  const backHref = category ? `/services?category=${category.href}` : "/services";

  return (
    <div>
      <div className="border-b border-outline-variant/40 bg-surface-container-low">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link
            href={backHref}
            className="inline-flex text-sm font-medium text-primary hover:underline"
          >
            ← Back to {category ? category.name : "services"}
          </Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-widest text-secondary">
            {service.office}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight leading-tight md:text-4xl">
            {service.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            {service.description}
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Card>
          <h2 className="text-base font-semibold">How this service is processed</h2>
          {service.process.length > 0 ? (
            <ol className="mt-4 divide-y divide-outline-variant/20">
              {service.process.map((step, i) => (
                <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-semibold text-on-primary-container">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface">{step.name}</p>
                    {(step.timeEstimation || step.amount) && (
                      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                        {step.timeEstimation && (
                          <div className="flex gap-1">
                            <dt className="font-medium">Time:</dt>
                            <dd>{step.timeEstimation}</dd>
                          </div>
                        )}
                        {step.amount && (
                          <div className="flex gap-1">
                            <dt className="font-medium">Amount:</dt>
                            <dd className="text-primary">{step.amount}</dd>
                          </div>
                        )}
                      </dl>
                    )}
                    {step.details && step.details.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-on-surface-variant">
                        {step.details.map((detail, j) => (
                          <li key={j}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Process details are not yet available for this service.
            </p>
          )}

          {service.source && (
            <Link
              href={service.source}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
            >
              More info here →
            </Link>
          )}
        </Card>

        <div className="mt-6 flex gap-3">
          <Link
            href="/services"
            className="inline-flex h-10 items-center justify-center rounded-full border border-outline-variant px-6 text-sm font-medium text-primary hover:bg-primary/8"
          >
            View all services
          </Link>
        </div>
      </section>
    </div>
  );
}
