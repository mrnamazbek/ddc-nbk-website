'use client';

import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { 
  IconShield, 
  IconActivity, 
  IconDeviceLaptop, 
  IconServer, 
  IconDatabase, 
  IconTrendingUp 
} from '@tabler/icons-react';

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

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative overflow-hidden bg-[#030a06] flex items-center justify-center">
      {/* Background Beams из Aceternity UI */}
      <BackgroundBeams className="opacity-40" />

      <div className="max-w-7xl w-full mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#E8C87A] text-xs font-mono uppercase tracking-widest bg-[#E8C87A]/10 px-3 py-1 rounded-full border border-[#E8C87A]/20">
            Aceternity & shadcn MCP Playground
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6 text-gradient-gold font-display">
            Компоненты Aceternity UI
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base">
            Эта страница демонстрирует работу установленных компонентов Bento Grid и Background Beams, стилизованных под цветовую палитру DDC.
          </p>
        </div>

        {/* Демонстрация Bento Grid */}
        <BentoGrid className="max-w-4xl mx-auto mb-16">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={item.className}
            />
          ))}
        </BentoGrid>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 transition text-sm font-semibold"
          >
            Вернуться на главную
          </a>
        </div>
      </div>
    </main>
  );
}
