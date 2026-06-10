'use client';

import { Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface Particle {
  id: number;
  delay: number;
  duration: number;
}

export default function CinematicThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        delay: i * 0.1,
        duration: 0.6 + i * 0.1,
      });
    }
    setParticles(newParticles);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 1000);
  };

  const handleToggle = () => {
    generateParticles();
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <div className="relative inline-block">
        <div className="relative flex h-[44px] w-[72px] items-center rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* SVG-фильтры для зернистой текстуры */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="grain-light">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="desaturatedNoise" />
            <feComponentTransfer in="desaturatedNoise" result="lightGrain">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="lightGrain" mode="overlay" />
          </filter>
          <filter id="grain-dark">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="desaturatedNoise" />
            <feComponentTransfer in="desaturatedNoise" result="darkGrain">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="darkGrain" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <motion.button
        ref={toggleRef}
        onClick={handleToggle}
        className="relative flex h-[44px] w-[72px] items-center rounded-full p-[5px] transition-all duration-300 focus:outline-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, #1A3D2B 0%, #0F241A 45%, #08080a 100%)'
            : 'radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)',
          boxShadow: isDark
            ? 'inset 4px 4px 9px rgba(0,0,0,0.85), inset -4px -4px 9px rgba(45,106,79,0.35), inset 0 2px 4px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.4), 0 10px 22px rgba(0,0,0,0.3)'
            : 'inset 4px 4px 9px rgba(148,163,184,0.5), inset -4px -4px 9px rgba(255,255,255,1), inset 0 2px 4px rgba(148,163,184,0.4), 0 2px 4px rgba(0,0,0,0.1), 0 10px 22px rgba(0,0,0,0.06)',
          border: isDark
            ? '1.5px solid rgba(82,183,136,0.35)'
            : '1.5px solid rgba(203,213,225,0.6)',
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        role="switch"
        aria-checked={isDark}
        whileTap={{ scale: 0.96 }}
      >
        {/* Глянцевый блик */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(82,183,136,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 30%, transparent 70%, rgba(148,163,184,0.15) 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Фоновые иконки */}
        <div className="absolute inset-0 flex items-center justify-between px-[10px]">
          <Sun size={15} className={isDark ? 'text-gold-light/70' : 'text-amber-600'} />
          <Moon size={15} className={isDark ? 'text-gold-light/70' : 'text-slate-700'} />
        </div>

        {/* Бегунок */}
        <motion.div
          className="relative z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full overflow-hidden"
          style={{
            background: isDark
              ? 'linear-gradient(145deg, #2D6A4F 0%, #1A3D2B 50%, #0F241A 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f8fafc 100%)',
            boxShadow: isDark
              ? 'inset 2px 2px 4px rgba(82,183,136,0.4), inset -2px -2px 4px rgba(0,0,0,0.8), 0 6px 18px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.4)'
              : 'inset 2px 2px 4px rgba(203,213,225,0.3), inset -2px -2px 4px rgba(255,255,255,1), 0 6px 18px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08)',
            border: isDark
              ? '1.5px solid rgba(82,183,136,0.4)'
              : '1.5px solid rgba(255,255,255,0.9)',
          }}
          animate={{ x: isDark ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)',
              mixBlendMode: 'overlay',
            }}
          />

          {isAnimating &&
            particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: isDark
                      ? 'radial-gradient(circle, rgba(82,183,136,0.6) 0%, rgba(82,183,136,0) 70%)'
                      : 'radial-gradient(circle, rgba(232,200,122,0.7) 0%, rgba(232,200,122,0) 70%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isDark ? 6 : 8, opacity: [0, 1, 0] }}
                  transition={{
                    duration: isDark ? 0.5 : particle.duration,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
            ))}

          <div className="relative z-10">
            {isDark ? (
              <Moon size={16} className="text-gold-light" />
            ) : (
              <Sun size={16} className="text-amber-500" />
            )}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
