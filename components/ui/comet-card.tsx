"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface CometCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Depth of the 3D rotation on mouse move. Higher = more dramatic tilt. */
  rotateDepth?: number;
  /** Depth of the translation (parallax) on mouse move. */
  translateDepth?: number;
}

/**
 * Comet Card — a perspective 3D tilt card (as seen on Perplexity Comet's site).
 * Tracks the cursor over the card and applies rotateX/rotateY + a parallax
 * translate, with a soft specular glare that follows the pointer. Returns to
 * rest on mouse leave. `className` styles the tilting surface; `containerClassName`
 * styles the perspective wrapper.
 */
export function CometCard({
  children,
  className = "",
  containerClassName = "",
  rotateDepth = 17.5,
  translateDepth = 20,
}: CometCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const tX = useTransform(sx, [-0.5, 0.5], [-translateDepth, translateDepth]);
  const tY = useTransform(sy, [-0.5, 0.5], [translateDepth, -translateDepth]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(232,200,122,0.28), rgba(255,255,255,0) 55%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={containerClassName}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{ rotateX, rotateY, x: tX, y: tY, transformStyle: "preserve-3d" }}
        className={`relative will-change-transform ${className}`}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}

export default CometCard;
