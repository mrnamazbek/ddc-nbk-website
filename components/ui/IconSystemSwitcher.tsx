"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIconSystem, IconSystem } from "../theme/IconSystemProvider";
import Icon from "./Icon";

export default function IconSystemSwitcher() {
  const { iconSystem, setIconSystem } = useIconSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const options: { id: IconSystem; name: string; desc: string }[] = [
    { id: "mingcute", name: "MingCute", desc: "Утончённый и анимированный" },
    { id: "iconsax", name: "Iconsax", desc: "Премиальный финтех-стиль" },
    { id: "solar", name: "Solar", desc: "Трендовый геометрический" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="liquid-glass-strong border border-glass-border p-4 rounded-2xl shadow-2xl max-w-[280px] flex flex-col gap-2"
          >
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold mb-1 border-b border-glass-border pb-2">
              A/B Тест иконок
            </div>
            {options.map((opt) => {
              const active = iconSystem === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIconSystem(opt.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl cursor-pointer flex flex-col transition-all relative overflow-hidden group ${
                    active
                      ? "bg-forest/30 border border-forest-light/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-semibold ${active ? "text-gold" : "text-white"}`}>
                      {opt.name}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-light mt-0.5 leading-tight">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопка открытия виджета */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-12 h-12 rounded-full cursor-pointer liquid-glass border border-glass-border flex items-center justify-center text-gold shadow-lg hover:text-white transition-colors relative group"
        aria-label="Настройки A/B теста иконок"
      >
        <span className="absolute inset-0 rounded-full bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        <Icon name="zap" size={20} animate={!isOpen} className="relative z-10" />
      </motion.button>
    </div>
  );
}
