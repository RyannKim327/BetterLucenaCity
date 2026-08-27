
import { LiveDataSection } from "@/components/live/live-data-section";
import AnnouncementSection from "@/components/sections/announcement";
import ServicesSection from "@/components/sections/services";
import AboutSection from "@/components/sections/about";
import HeroSection from "@/components/sections/hero";
import Contributors from "@/components/sections/contributors";


export default function Home() {

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <AnnouncementSection />
      <LiveDataSection />
      <Contributors />
    </div >
  );
}
