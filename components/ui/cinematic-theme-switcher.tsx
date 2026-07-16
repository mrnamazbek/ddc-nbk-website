'use client';

import Icon from './Icon';
import { useMounted } from "@/lib/clientState";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

interface Particle {
  id: number;
  delay: number;
  duration: number;
}

export default function CinematicThemeSwitcher() {
  const t = useTranslations("A11y");
  const { theme, setTheme, resolvedTheme } = useTheme();

  const mounted = useMounted();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

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
        <div className="relative flex h-[44px] w-[72px] items-center rounded-full bg-glass" />
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
        className="relative flex h-[44px] w-[72px] items-center rounded-full p-[5px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, var(--color-forest) 0%, var(--color-forest-dark) 45%, var(--background) 100%)'
            : 'radial-gradient(ellipse at top left, var(--surface) 0%, var(--color-offwhite) 42%, color-mix(in srgb, var(--color-forest) 14%, var(--surface)) 100%)',
          boxShadow: isDark
            ? 'inset 4px 4px 9px rgba(0,0,0,0.85), inset -4px -4px 9px color-mix(in srgb, var(--color-forest-light) 35%, transparent), inset 0 2px 4px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.4), 0 10px 22px rgba(0,0,0,0.3)'
            : 'inset 4px 4px 9px color-mix(in srgb, var(--color-forest-dark) 18%, transparent), inset -4px -4px 9px rgba(255,255,255,1), inset 0 2px 4px color-mix(in srgb, var(--color-forest-dark) 12%, transparent), 0 2px 4px color-mix(in srgb, var(--color-forest-dark) 10%, transparent), 0 10px 22px color-mix(in srgb, var(--color-forest-dark) 6%, transparent)',
          border: isDark
            ? '1.5px solid var(--glass-border-forest)'
            : '1.5px solid var(--border-primary)',
        }}
        aria-label={t("themeToggle")}
        role="switch"
        aria-checked={isDark}
        whileTap={{ scale: 0.96 }}
      >
        {/* Глянцевый блик */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, color-mix(in srgb, var(--color-forest-light) 18%, transparent) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, transparent 30%, transparent 70%, color-mix(in srgb, var(--color-forest-dark) 10%, transparent) 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Фоновые иконки */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-[10px]">
          <Icon name="sun" size={16} animate={false} className={isDark ? 'text-gold-light/70' : 'text-gold'} />
          <Icon name="moon" size={16} animate={false} className={isDark ? 'text-gold-light/70' : 'text-forest'} />
        </div>

        {/* Бегунок */}
        <motion.div
          className="relative z-10 grid h-[32px] w-[32px] place-items-center overflow-hidden rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(145deg, var(--color-forest-mid) 0%, var(--color-forest) 50%, var(--color-forest-dark) 100%)'
              : 'linear-gradient(145deg, var(--surface) 0%, color-mix(in srgb, var(--color-gold) 12%, var(--surface)) 50%, color-mix(in srgb, var(--color-forest-light) 10%, var(--surface)) 100%)',
            boxShadow: isDark
              ? 'inset 2px 2px 4px color-mix(in srgb, var(--color-forest-light) 40%, transparent), inset -2px -2px 4px rgba(0,0,0,0.8), 0 6px 18px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.4)'
              : 'inset 2px 2px 4px color-mix(in srgb, var(--color-forest-dark) 12%, transparent), inset -2px -2px 4px rgba(255,255,255,1), 0 6px 18px color-mix(in srgb, var(--color-forest-dark) 14%, transparent), 0 2px 4px color-mix(in srgb, var(--color-forest-dark) 8%, transparent)',
            border: isDark
              ? '1.5px solid var(--glass-border-forest)'
              : '1.5px solid var(--border-primary)',
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
                      ? 'radial-gradient(circle, color-mix(in srgb, var(--color-forest-light) 60%, transparent) 0%, transparent 70%)'
                      : 'radial-gradient(circle, color-mix(in srgb, var(--color-forest) 34%, transparent) 0%, transparent 70%)',
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

          <div className="relative z-10 grid h-full w-full place-items-center leading-none [&>svg]:block">
            {isDark ? (
              <Icon name="moon" size={16} animate={false} className="text-gold-light" />
            ) : (
              <Icon name="sun" size={16} animate={false} className="text-gold" />
            )}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
