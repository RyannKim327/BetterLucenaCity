import Image from "next/image";
import { site } from "@/lib/data/site";
import ServicesSection from "@/components/sections/services";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden rounded-b-lg bg-hero"
    >
      <div className="pointer-events-none absolute -right-60 -bottom-60 overflow-hidden">
        <Image
          src="/sun.png"
          alt=""
          width={600}
          height={600}
          className="opacity-10 animate-[spin_50s_linear_infinite]"
        />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 md:grid md:grid-cols-[2fr_3fr] md:items-center md:gap-10 md:py-24">
        <div className="flex flex-col">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary">
            Maligayang pagdating sa
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            <span className="text-primary">{site.locality}</span>, {site.province}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-on-surface-variant">
            Find city services, track public spending, and stay informed
            all in one citizen-first portal for {site.locality}.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/services">Browse Services</Button>
            <Button href="/transparency" variant="outlined">
              Transparency Portal
            </Button>
          </div>
        </div>
        <ServicesSection />
      </div>
    </section>
  );
}
