"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import NumberTicker from "@/components/ui/NumberTicker";

interface Transaction {
  id: string;
  system: string;
  amount: string;
  status: "success" | "pending";
  time: string;
}



export default function Stats() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Обновление жидкостных часов (Astana Time, UTC+5)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Инициализация и симуляция живой активности транзакций в микро-таблице
  useEffect(() => {
    const initialTx: Transaction[] = [
      { id: "TX-784920", system: "Цифровой Тенге", amount: "150 000 ₸", status: "success", time: "18:24:01" },
      { id: "TX-784921", system: "Система МБП", amount: "2 400 000 ₸", status: "success", time: "18:24:04" },
      { id: "TX-784922", system: "Цифровой Тенге", amount: "45 000 ₸", status: "success", time: "18:24:12" },
      { id: "TX-784923", system: "Система МБП", amount: "890 000 ₸", status: "pending", time: "18:24:18" },
      { id: "TX-784924", system: "Клиринг ЦЦР", amount: "5 000 000 ₸", status: "success", time: "18:24:20" },
    ];
    setTransactions(initialTx);

    const txInterval = setInterval(() => {
      setTransactions((prev) => {
        const nextId = parseInt(prev[0].id.split("-")[1]) + 5;
        const newTx: Transaction = {
          id: `TX-${nextId}`,
          system: Math.random() > 0.45 ? "Цифровой Тенге" : (Math.random() > 0.5 ? "Система МБП" : "Клиринг ЦЦР"),
          amount: (Math.floor(Math.random() * 950 + 5) * 1000).toLocaleString("ru-RU") + " ₸",
          status: Math.random() > 0.15 ? "success" : "pending",
          time: new Date().toLocaleTimeString("ru-RU", { timeZone: "Asia/Almaty" }),
        };
        return [newTx, ...prev.slice(0, 4)];
      });
    }, 4000);

    return () => clearInterval(txInterval);
  }, []);

  const formatAstanaTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString("ru-RU", {
      timeZone: "Asia/Almaty",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAstanaSeconds = (date: Date | null) => {
    if (!date) return "00";
    return date.toLocaleTimeString("ru-RU", {
      timeZone: "Asia/Almaty",
      second: "2-digit",
    });
  };

  const formatAstanaDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("ru-RU", {
      timeZone: "Asia/Almaty",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Варианты анимации для Bento Grid элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="stats" className="relative w-full py-24 sm:py-32 bg-[#0E2419]/55 overflow-hidden border-t border-white/[0.05]">
      {/* Декоративная фоновая сетка в зеленых тонах */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A3D2B03_1px,transparent_1px),linear-gradient(to_bottom,#1A3D2B03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Премиальное сияние DDC и Нацбанка */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[550px] h-[550px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Блок 1 (Bento 2x1): Жидкостные часы Astana Time (UTC+5) + Статус систем */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <GlassCard hoverAccent="forest" className="h-full flex flex-col justify-between p-8" isTiltEnabled={false}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                {/* Жидкостные часы из styles.css пользователя */}
                <div className="clock-liquid">
                  <div className="mini-table-caption">Государственный временной стандарт</div>
                  <div className="clock-liquid__hero">
                    <div className="clock-liquid__glow" />
                    <div className="clock-liquid__city">Время Астаны (UTC+5)</div>
                    <div className="clock-liquid__time">
                      <span className="clock-liquid__digits">{formatAstanaTime(currentTime)}</span>
                      <span className="clock-liquid__seconds">:{formatAstanaSeconds(currentTime)}</span>
                    </div>
                    <div className="clock-liquid__date">{formatAstanaDate(currentTime)}</div>
                  </div>
                </div>

                {/* Статус систем */}
                <div className="flex flex-col justify-center h-full gap-4">
                  <div className="mini-table-caption">Мониторинг государственных платформ</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-sm font-light text-zinc-300">Платформа Цифрового Тенге</span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-forest-light font-mono bg-forest/10 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-light animate-pulse" />
                        Активна
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-sm font-light text-zinc-300">Межбанковские Платежи</span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-forest-light font-mono bg-forest/10 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-light animate-pulse" />
                        Стабильно
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-sm font-light text-zinc-300">Национальный Шлюз Клиринга</span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-forest-light font-mono bg-forest/10 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-light animate-pulse" />
                        99.99% SLA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Блок 2 (Bento 1x1): Показатель SLA Доступности */}
          <motion.div variants={cardVariants}>
            <GlassCard hoverAccent="gold" className="h-full flex flex-col justify-between p-8">
              <div>
                <div className="mini-table-caption">Надежность инфраструктуры</div>
                <div className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-white mb-2 flex items-baseline mt-4">
                  <span className="text-gradient-gold">99.99</span>
                  <span className="text-gold text-2xl ml-1 font-sans font-light">%</span>
                </div>
                <h3 className="text-lg font-sans font-medium text-white tracking-wide mb-3">
                  Доступность систем
                </h3>
              </div>
              <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed mt-4">
                Обеспечение непрерывного функционирования критически важных государственных транзакционных ядер и баз данных.
              </p>
            </GlassCard>
          </motion.div>

          {/* Блок 3 (Bento 1x1): Объем транзакций в сутки */}
          <motion.div variants={cardVariants}>
            <GlassCard hoverAccent="gold" className="h-full flex flex-col justify-between p-8">
              <div>
                <div className="mini-table-caption">Пропускная способность</div>
                <div className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-white mb-2 flex items-baseline mt-4">
                  <span className="text-gradient-gold">
                    <NumberTicker value={50} />
                  </span>
                  <span className="text-gold text-2xl ml-1 font-sans font-light">млн+</span>
                </div>
                <h3 className="text-lg font-sans font-medium text-white tracking-wide mb-3">
                  Операций в сутки
                </h3>
              </div>
              <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed mt-4">
                Высокопроизводительное ядро ЦЦР обрабатывает миллионы межбанковских платежей в режиме реального времени.
              </p>
            </GlassCard>
          </motion.div>

          {/* Блок 4 (Bento 2x1): Микро-таблица живой транзакционной активности транзакций */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <GlassCard hoverAccent="forest" className="h-full flex flex-col justify-between p-8" isTiltEnabled={false}>
              <div className="w-full">
                <div className="mini-table-caption">Журнал транзакций Цифрового Тенге (Live Feed)</div>
                
                {/* Оболочка микро-таблицы из styles.css пользователя */}
                <div className="mini-table-shell mt-4">
                  <div className="mini-table-scroll">
                    <div className="mini-table">
                      {/* Шапка таблицы */}
                      <div className="mini-table__head">
                        <div className="mini-table__head-cell">ID</div>
                        <div className="mini-table__head-cell">Система</div>
                        <div className="mini-table__head-cell">Сумма</div>
                        <div className="mini-table__head-cell">Статус</div>
                      </div>

                      {/* Строки с транзакциями */}
                      {transactions.map((tx, idx) => (
                        <div
                          key={tx.id}
                          className={`mini-table__row ${idx === 0 ? "mini-table__row--top" : ""}`}
                          style={{
                            transition: "all 0.5s ease",
                            opacity: 1 - idx * 0.15, // Мягкое угасание старых строк
                          }}
                        >
                          <div className="mini-table__cell mono font-semibold">{tx.id}</div>
                          <div className="mini-table__cell text-zinc-300 font-light">{tx.system}</div>
                          <div className="mini-table__cell mono text-white">{tx.amount}</div>
                          <div className="mini-table__cell status">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "success" ? "bg-forest-light animate-pulse" : "bg-gold animate-pulse"
                            }`} />
                            <span className={`font-mono text-[10px] uppercase tracking-wider ${
                              tx.status === "success" ? "text-forest-light" : "text-gold-light"
                            }`}>
                              {tx.status === "success" ? "Проведено" : "В клиринге"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
