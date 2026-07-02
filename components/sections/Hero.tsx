"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Magnetic from "@/components/motion/Magnetic";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import Icon from "@/components/ui/Icon";
import DDCLogo from "@/components/ui/DDCLogo";

import { SplineScene } from "@/components/ui/splite";

import { useA11y } from "@/components/theme/AccessibilityProvider";

const ROBOT_SCENE = "/spline/scene.splinecode";

export default function Hero() {
  const t = useTranslations("Hero");
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
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

  useGSAP(
    () => {
      // Параллакс-эффект ухода контента под экран при скролле
      gsap.to(textRef.current, {
        yPercent: -20,
        opacity: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] as const, // premium ease-out expo
      },
    },
  };

  // Split translated title strings into array of word objects for localized Typewriter animation
  const title1Words = t("titleLine1").split(" ").filter(Boolean).map(w => ({ text: w }));
  const titleAccentWords = t("titleAccent").split(" ").filter(Boolean).map(w => ({
    text: w,
    className: "text-gradient-gold not-italic font-medium"
  }));
  const title2Words = t("titleLine2").split(" ").filter(Boolean).map(w => ({ text: w }));
  const typewriterWords = [...title1Words, ...titleAccentWords, ...title2Words];

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen lg:h-screen lg:max-h-[820px] xl:max-h-[880px] flex flex-col justify-center items-start overflow-hidden bg-transparent pt-16"
    >
      {/* Левый градиент-скрим для читаемости текста поверх живой 3D-сцены.
          Theme-aware: deep-forest scrim in dark, warm-cream scrim in light — so
          the hero text always reads and the light theme never goes dark. */}
      <div className="hero-text-scrim absolute inset-0 pointer-events-none z-[6]" />

      {/* Bottom fade so the WebGL dot/bokeh background dissolves smoothly into the
          next (solid) section instead of cutting off with a hard edge. */}
      <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 bg-gradient-to-t from-background/35 via-forest/10 to-transparent pointer-events-none z-[2]" />

      {/* Мягкие фоновые свечения для премиальной глубины */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none z-0" />

      {/* Контентная область поверх 3D: текст слева, интерактивный 3D-робот справа.
          Фон — глобальный интерактивный dot-shader (InteractiveDotGrid в page.tsx). */}
      <div
        ref={textRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex flex-col justify-center items-start flex-grow py-6 md:py-10"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-left relative z-10"
        >
          {/* Надзаголовок-статус с зеленым маяком цифровой стабильности */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md px-4 py-2 rounded-full">
            <DDCLogo
              title="DDC"
              className="h-4 w-[15px] shrink-0 text-foreground"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-forest-light animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-light font-mono font-medium">
              {t("badge")}
            </span>
          </motion.div>

          {/* Заголовок на Cormorant Garamond с плавным Typewriter-эффектом */}
          <div className="mb-3">
            <h1 className="font-display text-foreground">
              <TypewriterEffect
                words={typewriterWords}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-tight justify-start my-0 py-0 text-left flex flex-wrap"
                cursorClassName="h-6 sm:h-8 lg:h-12 bg-gold align-middle"
              />
            </h1>
          </div>

          {/* Подзаголовок на Inter */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base lg:text-lg text-foreground/70 font-sans font-normal leading-relaxed max-w-2xl mb-6"
          >
            {t("subtitle")}
          </motion.p>

          {/* Кнопки призыва к действию с тактильным откликом */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 justify-start w-full sm:w-auto"
          >
            <Magnetic>
              <MetalButton
                variant="gold"
                className="w-full sm:w-auto flex items-center justify-center gap-2 group hover-target"
                onClick={() => {
                  const target = document.getElementById("services");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("ctaPrimary")}
                <Icon name="arrow-right" size={16} />
              </MetalButton>
            </Magnetic>
            <Magnetic>
              <MetalButton
                variant="success"
                className="w-full sm:w-auto flex items-center justify-center hover-target"
                onClick={() => {
                  const target = document.getElementById("about");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("ctaSecondary")}
              </MetalButton>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Фоновый 3D-робот с логотипом DDC поверх dot-shader.
            На мобильных / при prefers-reduced-motion — статичный постер. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 right-0 -translate-y-1/2 w-full md:w-[52%] lg:w-[46%] xl:w-[42%] 2xl:w-[38%] max-w-[560px] h-[80%] md:h-[92%] pointer-events-auto z-0 overflow-visible opacity-30 md:opacity-65 mix-blend-screen"
        >
          <div className="absolute inset-0 w-full h-full scale-[1.0] md:scale-[1.08] origin-center">
            {!isMobileDevice && (
              <SplineScene
                scene={ROBOT_SCENE}
                className="w-full h-full [&_canvas]:!h-full [&_canvas]:!w-full"
                logoImg="/spline/ddc_logo_rm_bckgrnd.png"
                logoTarget="Body"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Анимированный скролл-индикатор */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-6 sm:left-12 lg:left-16 z-10 flex items-center gap-3 text-zinc-500 cursor-pointer hover:text-forest-light transition-colors duration-300 pointer-events-auto hover-target"
        onClick={() => {
          const target = document.getElementById("stats");
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium">{t("scroll")}</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Icon name="arrow-right" size={16} className="rotate-90 text-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
