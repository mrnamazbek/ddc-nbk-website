"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "gold" | "forest" | "ghost" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  isMagnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "gold", size = "md", isMagnetic = false, className = "", ...props }, ref) => {
    // Базовые стили
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-[var(--radius-button)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    // Стили вариантов
    let variantClass = "";
    if (variant === "ghost") {
      variantClass = "text-gray-light hover:text-white bg-transparent hover:bg-white/5";
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

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        data-variant={variant !== "ghost" ? variant : undefined}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
