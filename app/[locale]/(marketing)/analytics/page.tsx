"use client";

import { motion } from "framer-motion";
import FinancialInform from "@/components/ui/FinancialInform";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { Database, Cpu, TrendingUp, BarChart3, HelpCircle, Server, Check } from "lucide-react";

export default function AnalyticsPage() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const dbOptimizationTips = [
    {
      title: "Индексация (B-Tree & BRIN)",
      desc: "Использование B-Tree индексов для точечных запросов и BRIN (Block Range Index) для сверхбольших временных таблиц (time-series) в PostgreSQL.",
    },
    {
      title: "Партиционирование таблиц",
      desc: "Секционирование таблиц по диапазонам дат (Range Partitioning) для ускорения аналитических выборок за конкретные периоды.",
    },
    {
      title: "Денормализация в ClickHouse",
      desc: "Проектирование широких денормализованных таблиц в ClickHouse для агрегации миллионов транзакций без ресурсоемких операций JOIN.",
    },
  ];

  return (
    <div className="relative w-full bg-[#0A0A0A] overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            АНАЛИТИКА И ДАННЫЕ
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Информационные <br />
            <span className="text-gradient-gold font-medium">финансовые потоки</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Аналитический мониторинг финансового рынка Казахстана в реальном времени и архитектура высоконагруженных платформ обработки данных.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          <div className="lg:col-span-7">
            <FinancialInform />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <GlassCard hoverAccent="forest" className="p-8 h-full" isTiltEnabled={false}>
              <div className="flex gap-4 items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-gold uppercase">Big Data Stack</span>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    ETL Pipeline Architecture
                  </h3>
                </div>
              </div>
              
              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                Для обработки миллионов транзакций Цифрового Тенге в сутки DDC проектирует отказоустойчивые конвейеры данных (Data Pipelines) на базе Apache Kafka и Apache Airflow.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest-mid/20 text-forest-light flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ingestion Layer</h4>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">Реалтайм стриминг через брокеры сообщений Apache Kafka.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest-mid/20 text-forest-light flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Storage & Analytics</h4>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">Гибридное хранилище: PostgreSQL для транзакций, ClickHouse для мгновенных OLAP-отчетов.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest-mid/20 text-forest-light flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Orchestration</h4>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">Планирование и мониторинг графов DAG в Apache Airflow с валидацией качества данных (dbt).</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Database Developer / Data Engineer School */}
        <div className="mb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-3">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3 block">
                ИНЖЕНЕРНАЯ ШКОЛА DDC
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-white mb-8 font-normal tracking-tight">
                Оптимизация баз данных <span className="text-gradient-gold">для высоких нагрузок</span>
              </h2>
            </div>

            {dbOptimizationTips.map((tip, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-charcoal/20 border border-white/5 p-8 rounded-2xl hover:border-gold/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-3 tracking-wide">{tip.title}</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Career Advice Block */}
        <div className="bg-gradient-to-r from-forest-dark to-charcoal border border-forest-mid/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#52B78803_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="flex gap-4 items-start mb-6">
            <Server className="w-8 h-8 text-gold shrink-0 mt-1" />
            <div>
              <span className="text-xs uppercase text-gold font-semibold tracking-wider">советы карьерного роста</span>
              <h3 className="text-xl font-bold text-white tracking-wide">Как стать Data Engineer / Database Developer в финтехе?</h3>
            </div>
          </div>

          <p className="text-zinc-400 font-light leading-relaxed mb-6">
            Работа с государственными транзакционными системами в Национальном Банке требует фундаментальных знаний теории баз данных. Начинающим специалистам мы рекомендуем сосредоточиться на:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-400 font-light">
            <div className="flex gap-2">
              <span className="text-gold font-bold">•</span>
              <span><strong>Оптимизация SQL</strong>: понимание работы Query Planner, анализа `EXPLAIN ANALYZE` и избежание проблем `N+1` при интеграции ORM.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold font-bold">•</span>
              <span><strong>Data Modeling</strong>: нормализация до 3NF для OLTP-систем и денормализация (Kimball Dimensional Modeling) для построения хранилищ данных (DWH).</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold font-bold">•</span>
              <span><strong>Python для Data Engineering</strong>: написание поддерживаемых скриптов с типизацией Pydantic, интеграция с Kafka/RabbitMQ и разработка кастомных операторов в Airflow.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold font-bold">•</span>
              <span><strong>Безопасность</strong>: понимание криптографии (AES, RSA), хеширования паролей и аудита безопасности баз данных.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
