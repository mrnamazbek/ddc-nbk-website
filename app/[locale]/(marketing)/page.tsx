import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import CoinShowcase from "@/components/sections/CoinShowcase";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";
import Showcase from "@/components/sections/Showcase";

export default function MarketingHomePage() {
  return (
    <>
      {/* Interactive forest/gold dot grid behind all content (fixed, black bg) */}
      <InteractiveDotGrid />

      <div id="acts" className="relative z-10">
        <Hero />
        <Stats />
        <CoinShowcase />
        <Services />
        {/* Parallax showcase of real DDC assets (3D renders, NBK architecture, team) */}
        <Showcase />
        <About />
        <CTA />
      </div>
    </>
  );
}