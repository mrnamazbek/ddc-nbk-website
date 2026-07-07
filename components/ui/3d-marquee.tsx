"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
}

export function ThreeDMarquee({ images, className }: ThreeDMarqueeProps) {
  const reduce = useReducedMotion();
  const rows = [
    images.slice(0, 6),
    images.slice(6, 12),
    images.slice(12, 18),
  ].filter((row) => row.length > 0);

  return (
    <div
      className={cn(
        "pointer-events-none relative h-full w-full overflow-hidden [perspective:900px]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(201,168,76,0.08),rgba(26,99,71,0.08))]" />
      <div className="absolute inset-0 [transform:rotateX(58deg)_rotateZ(-17deg)_translate3d(-6%,8%,0)] [transform-style:preserve-3d]">
        {rows.map((row, rowIndex) => {
          const direction = rowIndex % 2 === 0 ? -1 : 1;
          return (
            <motion.div
              key={rowIndex}
              className="mb-6 flex gap-6"
              animate={reduce ? undefined : { x: direction * 84 }}
              transition={{
                duration: 18 + rowIndex * 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              style={{ marginLeft: rowIndex % 2 === 0 ? "-8%" : "-20%" }}
            >
              {[...row, ...row].map((src, index) => (
                <div
                  key={`${src}-${rowIndex}-${index}`}
                  className="h-36 w-56 shrink-0 overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-[0.65] saturate-[0.82] contrast-[1.08]"
                  />
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#030504_0%,transparent_24%,transparent_72%,#030504_100%),linear-gradient(180deg,#030504_0%,transparent_28%,#030504_100%)]" />
    </div>
  );
}
