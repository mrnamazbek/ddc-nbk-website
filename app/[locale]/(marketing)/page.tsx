"use client";

import LazyOnVisible from "@/components/ui/LazyOnVisible";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const Services = dynamic(() => import("@/components/sections/Services"), { ssr: false });
const Showcase = dynamic(() => import("@/components/sections/Showcase"), { ssr: false });
const Technologies = dynamic(() => import("@/components/sections/Technologies"), { ssr: false });
const About = dynamic(() => import("@/components/sections/About"), { ssr: false });
const CTA = dynamic(() => import("@/components/sections/CTA"), { ssr: false });

const LogoParticleReveal = dynamic(() => import("@/components/three/LogoParticleReveal"), { ssr: false });

function DeferredSections() {
  return (
    <>
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
}

export default function MarketingHomePage() {
  return (
    <div id="acts" className="relative z-10">
      <Hero />
      <LazyOnVisible id="stats" minHeight="430vh" rootMargin="900px 0px">
        <LogoParticleReveal />
      </LazyOnVisible>
      <DeferredSections />
    </div>
  );
}
