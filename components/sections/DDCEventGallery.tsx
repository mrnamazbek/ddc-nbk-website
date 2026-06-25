"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";

interface EventItem {
  id: string;
  image: string;
  translationKey: string;
}

const GALLERY_ITEMS: EventItem[] = [
  {
    id: "suleimenov",
    image: "/images/linkedin/post_17_suleimenov_meeting.jpg",
    translationKey: "suleimenov",
  },
  {
    id: "binur",
    image: "/images/linkedin/post_10_binur_meeting.jpg",
    translationKey: "binur",
  },
  {
    id: "aiPlatform",
    image: "/images/linkedin/post_0_ai_platform.jpg",
    translationKey: "aiPlatform",
  },
  {
    id: "llmLearning",
    image: "/images/linkedin/post_6_nfactorial_llm.jpg",
    translationKey: "llmLearning",
  },
  {
    id: "welcome",
    image: "/images/linkedin/post_19_welcome_meeting.jpg",
    translationKey: "welcome",
  },
  {
    id: "risks",
    image: "/images/linkedin/post_18_tech_talks_risks.jpg",
    translationKey: "risks",
  },
  {
    id: "architecture",
    image: "/images/linkedin/post_9_it_architecture.jpg",
    translationKey: "architecture",
  },
];

export default function DDCEventGallery() {
  const t = useTranslations("EventGallery");
  const shouldReduceMotionRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldReduceMotion = mounted ? !!shouldReduceMotionRaw : false;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % GALLERY_ITEMS.length);
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
    );
  }, [selectedIndex]);

  // Клавиши для лайтбокса
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  const getFlexValue = (index: number) => {
    if (shouldReduceMotion) return 1;
    if (hoveredIndex === null) return 1;
    return hoveredIndex === index ? 3.2 : 0.6;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Декорации на фоне */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок секции */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            {t("title")}{" "}
            <span className="text-gradient-gold font-medium">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Сетка / Карусель */}
        <div className="hidden md:flex gap-4 h-[460px] w-full items-stretch">
          {GALLERY_ITEMS.map((item, idx) => {
            const itemTitle = t(`events.${item.translationKey}.title`);
            const itemDesc = t(`events.${item.translationKey}.desc`);
            const isHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={item.id}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-charcoal/20 select-none group"
                style={{ flex: 1 }}
                animate={{ flex: getFlexValue(idx) }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(idx)}
              >
                {/* Изображение */}
                <Image
                  src={item.image}
                  alt={itemTitle}
                  fill
                  sizes="(max-w-768px) 100vw, 400px"
                  priority={idx < 3}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Градиентный оверлей */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10 transition-opacity duration-300" />

                {/* Контент */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                  <motion.div 
                    animate={{ y: isHovered || shouldReduceMotion ? 0 : 40 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider line-clamp-1">
                        {itemTitle}
                      </h3>
                    </div>

                    <AnimatePresence initial={false}>
                      {(isHovered || shouldReduceMotion) && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3"
                        >
                          {itemDesc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Мобильная версия (Вертикальный скролл карточек) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
          {GALLERY_ITEMS.map((item, idx) => {
            const itemTitle = t(`events.${item.translationKey}.title`);
            const itemDesc = t(`events.${item.translationKey}.desc`);

            return (
              <GlassCard
                key={item.id}
                hoverAccent="gold"
                variant="liquid"
                isTiltEnabled={false}
                className="overflow-hidden p-0 rounded-2xl flex flex-col cursor-pointer border border-white/5"
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={itemTitle}
                    fill
                    sizes="(max-w-768px) 100vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                </div>
                <div className="p-5 flex-grow text-left">
                  <h3 className="text-base font-bold text-white tracking-wide mb-2">
                    {itemTitle}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3">
                    {itemDesc}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>

      {/* Полноэкранный Лайтбокс */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Кнопка закрытия */}
            <button
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 border border-white/10"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close"
            >
              <Icon name="x" size={20} />
            </button>

            {/* Стрелка влево */}
            <button
              className="absolute left-6 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 border border-white/10 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous"
            >
              <Icon name="arrow-left" size={24} />
            </button>

            {/* Контейнер с изображением и деталями */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col bg-charcoal/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Фото */}
              <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black">
                <Image
                  src={GALLERY_ITEMS[selectedIndex].image}
                  alt={t(`events.${GALLERY_ITEMS[selectedIndex].translationKey}.title`)}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Текстовая панель */}
              <div className="p-6 bg-charcoal/90 border-t border-white/15 text-left">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-gold-light uppercase">
                    {t("overline")}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {selectedIndex + 1} / {GALLERY_ITEMS.length}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-2">
                  {t(`events.${GALLERY_ITEMS[selectedIndex].translationKey}.title`)}
                </h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {t(`events.${GALLERY_ITEMS[selectedIndex].translationKey}.desc`)}
                </p>
              </div>
            </motion.div>

            {/* Стрелка вправо */}
            <button
              className="absolute right-6 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 border border-white/10 hidden sm:block"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next"
            >
              <Icon name="arrow-right" size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
