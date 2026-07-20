"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import LottieAnimation from "@/components/ui/LottieAnimation";

interface Pillar {
  letter: string;
  title: string;
  textKey: string;
  animation: string;
  startY: number;
  rangeStart: number;
  rangeEnd: number;
}

const ROW_STEP_PX = 116;
const PILLARS: Pillar[] = [
  { letter: "C", title: "Commitment", textKey: "centerPillar1Text", animation: "/animations/career-center/commitment.json", startY: -2.5 * ROW_STEP_PX, rangeStart: 0.05, rangeEnd: 0.55 },
  { letter: "E", title: "Excellence", textKey: "centerPillar2Text", animation: "/animations/career-center/excellence.json", startY: -1.5 * ROW_STEP_PX, rangeStart: 0.1, rangeEnd: 0.6 },
  { letter: "N", title: "No Blame", textKey: "centerPillar3Text", animation: "/animations/career-center/no-blame.json", startY: -0.5 * ROW_STEP_PX, rangeStart: 0.15, rangeEnd: 0.65 },
  { letter: "T", title: "Team", textKey: "centerPillar4Text", animation: "/animations/career-center/team.json", startY: 0.5 * ROW_STEP_PX, rangeStart: 0.2, rangeEnd: 0.7 },
  { letter: "E", title: "Efficiency", textKey: "centerPillar5Text", animation: "/animations/career-center/efficiency.json", startY: 1.5 * ROW_STEP_PX, rangeStart: 0.25, rangeEnd: 0.75 },
  { letter: "R", title: "Result", textKey: "centerPillar6Text", animation: "/animations/career-center/result.json", startY: 2.5 * ROW_STEP_PX, rangeStart: 0.3, rangeEnd: 0.8 },
];

const LETTER_GAP_PX = 96;
const CARD_GAP_PX = 24;
const CHIP_SIZE_PX = 72;
const CARD_CENTER_OFFSET_PX = 360;

function PillarPiece({
  pillar,
  index,
  progress,
  text,
}: {
  pillar: Pillar;
  index: number;
  progress: MotionValue<number>;
  text: string;
}) {
  const cardSide = index % 2 === 0 ? -1 : 1;
  const initialCardX = cardSide * CARD_CENTER_OFFSET_PX;
  const finalXpx = (index - (PILLARS.length - 1) / 2) * LETTER_GAP_PX;
  const cardFadeEnd = pillar.rangeStart + (pillar.rangeEnd - pillar.rangeStart) * 0.45;
  const cardX = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [initialCardX, initialCardX * 0.84]);
  const cardY = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [pillar.startY, 0]);
  const cardOpacity = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [1, 0]);
  const cardBlurPx = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [0, 6]);
  const cardFilter = useMotionTemplate`blur(${cardBlurPx}px)`;
  const chipX = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [0, finalXpx]);
  const chipY = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [pillar.startY, 0]);
  const chipScale = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [1, 1.9]);
  const chipChromeOpacity = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [1, 0]);
  const illustration = (
    <LottieAnimation
      src={pillar.animation}
      label={`${pillar.title} illustration`}
      className="h-20 w-20 shrink-0 bg-transparent"
      frameClassName="h-20 min-h-0 w-20 bg-transparent"
      animationClassName="h-20 w-20 max-h-none"
      delay={index * 0.04}
    />
  );

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        style={{ x: cardX, y: cardY, opacity: cardOpacity, filter: cardFilter }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <GlassCard
          hoverAccent="gold"
          variant="glass"
          isTiltEnabled={false}
          className="w-[560px] border border-white/5 p-6 hover:border-gold/15"
        >
          <div className="flex items-center" style={{ gap: CARD_GAP_PX }}>
            {cardSide < 0 && illustration}
            <div className="min-w-0 flex-1">
              <h3 className="mb-1.5 text-base font-bold uppercase tracking-wide text-white">{pillar.title}</h3>
              <p className="line-clamp-2 text-sm font-light leading-relaxed text-zinc-300">{text}</p>
            </div>
            {cardSide > 0 && illustration}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{ y: cardY, opacity: cardOpacity }}
        className={`absolute top-0 h-px w-11 -translate-y-1/2 bg-gold/35 ${cardSide < 0 ? "right-9" : "left-9"}`}
      />

      <motion.div
        style={{ x: chipX, y: chipY, scale: chipScale, width: CHIP_SIZE_PX, height: CHIP_SIZE_PX }}
        className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl"
      >
        <motion.div
          style={{ opacity: chipChromeOpacity }}
          className="absolute inset-0 rounded-xl border border-forest-light/15 bg-forest/25"
        />
        <span className="relative translate-y-[0.08em] select-none font-display text-4xl font-black leading-none text-gold-light">{pillar.letter}</span>
      </motion.div>
    </div>
  );
}

/** Restored desktop scroll sequence: six culture cards converge into CENTER. */
export default function CareerCenterConverge() {
  const t = useTranslations("CareersPage");
  const triggerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  useGSAP(
    () => {
      if (!stageRef.current) return;

      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stageRef.current,
        pinType: "transform",
        pinSpacing: false,
        scrub: 0.8,
        onUpdate: (self) => progress.set(self.progress),
      });
    },
    { scope: triggerRef },
  );

  const captionOpacity = useTransform(progress, [0.78, 0.92], [0, 1]);
  const captionY = useTransform(progress, [0.78, 0.92], [16, 0]);
  const spineOpacity = useTransform(progress, [0.1, 0.58], [1, 0]);

  return (
    <div ref={triggerRef} className="relative mb-24 h-[300vh]">
      <div ref={stageRef} className="relative z-20 isolate h-screen overflow-visible bg-transparent">
        <div className="relative h-full w-full">
          <motion.div
            aria-hidden="true"
            style={{ opacity: spineOpacity }}
            className="absolute left-1/2 top-1/2 h-[580px] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-forest-light/45 to-transparent"
          />
          {PILLARS.map((pillar, index) => (
            <PillarPiece key={pillar.letter + index} pillar={pillar} index={index} progress={progress} text={t(pillar.textKey)} />
          ))}
        </div>

        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute bottom-[14%] left-1/2 -translate-x-1/2 px-6 text-center"
        >
          <p className="mb-4 text-base font-light italic text-zinc-400 sm:text-lg">{t("centerTitle")}</p>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-zinc-200 sm:text-xl">{t("centerLead")}</p>
        </motion.div>
      </div>
    </div>
  );
}
