"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";
import { BubbleText } from "@/components/ui/BubbleText";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

const STATS = [
  { key: "s1", accent: "gold" as const },
  { key: "s2", accent: "forest" as const },
  { key: "s3", accent: "forest" as const },
  { key: "s4", accent: "gold" as const },
  { key: "s5", accent: "gold" as const },
  { key: "s6", accent: "forest" as const },
  { key: "s7", accent: "forest" as const },
  { key: "s8", accent: "gold" as const },
];

export default function Stats({ id = "stats" }: { id?: string | null }) {
  const t = useTranslations("Stats");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id={id ?? undefined}
      className="relative w-full py-24 sm:py-32 bg-transparent overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A3D2B03_1px,transparent_1px),linear-gradient(to_bottom,#1A3D2B03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground mb-6">
            {t("title")}{" "}
            <span className="text-gradient-forest font-medium"><BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" /></span>
          </h2>
          <p className="text-muted font-sans font-normal leading-relaxed text-lg">
            <BubbleText text={t("subtitle")} />
          </p>
        </div>

        {/* Real metrics grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STATS.map((s) => (
            <motion.div key={s.key} variants={cardVariants}>
              <GlassCard hoverAccent={s.accent} className="h-full flex flex-col p-8">
                <div
                  className={`font-numbers text-5xl sm:text-6xl font-bold tracking-tight mb-4 ${
                    s.accent === "gold" ? "text-gradient-gold" : "text-gradient-forest"
                  }`}
                >
                  <AnimatedNumber value={t(`${s.key}.value`)} />
                </div>
                <h3 className="text-base font-sans font-semibold text-foreground tracking-wide mb-2">
                  {t(`${s.key}.label`)}
                </h3>
                <p className="text-sm font-sans font-normal text-muted leading-relaxed">
                  {t(`${s.key}.desc`)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
