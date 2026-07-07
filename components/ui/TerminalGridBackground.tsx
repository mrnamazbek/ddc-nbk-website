"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalGridBackgroundProps {
  className?: string;
  density?: "calm" | "dense";
}

const nodes = [
  [6, 14],
  [18, 28],
  [31, 18],
  [42, 34],
  [58, 20],
  [72, 30],
  [86, 16],
  [12, 74],
  [29, 66],
  [47, 78],
  [66, 70],
  [82, 82],
];

export default function TerminalGridBackground({
  className,
  density = "calm",
}: TerminalGridBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const gridSize = density === "dense" ? 56 : 72;

  return (
    <div
      aria-hidden="true"
      data-decorative
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <motion.div
        className="absolute inset-[-8%] opacity-[0.26]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 255, 64, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 255, 64, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: "radial-gradient(circle at 50% 42%, black 0%, rgba(0,0,0,0.76) 34%, transparent 74%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : { backgroundPosition: ["0px 0px", `${gridSize}px ${gridSize}px`] }
        }
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-0 top-[28%] h-px w-full bg-gradient-to-r from-transparent via-lime-300/35 to-transparent blur-[0.5px]"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, 120, 0],
                opacity: [0.05, 0.38, 0.08],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
      />

      {nodes.map(([left, top], index) => (
        <motion.span
          key={`${left}-${top}`}
          className="absolute h-1 w-1 rounded-full bg-lime-300/60 shadow-[0_0_18px_rgba(168,255,64,0.55)]"
          style={{ left: `${left}%`, top: `${top}%` }}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.08, 0.85, 0.12],
                  scale: [0.55, 1.35, 0.65],
                }
          }
          transition={{
            duration: 5.8,
            repeat: Infinity,
            delay: index * 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}
