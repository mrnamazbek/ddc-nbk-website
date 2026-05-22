"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  isTiltEnabled?: boolean;
}

export default function GlassCard({ children, className = "", isTiltEnabled = true }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion-значения для отслеживания мыши
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Настройка сглаживания для эффекта пружины
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isTiltEnabled || !cardRef.current) return;
    
    // Отключаем 3D-наклон на мобильных устройствах
    if (window.innerWidth < 1024) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Рассчитываем координаты мыши относительно центра карточки
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

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
      className={`glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-500 hover:border-gold/30 hover:shadow-gold hover:shadow-sm ${className}`}
    >
      {/* Мягкий золотистый блик, перемещающийся по карте при наведении */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-gold/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Слой свечения Forest Green внизу для дополнительного объема */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-forest/20 rounded-full blur-[60px] pointer-events-none" />

      <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
