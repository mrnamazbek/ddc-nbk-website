import ExperienceCanvas from "@/components/three/ExperienceCanvas";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import DigitalShowcase from "@/components/sections/DigitalShowcase";
import Security from "@/components/sections/Security";
import News from "@/components/sections/News";
import CTA from "@/components/sections/CTA";

// Demos
import HeroParallaxDemo from "@/components/hero-parallax-demo";
import { HeroScrollDemo } from "@/components/container-scroll-demo";
import { SplineSceneBasic } from "@/components/spline-demo";

export default function MarketingHomePage() {
  return (
    <>
      {/* The continuous scroll-driven 3D journey lives behind all content. */}
      <ExperienceCanvas />

      {/* Content sections float above the canvas (z-10). Order matches the 3D
          act narrative: Hero→Formation, Stats→Expansion, Services→Coin,
          Security→Vault, Digital→Data Flow, About→Steppe, News+CTA→Return. */}
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
        <News />
        <CTA />
      </div>
    </>
  );
}
