"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFontSystem, type FontSystem } from "@/components/theme/FontSystemProvider";
import Icon from "./Icon";

export default function FontFloatingSwitcher() {
  const { fontSystem, setFontSystem } = useFontSystem();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fonts: { id: FontSystem; label: string; desc: string }[] = [
    { id: "pair-a", label: "Control", desc: "Golos + Source Serif" },
    { id: "nohemi", label: "Nohemi", desc: "Геометрический гротеск" },
    { id: "neue-regrade", label: "Neue Regrade", desc: "Гротеск с инктрапами" },
    { id: "quantify", label: "Quantify", desc: "Футуристичный дисплейный" },
    { id: "neue-power", label: "Clash Display", desc: "Бруталистский акцидентный" },
    { id: "serena", label: "Satoshi", desc: "Элегантный гротеск" },
  ];

  const currentFontLabel = fonts.find((f) => f.id === fontSystem)?.label || "Control";

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[999]">
      <div className="relative">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full liquid-glass text-white border border-gold/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-gold/50 transition-all font-mono text-xs focus:outline-none"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span>Шрифт: {currentFontLabel}</span>
          <Icon name="arrow-up-right" className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl border border-white/10 bg-black/90 p-2 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-1"
            >
              <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-[#E8C87A] font-bold font-mono">
                  Выбор шрифта (A/B)
                </span>
              </div>

              {fonts.map((f) => {
                const active = fontSystem === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFontSystem(f.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col font-mono text-xs ${
                      active
                        ? "bg-[#E8C87A]/10 text-[#E8C87A] border border-[#E8C87A]/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      {f.label}
                      {active && <span className="w-1 h-1 rounded-full bg-[#E8C87A]" />}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-light mt-0.5">{f.desc}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
