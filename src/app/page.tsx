import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { announcements, emergencyHotlines } from "@/lib/data/announcements";
import { services } from "@/lib/data/services";
import { site } from "@/lib/data/site";
import MapClient from "@/components/map/map-client";
import { LUCENA } from "@/lib/sources/shared";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const featuredServices = services.filter((s) => s.featured);
  const latestAnnouncements = announcements.slice(0, 3);

  return (
    <div>
      <section className="bg-surface-container-low">
        <div className="flex mx-auto max-w-6xl gap-6 px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-secondary">
              Maligayang pagdating sa
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              <span className="text-primary">{site.locality}</span>, {site.province}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">
              Find city services, track public spending, and stay informed
              all in one citizen-first portal for Lucena City.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/services">Browse Services</Button>
              <Button href="/transparency" variant="outlined">
                Transparency Portal
              </Button>
            </div>
          </div>
          <MapClient className="w-full aspect-video" />
        </div>
      </section>

      <section className="flex flex-col mx-auto max-w-6xl gap-4 px-4 py-16 sm:px-6" aria-labelledby="about-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">Lucena City at a Glance</h2>
        </div>
        <div className="flex gap-4">
          <Card className="flex flex-col h-full">
            <p
              className="text-xs uppercase tracking-wider text-secondary">Barangay</p>
            <span>{LUCENA.barangays.length} Barangays</span>
          </Card>
        </div>
      </section>

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

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="announcements-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="announcements-heading" className="text-2xl font-semibold tracking-tight">
            Latest Announcements
          </h2>
          <Link href="/announcements" className="shrink-0 text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {latestAnnouncements.map((announcement) => (
            <li key={announcement.id}>
              <Card className="h-full">
                <time dateTime={announcement.date} className="text-xs text-on-surface-variant">
                  {formatDate(announcement.date)}
                </time>
                <h3 className="mt-2 text-base font-semibold leading-snug">{announcement.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                  {announcement.excerpt}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div >
  );
}
