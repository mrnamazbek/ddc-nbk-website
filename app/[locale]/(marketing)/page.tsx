"use client";

import { useABTest } from "@/lib/abTest";
import ABTestSwitcher from "@/components/ui/ABTestSwitcher";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";
import Showcase from "@/components/sections/Showcase";
import Technologies from "@/components/sections/Technologies";

// Lazy-loaded components for Variant B
const SecuredFiBackground = dynamic(() => import("@/components/ui/SecuredFiBackground"), { ssr: false });
const SecuredFiHero = dynamic(() => import("@/components/sections/SecuredFiHero"), { ssr: false });
const SecuredFiServices = dynamic(() => import("@/components/sections/SecuredFiServices"), { ssr: false });

export default function MarketingHomePage() {
  const activeVariant = useABTest("home_layout");

  if (activeVariant === "B") {
    return (
      <>
        {/* Morphing 3D Particle Sphere in our colors */}
        <SecuredFiBackground />

        <div className="relative z-10">
          {/* Replicating typography and scrolling presentation of Secured Finance */}
          <SecuredFiHero />
          
          {/* Minimalist 6-card services list with pulsing status indicators */}
          <SecuredFiServices />
        </div>

        {/* Global A/B variant switcher */}
        <ABTestSwitcher pageKey="home_layout" current={activeVariant} />
      </>
    );
  }

  return (
    <>
      <div id="acts" className="relative z-10">
        <Hero />
        <Stats />
        <Services />
        <Showcase />
        <Technologies />
        <About />
        <CTA />
      </div>

      <ABTestSwitcher pageKey="home_layout" current={activeVariant} />
    </>
  );
}