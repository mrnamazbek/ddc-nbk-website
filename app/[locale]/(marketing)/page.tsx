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
import Readiness from "@/components/sections/Readiness";

// Lazy-loaded components for Variant B
const SecuredFiBackground = dynamic(() => import("@/components/ui/SecuredFiBackground"), { ssr: false });

// Lazy-loaded component for Variant C (particle logo-morph reveal)
const LogoParticleReveal = dynamic(() => import("@/components/three/LogoParticleReveal"), { ssr: false });

export default function MarketingHomePage() {
  const activeVariant = useABTest("home_layout");

  if (activeVariant === "C") {
    return (
      <>
        {/* Variant C keeps Variant A's hero and uses the global flowing shader
            there; the heavier particle morph is isolated to the stats reveal. */}
        <div id="acts" className="relative z-10">
          <Hero />
          <LogoParticleReveal />
          <Readiness />
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

  if (activeVariant === "B") {
    return (
      <>
        {/* Variant B keeps the Variant A content stack and adds only the scroll morph layer. */}
        <SecuredFiBackground />

        <div id="acts" className="relative z-10">
          <Hero />
          <section id="stats" className="relative h-[190vh]" aria-label="Digital development in numbers" />
          <Readiness />
          <Services />
          <Showcase />
          <Technologies />
          <About />
          <CTA />
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
        <Readiness />
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
