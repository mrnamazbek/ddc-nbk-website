"use client";

import { useABTest } from "@/lib/abTest";
import ABTestSwitcher from "@/components/ui/ABTestSwitcher";
import LazyOnVisible from "@/components/ui/LazyOnVisible";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const Stats = dynamic(() => import("@/components/sections/Stats"), { ssr: false });
const Readiness = dynamic(() => import("@/components/sections/Readiness"), { ssr: false });
const Services = dynamic(() => import("@/components/sections/Services"), { ssr: false });
const Showcase = dynamic(() => import("@/components/sections/Showcase"), { ssr: false });
const Technologies = dynamic(() => import("@/components/sections/Technologies"), { ssr: false });
const About = dynamic(() => import("@/components/sections/About"), { ssr: false });
const CTA = dynamic(() => import("@/components/sections/CTA"), { ssr: false });

// Lazy-loaded components for Variant B
const SecuredFiBackground = dynamic(() => import("@/components/ui/SecuredFiBackground"), { ssr: false });

// Lazy-loaded component for Variant C (particle logo-morph reveal)
const LogoParticleReveal = dynamic(() => import("@/components/three/LogoParticleReveal"), { ssr: false });

export default function MarketingHomePage() {
  const activeVariant = useABTest("home_layout");

  const DeferredSections = () => (
    <>
      <LazyOnVisible minHeight="720px">
        <Readiness />
      </LazyOnVisible>
      <LazyOnVisible id="services" minHeight="1050px">
        <Services id={null} />
      </LazyOnVisible>
      <LazyOnVisible minHeight="180vh">
        <Showcase />
      </LazyOnVisible>
      <LazyOnVisible minHeight="1050px">
        <Technologies />
      </LazyOnVisible>
      <LazyOnVisible id="about" minHeight="960px">
        <About id={null} />
      </LazyOnVisible>
      <LazyOnVisible minHeight="760px">
        <CTA />
      </LazyOnVisible>
    </>
  );

  if (activeVariant === "C") {
    return (
      <>
        {/* Variant C keeps Variant A's hero and uses the global flowing shader
            there; the heavier particle morph is isolated to the stats reveal. */}
        <div id="acts" className="relative z-10">
          <Hero />
          <LazyOnVisible id="stats" minHeight="430vh" rootMargin="900px 0px">
            <LogoParticleReveal />
          </LazyOnVisible>
          <DeferredSections />
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
          <DeferredSections />
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
        <LazyOnVisible id="stats" minHeight="760px">
          <Stats id={null} />
        </LazyOnVisible>
        <DeferredSections />
      </div>

      <ABTestSwitcher pageKey="home_layout" current={activeVariant} />
    </>
  );
}
