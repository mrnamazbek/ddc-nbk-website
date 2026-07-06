"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useMotionTemplate, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";

interface Pillar {
  letter: string;
  title: string;
  textKey: string;
  /** Starting vertical offset from stage center, in px — the six cards stack
   * as a single centered column (line by line), only moving vertically. Fixed
   * px (not vh) so the fixed-height cards below never collide regardless of
   * viewport height. */
  startY: number;
  /** Local progress window (0-1 of the pin duration) this piece animates within. */
  rangeStart: number;
  rangeEnd: number;
}

// Same order top-to-bottom as the card list: C, E, N, T, E, R. Each piece's
// convergence window is staggered (not lockstep) so the list visibly
// collapses top-to-bottom into the assembled word as you keep scrolling.
// 140px between rows — comfortably clears the ~115px card height computed
// below (CARD_PADDING_PX + title + 2-line clamp) with room to spare.
const ROW_STEP_PX = 140;
const PILLARS: Pillar[] = [
  { letter: "C", title: "Commitment", textKey: "centerPillar1Text", startY: -2.5 * ROW_STEP_PX, rangeStart: 0.05, rangeEnd: 0.55 },
  { letter: "E", title: "Excellence", textKey: "centerPillar2Text", startY: -1.5 * ROW_STEP_PX, rangeStart: 0.1, rangeEnd: 0.6 },
  { letter: "N", title: "No Blame", textKey: "centerPillar3Text", startY: -0.5 * ROW_STEP_PX, rangeStart: 0.15, rangeEnd: 0.65 },
  { letter: "T", title: "Team", textKey: "centerPillar4Text", startY: 0.5 * ROW_STEP_PX, rangeStart: 0.2, rangeEnd: 0.7 },
  { letter: "E", title: "Efficiency", textKey: "centerPillar5Text", startY: 1.5 * ROW_STEP_PX, rangeStart: 0.25, rangeEnd: 0.75 },
  { letter: "R", title: "Result", textKey: "centerPillar6Text", startY: 2.5 * ROW_STEP_PX, rangeStart: 0.3, rangeEnd: 0.8 },
];

const LETTER_GAP_PX = 85;
const CARD_WIDTH_PX = 440;
const CARD_PADDING_PX = 20; // matches the GlassCard's p-5
const CARD_GAP_PX = 20; // matches gap-5 between the chip and text column
const CHIP_SIZE_PX = 64; // matches the chip's w-16/h-16 — identical on every card
// The chip sits CARD_PADDING_PX + half the chip size in from the card's left
// edge, i.e. left of the card's own center by half the card width minus
// that — so the persisting chip starts exactly where it visually sits inside
// the card (no jump) and only needs to travel the remaining distance.
const CHIP_OFFSET_FROM_CARD_CENTER_PX = -(CARD_WIDTH_PX / 2 - (CARD_PADDING_PX + CHIP_SIZE_PX / 2));

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
  const finalXpx = (index - (PILLARS.length - 1) / 2) * LETTER_GAP_PX;
  const cardFadeEnd = pillar.rangeStart + (pillar.rangeEnd - pillar.rangeStart) * 0.45;

  // The card stays horizontally centered and only travels vertically before
  // dissolving — it's a straight stacked list, not a scatter. Fixed-px start
  // positions (not vh) keep the gap between cards constant regardless of
  // viewport height, so they never overlap.
  const cardY = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [pillar.startY, 0]);
  const cardOpacity = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [1, 0]);
  const cardBlurPx = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [0, 6]);
  const cardFilter = useMotionTemplate`blur(${cardBlurPx}px)`;

  // The chip (and its letter) is the one element that survives the whole
  // piece: it starts exactly where it sits inside the card, travels with the
  // card while the card is still visible, then keeps going to its assigned
  // slot in "CENTER" while its own small background/border fade away —
  // leaving a bare, continuously-growing glyph. Same element throughout, so
  // there's no size pop or repositioning jump at any point.
  const chipX = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [CHIP_OFFSET_FROM_CARD_CENTER_PX, finalXpx]);
  const chipY = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [pillar.startY, 0]);
  const chipScale = useTransform(progress, [pillar.rangeStart, pillar.rangeEnd], [1, 2]);
  const chipChromeOpacity = useTransform(progress, [pillar.rangeStart, cardFadeEnd], [1, 0]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Card — dissolves around the chip as the piece assembles */}
      <motion.div
        style={{ y: cardY, opacity: cardOpacity, filter: cardFilter }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <GlassCard
          hoverAccent="gold"
          variant="glass"
          isTiltEnabled={false}
          // Literal w-[440px] here must stay in sync with CARD_WIDTH_PX above
          // (GlassCard doesn't forward a style prop, so this can't be dynamic).
          className="p-5 border border-white/5 hover:border-gold/15 w-[440px]"
        >
          <div className="flex items-center" style={{ gap: CARD_GAP_PX }}>
            {/* Invisible placeholder reserves the chip's spot in the row so
                the text doesn't reflow — the real, always-visible chip
                renders as a sibling overlay below, positioned to land here. */}
            <div className="shrink-0" style={{ width: CHIP_SIZE_PX, height: CHIP_SIZE_PX }} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-1.5">{pillar.title}</h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed line-clamp-2">{text}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chip + letter — always visible, grows in place as its own chrome fades */}
      <motion.div
        style={{ x: chipX, y: chipY, scale: chipScale, width: CHIP_SIZE_PX, height: CHIP_SIZE_PX }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-xl flex items-center justify-center"
      >
        <motion.div
          style={{ opacity: chipChromeOpacity }}
          className="absolute inset-0 rounded-xl bg-forest/25 border border-forest-light/15"
        />
        <span className="relative font-display text-3xl font-black text-gold-light leading-none select-none">
          {pillar.letter}
        </span>
      </motion.div>
    </div>
  );
}

export default function CareerCenterConverge() {
  const t = useTranslations("CareersPage");
  const triggerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  // Pin the stage via a counter-translate ("transform" pinType) instead of
  // position:fixed/sticky — this page's root wrapper is overflow-hidden
  // (needed to contain unrelated decorative blur elements elsewhere on the
  // page), and overflow-hidden ancestors clip fixed/sticky descendants. The
  // transform-based pin never leaves normal flow, so it isn't affected.
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
    { scope: triggerRef }
  );

  const introOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const captionOpacity = useTransform(progress, [0.78, 0.92], [0, 1]);
  const captionY = useTransform(progress, [0.78, 0.92], [16, 0]);

  return (
    <div ref={triggerRef} className="relative h-[300vh] mb-24">
      <div ref={stageRef} className="relative h-screen overflow-hidden">
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center px-6"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium block mb-3">
            {t("centerOverline")}
          </span>
          <p className="text-lg sm:text-xl text-zinc-300 font-light">{t("centerIntro")}</p>
        </motion.div>

        <div className="relative w-full h-full">
          {PILLARS.map((pillar, idx) => (
            <PillarPiece key={idx} pillar={pillar} index={idx} progress={progress} text={t(pillar.textKey)} />
          ))}
        </div>

        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute bottom-[14%] left-1/2 -translate-x-1/2 text-center px-6"
        >
          <p className="text-base sm:text-lg text-zinc-400 font-light italic mb-4">{t("centerTitle")}</p>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-200 font-light leading-relaxed">
            {t("centerLead")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
