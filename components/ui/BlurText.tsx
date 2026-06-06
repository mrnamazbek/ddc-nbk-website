"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDuration?: number;
  blurAmount?: string;
}

export default function BlurText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  staggerDuration = 0.08,
  blurAmount = "8px",
}: BlurTextProps) {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      filter: `blur(${blurAmount})`,
      y: 10,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  return (
    <motion.p
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          variants={wordVariants}
          className={`inline-block ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}
