"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

interface FeatureTab {
  id: string;
  hoverAccent: "gold" | "forest";
  svgIcon: React.ReactNode;
}

export default function DigitalShowcase() {
  const t = useTranslations("Digital");
  const [activeTab, setActiveTab] = useState("t1");

  const tabs: FeatureTab[] = [
    {
      id: "t1",
      hoverAccent: "gold",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M12 7v10M8 9.5h8M8 12.5h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "t2",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "t3",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 11h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="digital" className="relative w-full py-24 sm:py-32 bg-[#0E2419]/55 overflow-hidden border-t border-white/5">
      {/* Технологическая подсветка на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-forest/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-zinc-400 font-sans font-light leading-relaxed text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Вкладки и Интерактивный контент */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Левая сторона: Список вкладок */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 flex items-center gap-4 cursor-pointer group ${
                    isActive
                      ? "liquid-glass-strong text-white"
                      : "liquid-glass text-zinc-400 hover:text-white"
                  }`}
                  data-hover={tab.hoverAccent}
                >
                  <div className={`w-10 h-10 rounded-lg liquid-glass flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? tab.hoverAccent === "gold" ? "text-gold font-bold" : "text-forest-light font-bold"
                      : "text-zinc-500"
                  }`} data-hover={tab.hoverAccent}>
                    {tab.svgIcon}
                  </div>
                  <div>
                    <span className="text-[10px] block mb-1 font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                      {t(`${tab.id}.badge`)}
                    </span>
                    <h3 className="text-sm font-sans font-semibold">
                      {t(`${tab.id}.title`)}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Правая сторона: Контент активной вкладки с анимацией смены */}
          <GlassCard
            hoverAccent={currentTab.hoverAccent}
            className="lg:col-span-8 p-8 sm:p-12 relative overflow-hidden min-h-[420px] flex flex-col justify-between"
          >
            {/* Animated background rings for depth */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-forest-light/5 animate-[spin_40s_linear_infinite] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-t border-gold/10 animate-[spin_20s_linear_infinite] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col justify-between h-full flex-grow gap-8"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl liquid-glass flex items-center justify-center transition-all duration-300 ${
                      currentTab.hoverAccent === "gold" ? "text-gold group-hover:bg-gold/10" : "text-forest-light group-hover:bg-forest/10"
                    }`} data-hover={currentTab.hoverAccent}>
                      {currentTab.svgIcon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-gold block mb-1">
                        {t(`${currentTab.id}.badge`)}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide">
                        {t(`${currentTab.id}.title`)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-300 font-sans font-light leading-relaxed mb-8 text-base">
                    {t(`${currentTab.id}.description`)}
                  </p>

                  {/* Список преимуществ */}
                  <ul className="space-y-3.5">
                    {["b1", "b2", "b3"].map((b) => (
                      <li key={b} className="flex items-center gap-3.5 text-sm text-zinc-400 font-sans font-light">
                        <svg viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 stroke-[2] ${
                          currentTab.hoverAccent === "gold" ? "text-gold" : "text-forest-light"
                        }`} fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t(`${currentTab.id}.${b}`)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                  <Button variant="forest" className="flex items-center justify-center gap-2 group font-medium" onClick={() => { document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>
                    {t("btnPrimary")}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[2] transition-transform duration-300 transform group-hover:translate-x-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                  <Button variant="ghost" className="font-medium" onClick={() => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>{t("btnSecondary")}</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

        </div>

      </div>
    </section>
  );
}

