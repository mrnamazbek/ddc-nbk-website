"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

interface FeatureTab {
  id: string;
  title: string;
  badge: string;
  description: string;
  benefits: string[];
  hoverAccent: "gold" | "blue";
  svgIcon: React.ReactNode;
}

export default function DigitalShowcase() {
  const [activeTab, setActiveTab] = useState("targeted");

  const tabs: FeatureTab[] = [
    {
      id: "targeted",
      title: "Целевые (маркированные) платежи",
      badge: "БЮДЖЕТНЫЙ КОНТРОЛЬ",
      description: "Инновационная технология маркирования средств на основе программируемых денег, которая гарантирует использование государственного бюджета строго по назначению без коррупционных рисков.",
      hoverAccent: "gold",
      benefits: [
        "Автоматический контроль цепочки транзакций",
        "Интеграция с государственными реестрами",
        "Полная прозрачность расходования субсидий",
      ],
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M12 7v10M8 9.5h8M8 12.5h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "offline",
      title: "Двухуровневые оффлайн-транзакции",
      badge: "ФИНАНСОВАЯ ИНКЛЮЗИВНОСТЬ",
      description: "Обеспечение проведения транзакций в цифровой валюте даже в отдаленных районах без доступа к интернету и мобильной связи, гарантируя непрерывность платежного оборота страны.",
      hoverAccent: "blue",
      benefits: [
        "Независимость от интернет-провайдеров",
        "Аппаратные кошельки на смарт-картах",
        "Безопасная синхронизация при восстановлении сети",
      ],
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "smart",
      title: "Программируемые смарт-контракты",
      badge: "БУДУЩЕЕ БИЗНЕСА",
      description: "Создание гибкой логики финансовых сделок для коммерческого сектора. Смарт-контракты позволяют автоматизировать расчеты, снижая издержки на посредников и юристов.",
      hoverAccent: "blue",
      benefits: [
        "Безопасные сделки эскроу без посредников",
        "Мгновенный расчет налогов при оплате",
        "Гибкие сценарии автоматических распределений",
      ],
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
    <section id="digital" className="relative w-full py-24 sm:py-32 bg-[#08080a] overflow-hidden border-t border-white/5">
      {/* Технологическая подсветка на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-blue/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            НАЦИОНАЛЬНЫЕ ИННОВАЦИИ
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Платформа <br />
            <span className="text-gradient-gold font-medium">Цифрового Тенге</span>
          </h2>
          <p className="text-zinc-400 font-sans font-light leading-relaxed text-lg">
            Цифровой Тенге — это третья форма национальной валюты, которая дополняет наличные и безналичные деньги, открывая принципиально новые возможности для государства, бизнеса и граждан.
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
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer group ${
                    isActive
                      ? tab.hoverAccent === "gold"
                        ? "bg-gold/10 border-gold/45 text-white shadow-[0_4px_20px_rgba(201,168,76,0.15)]"
                        : "bg-brand-blue/15 border-brand-blue-light/45 text-white shadow-[0_4px_20px_rgba(0,92,187,0.15)]"
                      : "bg-transparent border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? tab.hoverAccent === "gold" ? "bg-gold text-black font-bold" : "bg-brand-blue-light text-black font-bold"
                      : "bg-white/5 text-gold"
                  }`}>
                    {tab.svgIcon}
                  </div>
                  <div>
                    <span className="text-[10px] block mb-1 font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                      {tab.badge}
                    </span>
                    <h3 className="text-sm font-sans font-semibold">
                      {tab.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Правая сторона: Контент активной вкладки с анимацией смены */}
          <div className="lg:col-span-8 border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_70px_rgba(0,0,0,0.5)] rounded-2xl p-8 sm:p-12 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            {/* Крутящееся кольцо на заднем фоне карточки для создания футуристического объема */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-brand-blue-light/5 animate-[spin_40s_linear_infinite] pointer-events-none" />
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentTab.hoverAccent === "gold"
                        ? "bg-gold/10 border border-gold/20 text-gold"
                        : "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-light"
                    }`}>
                      {currentTab.svgIcon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-gold block mb-1">
                        {currentTab.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide">
                        {currentTab.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-300 font-sans font-light leading-relaxed mb-8 text-base">
                    {currentTab.description}
                  </p>

                  {/* Список преимуществ */}
                  <ul className="space-y-3.5">
                    {currentTab.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3.5 text-sm text-zinc-400 font-sans font-light">
                        <svg viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 stroke-[2] ${
                          currentTab.hoverAccent === "gold" ? "text-gold" : "text-brand-blue-light"
                        }`} fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                  <Button variant="blue" className="flex items-center justify-center gap-2 group font-medium">
                    Техническая спецификация
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[2] transition-transform duration-300 transform group-hover:translate-x-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                  <Button variant="ghost" className="font-medium">Архитектура платформы</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

