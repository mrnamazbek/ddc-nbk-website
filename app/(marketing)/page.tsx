import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import DigitalShowcase from "@/components/sections/DigitalShowcase";
import Security from "@/components/sections/Security";
import News from "@/components/sections/News";
import CTA from "@/components/sections/CTA";

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <About />
      <DigitalShowcase />
      <Security />
      <News />
      <CTA />
    </>
  );
}
