"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Percent, Calendar, RefreshCw } from "lucide-react";
import GlassCard from "./GlassCard";

interface RateItem {
  code: string;
  name: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  history: number[];
}

export default function FinancialInform() {
  const [rates, setRates] = useState<RateItem[]>([]);
  const [baseRate, setBaseRate] = useState({ value: 14.75, change: -0.25, history: [16.0, 15.75, 15.25, 15.0, 14.75] });
  const [inflation, setInflation] = useState({ value: 8.4, change: -0.3, history: [9.8, 9.3, 8.9, 8.6, 8.4] });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const mockRates: RateItem[] = [
        {
          code: "USD",
          name: "Доллар США",
          value: 448.25 + (Math.random() * 2 - 1),
          change: 0.15 + (Math.random() * 0.4 - 0.2),
          trend: Math.random() > 0.5 ? "up" : "down",
          history: [445.2, 446.8, 447.1, 447.9, 448.25],
        },
        {
          code: "EUR",
          name: "Евро",
          value: 485.4 + (Math.random() * 2 - 1),
          change: -0.32 + (Math.random() * 0.4 - 0.2),
          trend: Math.random() > 0.5 ? "down" : "up",
          history: [487.5, 486.9, 486.2, 485.8, 485.4],
        },
        {
          code: "RUB",
          name: "Российский Рубль",
          value: 4.95 + (Math.random() * 0.1 - 0.05),
          change: 0.02 + (Math.random() * 0.04 - 0.02),
          trend: Math.random() > 0.5 ? "up" : "stable",
          history: [4.88, 4.91, 4.93, 4.92, 4.95],
        },
      ];
      setRates(mockRates);
      
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    generateData();
    const interval = setInterval(generateData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Функция для отрисовки спарклайна (мини-графика) через SVG
  const renderSparkline = (data: number[], colorClass: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 30;
    const width = 100;
    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="w-24 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={colorClass}
          points={points}
        />
      </svg>
    );
  };

  return (
    <GlassCard hoverAccent="gold" className="p-8 h-full flex flex-col justify-between" isTiltEnabled={false}>
      <div>
        {/* Шапка виджета с индикатором реального времени */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-gold uppercase">
              Макроэкономический монитор
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Финансовые индикаторы РК
            </h3>
          </div>
          <button
            onClick={generateData}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:bg-white/10 active:scale-95 transition-all duration-300 disabled:opacity-50 select-none cursor-pointer"
            title="Обновить показатели"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-gold" : ""}`} />
          </button>
        </div>

        {/* Сетка основных индикаторов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Базовая ставка Нацбанка */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/25 transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gold/5 rounded-full blur-xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-500" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-light">Базовая ставка НБК</span>
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                {baseRate.value.toFixed(2)}%
              </span>
              <span className={`text-xs font-mono font-medium flex items-center gap-0.5 ${
                baseRate.change < 0 ? "text-forest-light" : "text-red-500"
              }`}>
                {baseRate.change < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {baseRate.change < 0 ? "" : "+"}{baseRate.change}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-light">Тренд за 5 заседаний</span>
              {renderSparkline(baseRate.history, "text-gold")}
            </div>
          </div>

          {/* Инфляция годовая */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-forest/25 transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-forest/5 rounded-full blur-xl pointer-events-none group-hover:bg-forest/10 transition-colors duration-500" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-light">Годовая инфляция</span>
              <div className="w-8 h-8 rounded-lg bg-forest/20 border border-forest-light/20 flex items-center justify-center text-forest-light">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-white">
                {inflation.value.toFixed(1)}%
              </span>
              <span className="text-xs font-mono font-medium text-forest-light flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {inflation.change}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-light">Снижение темпов</span>
              {renderSparkline(inflation.history, "text-forest-light")}
            </div>
          </div>
        </div>

        {/* Таблица официальных курсов валют */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
            Официальные курсы валют (KZT)
          </span>
          {rates.map((rate) => (
            <div
              key={rate.code}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-mono text-xs font-semibold">
                  {rate.code}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide leading-tight">
                    {rate.code} / KZT
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-light">
                    {rate.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {renderSparkline(rate.history, rate.trend === "up" ? "text-forest-light" : "text-gold")}
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-white block">
                    {rate.value.toFixed(2)} ₸
                  </span>
                  <span className={`text-[10px] font-mono font-medium flex items-center justify-end gap-0.5 ${
                    rate.change > 0 ? "text-forest-light" : "text-gold-light"
                  }`}>
                    {rate.change > 0 ? "+" : ""}{rate.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Футер дашборда со статусом обновления */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Обновлено: {lastUpdated || "загрузка..."}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-light">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
          Live feed Нацбанка
        </span>
      </div>
    </GlassCard>
  );
}
