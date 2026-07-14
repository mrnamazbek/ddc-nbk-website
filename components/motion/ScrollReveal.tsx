"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useA11y } from "@/components/theme/AccessibilityProvider";

/**
 * Site-wide entrance-motion standard. Every scroll reveal (text, buttons,
 * cards) shares this one easing curve and duration band — that consistency
 * is the point, not a per-section choice.
 */
export const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

export const ENTRANCE_DURATION = {
  label: 0.8,
  title: 1.1,
  subtitle: 1.0,
  button: 0.9,
  card: 1.0,
} as const;

/** Stagger delay between sibling elements, per the 0.08-0.2s band. */
export const STAGGER = {
  tight: 0.08,
  base: 0.12,
  loose: 0.2,
} as const;

/** Standard "trigger once, a bit before fully in view" scroll trigger. */
export const VIEWPORT_ONCE = { once: true, margin: "-10%" } as const;

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  /** Entrance blur in px; 0 disables (cards skip blur per spec, text uses 10). */
  blur?: number;
  /** Starting scale; 1 disables. Kept subtle on purpose — never a bounce/pop. */
  scale?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  blur = 0,
  scale = 1,
  className = "",
}: ScrollRevealProps) {
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const initial = {
    opacity: 0,
    ...directions[direction],
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
    ...(scale !== 1 ? { scale } : {}),
  };

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(blur ? { filter: "blur(0px)" } : {}),
    ...(scale !== 1 ? { scale: 1 } : {}),
    transition: {
      duration,
      delay,
      ease: ENTRANCE_EASE,
    },
  };

  return (
    <motion.div
      initial={reduce ? false : initial}
      whileInView={animate}
      viewport={VIEWPORT_ONCE}
      className={`${blur ? "reveal-blur-touch-off " : ""}${className}`}
    >
      {children}
    </motion.div>
  );
}
