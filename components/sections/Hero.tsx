"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import ShimmerButton from "@/components/ui/ShimmerButton";
import Magnetic from "@/components/motion/Magnetic";

export default function Hero() {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

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

  const textRowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-start overflow-hidden bg-transparent pt-20"
    >
      {/* Левый градиент-скрим для читаемости текста поверх живой 3D-сцены */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E2419]/85 via-[#0E2419]/30 to-transparent pointer-events-none" />

      {/* Мягкие фоновые свечения для премиальной глубины */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      {/* Контентная область поверх 3D — строго асимметричное левое выравнивание */}
      <div 
        ref={textRef}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full text-left flex flex-col justify-center flex-grow py-12 md:py-24"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Надзаголовок-статус с зеленым маяком цифровой стабильности */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md px-4 py-2 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-light animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-light font-mono font-medium">
              {t("badge")}
            </span>
          </motion.div>

          {/* Заголовок на Cormorant Garamond с кинетическим эффектом появления */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              variants={textRowVariants}
              className="font-display italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.02] text-white"
            >
              {t("titleLine1")} <br />
              <span className="text-gradient-forest font-medium not-italic">{t("titleAccent")}</span> <br />
              {t("titleLine2")}
            </motion.h1>
          </div>

          {/* Подзаголовок на Inter */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/70 font-sans font-light leading-relaxed max-w-2xl mb-12"
          >
            {t("subtitle")}
          </motion.p>

          {/* Кнопки призыва к действию с тактильным откликом */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 justify-start w-full sm:w-auto"
          >
            <Magnetic>
              <ShimmerButton
                variant="gold"
                className="w-full sm:w-auto flex items-center justify-center gap-2 group hover-target"
                onClick={() => {
                  const target = document.getElementById("services");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("ctaPrimary")}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-current" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </ShimmerButton>
            </Magnetic>
            <Magnetic>
              <ShimmerButton
                variant="forest"
                className="w-full sm:w-auto flex items-center justify-center hover-target"
                onClick={() => {
                  const target = document.getElementById("about");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("ctaSecondary")}
              </ShimmerButton>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      {/* Анимированный скролл-индикатор */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-6 sm:left-12 lg:left-16 z-10 flex items-center gap-3 text-zinc-500 cursor-pointer hover:text-forest-light transition-colors duration-300 pointer-events-auto hover-target"
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
          <svg 
            className="w-4 h-4 stroke-current" 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

