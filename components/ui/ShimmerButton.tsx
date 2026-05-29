"use client";

import React, { CSSProperties, ReactNode } from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  className?: string;
  variant?: "blue" | "gold" | "default";
}

export default function ShimmerButton({
  children,
  shimmerColor,
  shimmerSize = "0.08em",
  shimmerDuration = "2.5s",
  borderRadius = "9999px",
  background = "rgba(10, 10, 12, 0.9)",
  className = "",
  variant = "default",
  ...props
}: ShimmerButtonProps) {
  // Выбираем цвет шиммера в зависимости от брендового варианта (синий ЦЦР или золото НБК)
  const defaultShimmerColor =
    variant === "blue"
      ? "#38bdf8"
      : variant === "gold"
      ? "#C9A84C"
      : "#FFFFFF";

  const color = shimmerColor || defaultShimmerColor;

  return (
    <button
      style={
        {
          "--shimmer-color": color,
          "--shimmer-size": shimmerSize,
          "--shimmer-duration": shimmerDuration,
          "--border-radius": borderRadius,
          "--background": background,
          borderRadius,
          background,
        } as CSSProperties
      }
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden border border-white/10 px-6 py-3 text-white transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      {...props}
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
        className="absolute inset-[1px] z-[-1] transition-colors duration-300 group-hover:bg-black/80"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      />

      {/* Контент кнопки */}
      <div className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
        {children}
      </div>
    </button>
  );
}
