"use client";

import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import LottieAnimation from "@/components/ui/LottieAnimation";

interface Pillar {
  letter: string;
  title: string;
  textKey: string;
  animation: string;
}

// The pillar names spell "CENTER" on purpose (a nod to ЦЦР — the Center for
// Digital Development) and stay in English in every locale since the acronym
// itself only works in English; only the descriptions below are translated.
const PILLARS: Pillar[] = [
  { letter: "C", title: "Commitment", textKey: "centerPillar1Text", animation: "/animations/career-center/commitment.json" },
  { letter: "E", title: "Excellence", textKey: "centerPillar2Text", animation: "/animations/career-center/excellence.json" },
  { letter: "N", title: "No Blame", textKey: "centerPillar3Text", animation: "/animations/career-center/no-blame.json" },
  { letter: "T", title: "Team", textKey: "centerPillar4Text", animation: "/animations/career-center/team.json" },
  { letter: "E", title: "Efficiency", textKey: "centerPillar5Text", animation: "/animations/career-center/efficiency.json" },
  { letter: "R", title: "Result", textKey: "centerPillar6Text", animation: "/animations/career-center/result.json" },
];

export default function CareerCultureValues() {
  const t = useTranslations("CareersPage");

  return (
    <div className="mb-24 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <StaggerGroup stagger={STAGGER.tight} className="lg:col-span-8 flex flex-col gap-3">
          {PILLARS.map((pillar, idx) => (
            <StaggerItem key={idx} duration={ENTRANCE_DURATION.card}>
              <GlassCard
                hoverAccent="gold"
                variant="glass"
                isTiltEnabled={false}
                className="p-5 sm:p-6 border border-white/5 hover:border-gold/15"
              >
                <div className="flex items-center gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-forest-light/15 bg-forest/25 sm:size-18">
                    <span className="font-display text-2xl font-bold text-gold-light sm:text-4xl">
                      {pillar.letter}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {t(pillar.textKey)}
                    </p>
                  </div>
                  <LottieAnimation
                    src={pillar.animation}
                    label={`${pillar.title} illustration`}
                    className="hidden h-20 w-20 shrink-0 bg-transparent sm:block"
                    frameClassName="h-20 min-h-0 w-20 bg-transparent"
                    animationClassName="h-20 w-20 max-h-none"
                    delay={idx * 0.04}
                  />
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <ScrollReveal direction="left" distance={40} duration={ENTRANCE_DURATION.card} delay={0.15} className="lg:col-span-4 relative">
          <div className="absolute -top-12 -right-8 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-8 w-32 h-32 bg-forest-mid/20 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
            {t("centerOverline")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-gradient-gold mb-4 leading-none">
            CENTER
          </h2>
          <p className="text-sm text-zinc-400 font-light italic mb-6">
            {t("centerTitle")}
          </p>
          <p className="text-base sm:text-lg text-zinc-200 font-light leading-relaxed">
            {t("centerLead")}
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
