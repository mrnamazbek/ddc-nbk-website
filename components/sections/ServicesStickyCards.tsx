"use client";

import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useTranslations } from "next-intl";

import Icon from "@/components/ui/Icon";
import PageIntro from "@/components/sections/PageIntro";
import ServiceAnimatedScene, {
  ServiceSelectorIcon,
  type ServiceVisualId,
} from "@/components/sections/ServiceAnimatedVisuals";

const SERVICES: { id: ServiceVisualId }[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

const transitionEase = [0.22, 1, 0.36, 1] as const;

export default function ServicesStickyCards() {
  const t = useTranslations("ServicesPage");
  const stageRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const services = useMemo(
    () =>
      SERVICES.map(({ id }) => ({
        id,
        eyebrow: `0${id} / 05`,
        title: t(`s${id}.title`),
        description: t(`s${id}.description`),
        features: [t(`s${id}.f1`), t(`s${id}.f2`)],
      })),
    [t],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = Math.min(services.length - 1, Math.floor(progress * services.length));
    setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
  });

  const selectedIndex = previewIndex ?? activeIndex;
  const selectedService = services[selectedIndex];

  function scrollToService(index: number) {
    const stage = stageRef.current;
    if (!stage) return;

    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, stage.offsetHeight - window.innerHeight);
    const target = stageTop + travel * ((index + 0.45) / services.length);

    setPreviewIndex(null);
    window.scrollTo({
      top: target,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <main className="theme-on-forest relative w-full bg-transparent text-foreground">
      {!shouldReduceMotion && <section ref={stageRef} className="relative hidden h-[500vh] xl:block">
        <div className="sticky top-0 h-svh overflow-hidden px-8 pb-8 pt-28 2xl:px-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.div
                key={selectedService.id}
                className="absolute inset-y-0 right-0 w-[58%] border-l border-forest-light/10 bg-forest/5"
                initial={shouldReduceMotion ? false : { opacity: 0, clipPath: selectedIndex % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.75, ease: transitionEase }}
              />
            </AnimatePresence>
            <div className="absolute right-[8%] top-[16%] h-[68%] w-px bg-forest-light/10" />
            <div className="absolute right-[18%] top-[10%] h-[82%] w-px bg-gold/10" />
          </div>

          <div className="relative mx-auto flex h-full max-w-[1480px] flex-col">
            <header className="flex items-end justify-between gap-12 border-b border-white/10 pb-6">
              <div>
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light">
                  {t("overline")}
                </span>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground 2xl:text-4xl">
                  {t("titleLine1")} <span className="text-gold-light">{t("titleAccent")}</span>
                </h1>
              </div>
              <p className="max-w-md text-right text-sm leading-relaxed text-muted 2xl:text-base">
                {t("subtitle")}
              </p>
            </header>

            <div className="grid min-h-0 flex-1 grid-cols-[250px_minmax(330px,0.82fr)_minmax(0,1.18fr)] items-center gap-10 2xl:grid-cols-[280px_minmax(380px,0.82fr)_minmax(0,1.18fr)] 2xl:gap-14">
              <nav aria-label={t("titleLine1")} className="relative py-3">
                <div className="absolute bottom-5 left-5 top-5 w-px bg-white/10" aria-hidden="true">
                  <motion.div
                    className="h-full w-full origin-top bg-gold"
                    style={{ scaleY: scrollYProgress }}
                  />
                </div>

                {services.map((service, index) => {
                  const isSelected = selectedIndex === index;
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => scrollToService(index)}
                      onMouseEnter={() => setPreviewIndex(index)}
                      onMouseLeave={() => setPreviewIndex(null)}
                      onFocus={() => setPreviewIndex(index)}
                      onBlur={() => setPreviewIndex(null)}
                      className="group relative flex w-full items-center gap-4 py-3.5 text-left focus-visible:outline-none"
                    >
                      <motion.span
                        className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-[var(--background)] transition-colors duration-[var(--duration-base)] ${
                          isSelected
                            ? "border-gold text-gold-light"
                            : "border-forest-light/25 text-muted"
                        }`}
                        animate={{ scale: isSelected ? 1.06 : 1 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: transitionEase }}
                      >
                        <ServiceSelectorIcon id={service.id} active={isSelected} />
                      </motion.span>

                      <span className="min-w-0 flex-1">
                        <span className="mb-0.5 block font-mono text-[9px] tracking-[0.22em] text-gold-light/70">
                          {service.eyebrow}
                        </span>
                        <motion.span
                          className={`block text-sm font-medium leading-tight transition-colors duration-[var(--duration-base)] ${
                            isSelected ? "text-foreground" : "text-muted"
                          }`}
                          animate={{ x: isSelected && !shouldReduceMotion ? 5 : 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: transitionEase }}
                        >
                          {service.title}
                        </motion.span>
                      </span>

                      <motion.span
                        aria-hidden="true"
                        className="h-px w-7 origin-left bg-gold"
                        animate={{ scaleX: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: transitionEase }}
                      />
                    </button>
                  );
                })}
              </nav>

              <div className="relative min-h-[480px] 2xl:min-h-[540px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={selectedService.id}
                    className="absolute inset-0 flex flex-col justify-center"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 32, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.62, ease: transitionEase }}
                  >
                    <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-gold-light">
                      {selectedService.eyebrow} / DDC
                    </p>
                    <h2 className="max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-tight text-foreground 2xl:text-6xl">
                      {selectedService.title}
                    </h2>
                    <p className="mt-7 max-w-lg text-base leading-relaxed text-muted 2xl:text-lg">
                      {selectedService.description}
                    </p>
                    <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
                      {selectedService.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                          initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.32 + featureIndex * 0.09, duration: 0.45 }}
                        >
                          <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-forest-light" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.article>
                </AnimatePresence>
              </div>

              <div className="relative flex min-h-0 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedService.id}
                    className="w-full"
                    initial={shouldReduceMotion ? false : {
                      opacity: 0,
                      x: selectedIndex % 2 === 0 ? 55 : -55,
                      clipPath: selectedIndex % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
                    }}
                    animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.78, ease: transitionEase }}
                  >
                    <ServiceAnimatedScene id={selectedService.id} className="mx-auto" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <footer className="flex items-center gap-5 border-t border-white/10 pt-5">
              <span className="font-mono text-[10px] tracking-[0.25em] text-gold-light">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 overflow-hidden bg-white/10">
                <motion.div className="h-full origin-left bg-gold" style={{ scaleX: scrollYProgress }} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted">05</span>
            </footer>
          </div>
        </div>
      </section>}

      <section className={`px-6 pb-24 pt-32 sm:px-12 ${shouldReduceMotion ? "xl:block" : "xl:hidden"}`}>
        <div className="mx-auto max-w-5xl">
          <PageIntro
            overline={t("overline")}
            titleLine1={t("titleLine1")}
            titleAccent={t("titleAccent")}
            subtitle={t("subtitle")}
          />

          <div className="mt-16">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                className="border-t border-white/10 py-12 sm:py-16"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: index === 0 ? 0 : 0.05, ease: transitionEase }}
              >
                <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
                  <div>
                    <div className="mb-5 flex items-center gap-4 text-gold-light">
                      <span className="flex size-11 items-center justify-center rounded-full border border-gold/30">
                        <ServiceSelectorIcon id={service.id} active />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
                        {service.eyebrow} / DDC
                      </span>
                    </div>
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-muted">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                          <Icon name="check-circle" size={15} className="mt-0.5 shrink-0 text-forest-light" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ServiceAnimatedScene id={service.id} className="mx-auto max-w-[520px]" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
