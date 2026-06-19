"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import { Timeline as UItimeline } from "@/components/ui/timeline";

interface TimelineMilestone {
  key: string;
}

export default function Timeline() {
  const t = useTranslations("Timeline");
  const containerRef = useRef<HTMLDivElement>(null);

  const milestones: TimelineMilestone[] = [
    { key: "y1996" },
    { key: "y2003" },
    { key: "y2015" },
    { key: "y2017" },
    { key: "y2020" },
    { key: "y2025" },
  ];

  useGSAP(
    () => {
      // Smooth fade-in of the entire timeline container on scroll
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const timelineData = milestones.map((m) => ({
    title: t(`${m.key}.year`),
    content: (
      <div className="flex flex-col gap-2">
        <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-wide transition-colors duration-300 hover:text-gold">
          {t(`${m.key}.title`)}
        </h4>
        <p className="text-muted text-xs sm:text-sm md:text-base font-light leading-relaxed">
          {t(`${m.key}.desc`)}
        </p>
      </div>
    ),
  }));

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-sm sm:text-base font-sans font-light text-muted leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Upgraded scroll-linked timeline */}
        <div className="w-full relative">
          <UItimeline data={timelineData} />
        </div>

      </div>

      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
    </section>
  );
}
