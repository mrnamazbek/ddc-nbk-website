"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import Icon, { IconName } from "@/components/ui/Icon";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/**
 * DDC's public technology scope. The lines are a conceptual map of work
 * domains, not a representation of support contracts or legal relationships.
 *
 * This is deliberately CSS/transform-only: no canvas, WebGL, rAF loop, or
 * viewport-wide effects. Motion is disabled for reduced-motion and the site's
 * accessibility mode.
 */
type NodeId = "systems" | "data" | "integrations" | "infrastructure" | "security" | "services";

interface EcosystemNode {
  id: NodeId;
  x: number;
  y: number;
  floatDuration: number;
  icon: IconName;
}

const NODES: EcosystemNode[] = [
  { id: "systems", x: 24, y: 17, floatDuration: 7.5, icon: "layers" },
  { id: "data", x: 76, y: 17, floatDuration: 8.5, icon: "database" },
  { id: "integrations", x: 22, y: 42, floatDuration: 6.8, icon: "share" },
  { id: "infrastructure", x: 78, y: 42, floatDuration: 9.2, icon: "server" },
  { id: "security", x: 24, y: 77, floatDuration: 7.9, icon: "shield-check" },
  { id: "services", x: 76, y: 77, floatDuration: 8.8, icon: "contact-center" },
];

// The outer nodes occupy 17%…77% vertically, so 47% is their visual midpoint.
const CENTER = { x: 50, y: 47 };

export default function EcosystemMap() {
  const t = useTranslations("Ecosystem");
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;
  const sceneRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(springX, [-1, 1], [-7, 7]);
  const rotateX = useTransform(springY, [-1, 1], [5, -5]);

  const onPointerMove = (event: React.PointerEvent) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section aria-labelledby="ecosystem-title" className="relative mx-auto max-w-7xl px-6 pb-28 pt-28 sm:px-12 lg:px-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
          <span className="block text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("overline")}
          </span>
        </ScrollReveal>
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title} delay={STAGGER.tight}>
          <h2 id="ecosystem-title" className="mt-4 font-display text-3xl font-normal tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={STAGGER.base}>
          <p className="mt-5 text-sm font-light leading-relaxed text-text-secondary sm:text-base">
            {t("subtitle")}
          </p>
        </ScrollReveal>
      </div>

      <div
        ref={sceneRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative mx-auto h-[420px] max-w-4xl sm:h-[520px]"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {NODES.map((node) => (
              <line
                key={node.id}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={node.x}
                y2={node.y}
                strokeWidth="0.22"
                strokeDasharray="1.6 1.2"
                className={cn("stroke-gold/35", !reduce && "ecosystem-link")}
              />
            ))}
          </svg>

          <div
            className="absolute z-10"
            style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-glass shadow-lg shadow-foreground/5 backdrop-blur-md sm:h-36 sm:w-36">
              <span aria-hidden className="absolute inset-[-10px] rounded-full border border-gold/10" />
              <Image
                src="/images/logo/ddc-emblem.svg"
                alt="DDC"
                width={72}
                height={72}
                loading="eager"
                className="h-12 w-12 sm:h-[72px] sm:w-[72px]"
              />
            </div>
            {/* Подпись вынесена из потока (absolute): иначе она входит в
                центрируемый translate(-50%,-50%)-бокс и сталкивает круг
                эмблемы вверх от точки схождения линий (замерено: −12px). */}
            <span className="sr-only sm:not-sr-only sm:absolute sm:left-1/2 sm:top-full sm:mt-3 sm:block sm:-translate-x-1/2 sm:whitespace-nowrap sm:text-center sm:font-mono sm:text-[10px] sm:uppercase sm:tracking-[0.28em] sm:text-gold-light">
              {t("centerLabel")}
            </span>
          </div>

          <ul aria-label={t("nodesLabel")} className="contents">
            {NODES.map((node, index) => (
              <li
                key={node.id}
                className="absolute z-20"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={reduce ? undefined : { y: [-6, 6, -6] }}
                  transition={{
                    duration: node.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.7,
                  }}
                  className={cn(
                    "flex w-28 flex-col items-center gap-1 rounded-[var(--radius-card)] border px-2 py-3 text-center backdrop-blur-md transition-colors duration-[var(--duration-base)] sm:w-auto sm:min-w-32 sm:px-4",
                    "border-glass-border bg-glass hover:border-gold/40",
                  )}
                >
                  <Icon name={node.icon} size={20} className="text-gold" />
                  <span className="font-mono text-[11px] font-bold tracking-wide text-gold-light sm:text-base sm:tracking-wider">
                    {t(`nodes.${node.id}.title`)}
                  </span>
                  <span className="hidden max-w-40 text-[10px] font-light uppercase tracking-[0.12em] text-muted sm:block">
                    {t(`nodes.${node.id}.description`)}
                  </span>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <p className="mx-auto -mt-4 max-w-3xl text-center text-xs font-light leading-relaxed text-muted">
        {t("disclaimer")}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium">
        <a
          href="https://nationalbank.kz/ru/news/dochernie-predpriyatiya"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest-light underline-offset-4 transition-colors duration-[var(--duration-base)] hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {t("nbkSource")}
        </a>
      </div>
    </section>
  );
}
