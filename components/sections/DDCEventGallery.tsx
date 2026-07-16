"use client";

import { useState, useEffect, useCallback } from "react";
import { useMounted } from "@/lib/clientState";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import GlassCard from "@/components/ui/GlassCard";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import { cn } from "@/lib/utils";

/** Enter/Space activates a div-based card the same way a click would —
 * needed because these cards carry framer-motion layoutId shared-element
 * transitions into the lightbox, which a plain <button> would complicate. */
function onCardKeyDown(onActivate: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };
}

interface EventItem {
  id: string;
  image: string;
  translationKey: string;
  linkedinUrl: string;
}

const GALLERY_ITEMS: EventItem[] = [
  {
    id: "suleimenov",
    image: "/images/linkedin/post_17_suleimenov_meeting.jpg",
    translationKey: "suleimenov",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7380833625589637120",
  },
  {
    id: "binur",
    image: "/images/linkedin/post_10_binur_meeting.jpg",
    translationKey: "binur",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7448264532290064384",
  },
  {
    id: "aiPlatform",
    image: "/images/linkedin/post_0_ai_platform.jpg",
    translationKey: "aiPlatform",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7473705322331791361",
  },
  {
    id: "llmLearning",
    image: "/images/linkedin/post_6_nfactorial_llm.jpg",
    translationKey: "llmLearning",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7434466951747268608",
  },
  {
    id: "welcome",
    image: "/images/linkedin/post_19_welcome_meeting.jpg",
    translationKey: "welcome",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7369262809072705538",
  },
  {
    id: "risks",
    image: "/images/linkedin/post_18_tech_talks_risks.jpg",
    translationKey: "risks",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7379732459627814913",
  },
  {
    id: "architecture",
    image: "/images/linkedin/post_9_it_architecture.jpg",
    translationKey: "architecture",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7450435545597456385",
  },
];

export default function DDCEventGallery() {
  const t = useTranslations("EventGallery");
  const { enabled: a11yEnabled } = useA11y();
  const shouldReduceMotionRaw = useReducedMotion();
  const mounted = useMounted();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const selectedItem = selectedIndex === null ? null : GALLERY_ITEMS[selectedIndex];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Заголовок секции */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            {t("title")}{" "}
            <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            <BubbleText text={t("subtitle")} />
          </p>
        </div>

        {/* Сетка / Карусель — the narrow hover-to-expand accordion depends on
            mouse hover with no keyboard equivalent, and its collapsed strips
            (~145px wide against a fixed 460px height) crop titles far more
            aggressively at the low-vision mode's larger type. Low-vision mode
            uses the plain grid below instead, same as small screens. */}
        <div className={cn("hidden gap-4 h-[460px] w-full items-stretch", !a11yEnabled && "md:flex")}>
          {GALLERY_ITEMS.map((item, idx) => {
            const itemTitle = t(`events.${item.translationKey}.title`);
            const itemDesc = t(`events.${item.translationKey}.desc`);
            const isHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={itemTitle}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-charcoal/20 select-none group focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
                style={{ flex: 1 }}
                animate={{ flex: getFlexValue(idx) }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(idx)}
                onKeyDown={onCardKeyDown(() => setSelectedIndex(idx))}
              >
                {/* Изображение */}
                <motion.div
                  layoutId={`event-image-${item.id}`}
                  className="absolute inset-0"
                  transition={{ layout: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <Image
                    src={item.image}
                    alt={itemTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={idx < 3}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>

                {/* Градиентный оверлей с эффектом дыма/затемнения для неактивного состояния */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 transition-all duration-500 ease-in-out",
                    isHovered || shouldReduceMotion
                      ? "bg-gradient-to-t from-black/98 via-black/40 to-transparent backdrop-blur-none"
                      : "bg-black/65 backdrop-blur-[1.5px]"
                  )}
                />

                {/* Контент */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end">
                  {/* Вертикальный заголовок для неактивного состояния */}
                  <AnimatePresence>
                    {!isHovered && !shouldReduceMotion && (
                      <motion.div
                        key="vertical-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <span className="whitespace-nowrap uppercase tracking-[0.3em] font-heading font-black text-[11px] text-zinc-100/90 rotate-90 origin-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                          {itemTitle}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Горизонтальный контент для активного состояния */}
                  <div
                    className={cn(
                      "p-6 text-left transition-all duration-500 ease-out transform-gpu",
                      isHovered || shouldReduceMotion
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 shadow-[0_0_12px_rgba(235,192,105,0.4)]" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading line-clamp-1">
                        {itemTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3">
                      {itemDesc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Мобильная версия (Вертикальный скролл карточек) — also the
            low-vision fallback for the desktop accordion above: full-size,
            untruncated titles and a normal aspect ratio, and (unlike the
            accordion) a real keyboard-focusable, Enter/Space-activatable
            target via the wrapping button. */}
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-6", !a11yEnabled && "md:hidden")}>
          {GALLERY_ITEMS.map((item, idx) => {
            const itemTitle = t(`events.${item.translationKey}.title`);
            const itemDesc = t(`events.${item.translationKey}.desc`);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 rounded-2xl"
              >
              <GlassCard
                hoverAccent="gold"
                variant="liquid"
                isTiltEnabled={false}
                className="overflow-hidden p-0 rounded-2xl flex flex-col cursor-pointer border border-white/5"
              >
                <div className="relative h-48 w-full">
                  <motion.div
                    layoutId={`event-mobile-image-${item.id}`}
                    className="absolute inset-0"
                    transition={{ layout: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <Image
                      src={item.image}
                      alt={itemTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </motion.div>
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
              </button>
            );
          })}
        </div>

      </div>

      {/* Полноэкранный Лайтбокс */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="event-lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
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
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.92, rotateX: 6, filter: "blur(12px)" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96, filter: "blur(8px)" }}
              transition={{ duration: shouldReduceMotion ? 0.18 : 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="event-lightbox-shell relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal/80 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Фото */}
              <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black">
                <motion.div
                  layoutId={`event-image-${selectedItem.id}`}
                  className="absolute inset-0"
                  transition={{ layout: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } }}
                >
                  <Image
                    src={selectedItem.image}
                    alt={t(`events.${selectedItem.translationKey}.title`)}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Текстовая панель */}
              <div className="p-6 bg-charcoal/90 border-t border-white/15 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-gold-light uppercase">
                      {t("overline")}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono sm:hidden">
                      {selectedIndex + 1} / {GALLERY_ITEMS.length}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-2">
                    {t(`events.${selectedItem.translationKey}.title`)}
                  </h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    {t(`events.${selectedItem.translationKey}.desc`)}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <span className="text-xs text-zinc-400 font-mono hidden sm:block">
                    {selectedIndex + 1} / {GALLERY_ITEMS.length}
                  </span>
                  <a
                    href={selectedItem.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass text-xs font-mono font-bold text-white hover:text-gold border border-white/10 hover:border-gold/30 transition-all w-full sm:w-auto justify-center select-none"
                  >
                    <span>{t("viewPost")}</span>
                    <Icon name="arrow-up-right" size={14} />
                  </a>
                </div>
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
