"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ENTRANCE_EASE, STAGGER, VIEWPORT_ONCE } from "./ScrollReveal";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface StaggerGroupProps {
  children: ReactNode;
  /** Delay between each direct child, in seconds. */
  stagger?: number;
  /** Delay before the first child starts. */
  delayChildren?: number;
  className?: string;
}

const containerVariants = (stagger: number, delayChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/**
 * Wraps a group of `StaggerItem`s (cards, buttons, list rows) so they reveal
 * one after another instead of all at once. Pair with `StaggerItem` — plain
 * children won't pick up the stagger since framer-motion needs each child to
 * be its own animated element reading the shared "visible" variant.
 */
export function StaggerGroup({ children, stagger = STAGGER.base, delayChildren = 0, className }: StaggerGroupProps) {
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={containerVariants(stagger, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  /** Starting scale; 1 disables. Kept subtle — never a bounce/pop. */
  scale?: number;
  blur?: number;
}

const itemVariants = (duration: number, distance: number, scale: number, blur: number): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
    ...(scale !== 1 ? { scale } : {}),
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
  },
  visible: {
    opacity: 1,
    y: 0,
    ...(scale !== 1 ? { scale: 1 } : {}),
    ...(blur ? { filter: "blur(0px)" } : {}),
    transition: { duration, ease: ENTRANCE_EASE },
  },
});

export function StaggerItem({ children, className, duration = 1.0, distance = 30, scale = 1, blur = 0 }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants(duration, distance, scale, blur)} className={className}>
      {children}
    </motion.div>
  );
}
