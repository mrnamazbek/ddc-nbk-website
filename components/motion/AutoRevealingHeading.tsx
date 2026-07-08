"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";

type AutoRevealingHeadingProps = {
  text: string;
  splitBy?: "letter" | "word";
  /** Stagger between pieces, in seconds. Smaller = faster cascade. */
  delay?: number;
  className?: string;
};

/**
 * Word/letter-by-word reveal on scroll into view. Tuned to be smooth (soft
 * blur + gentle ease-out, no springy overshoot) and fast (tight stagger,
 * short per-word duration). Honours prefers-reduced-motion.
 */
export function AutoRevealingHeading({
  text = "",
  splitBy = "word",
  delay = 0.03,
  className = "",
}: AutoRevealingHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const pieces = splitBy === "word" ? text.split(" ") : text.split("");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : delay },
    },
  };

  const itemVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {pieces.map((piece, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block will-change-[transform,filter,opacity]"
          style={{ marginRight: splitBy === "word" ? "0.25em" : undefined }}
        >
          {piece}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default AutoRevealingHeading;
