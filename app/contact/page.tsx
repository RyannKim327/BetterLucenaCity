import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { emergencyHotlines } from "@/lib/data/announcements";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Makipag-ugnayan"
        title="Contact the City"
        description="Reach out to City Hall for inquiries, feedback, or reports. Malasakit starts with listening."
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Visit City Hall</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {site.cityHallAddress}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Office hours: Monday – Friday, 8:00 AM – 5:00 PM
          </p>
        </Card>
        <Card>
          <h2 className="text-base font-semibold">Email</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            General inquiries and feedback:
          </p>
          <a href={`mailto:${site.email}`} className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
            {site.email}
          </a>
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-base font-semibold">Hotlines</h2>
          <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {emergencyHotlines.map((hotline) => (
              <li key={hotline.name}>
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">{hotline.name}</p>
                <a
                  href={`tel:${hotline.number.replace(/[^+\d]/g, "")}`}
                  className="text-lg font-semibold hover:text-primary"
                >
                  {hotline.number}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
