"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "gold" | "forest" | "ghost" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "gold", size = "md", className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    const baseStyles =
      "inline-flex items-center justify-center rounded-[var(--radius-button)] font-semibold transition-[color,background,border-color,box-shadow,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantClass =
      variant === "ghost"
        ? "text-muted hover:text-foreground bg-transparent hover:bg-glass border border-transparent"
        : "liquid-glass-button";

    const sizes = {
      sm: "min-h-11 px-4 py-2 text-xs",
      md: "min-h-11 px-6 py-3 text-sm",
      lg: "min-h-[52px] px-8 py-4 text-base",
    };

    const combinedClassName = cn(baseStyles, variantClass, sizes[size], className);

    const content = (
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    );

    // Упругая пружинная анимация для премиального тактильного отклика
    const hoverAnimation = shouldReduceMotion ? {} : { y: -1, scale: 1.02 };
    const tapAnimation = shouldReduceMotion ? {} : { scale: 0.97 };
    const springTransition = shouldReduceMotion
      ? { duration: 0.1 }
      : { type: "spring" as const, stiffness: 400, damping: 20, mass: 0.5 };

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        data-variant={variant !== "ghost" ? variant : undefined}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={springTransition}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
