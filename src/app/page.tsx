import LiveDataSection from "@/components/live/live-data-section";
import AnnouncementSection from "@/components/sections/announcement";
import AboutSection from "@/components/sections/about";
import HeroSection from "@/components/sections/hero";
import History from "@/components/sections/history";


export default function Home() {

  return (
    <>
      <HeroSection />
      <AboutSection />
      <AnnouncementSection />
      <LiveDataSection />
      <History />
    </>
  );
}
