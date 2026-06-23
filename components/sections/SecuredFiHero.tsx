"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SecuredFiHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress across the 200vh viewport of the hero/stats section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Screen 1 (Hero Title & Subtitle) scroll animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  // Screen 2 (Stats Grid) scroll animations
  const statsOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.85, 0.98], [0, 1, 1, 0]);
  const statsY = useTransform(scrollYProgress, [0.4, 0.55], [120, 0]);
  const statsScale = useTransform(scrollYProgress, [0.85, 0.98], [1, 0.95]);

  const stats = [
    {
      num: "1996",
      label: "Year founded",
      desc: "Over 20 years on the IT-solutions market for the National Bank.",
    },
    {
      num: "50 / 24",
      label: "Information systems",
      desc: "50 systems built, 24 of them in operation today.",
    },
    {
      num: "2020",
      label: "Procurement portal",
      desc: "Year the unified state procurement portal was launched.",
    },
    {
      num: "1477",
      label: "Contact center",
      desc: "Unified toll-free support number across Kazakhstan.",
    },
  ];

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full">
      {/* SECTION 1: Fixed Hero Screen */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="fixed inset-0 flex flex-col items-center justify-center px-6 pointer-events-none z-10"
      >
        <div className="max-w-5xl text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold-light text-xs font-mono tracking-widest uppercase"
          >
            Digital Development Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-serif font-light tracking-tight text-white mb-8 leading-tight"
          >
            Digital development <br />
            <span className="text-gold-light font-normal">in numbers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base md:text-lg text-zinc-400 font-sans font-light leading-relaxed mb-4"
          >
            The technological core of the National Bank
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-sm md:text-base text-zinc-500 font-sans font-light leading-relaxed"
          >
            For over two decades we have built and maintained the key information systems of Kazakhstan's financial infrastructure.
          </motion.p>
        </div>
      </motion.div>

      {/* SECTION 2: Fixed Stats Screen */}
      <motion.div
        style={{ opacity: statsOpacity, y: statsY, scale: statsScale }}
        className="fixed inset-0 flex flex-col items-center justify-center px-6 pointer-events-none z-10"
      >
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-gold-light tracking-widest uppercase mb-4">Financial Infrastructure</h2>
            <p className="text-2xl md:text-3xl font-serif text-white font-light">Key milestones of Kazakhstan's central bank IT operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center md:items-start text-center md:text-left border-l border-white/5 pl-0 md:pl-6 py-2"
              >
                <div className="text-4xl md:text-6xl font-serif font-light text-gold-light mb-3 tracking-tight">
                  {stat.num}
                </div>
                <div className="text-xs font-mono text-white tracking-wider uppercase mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-zinc-500 font-sans font-light leading-relaxed">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
