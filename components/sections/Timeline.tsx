"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { getScroll } from "@/lib/scrollStore";

interface TimelineMilestone {
  key: string;
  year: string;
}

export default function Timeline() {
  const t = useTranslations("Timeline");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const milestones: TimelineMilestone[] = [
    { key: "y1996", year: "1996" },
    { key: "y2003", year: "2003" },
    { key: "y2015", year: "2015" },
    { key: "y2017", year: "2017" },
    { key: "y2020", year: "2020-2023" },
    { key: "y2025", year: "2025" },
  ];

  // Sync active index with scroll progress (range 0.90 to 0.93)
  useEffect(() => {
    let animId: number;
    const syncScroll = () => {
      if (!document.getElementById("acts")) return;
      const p = getScroll().smooth;
      if (p >= 0.90 && p <= 0.93) {
        const localProg = (p - 0.90) / 0.03; // 0..1
        const index = Math.min(milestones.length - 1, Math.floor(localProg * milestones.length));
        setActiveIndex(index);
      }
      animId = requestAnimationFrame(syncScroll);
    };
    syncScroll();
    return () => cancelAnimationFrame(animId);
  }, [milestones.length]);

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

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-black overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6 leading-tight">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-sm sm:text-base font-sans font-light text-zinc-400 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Desktop timeline track (Horizontal) */}
        <div className="hidden lg:block relative mb-12">
          {/* Horizontal connecting track line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-zinc-800 via-gold/40 to-zinc-800 -translate-y-1/2" />
          
          {/* Timeline Nodes */}
          <div className="relative flex justify-between items-center max-w-5xl mx-auto">
            {milestones.map((m, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveIndex(idx)}
                  className="relative flex flex-col items-center group focus:outline-none"
                >
                  {/* Glowing halo for active node */}
                  {isActive && (
                    <motion.span
                      layoutId="activeGlow"
                      className="absolute -top-3 w-10 h-10 rounded-full bg-gold/20 blur-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Node dot */}
                  <span className={`w-4 h-4 rounded-full border-2 transition-all duration-300 relative z-10 ${
                    isActive 
                      ? "bg-gold border-gold scale-125 shadow-[0_0_15px_#E8C87A]" 
                      : "bg-[#0A0A0A] border-zinc-700 group-hover:border-zinc-500 group-hover:scale-110"
                  }`} />
                  
                  {/* Year text */}
                  <span className={`mt-3 font-mono text-xs transition-colors duration-300 ${
                    isActive ? "text-gold font-semibold" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}>
                    {t(`${m.key}.year`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Active Card (Desktop) */}
        <div className="hidden lg:block min-h-[220px] max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GlassCard
                hoverAccent="gold"
                variant="liquid-strong"
                isTiltEnabled={false}
                className="p-8 border border-gold/15"
              >
                <div className="flex gap-8 items-start">
                  <div className="font-display text-5xl font-bold text-gradient-gold shrink-0">
                    {t(`${milestones[activeIndex].key}.year`)}
                  </div>
                  <div>
                    <h3 className="text-xl font-sans font-semibold text-white mb-3">
                      {t(`${milestones[activeIndex].key}.title`)}
                    </h3>
                    <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed">
                      {t(`${milestones[activeIndex].key}.desc`)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile timeline view (Vertical Stack) */}
        <div className="lg:hidden relative space-y-6">
          {/* Vertical line helper */}
          <div className="absolute left-6 top-4 bottom-4 w-[1px] bg-gradient-to-b from-gold via-zinc-800 to-transparent" />
          
          {milestones.map((m, idx) => (
            <div key={m.key} className="flex gap-6 relative z-10 group">
              {/* Dot indicator */}
              <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center shrink-0 border border-white/5 transition-all duration-300 group-hover:border-gold/30">
                <span className="w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_#E8C87A]" />
              </div>
              <div className="w-full">
                <GlassCard hoverAccent="gold" variant="liquid" isTiltEnabled={false} className="p-6">
                  <div className="font-mono text-xs text-gold mb-1 font-semibold">
                    {t(`${m.key}.year`)}
                  </div>
                  <h3 className="text-base font-sans font-semibold text-white mb-2">
                    {t(`${m.key}.title`)}
                  </h3>
                  <p className="text-xs font-sans font-light text-zinc-400 leading-relaxed">
                    {t(`${m.key}.desc`)}
                  </p>
                </GlassCard>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
    </section>
  );
}
