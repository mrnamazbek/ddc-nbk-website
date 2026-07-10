"use client";

import * as React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number;
  /** Vertical step between stacked cards, in px. */
  incrementY?: number;
  /** Depth step, so the stack reads as layered rather than flat. */
  incrementZ?: number;
  /**
   * Offset of the first card from the top of the viewport. The site header is
   * fixed, so the stack has to park below it instead of at y=0.
   */
  baseY?: number;
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ perspective: "1000px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
});
ContainerScroll.displayName = "ContainerScroll";

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      baseY = 0,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const y = baseY + index * incrementY;
    const z = index * incrementZ;

    return (
      <motion.div
        ref={ref}
        layout="position"
        style={{
          top: y,
          z,
          backfaceVisibility: "hidden",
          ...style,
        }}
        className={cn("sticky", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

CardSticky.displayName = "CardSticky";

export { ContainerScroll, CardSticky };
