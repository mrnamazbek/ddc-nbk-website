"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Thin forest→gold progress bar pinned to the top of the page that fills as the
 * user scrolls (a big-tech signature touch). Styled via `.scroll-progress-bar`
 * in globals.css. Spring-smoothed for premium feel; under prefers-reduced-motion
 * it tracks scroll directly without the spring. It remains visible (it conveys
 * position) but never adds gratuitous motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const scaleX = reduce ? scrollYProgress : smooth;

  return <motion.div aria-hidden className="scroll-progress-bar" style={{ scaleX }} />;
}
