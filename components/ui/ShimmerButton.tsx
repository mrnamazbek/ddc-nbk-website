"use client";

import React, { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  className?: string;
  variant?: "forest" | "gold" | "default";
}

export default function ShimmerButton({
  children,
  shimmerColor,
  shimmerSize = "0.08em",
  shimmerDuration = "2.5s",
  borderRadius = "9999px",
  background = "rgba(20, 20, 25, 0.45)",
  className = "",
  variant = "default",
  ...props
}: ShimmerButtonProps) {
  const { enabled: a11yEnabled } = useA11y();
  const shouldReduceMotion = useReducedMotion() || a11yEnabled;

  // Выбираем цвет шиммера в зависимости от брендового варианта (зеленый DDC или золото NBK)
  const defaultShimmerColor =
    variant === "forest"
      ? "#52B788"
      : variant === "gold"
      ? "#C9A84C"
      : "#FFFFFF";

  const color = shimmerColor || defaultShimmerColor;

  const hoverAnimation = shouldReduceMotion ? {} : { scale: 1.02, y: -1 };
  const tapAnimation = shouldReduceMotion ? {} : { scale: 0.97 };
  const springTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: "spring" as const, stiffness: 400, damping: 20, mass: 0.5 };

  // The shimmer/glass look is built from two decorative divs painted OVER the
  // button's own background — a conic-gradient sweep and a translucent
  // `bg-background/40` fill — plus a backdrop blur. All of that is exactly
  // the kind of low-contrast, hard-to-read chrome the low-vision mode exists
  // to remove, and CSS alone can't safely override it here (the sweep/fill
  // are separate painted layers, not the button's own background-color).
  // Render a plain solid high-contrast button instead when a11y is on.
  if (a11yEnabled) {
    return (
      <button
        className={`relative z-0 flex cursor-pointer items-center justify-center gap-2 border-2 px-6 py-3 font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
        style={{
          borderRadius,
          backgroundColor: "var(--a11y-fg)",
          color: "var(--a11y-bg)",
          borderColor: "var(--a11y-fg)",
        }}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      style={
        {
          "--shimmer-color": color,
          "--shimmer-size": shimmerSize,
          "--shimmer-duration": shimmerDuration,
          "--border-radius": borderRadius,
          "--background": background,
          borderRadius,
          background,
          backdropFilter: "blur(8px) saturate(160%)",
          WebkitBackdropFilter: "blur(8px) saturate(160%)",
        } as CSSProperties
      }
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden border border-glass-border px-6 py-3 text-foreground transition-[border-color,background-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 ${className}`}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={springTransition}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {/* Эффект мерцающего свечения (Шиммер) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden [border-radius:var(--border-radius)] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div
          className="absolute -inset-[100%] animate-spin-slow opacity-30 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundImage: `conic-gradient(from 0deg, transparent 50%, var(--shimmer-color) 70%, transparent 90%)`,
            animationDuration: shimmerDuration,
          }}
        />
      </div>

      {/* Внутренняя заливка */}
      <div
        className="absolute inset-[1px] z-[-1] transition-colors duration-300 group-hover:bg-background/60 bg-background/40"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      />

      {/* Контент кнопки */}
      <div className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
        {children}
      </div>
    </motion.button>
  );
}
