"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "gold" | "forest" | "ghost" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  isMagnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "gold", size = "md", isMagnetic = false, className = "", ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    // Базовые стили
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    // Стили вариантов
    let variantClass = "";
    if (variant === "ghost") {
      variantClass = "text-muted hover:text-foreground bg-transparent hover:bg-glass";
    } else {
      variantClass = "liquid-glass-button font-semibold";
    }

    // Стили размеров
    const sizes = {
      sm: "px-4 py-2 text-xs min-h-[36px]",
      md: "px-6 py-3 text-sm min-h-[44px]",
      lg: "px-8 py-4 text-base min-h-[52px]",
    };

    const combinedClassName = `${baseStyles} ${variantClass} ${sizes[size]} ${className}`;

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
