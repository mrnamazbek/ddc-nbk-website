"use client";

import { useTranslations } from "next-intl";
import { Timeline as UItimeline } from "@/components/ui/timeline";
import { BubbleText } from "@/components/ui/BubbleText";
import ScrollReveal, { ENTRANCE_DURATION } from "@/components/motion/ScrollReveal";
import { RevealWords } from "@/components/motion/RevealWords";

interface TimelineMilestone {
  key: string;
}

export default function Timeline() {
  const t = useTranslations("Timeline");

  const milestones: TimelineMilestone[] = [
    { key: "y1996" },
    { key: "y2003" },
    { key: "y2015" },
    { key: "y2017" },
    { key: "y2020" },
    { key: "y2025" },
  ];

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
      className="relative w-full py-24 sm:py-32 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Section Header — the vertical line below starts drawing as soon as
            this section scrolls into view; label / heading / description
            follow it in sequence rather than appearing all at once. */}
        <div className="max-w-3xl mb-16">
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label} delay={0.15}>
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
              {t("overline")}
            </span>
          </ScrollReveal>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
            <RevealWords text={t("titleLine1")} delay={0.3} useBubbleText />{" "}
            <RevealWords
              text={t("titleAccent")}
              delay={0.5}
              useBubbleText
              bubbleActiveClassName="text-gold font-black"
            />
          </h2>
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.65}>
            <p className="text-sm sm:text-base font-sans font-light text-muted leading-relaxed">
              <BubbleText text={t("subtitle")} />
            </p>
          </ScrollReveal>
        </div>

        {/* Upgraded scroll-linked timeline */}
        <div className="w-full relative">
          <UItimeline data={timelineData} />
        </div>

      </div>

    </section>
  );
}
