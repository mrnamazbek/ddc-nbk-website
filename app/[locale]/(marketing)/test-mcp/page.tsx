'use client';

import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { motion } from 'framer-motion';
import {
  IconShield,
  IconActivity,
  IconServer,
  IconDatabase,
  IconCheck
} from '@tabler/icons-react';
import { Link } from '@/i18n/navigation';

import { BubbleText } from '@/components/ui/BubbleText';

export default function TestMcpPage() {
  const items = [
    {
      title: "Мониторинг транзакций",
      description: "Анализ платежей в реальном времени с использованием алгоритмов машинного обучения.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-[#062c1e] to-[#0c1815] border border-emerald-950/50 flex-col items-center justify-center p-4">
        <IconActivity className="h-8 w-8 text-[#E8C87A] animate-pulse" />
      </div>,
      icon: <IconActivity className="h-4 w-4 text-zinc-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Безопасность данных",
      description: "Шифрование военного уровня и соответствие стандартам PCI DSS.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-[#121c17] to-[#040806] border border-emerald-950/30 flex-col items-center justify-center p-4">
        <IconShield className="h-8 w-8 text-emerald-500" />
      </div>,
      icon: <IconShield className="h-4 w-4 text-zinc-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Облачная инфраструктура",
      description: "Масштабируемые серверы с аптаймом 99.99%.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-[#061814] to-[#020504] border border-emerald-950/30 flex-col items-center justify-center p-4">
        <IconServer className="h-8 w-8 text-zinc-400" />
      </div>,
      icon: <IconServer className="h-4 w-4 text-zinc-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Базы данных высокого уровня",
      description: "Оптимизированные SQL и NoSQL кластеры для Big Data.",
      header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-[#041a12] to-[#0c1815] border border-emerald-950/40 flex-col items-center justify-center p-4">
        <IconDatabase className="h-8 w-8 text-[#E8C87A]" />
      </div>,
      icon: <IconDatabase className="h-4 w-4 text-zinc-500" />,
      className: "md:col-span-2",
    },
  ];

  const pricingPlans = [
    {
      name: "Стартап",
      price: "$99",
      period: "в месяц",
      description: "Оптимальное решение для молодых проектов и тестирования гипотез.",
      features: [
        "До 10 000 транзакций в месяц",
        "Базовый мониторинг транзакций",
        "Интеграция с базой данных за 1 день",
        "Поддержка по email",
      ],
      cta: "Начать бесплатно",
      popular: false,
      glow: "from-emerald-950/20 to-transparent",
      border: "border-emerald-950/30",
    },
    {
      name: "Бизнес",
      price: "$299",
      period: "в месяц",
      description: "Для растущего бизнеса, требующего высокой надежности и скорости.",
      features: [
        "До 100 000 транзакций в месяц",
        "Анализ платежей в реальном времени",
        "Соответствие стандартам PCI DSS",
        "Выделенный менеджер 24/7",
        "Продвинутый дашборд аналитики",
      ],
      cta: "Попробовать бесплатно",
      popular: true,
      glow: "from-emerald-900/40 via-[#E8C87A]/10 to-transparent",
      border: "border-[#E8C87A]/50 shadow-[0_0_20px_rgba(232,200,122,0.15)]",
    },
    {
      name: "Корпорация",
      price: "Индивидуально",
      period: "",
      description: "Индивидуальные условия для крупных компаний с большими объемами данных.",
      features: [
        "Безлимитное число транзакций",
        "Выделенные сервера и СУБД кластеры",
        "Кастомные ML-модели мониторинга",
        "SLA 99.99% и полная поддержка",
        "Интеграции с Big Data системами",
      ],
      cta: "Связаться с нами",
      popular: false,
      glow: "from-emerald-950/20 to-transparent",
      border: "border-emerald-950/30",
    },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative overflow-hidden bg-[#030a06]">
      {/* Background Beams из Aceternity UI */}
      <BackgroundBeams className="opacity-40" />

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#E8C87A] text-xs font-mono uppercase tracking-widest bg-[#E8C87A]/10 px-3 py-1 rounded-full border border-[#E8C87A]/20">
            <BubbleText text="Aceternity & shadcn MCP Playground" />
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6 text-gradient-gold font-display">
            <BubbleText text="Компоненты Aceternity UI" />
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base">
            <BubbleText text="Эта страница демонстрирует работу установленных компонентов Bento Grid и Background Beams, стилизованных под цветовую палитру DDC." />
          </p>
        </div>

        {/* Демонстрация Bento Grid */}
        <BentoGrid className="max-w-4xl mx-auto mb-24">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={<BubbleText text={item.title} />}
              description={<BubbleText text={item.description} />}
              header={item.header}
              icon={item.icon}
              className={item.className}
            />
          ))}
        </BentoGrid>

        {/* Интерактивная секция цен (Bento Pricing) */}
        <div className="max-w-5xl mx-auto mb-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <BubbleText text="Тарифные планы для вашего масштаба" />
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              <BubbleText text="Исследуйте наши гибкие условия, созданные в соответствии с лучшими практиками юзабилити и оптимизации конверсий." />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl p-6 bg-gradient-to-b from-[#061814] to-[#020504] border ${plan.border} flex flex-col justify-between overflow-hidden group/pricing`}
              >
                {/* Фоновый градиент-подсветка */}
                <div className={`absolute inset-0 bg-gradient-to-b ${plan.glow} opacity-50 pointer-events-none transition-opacity duration-500 group-hover/pricing:opacity-75`} />

                <div className="relative z-10">
                  {plan.popular && (
                    <span className="absolute top-0 right-0 text-[10px] font-mono uppercase tracking-widest text-[#030a06] bg-[#E8C87A] px-2.5 py-0.5 rounded-full font-bold">
                      Популярный
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 text-xs mb-6 min-h-[2.5rem]">{plan.description}</p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl md:text-4xl font-extrabold text-[#E8C87A]">{plan.price}</span>
                    {plan.period && (
                      <span className="text-zinc-500 text-xs ml-2">{plan.period}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-zinc-300">
                        <IconCheck className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all relative z-10 ${
                    plan.popular
                      ? "bg-[#E8C87A] text-[#030a06] hover:bg-[#d6b76c] hover:shadow-[0_0_15px_rgba(232,200,122,0.3)]"
                      : "bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/20 hover:border-emerald-500/40"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 transition text-sm font-semibold"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
