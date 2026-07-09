"use client";

import { useReducedMotion, motion, type Variants } from "framer-motion";
import { BubbleText } from "@/components/ui/BubbleText";
import { ENTRANCE_EASE, ENTRANCE_DURATION, VIEWPORT_ONCE } from "./ScrollReveal";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface RevealWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  /** Delay before the first word starts. */
  delay?: number;
  /** Delay between words. */
  stagger?: number;
  /**
   * Render each word through BubbleText's per-character hover effect instead
   * of plain text. A boolean flag (not a render-prop function) so this stays
   * safe to pass from Server Components into this "use client" component.
   */
  useBubbleText?: boolean;
  /** Forwarded to BubbleText's activeClassName when useBubbleText is set (e.g. the gold accent line). */
  bubbleActiveClassName?: string;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: ENTRANCE_DURATION.title, ease: ENTRANCE_EASE },
  },
};

/**
 * Word-by-word title reveal — the "Main title" step of the entrance system.
 * Each word fades/rises/unblurs in sequence rather than the whole heading
 * appearing at once.
 */
export function RevealWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  useBubbleText: withBubbleText = false,
  bubbleActiveClassName,
}: RevealWordsProps) {
  const { enabled: a11yEnabled } = useA11y();
  const reduceMotion = useReducedMotion() || a11yEnabled;

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
      className={className}
    >
      {words.map((word, index) => (
        // The space between words must live OUTSIDE the inline-block span —
        // trailing whitespace at the edge of an inline-block gets collapsed
        // by the browser, which otherwise runs every word together.
        <span key={`${word}-${index}`} style={{ display: "inline" }}>
          <motion.span
            aria-hidden="true"
            variants={wordVariants}
            className={wordClassName ? `inline-block ${wordClassName}` : "inline-block"}
          >
            {withBubbleText ? <BubbleText text={word} activeClassName={bubbleActiveClassName} /> : word}
          </motion.span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
