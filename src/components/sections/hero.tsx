import { site } from "@/lib/data/site";
import MapClient from "@/components/map/map-client";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
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
  )
}
