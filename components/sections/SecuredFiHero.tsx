import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { SplineScene } from "@/components/ui/splite";
import { useA11y } from "@/components/theme/AccessibilityProvider";

const ROBOT_SCENE = "/spline/scene.splinecode";

export default function SecuredFiHero() {
  const tStats = useTranslations("Stats");
  const tHero = useTranslations("Hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsMobileDevice(window.innerWidth < 768 || isCoarse || isReduced || a11yEnabled || prefersReducedMotion);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [a11yEnabled, prefersReducedMotion]);

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
    { key: "s1" },
    { key: "s2" },
    { key: "s3" },
    { key: "s4" },
  ];

  // Helper to split the title text dynamically so the last words are highlighted in gold
  const overlineText = tStats("overline");
  const words = overlineText.split(" ");
  const midIndex = Math.max(1, words.length - 2);
  const firstPart = words.slice(0, midIndex).join(" ");
  const lastPart = words.slice(midIndex).join(" ");

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        {/* BACKGROUND: Ambient Spline robot behind the text */}
        {!isMobileDevice && (
          <div className="absolute inset-0 w-full h-full z-0 opacity-40 select-none">
            <div className="w-full h-full scale-[1.0] md:scale-[1.12] origin-center">
              <SplineScene
                scene={ROBOT_SCENE}
                className="w-full h-full [&_canvas]:!h-full [&_canvas]:!w-full"
                logoImg="/spline/ddc_logo_rm_bckgrnd.png"
                logoTarget="Body"
              />
            </div>
            {/* Scrim to guarantee high contrast but let the robot show through */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0e2419]/50 via-[#040c08]/20 to-[#040c08]/80" />
          </div>
        )}

        {/* SECTION 1: Hero Title & Subtitle */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10"
        >
          <div className="max-w-5xl text-center flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold-light text-xs font-mono tracking-widest uppercase pointer-events-auto"
            >
              {tHero("badge")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-serif font-light tracking-tight text-white mb-8 leading-tight pointer-events-auto"
            >
              {firstPart} <br />
              <span className="text-gold font-normal">{lastPart}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-base md:text-lg text-zinc-300 font-sans font-light leading-relaxed mb-4 pointer-events-auto"
            >
              {tStats("title")} <span className="text-gold-light font-medium">{tStats("titleAccent")}</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-sm md:text-base text-zinc-400 font-sans font-light leading-relaxed pointer-events-auto"
            >
              {tStats("subtitle")}
            </motion.p>
          </div>
        </motion.div>

        {/* SECTION 2: Stats Screen */}
        <motion.div
          style={{ opacity: statsOpacity, y: statsY, scale: statsScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10"
        >
          <div className="max-w-6xl w-full pointer-events-auto">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono text-gold-light tracking-widest uppercase mb-4">{tStats("titleAccent")}</h2>
              <p className="text-2xl md:text-3xl font-serif text-white font-light max-w-3xl mx-auto leading-relaxed">{tStats("subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center md:items-start text-center md:text-left border-l border-white/5 pl-0 md:pl-6 py-2"
                >
                  <div className="text-4xl md:text-6xl font-serif font-light text-gold mb-3 tracking-tight">
                    {tStats(`${stat.key}.value`)}
                  </div>
                  <div className="text-xs font-mono text-white tracking-wider uppercase mb-2">
                    {tStats(`${stat.key}.label`)}
                  </div>
                  <div className="text-sm text-zinc-400 font-sans font-light leading-relaxed">
                    {tStats(`${stat.key}.desc`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
