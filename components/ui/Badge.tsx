"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "gold" | "green" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold select-none border tracking-wide uppercase";

  const variants = {
    gold: "bg-gold/10 text-gold-light border-gold/20",
    green: "bg-forest-mid/10 text-forest-light border-forest-mid/20",
    gray: "bg-glass text-muted border-glass-border",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
