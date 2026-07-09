"use client";

import { Fragment } from "react";
import { MotionConfig } from "framer-motion";
import { useA11y } from "@/components/theme/AccessibilityProvider";

/**
 * Sitewide reduced-motion switch. Individual sections gate their OWN heavy
 * effects (GSAP parallax, WebGL scenes, mobile-vs-desktop swaps) by reading
 * `useA11y()` directly, but the small everyday entrance reveals — the
 * `motion.div initial={hidden} animate={visible}` fade/slide/blur stagger
 * used across nearly every section, plus the hero's typewriter reveal —
 * don't each check it individually. Framer Motion's `reducedMotion="always"`
 * makes every motion value in the tree jump straight to its target instead
 * of animating, with no per-component changes needed.
 *
 * The saved a11y preference loads from localStorage in an effect (it can't
 * be read during the server-rendered first paint without a hydration
 * mismatch), so on every page load there's a brief window where components
 * already mount and start animating with `enabled: false` before the real
 * value arrives. Framer Motion only restarts an animation when its target
 * changes — an entrance reveal whose `animate` target was already set
 * before the flag flipped won't redirect just because `reducedMotion`
 * changed under it, so it's left stuck mid-transition. Keying the whole
 * tree on the resolved a11y flag forces React to unmount and remount it the
 * moment the real value is known, so every Motion component underneath
 * evaluates `initial`/`animate` fresh with the correct value from its very
 * first render instead of racing a localStorage read.
 */
export default function MotionA11yConfig({ children }: { children: React.ReactNode }) {
  const { enabled: a11yEnabled } = useA11y();

  return (
    <MotionConfig reducedMotion={a11yEnabled ? "always" : "user"}>
      <Fragment key={a11yEnabled ? "a11y" : "standard"}>{children}</Fragment>
    </MotionConfig>
  );
}
