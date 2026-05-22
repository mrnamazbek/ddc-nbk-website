"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, ChevronDown } from "lucide-react";

// Динамический импорт 3D-сцены для предотвращения ошибок SSR и повышения производительности при первой загрузке
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-forest-light border-t-gold rounded-full animate-spin" />
    </div>
  ),
});

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // premium ease-out expo
      },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0A0A0A] pt-20">
      {/* 3D Интерактивный бэкграунд */}
      <HeroScene />

      {/* Контентная область поверх 3D */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full text-center md:text-left flex flex-col justify-center flex-grow py-12 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Надзаголовок-статус */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-forest-light animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
              Digital Development Center • National Bank of Kazakhstan
            </span>
          </motion.div>

          {/* Заголовок на Cormorant Garamond */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] text-white mb-8"
          >
            Формируя <br className="hidden md:inline" />
            <span className="text-gradient-gold font-medium">цифровое будущее</span> <br />
            финансовой экосистемы
          </motion.h1>

          {/* Подзаголовок на Inter */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-zinc-400 font-sans font-light leading-relaxed max-w-2xl mb-12"
          >
            Разработка национальных цифровых инфраструктур, интеграция передовых технологий и создание безопасной финансовой архитектуры для Республики Казахстан.
          </motion.p>

          {/* Кнопки призыва к действию */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2 group"
              onClick={() => {
                const target = document.getElementById("services");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Наши решения
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                const target = document.getElementById("about");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              О Центре
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Анимированный скролл-индикатор */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-500 cursor-pointer hover:text-gold transition-colors duration-300 pointer-events-auto"
        onClick={() => {
          const target = document.getElementById("stats");
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Прокрутите вниз</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
