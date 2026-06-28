"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
  target,
  rel,
  ariaLabel,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  ariaLabel?: string;
}) => {
  const [transform, setTransform] = useState("translate(-50%,-50%) rotateX(0deg) scale(1)");

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };

  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <a
      className={cn("relative z-20 cursor-pointer group/pin", containerClassName)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      href={href || "/"}
      target={target}
      rel={rel}
      aria-label={ariaLabel || title}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{ transform }}
          className="absolute left-1/2 top-1/2 flex items-start justify-start overflow-hidden rounded-lg border border-gold/25 bg-[#050807]/95 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition duration-700 group-hover/pin:border-gold/45 group-focus-visible/pin:border-gold/45"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} />
    </a>
  );
};

export const PinPerspective = ({ title }: { title?: string }) => {
  const reduce = useReducedMotion();
  const pulseTransition = (delay: number) =>
    reduce
      ? { duration: 0 }
      : {
          duration: 6,
          repeat: Infinity,
          delay,
        };

  return (
    <motion.div className="pointer-events-none absolute left-1/2 top-1/2 z-[25] flex h-72 w-80 -translate-x-1/2 -translate-y-[56%] items-center justify-center opacity-0 transition duration-500 group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100">
      <div className="relative h-full w-full flex-none">
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <span className="relative z-10 flex items-center rounded-full bg-[#050807] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold ring-1 ring-gold/25">
            {title}
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-gold/0 via-gold/90 to-gold/0" />
          </span>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {[0, 2, 4].map((delay) => (
            <motion.div
              key={delay}
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={
                reduce
                  ? { opacity: 0.22, scale: 0.62, x: "-50%", y: "-50%" }
                  : {
                      opacity: [0, 1, 0.5, 0],
                      scale: 1,
                      x: "-50%",
                      y: "-50%",
                      z: 0,
                    }
              }
              transition={pulseTransition(delay)}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-full bg-gold/[0.08] shadow-[0_8px_16px_rgba(201,168,76,0.16)]"
            />
          ))}
        </div>

        <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-gold blur-[2px] group-hover/pin:h-40 group-focus-visible/pin:h-40" />
        <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-gold group-hover/pin:h-40 group-focus-visible/pin:h-40" />
        <motion.div className="absolute bottom-1/2 right-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-gold blur-[3px]" />
        <motion.div className="absolute bottom-1/2 right-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-gold-light" />
      </div>
    </motion.div>
  );
};
