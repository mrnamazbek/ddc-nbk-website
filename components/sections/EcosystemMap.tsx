"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/**
 * «Экосистема»: эмблема DDC (гексагон с квадратом-ядром в центре) как
 * центральный узел, вокруг — системы, которые центр сопровождает. Узлы
 * парят на разной глубине (translateZ) внутри общей 3D-сцены, наклоняющейся
 * за курсором; линии связи ведут к ядру.
 *
 * Дисциплина производительности — та же, что мы навели по всему сайту:
 * только transform/opacity (композитные), никакого WebGL и rAF-циклов;
 * наклон — спружиненные motion values (обновляются только пока курсор
 * двигается над секцией); float-анимации выключаются вместе с
 * reduced-motion/a11y, наклон дополнительно не активируется на тач-экранах
 * (pointermove там не генерирует hover-позицию).
 */

interface EcosystemNode {
  code: string;
  /** ключ подписи в i18n: maintenance | dwh | others */
  role: "maintenance" | "dwh" | "others";
  /** позиция в % от контейнера */
  x: number;
  y: number;
  /** глубина параллакса, px */
  depth: number;
  /** длительность цикла парения, s — у всех разная, чтобы не маршировали в ногу */
  floatDuration: number;
}

// Коды систем — собственные имена, одинаковы во всех локалях. i18n-exempt
const NODES: EcosystemNode[] = [
  { code: "KASE", role: "maintenance", x: 17, y: 22, depth: 70, floatDuration: 7.5 }, // i18n-exempt
  { code: "ЕНПФ", role: "maintenance", x: 81, y: 18, depth: 55, floatDuration: 8.5 }, // i18n-exempt
  { code: "ЦДЦБ", role: "maintenance", x: 85, y: 62, depth: 80, floatDuration: 6.8 }, // i18n-exempt
  { code: "ЭИВК", role: "maintenance", x: 15, y: 66, depth: 60, floatDuration: 9.2 }, // i18n-exempt
  { code: "DWH", role: "dwh", x: 30, y: 88, depth: 90, floatDuration: 7.9 }, // i18n-exempt
  { code: "•••", role: "others", x: 70, y: 90, depth: 45, floatDuration: 8.8 }, // i18n-exempt
];

const CENTER = { x: 50, y: 48 };

export default function EcosystemMap() {
  const t = useTranslations("Ecosystem");
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;
  const sceneRef = useRef<HTMLDivElement>(null);

  // Наклон сцены за курсором: -1..1 по обеим осям, со спружиниванием.
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
    <section aria-label={t("title")} className="relative mx-auto max-w-7xl px-6 pb-28 pt-8 sm:px-12 lg:px-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium block">
            {t("overline")}
          </span>
        </ScrollReveal>
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title} delay={STAGGER.tight}>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-normal tracking-tight text-foreground">
            {t("title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={STAGGER.base}>
          <p className="mt-5 text-sm sm:text-base font-light leading-relaxed text-text-secondary">
            {t("subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {/* 3D-сцена. Фиксированная высота: узлы позиционируются в %, layout shift исключён. */}
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
          {/* Линии связи: под узлами, приглушённое золото, медленное «дыхание» штриха. */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {NODES.map((node) => (
              <line
                key={node.code}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={node.x}
                y2={node.y}
                stroke="rgba(232, 200, 122, 0.22)"
                strokeWidth="0.22"
                strokeDasharray="1.6 1.2"
                className={reduce ? undefined : "ecosystem-link"}
              />
            ))}
          </svg>

          {/* Центральный узел — эмблема DDC (ядро с квадратом в центре). */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%`, transform: "translate(-50%, -50%) translateZ(30px)" }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [-4, 4, -4] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-28 w-28 items-center justify-center rounded-full border border-gold/30 bg-glass shadow-[0_0_60px_rgba(232,200,122,0.18)] backdrop-blur-md sm:h-36 sm:w-36"
            >
              <span aria-hidden className="absolute inset-[-10px] rounded-full border border-gold/10" />
              <Image
                src="/images/logo/ddc-emblem.svg"
                alt="DDC"
                width={72}
                height={72}
                className="h-14 w-14 sm:h-[72px] sm:w-[72px]"
              />
            </motion.div>
            <span className="mt-3 block text-center font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light">
              {t("centerLabel")}
            </span>
          </div>

          {/* Спутники-системы. ul/li — скринридер читает это как список систем. */}
          <ul aria-label={t("nodesLabel")} className="contents">
            {NODES.map((node, index) => (
              <li
                key={node.code}
                className="absolute z-20"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: `translate(-50%, -50%) translateZ(${reduce ? 0 : node.depth}px)`,
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
                    "flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 backdrop-blur-md transition-colors duration-300",
                    "border-glass-border bg-glass hover:border-gold/40",
                    node.role === "dwh" && "border-forest-light/30",
                  )}
                >
                  <span className="font-mono text-sm font-bold tracking-wider text-gold-light sm:text-base">
                    {node.code}
                  </span>
                  {/* На узких экранах подпись прячем — иначе широкие карточки
                      обрезаются краями вьюпорта; остаются только коды. */}
                  <span className="hidden whitespace-nowrap text-[10px] font-light uppercase tracking-[0.18em] text-muted sm:block">
                    {t(node.role)}
                  </span>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
