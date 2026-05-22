"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gold" | "green" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  isMagnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "gold", size = "md", isMagnetic = false, className = "", ...props }, ref) => {
    // Базовые стили
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    // Стили вариантов
    const variants = {
      gold: "bg-gradient-to-r from-gold-light via-gold to-gold-muted text-black font-semibold shadow-gold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
      green: "border border-forest-mid text-white bg-transparent hover:bg-forest-dark hover:border-forest-light hover:shadow-green hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
      ghost: "text-gray-light hover:text-white bg-transparent hover:bg-white/5",
      glass: "glass-panel text-white hover:bg-white/10 border-white/10 hover:border-gold/30 hover:scale-[1.02] active:scale-[0.98]",
      outline: "border border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]",
    };

    // Стили размеров
    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    // Если включен режим уменьшенного движения, возвращаем обычную кнопку
    const content = (
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    );

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
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
