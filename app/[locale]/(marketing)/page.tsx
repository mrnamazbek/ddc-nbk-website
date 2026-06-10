import InteractiveDotGrid from "@/components/ui/InteractiveDotGrid";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";

// Demos
import HeroParallaxDemo from "@/components/hero-parallax-demo";
import { HeroScrollDemo } from "@/components/container-scroll-demo";
import { SplineSceneBasic } from "@/components/spline-demo";
import Security from "@/components/sections/Security";
import DigitalShowcase from "@/components/sections/DigitalShowcase";

export default function MarketingHomePage() {
  return (
    <>
      {/* Сетка точек с эффектом искажения при наведении мыши */}
      <InteractiveDotGrid />

      <div id="acts" className="relative z-10">
        <Hero />
        
        {/* Added 3D Spline Robot */}
        <section className="py-10 max-w-7xl mx-auto w-full px-4">
          <SplineSceneBasic />
        </section>

        {/* Added Container Scroll Animation */}
        <HeroScrollDemo />

        <Stats />
        <Services />
        
        {/* Added Hero Parallax */}
        <HeroParallaxDemo />

        <Security />
        <DigitalShowcase />
        <About />
        <CTA />
      </div>
    </>
  );
}