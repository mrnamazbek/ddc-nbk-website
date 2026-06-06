"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  isTiltEnabled?: boolean;
  hoverAccent?: "gold" | "forest" | "default";
  variant?: "glass" | "liquid" | "liquid-strong";
}

export default function GlassCard({
  children,
  className = "",
  isTiltEnabled = true,
  hoverAccent = "default",
  variant = "liquid",
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Motion-значения для отслеживания мыши (3D-наклон)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Настройка сглаживания для эффекта пружины
  const springConfig = { damping: 22, stiffness: 160, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Рассчитываем координаты мыши относительно левого верхнего угла элемента для Spotlight Border
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;

    if (glowRef.current) {
      glowRef.current.style.left = `${clientX}px`;
      glowRef.current.style.top = `${clientY}px`;
    }

    if (!isTiltEnabled) return;
    
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

  // Цвет подсветки Spotlight Border (повышенная яркость и радиус для эффекта жидкого стекла)
  const spotlightColor = hoverAccent === "gold"
    ? "radial-gradient(circle, rgba(201, 168, 76, 0.22) 0%, rgba(201, 168, 76, 0) 75%)"
    : "radial-gradient(circle, rgba(82, 183, 136, 0.22) 0%, rgba(82, 183, 136, 0) 75%)";

  const glassClass = variant === "liquid-strong" 
    ? "liquid-glass-strong" 
    : variant === "liquid" 
    ? "liquid-glass" 
    : "glass-card";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      data-hover={hoverAccent === "gold" ? "gold" : "forest"}
      className={`${glassClass} spotlight-card p-6 ${accentClasses[hoverAccent]} ${className}`}
    >
      {/* Эффект Spotlight Border (светящийся синий или золотой ореол, следующий за мышкой) */}
      <div
        ref={glowRef}
        className="spotlight-glow"
        style={{ background: spotlightColor }}
      />

      {/* Мягкий блик, перемещающийся по карте при наведении (из исходного дизайна) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/3 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Слой свечения бренда в углу для придания глубины */}
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-40 ${
        hoverAccent === "gold" ? "bg-gold/25" : "bg-forest-mid/25"
      }`} />

      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
