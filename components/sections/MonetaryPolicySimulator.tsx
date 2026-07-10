"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface SimulationState {
  quarter: number;
  rate: number;
  inflation: number;
  kzt: number;
  activity: number;
  history: {
    quarter: number;
    rate: number;
    inflation: number;
    kzt: number;
    activity: number;
  }[];
}

const INITIAL_STATE: SimulationState = {
  quarter: 1,
  rate: 14.75,
  inflation: 8.4,
  kzt: 448.20,
  activity: 51.2,
  history: [
    { quarter: 1, rate: 14.75, inflation: 8.4, kzt: 448.20, activity: 51.2 }
  ],
};

export default function MonetaryPolicySimulator() {
  const t = useTranslations("AnalyticsPage.simulator");
  const tm = useTranslations("MonetarySim");
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [selectedRate, setSelectedRate] = useState<number>(14.75);
  const [isSimulating, setIsSimulating] = useState(false);

  // Вычисляемое состояние для отзывов (derived state)
  const getFeedback = () => {
    if (state.inflation > 9.0) {
      return { message: t("status.high"), type: "high" as const };
    } else if (state.activity < 49.0) {
      return { message: t("status.low"), type: "low" as const };
    } else {
      return { message: t("status.win"), type: "win" as const };
    }
  };

  const { message: feedbackMessage, type: feedbackType } = getFeedback();

  const handleNextQuarter = () => {
    if (isSimulating || state.quarter >= 4) return;

    setIsSimulating(true);

    setTimeout(() => {
      setState((prev) => {
        const nextQuarter = prev.quarter + 1;

        // Моделирование изменений
        // 1. Инфляция реагирует на ставку с лагом:
        // Балансовая ставка ~12%. Все что выше - снижает инфляцию, все что ниже - разгоняет.
        const inflationDiff = (12.0 - selectedRate) * 0.15 + (Math.random() * 0.4 - 0.2);
        const newInflation = Math.max(3.0, prev.inflation + inflationDiff);

        // 2. Курс тенге KZT/USD укрепляется при высокой ставке и ослабляется при низкой
        const kztDiff = (13.0 - selectedRate) * 1.8 + (Math.random() * 2.0 - 1.0);
        const newKzt = Math.max(380.0, prev.kzt + kztDiff);

        // 3. Деловая активность (ИДА) падает при высокой ставке (дорогие кредиты) и растет при низкой
        const activityDiff = (13.5 - selectedRate) * 0.25 + (Math.random() * 0.6 - 0.3);
        const newActivity = Math.max(42.0, Math.min(65.0, prev.activity + activityDiff));

        const nextStep = {
          quarter: nextQuarter,
          rate: selectedRate,
          inflation: parseFloat(newInflation.toFixed(2)),
          kzt: parseFloat(newKzt.toFixed(2)),
          activity: parseFloat(newActivity.toFixed(1)),
        };

        return {
          quarter: nextQuarter,
          rate: selectedRate,
          inflation: nextStep.inflation,
          kzt: nextStep.kzt,
          activity: nextStep.activity,
          history: [...prev.history, nextStep],
        };
      });
      setIsSimulating(false);
    }, 1000);
  };

  const handleRestart = () => {
    setState(INITIAL_STATE);
    setSelectedRate(14.75);
  };

  // Helper to draw tiny chart inside widget
  const renderMiniChart = (data: number[], colorClass: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 40;
    const width = 120;

    const points = data
      .map((val, index) => {
        const x = data.length > 1 ? (index / (data.length - 1)) * width : 0;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="w-28 h-10 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={colorClass}
          points={points}
        />
        {data.map((val, index) => {
          const x = data.length > 1 ? (index / (data.length - 1)) * width : 0;
          const y = height - ((val - min) / range) * (height - 8) - 4;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              className={`${colorClass} fill-black`}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <GlassCard hoverAccent="forest" className="p-8 border border-white/5 relative overflow-hidden" isTiltEnabled={false}>
      <div className="text-left mb-8 flex justify-between items-start">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-gold uppercase block mb-1">
            DDC MONETARY POLICY LAB
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-normal text-white mb-2">
            {t("title")}
          </h3>
          <p className="text-sm text-zinc-400 font-light">
            <BubbleText text={t("subtitle")} />
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right">
          <span className="text-[9px] font-mono text-zinc-500 uppercase block">
            {t("quarterLabel")}
          </span>
          <span className="text-lg font-mono font-bold text-white">
            {state.quarter} / 4
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Панель управления ставкой */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="rate-range" className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {t("rateLabel")}
              </label>
              <span className="text-xl font-mono font-bold text-gold">
                {selectedRate.toFixed(2)}%
              </span>
            </div>

            <input
              id="rate-range"
              type="range"
              aria-label={t("rateLabel")}
              min="5.00"
              max="20.00"
              step="0.25"
              value={selectedRate}
              disabled={isSimulating || state.quarter >= 4}
              onChange={(e) => setSelectedRate(parseFloat(e.target.value))}
              className="w-full h-11 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold disabled:opacity-50"
            />

            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>{tm("stimulating")}</span>
              <span>{tm("tight")}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {state.quarter < 4 ? (
              <Button
                onClick={handleNextQuarter}
                disabled={isSimulating}
                variant="forest"
                className="w-full justify-center py-3.5 font-mono text-xs uppercase"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <Icon name="refresh" className="animate-spin text-black" size={14} />
                    {tm("calculating")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Icon name="zap" className="text-black" size={14} />
                    {t("simulateBtn")}
                  </span>
                )}
              </Button>
            ) : (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-3">
                <span className="text-xs font-mono text-zinc-400 block">
                  {tm("cycleComplete")}
                </span>
                <Button
                  onClick={handleRestart}
                  variant="gold"
                  className="w-full justify-center py-2.5 font-mono text-xs uppercase"
                >
                  <span className="flex items-center gap-2">
                    <Icon name="refresh" className="text-black" size={14} />
                    {t("restartBtn")}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Табло макропоказателей */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Инфляция */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {t("inflationLabel")}
              </span>
              <div className="flex items-baseline gap-1.5 my-2">
                <span className="text-2xl font-mono font-bold text-white">
                  {state.inflation.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                {renderMiniChart(state.history.map(h => h.inflation), "text-forest-light")}
              </div>
            </div>

            {/* Курс USD/KZT */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {t("kztLabel")}
              </span>
              <div className="flex items-baseline gap-1.5 my-2">
                <span className="text-2xl font-mono font-bold text-white">
                  {state.kzt.toFixed(2)} ₸
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                {renderMiniChart(state.history.map(h => h.kzt), "text-gold")}
              </div>
            </div>

            {/* Деловая активность */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                {t("activityLabel")}
              </span>
              <div className="flex items-baseline gap-1.5 my-2">
                <span className="text-2xl font-mono font-bold text-white">
                  {state.activity.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {state.activity > 50 ? tm("growth") : tm("decline")}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                {renderMiniChart(state.history.map(h => h.activity), "text-blue-400")}
              </div>
            </div>

          </div>

          {/* Текстовая аналитика */}
          <AnimatePresence mode="wait">
            <motion.div
              key={feedbackMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 ${
                feedbackType === "win"
                  ? "bg-forest/10 border-forest-light/20 text-zinc-300"
                  : "bg-amber-950/10 border-amber-500/20 text-zinc-300"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <Icon
                  name={feedbackType === "win" ? "check-circle" : "alert"}
                  className={feedbackType === "win" ? "text-forest-light" : "text-gold"}
                  size={18}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase block">
                  {tm("report")}
                </span>
                <p className="text-xs font-sans font-light leading-relaxed">
                  {feedbackMessage}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </GlassCard>
  );
}
