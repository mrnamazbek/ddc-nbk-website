"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Magnetic from "@/components/motion/Magnetic";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { BubbleText } from "@/components/ui/BubbleText";
import { MetalButton } from "@/components/ui/liquid-glass-button";
import Icon from "@/components/ui/Icon";
import DDCLogo from "@/components/ui/DDCLogo";
import FlowingHeroShaderBackground from "@/components/ui/ShaderBackground";
import { ENTRANCE_EASE, ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";

import { SplineScene } from "@/components/ui/splite";

import { useA11y } from "@/components/theme/AccessibilityProvider";

const ROBOT_SCENE = "/spline/scene.splinecode";

export default function Hero() {
  const t = useTranslations("Hero");
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const reduced = a11yEnabled || prefersReducedMotion;
  const { resolvedTheme } = useTheme();
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
      if (
        !containerRef.current ||
        !textRef.current ||
        a11yEnabled ||
        prefersReducedMotion ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        window.innerWidth < 1024
      ) {
        return;
      }

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
    { scope: containerRef, dependencies: [a11yEnabled, prefersReducedMotion] }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: STAGGER.base,
        delayChildren: 0.2,
      },
    },
  };

  // Label (badge): first to appear, shortest hold.
  const labelVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: ENTRANCE_DURATION.label, ease: ENTRANCE_EASE },
    },
  };

  // Subtitle: same shape, slightly longer settle.
  const subtitleVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: ENTRANCE_DURATION.subtitle, ease: ENTRANCE_EASE },
    },
  };

  // Buttons: last to appear, each scales in with a tight stagger between them
  // (never a bounce — scale stays subtle, 0.96 -> 1).
  const buttonContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER.tight } },
  };

  const buttonItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: ENTRANCE_DURATION.button, ease: ENTRANCE_EASE },
    },
  };

  // Split translated title strings into explicit reveal LINES (not one flat
  // word list) — titleLine1/titleAccent/titleLine2 are the designed line
  // breaks; TypewriterEffect reveals each with its own clip animation, so
  // this stays true to that layout instead of depending on wherever flex-wrap
  // happens to break at a given viewport width.
  const title1Words = t("titleLine1").split(" ").filter(Boolean).map(w => ({ text: w }));
  const titleAccentWords = t("titleAccent").split(" ").filter(Boolean).map(w => ({
    text: w,
    className: "text-gradient-gold not-italic font-medium"
  }));
  const title2Words = t("titleLine2").split(" ").filter(Boolean).map(w => ({ text: w }));
  const typewriterLines = [title1Words, titleAccentWords, title2Words].filter((line) => line.length > 0);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen lg:h-screen lg:max-h-[820px] xl:max-h-[880px] flex flex-col justify-center items-start overflow-hidden bg-transparent pt-16"
    >
      {/* Flowing shader effect — scoped to the hero only. It's positioned
          absolute within this section (not fixed to the viewport), so it
          scrolls away with the hero instead of trailing into later sections. */}
      <FlowingHeroShaderBackground isLight={resolvedTheme === "light"} />

      {/* Левый градиент-скрим для читаемости текста поверх живой 3D-сцены.
          Theme-aware: deep-forest scrim in dark, warm-cream scrim in light — so
          the hero text always reads and the light theme never goes dark. */}
      <div className="hero-text-scrim absolute inset-0 pointer-events-none z-[6]" />

      {/* Контентная область поверх 3D: текст слева, интерактивный 3D-робот справа.
          Фон — глобальный интерактивный dot-shader (InteractiveDotGrid в page.tsx). */}
      <div
        ref={textRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex flex-col justify-center items-start flex-grow py-6 md:py-10"
      >
        <motion.div
          variants={containerVariants}
          initial={reduced ? false : "hidden"}
          animate="visible"
          className="text-left relative z-10"
        >
          {/* Надзаголовок-статус с зеленым маяком цифровой стабильности */}
          <motion.div variants={labelVariants} className="inline-flex items-center gap-3 mb-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md px-4 py-2 rounded-full">
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
                lines={typewriterLines}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-tight"
                cursorClassName="h-6 sm:h-8 lg:h-12 bg-gold"
              />
            </h1>
          </div>

          {/* Подзаголовок на Inter — обёрнут в div с max-width, чтобы текст не
              заходил на робота (глобальное правило p{max-width:72ch} не даёт
              ограничить ширину прямо на <p>). */}
          <div className="max-w-md lg:max-w-lg xl:max-w-xl mb-6">
            <motion.p
              variants={subtitleVariants}
              className="text-sm sm:text-base lg:text-lg text-foreground/70 font-sans font-normal leading-relaxed"
            >
              <BubbleText text={t("subtitle")} />
            </motion.p>
          </div>

          {/* Кнопки призыва к действию с тактильным откликом */}
          <motion.div
            variants={buttonContainerVariants}
            className="flex flex-col sm:flex-row items-center gap-4 justify-start w-full sm:w-auto"
          >
            <motion.div variants={buttonItemVariants} className="w-full sm:w-auto">
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
            </motion.div>
            <motion.div variants={buttonItemVariants} className="w-full sm:w-auto">
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
        </motion.div>

        {/* Фоновый 3D-робот с логотипом DDC поверх dot-shader.
            На мобильных / при prefers-reduced-motion — статичный постер. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: ENTRANCE_EASE }}
          className="absolute top-1/2 right-0 -translate-y-1/2 -mt-8 md:-mt-14 w-full md:w-[52%] lg:w-[46%] xl:w-[42%] 2xl:w-[38%] max-w-[560px] h-[80%] md:h-[92%] pointer-events-auto z-0 overflow-visible opacity-30 md:opacity-65 mix-blend-screen"
        >
          <div className="absolute inset-0 w-full h-full scale-[1.05] md:scale-[1.12] origin-center">
            {!isMobileDevice && (
              <SplineScene
                scene={ROBOT_SCENE}
                className="w-full h-full [&_canvas]:!h-full [&_canvas]:!w-full"
                logoImg="/spline/ddc_logo_rm_bckgrnd.png"
                logoTarget="Body"
                trackCursor
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Анимированный скролл-индикатор */}
      {!a11yEnabled && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: ENTRANCE_EASE }}
          className="absolute bottom-6 left-6 sm:left-12 lg:left-16 z-10 hidden items-center gap-3 text-zinc-500 cursor-pointer hover:text-forest-light transition-colors duration-300 pointer-events-auto hover-target [@media(min-height:700px)]:flex"
          onClick={() => {
            const target = document.getElementById("stats");
            target?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium">{t("scroll")}</span>
          <motion.div
            animate={reduced ? { y: 0 } : { y: [0, 4, 0] }}
            transition={reduced ? { duration: 0 } : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Icon name="arrow-right" size={16} className="rotate-90 text-zinc-500" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
