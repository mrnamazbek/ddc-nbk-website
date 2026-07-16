"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Icon from "./Icon";
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
  const t = useTranslations("FinancialInform");
  const [rates, setRates] = useState<RateItem[]>([]);
  // Ставка и инфляция публикуются НБК по календарю заседаний, а не фидом —
  // значения и история фиксируются в коде и обновляются вместе с контентом.
  const [baseRate] = useState({ value: 14.75, change: -0.25, history: [16.0, 15.75, 15.25, 15.0, 14.75] });
  const [inflation] = useState({ value: 8.4, change: -0.3, history: [9.8, 9.3, 8.9, 8.6, 8.4] });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Курсы валют — живые официальные данные НБК через наш кэширующий
  // эндпоинт /api/rates (источник: rss/rates_all.xml Нацбанка). Фид
  // дневной, поэтому никакого фонового поллинга — только маунт и ручное
  // обновление. Никаких сгенерированных значений: если данных нет,
  // показываем честное состояние недоступности.
  const loadRates = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error(`rates endpoint ${response.status}`);
      const data: { asOf: string | null; rates: { code: string; value: number; change: number; trend: "up" | "down" }[] } =
        await response.json();

      const names: Record<string, string> = { USD: t("usd"), EUR: t("eur"), RUB: t("rub") };
      setRates(
        data.rates.map((rate) => ({
          code: rate.code,
          name: names[rate.code] ?? rate.code,
          value: rate.value,
          change: rate.change,
          trend: rate.trend,
          history: [],
        })),
      );
      setLastUpdated(data.asOf ?? "");
      setHasError(false);
    } catch (error) {
      console.error("Failed to load NBK rates:", error);
      setHasError(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const x = data.length > 1 ? (index / (data.length - 1)) * width : 0;
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
              {t("title")}
            </span>
            <h3 className="text-xl font-bold text-foreground tracking-wide">
              {t("subtitle")}
            </h3>
          </div>
          <button
            onClick={() => void loadRates()}
            disabled={isRefreshing}
            className="h-11 min-w-11 shrink-0 rounded-full bg-glass border border-glass-border flex items-center justify-center text-muted hover:text-gold hover:bg-glass active:scale-95 transition-all duration-300 disabled:opacity-50 select-none cursor-pointer"
            title={t("refreshBtn")}
          >
            <Icon name="refresh" size={16} animate={false} className={isRefreshing ? "animate-spin text-gold" : ""} />
          </button>
        </div>

        {/* Сетка основных индикаторов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Базовая ставка Нацбанка */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/25 transition-colors duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted font-light">{t("baseRate")}</span>
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Icon name="percent" size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {baseRate.value.toFixed(2)}%
              </span>
              <span className={`text-xs font-mono font-medium flex items-center gap-0.5 ${
                baseRate.change < 0 ? "text-forest-light" : "text-red-500"
              }`}>
                {baseRate.change < 0 ? <Icon name="trending-down" size={14} /> : <Icon name="trending-up" size={14} />}
                {baseRate.change < 0 ? "" : "+"}{baseRate.change}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-light">{t("baseRateTrend")}</span>
              {renderSparkline(baseRate.history, "text-gold")}
            </div>
          </div>

          {/* Инфляция годовая */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-forest/25 transition-colors duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted font-light">{t("inflation")}</span>
              <div className="w-8 h-8 rounded-lg bg-forest/20 border border-forest-light/20 flex items-center justify-center text-forest-light">
                <Icon name="trending-down" size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {inflation.value.toFixed(1)}%
              </span>
              <span className="text-xs font-mono font-medium text-forest-light flex items-center gap-0.5">
                <Icon name="trending-down" size={14} />
                {inflation.change}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-light">{t("inflationTrend")}</span>
              {renderSparkline(inflation.history, "text-forest-light")}
            </div>
          </div>
        </div>

        {/* Таблица официальных курсов валют */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-1">
            {t("exchangeRates")}
          </span>
          {hasError && rates.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.03] text-xs text-muted font-light">
              {t("unavailable")}
            </div>
          ) : (
            rates.map((rate) => (
              <div
                key={rate.code}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-glass-border transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-glass border border-glass-border flex items-center justify-center text-foreground font-mono text-xs font-semibold">
                    {rate.code}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground tracking-wide leading-tight">
                      {rate.code} / KZT
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-light">
                      {rate.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-foreground block">
                    {rate.value.toFixed(2)} ₸
                  </span>
                  {/* change из фида НБК — абсолютное изменение в тенге */}
                  <span className={`text-[10px] font-mono font-medium flex items-center justify-end gap-0.5 ${
                    rate.trend === "up" ? "text-forest-light" : "text-gold-light"
                  }`}>
                    {rate.trend === "up" ? <Icon name="trending-up" size={12} /> : <Icon name="trending-down" size={12} />}
                    {rate.change > 0 ? "+" : ""}{rate.change.toFixed(2)} ₸
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Футер дашборда со статусом обновления */}
      <div className="flex items-center justify-between border-t border-glass-border pt-6 mt-8">
        <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Icon name="calendar" size={14} />
          {t("updated")}: {hasError ? t("unavailable") : lastUpdated || t("loading")}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-light">
          <span className={`w-1.5 h-1.5 rounded-full bg-gold ${hasError ? "" : "animate-ping"}`} />
          {t("source")}
        </span>
      </div>
    </GlassCard>
  );
}
