import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { announcements } from "@/lib/data/announcements";
import { services } from "@/lib/data/services";
import { site } from "@/lib/data/site";
import MapClient from "@/components/map/map-client";
import { LUCENA } from "@/lib/sources/shared";
import { LiveDataSection } from "@/components/live/live-data-section";
import AnnouncementSection from "@/components/sections/announcement";
import ServicesSection from "@/components/sections/services";
import AboutSection from "@/components/sections/about";
import HeroSection from "@/components/sections/hero";


export default function Home() {

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <AnnouncementSection />
      <LiveDataSection />
    </div >
  );
}
