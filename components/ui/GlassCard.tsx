"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  isTiltEnabled?: boolean;
  hoverAccent?: "gold" | "forest" | "default";
  variant?: "glass" | "liquid" | "liquid-strong";
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  isTiltEnabled = true,
  hoverAccent = "default",
  variant = "liquid",
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion-значения для отслеживания мыши (3D-наклон)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Настройка сглаживания для эффекта пружины
  const springConfig = { damping: 22, stiffness: 160, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-6, 6]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (!isTiltEnabled || shouldReduceMotion) return;
    
    // Отключаем 3D-наклон на мобильных устройствах
    if (window.innerWidth < 1024) return;

    // Рассчитываем координаты мыши относительно центра карточки для 3D-наклона
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  // Сброс при уходе мыши
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Стили рамок и теней в зависимости от выбранного акцента ховера
  const accentClasses = {
    default: "hover:border-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)]",
    forest: "hover:border-forest-light/30 hover:shadow-[0_8px_32px_rgba(26,61,43,0.25)]",
    gold: "hover:border-gold/30 hover:shadow-[0_8px_32px_rgba(201,168,76,0.15)]",
  };

  const glassClass = variant === "liquid-strong" 
    ? "liquid-glass-strong" 
    : variant === "liquid" 
    ? "liquid-glass" 
    : "glass-card";

  const classes = className.split(" ");
  const innerLayoutClasses = classes.filter(c => 
    c === "flex" || 
    c.startsWith("flex-") || 
    c.startsWith("grid-") || 
    c.startsWith("justify-") || 
    c.startsWith("items-") || 
    c.startsWith("gap-") || 
    c === "h-full" || 
    c === "w-full" ||
    c.startsWith("md:flex") ||
    c.startsWith("md:items-") ||
    c.startsWith("md:justify-") ||
    c.startsWith("md:gap-") ||
    c.startsWith("sm:flex") ||
    c.startsWith("sm:items-") ||
    c.startsWith("sm:justify-") ||
    c.startsWith("lg:flex") ||
    c.startsWith("lg:items-") ||
    c.startsWith("lg:justify-")
  ).join(" ");
  
  const isFlex = classes.some(c => c === "flex" || c.startsWith("flex-"));
  const innerWrapperClass = `relative z-10 ${isFlex ? "flex-grow h-full w-full" : ""} ${innerLayoutClasses}`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      data-hover={hoverAccent === "gold" ? "gold" : "forest"}
      className={`${glassClass} spotlight-card p-6 ${accentClasses[hoverAccent]} ${className}`}
    >
      {/* Мягкий блик, перемещающийся по карте при наведении (из исходного дизайна) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/3 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div style={{ transform: "translateZ(20px)" }} className={innerWrapperClass}>
        {children}
      </div>
    </motion.div>
  );
}
