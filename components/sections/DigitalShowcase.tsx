"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Landmark, ArrowRight, Brain, ZapOff, CheckCircle2 } from "lucide-react";

interface FeatureTab {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
  description: string;
  benefits: string[];
}

export default function DigitalShowcase() {
  const [activeTab, setActiveTab] = useState("targeted");

  const tabs: FeatureTab[] = [
    {
      id: "targeted",
      icon: Landmark,
      title: "Целевые (маркированные) платежи",
      badge: "Бюджетный контроль",
      description: "Инновационная технология маркирования средств на основе программируемых денег, которая гарантирует использование государственного бюджета строго по назначению без коррупционных рисков.",
      benefits: [
        "Автоматический контроль цепочки транзакций",
        "Интеграция с государственными реестрами",
        "Полная прозрачность расходования субсидий",
      ],
    },
    {
      id: "offline",
      icon: ZapOff,
      title: "Двухуровневые оффлайн-транзакции",
      badge: "Финансовая инклюзивность",
      description: "Обеспечение проведения транзакций в цифровой валюте даже в отдаленных районах без доступа к интернету и мобильной связи, гарантируя непрерывность платежного оборота страны.",
      benefits: [
        "Независимость от интернет-провайдеров",
        "Аппаратные кошельки на смарт-картах",
        "Безопасная синхронизация при восстановлении сети",
      ],
    },
    {
      id: "smart",
      icon: Brain,
      title: "Программируемые смарт-контракты",
      badge: "Будущее бизнеса",
      description: "Создание гибкой логики финансовых сделок для коммерческого сектора. Смарт-контракты позволяют автоматизировать расчеты, снижая издержки на посредников и юристов.",
      benefits: [
        "Безопасные сделки эскроу без посредников",
        "Мгновенный расчет налогов при оплате",
        "Гибкие сценарии автоматических распределений",
      ],
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const IconComponent = currentTab.icon;

  return (
    <section id="digital" className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      {/* Технологическая подсветка на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-forest/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            национальные инновации
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            Платформа <br />
            <span className="text-gradient-gold font-medium">Цифрового Тенге</span>
          </h2>
          <p className="text-zinc-400 font-sans font-light leading-relaxed">
            Цифровой Тенге — это третья форма национальной валюты, которая дополняет наличные и безналичные деньги, открывая принципиально новые возможности для государства, бизнеса и граждан.
          </p>
        </div>

        {/* Вкладки и Интерактивный контент */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Левая сторона: Список вкладок */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer group ${
                    isActive
                      ? "bg-forest/20 border-forest-light/40 text-white shadow-green shadow-sm"
                      : "bg-transparent border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive ? "bg-forest-light text-black font-bold" : "bg-charcoal text-gold"
                  }`}>
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gold/80 block mb-1 font-medium tracking-wider uppercase">
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
          <div className="lg:col-span-8 glass-panel border-white/5 rounded-2xl p-8 sm:p-12 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
            {/* Крутящееся кольцо на заднем фоне карточки для создания футуристического объема */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-forest-light/10 animate-[spin_40s_linear_infinite] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-t border-gold/15 animate-[spin_20s_linear_infinite] pointer-events-none" />

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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold/80 font-medium">
                        {currentTab.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-wide">
                        {currentTab.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-300 font-sans font-light leading-relaxed mb-8">
                    {currentTab.description}
                  </p>

                  {/* Список преимуществ */}
                  <ul className="space-y-3">
                    {currentTab.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-sans font-light">
                        <CheckCircle2 className="w-4 h-4 text-forest-light shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                  <Button variant="gold" className="flex items-center justify-center gap-2 group">
                    Техническая спецификация
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <Button variant="ghost">Архитектура платформы</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
