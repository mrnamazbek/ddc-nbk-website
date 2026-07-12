"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import TerminalGridBackground from "@/components/ui/TerminalGridBackground";
import ScrollWordHero from "@/components/ui/scroll-hero-section";
import LottieAnimation from "@/components/ui/LottieAnimation";
import ScrollReveal, { ENTRANCE_DURATION } from "@/components/motion/ScrollReveal";

interface MissionStep {
  key: string;
  lottieSrc: string;
  lottieLabel: string;
}

// One Lottie per step, matched to what each animation actually depicts
// (checked each file's layer names) rather than left at their previous
// mismatched, semi-random assignment.
const STEPS: MissionStep[] = [
  {
    key: "step1",
    lottieSrc: "/animations/data-science-floating-laptop.json",
    lottieLabel: "Data charts and diagrams rising from a laptop",
  },
  {
    key: "step2",
    lottieSrc: "/animations/it-infrastructure-server-data.json",
    lottieLabel: "Server infrastructure with active cooling and processing",
  },
  {
    key: "step3",
    lottieSrc: "/animations/lounge-digital-data-protection-and-information-security.json",
    lottieLabel: "A lock, key, and password fields representing data security",
  },
  {
    key: "step4",
    lottieSrc: "/animations/data-science-pc-screen.json",
    lottieLabel: "A magnifying glass reviewing data on a monitor",
  },
];

function MissionSpine() {
  const t = useTranslations("Mission");
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (!listRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setListHeight(entry.target.getBoundingClientRect().height);
      }
    });
    resizeObserver.observe(listRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start 65%", "end 65%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, listHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
      {/* The intro (overline, heading, subtitle) is not repeated here: it is now
          the copy revealed inside the word-hero's full-bleed panel above. */}

      {/* Central spine — each pillar sits on alternating sides of it */}
      <div ref={scrollTargetRef} className="relative">
        <div
          ref={listRef}
          className="relative flex flex-col gap-20 sm:gap-28"
        >
          {/* Track (static, faint) */}
          <div
            style={{ height: listHeight }}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-[2px] overflow-hidden bg-gradient-to-b from-transparent via-glass-border to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            {/* Growing glow, tied to scroll progress through the pillar list */}
            <motion.div
              style={{ height: heightTransform, opacity: opacityTransform }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-forest-light via-gold to-gold-light rounded-full shadow-[0_0_8px_rgba(232,200,122,0.5)]"
            />
          </div>

          {STEPS.map((step, index) => {
            const lottieFirst = index % 2 === 1;
            return (
              <div key={step.key} className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Node on the spine */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-background border border-glass-border shadow-[0_0_10px_rgba(232,200,122,0.15)]">
                  <span className="font-mono text-sm font-bold text-gold">0{index + 1}</span>
                </div>

                <ScrollReveal
                  direction={lottieFirst ? "right" : "left"}
                  distance={40}
                  duration={ENTRANCE_DURATION.card}
                  className={cn("lg:col-span-6", lottieFirst && "lg:order-2")}
                >
                  <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
                    {t(`${step.key}Name`)}
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-normal tracking-tight text-foreground mb-5 leading-snug">
                    {t(`${step.key}Title`)}
                  </h2>
                  <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-lg">
                    {t(`${step.key}Desc`)}
                  </p>
                </ScrollReveal>

                <ScrollReveal
                  direction={lottieFirst ? "left" : "right"}
                  distance={40}
                  duration={ENTRANCE_DURATION.card}
                  delay={0.1}
                  className={cn("lg:col-span-6", lottieFirst && "lg:order-1")}
                >
                  <LottieAnimation
                    src={step.lottieSrc}
                    label={step.lottieLabel}
                    className="overflow-visible"
                    frameClassName="min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] xl:min-h-[540px]"
                    animationClassName="max-h-[500px] xl:max-h-[540px] scale-[1.02]"
                  />
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Mission2D() {
  return (
    <div className="relative w-full bg-transparent overflow-hidden py-24 sm:py-32 font-sans">
      <div className="brand-dot-grid absolute inset-0 pointer-events-none" />
      <TerminalGridBackground className="opacity-75" />

      <MissionSpine />
    </div>
  );
}

export default function MissionPage() {
  const t = useTranslations("Mission");
  const wordHero = useTranslations("Mission.wordHero");

  return (
    <>
      <ScrollWordHero
        leadIn={wordHero("leadIn")}
        items={wordHero.raw("words")}
        srSummary={wordHero("srSummary")}
      >
        <span className="scroll-word-hero__overline">{t("overline")}</span>
        <h1 className="scroll-word-hero__title">
          {t("titleLine1")}{" "}
          <span className="scroll-word-hero__accent">{t("titleAccent")}</span>{" "}
          {t("titleLine2")}
        </h1>
        <p className="scroll-word-hero__subtitle">{t("subtitle")}</p>
      </ScrollWordHero>
      <Mission2D />
    </>
  );
}
