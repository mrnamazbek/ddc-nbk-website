"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

type ScenarioKey = "food" | "agro" | "invest";
type CategoryKey = "food" | "machinery" | "construction" | "luxury";

interface Scenario {
  key: ScenarioKey;
  bin: string;
  allowedCategory: CategoryKey;
  merchantName: string;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  food: {
    key: "food",
    bin: "123456789012",
    allowedCategory: "food",
    merchantName: "ТОО Алтын Дан (Школьное питание)",
  },
  agro: {
    key: "agro",
    bin: "987654321098",
    allowedCategory: "machinery",
    merchantName: "АО КазАгроМаш (Сельхоз-техника)",
  },
  invest: {
    key: "invest",
    bin: "555666777888",
    allowedCategory: "construction",
    merchantName: "ТОО КазПромСтрой (Инфраструктура)",
  },
};

export default function DigitalTengeSimulator() {
  const t = useTranslations("DigitalPage.simulator");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>("food");
  const [amount, setAmount] = useState<string>("50000");
  const [bin, setBin] = useState<string>("123456789012");
  const [category, setCategory] = useState<CategoryKey>("food");

  // Состояния симуляции
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<{
    success: boolean;
    hash?: string;
    index?: number;
    reason?: string;
  } | null>(null);

  // Смена сценария, автозаполнение БИН и Категории
  const handleScenarioChange = (scKey: ScenarioKey) => {
    if (isSimulating) return;
    setSelectedScenario(scKey);
    const sc = SCENARIOS[scKey];
    setBin(sc.bin);
    setCategory(sc.allowedCategory);
    setSimulationResult(null);
  };

  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSimulating) return;

    // Сброс старых результатов
    setIsSimulating(true);
    setCurrentPhase(1);
    setSimulationResult(null);

    // Запуск пошаговой симуляции
    const timers = [
      setTimeout(() => setCurrentPhase(2), 1000),
      setTimeout(() => setCurrentPhase(3), 2000),
      setTimeout(() => setCurrentPhase(4), 3000),
      setTimeout(() => {
        setIsSimulating(false);
        setCurrentPhase(0);

        // Валидация по правилам смарт-контракта
        const targetSc = SCENARIOS[selectedScenario];
        const isBinValid = bin.trim() === targetSc.bin;
        const isCategoryValid = category === targetSc.allowedCategory;
        const isAmountValid = parseFloat(amount) > 0;

        if (isBinValid && isCategoryValid && isAmountValid) {
          // Генерация псевдослучайного хеша блока
          const randomHash = "0x" + Array.from({ length: 40 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("");

          setSimulationResult({
            success: true,
            hash: randomHash,
            index: Math.floor(100000 + Math.random() * 900000),
          });
        } else {
          setSimulationResult({
            success: false,
            reason: !isBinValid
              ? "Неаккредитованный БИН получателя для данной госпрограммы"
              : "Нецелевая категория расходов (нарушение условий маркировки токенов)",
          });
        }
      }, 4000)
    ];

    return () => timers.forEach(clearTimeout);
  };

  return (
    <GlassCard className="p-8 border border-white/5 relative overflow-hidden" isTiltEnabled={false}>
      {/* Декоративный светящийся фон */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-forest/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-left mb-8">
        <h3 className="text-xl sm:text-2xl font-display font-normal text-white mb-2">
          {t("title")}{" "}
          <span className="text-gradient-gold font-medium">SDK</span>
        </h3>
        <p className="text-sm text-zinc-400 font-light">
          <BubbleText text={t("subtitle")} />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Форма управления */}
        <form onSubmit={handleStartSimulation} className="lg:col-span-6 space-y-6 text-left">

          {/* Сценарий */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gold-light mb-3">
              {t("scenarioLabel")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["food", "agro", "invest"] as ScenarioKey[]).map((scKey) => (
                <button
                  key={scKey}
                  type="button"
                  onClick={() => handleScenarioChange(scKey)}
                  disabled={isSimulating}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all duration-300 ${
                    selectedScenario === scKey
                      ? "bg-forest/30 border-forest-light text-white shadow-lg"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:border-white/10"
                  }`}
                >
                  {t(`scenarios.${scKey}.title`)}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">
              {t(`scenarios.${selectedScenario}.desc`)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Сумма */}
            <div>
              <label htmlFor="amount" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                {t("amountLabel")}
              </label>
              <input
                id="amount"
                type="number"
                aria-label={t("amountLabel")}
                value={amount}
                disabled={isSimulating}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-gold/30 focus:outline-none disabled:opacity-50 transition-colors"
                required
              />
            </div>

            {/* Категория */}
            <div>
              <label htmlFor="category" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                {t("categoryLabel")}
              </label>
              <select
                id="category"
                aria-label={t("categoryLabel")}
                value={category}
                disabled={isSimulating}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-gold/30 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
              >
                {(["food", "machinery", "construction", "luxury"] as CategoryKey[]).map((catKey) => (
                  <option key={catKey} value={catKey} className="bg-charcoal text-white">
                    {t(`categories.${catKey}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* БИН */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="bin" className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                {t("binLabel")}
              </label>
              <button
                type="button"
                onClick={() => !isSimulating && setBin(SCENARIOS[selectedScenario].bin)}
                className="inline-flex min-h-11 items-center text-[10px] font-mono text-gold underline hover:text-gold-light cursor-pointer"
                disabled={isSimulating}
              >
                Вставить аккредитованный БИН
              </button>
            </div>
            <input
              id="bin"
              type="text"
              aria-label={t("binLabel")}
              value={bin}
              maxLength={12}
              disabled={isSimulating}
              onChange={(e) => setBin(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-charcoal/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-gold/30 focus:outline-none disabled:opacity-50 transition-colors"
              required
            />
            <span className="text-[10px] text-zinc-500 font-mono mt-1.5 block">
              Рекомендуемый получатель: {SCENARIOS[selectedScenario].merchantName}
            </span>
          </div>

          {/* Кнопка запуска */}
          <Button
            type="submit"
            variant="gold"
            disabled={isSimulating}
            className="w-full py-3.5 justify-center font-mono tracking-wider text-xs uppercase"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <Icon name="refresh" className="animate-spin text-black" size={14} />
                Обработка транзакции...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon name="zap" className="text-black" size={14} />
                {t("submitBtn")}
              </span>
            )}
          </Button>
        </form>

        {/* Анимационный монитор блокчейна */}
        <div className="lg:col-span-6 bg-black/40 border border-white/5 rounded-2xl p-6 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 z-10">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-light animate-ping" />
              Hyperledger Node monitor
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              STATUS: {isSimulating ? "PROCESSING" : "IDLE"}
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center gap-4 z-10">
            {/* Отображение этапов при симуляции */}
            {isSimulating && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((phaseNum) => {
                  const isActive = currentPhase === phaseNum;
                  const isCompleted = currentPhase > phaseNum;

                  return (
                    <motion.div
                      key={phaseNum}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border font-mono text-xs transition-colors ${
                        isActive
                          ? "bg-forest/10 border-forest-light text-white"
                          : isCompleted
                          ? "bg-white/[0.01] border-white/5 text-forest-light opacity-60"
                          : "bg-transparent border-transparent text-zinc-600"
                      }`}
                    >
                      <div className="shrink-0">
                        {isCompleted ? (
                          <Icon name="check-circle" size={16} className="text-forest-light" />
                        ) : isActive ? (
                          <Icon name="refresh" size={16} className="animate-spin text-gold" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-700">
                            {phaseNum}
                          </div>
                        )}
                      </div>
                      <span>{t(`phases.p${phaseNum}`)}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Отображение результатов */}
            <AnimatePresence mode="wait">
              {!isSimulating && simulationResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-left"
                >
                  <div className={`p-5 rounded-xl border ${
                    simulationResult.success
                      ? "bg-forest/10 border-forest-light/30"
                      : "bg-red-950/10 border-red-500/20"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon
                        name={simulationResult.success ? "check-circle" : "alert"}
                        className={simulationResult.success ? "text-forest-light" : "text-red-500"}
                        size={24}
                      />
                      <h4 className={`text-sm font-bold tracking-wider uppercase font-mono ${
                        simulationResult.success ? "text-forest-light" : "text-red-400"
                      }`}>
                        {t(`result.${simulationResult.success ? "successTitle" : "failTitle"}`)}
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      {t(`result.${simulationResult.success ? "successDesc" : "failDesc"}`)}
                    </p>

                    {!simulationResult.success && simulationResult.reason && (
                      <p className="text-xs text-red-400 font-mono mt-3 border-t border-red-500/10 pt-3">
                        REASON: {simulationResult.reason}
                      </p>
                    )}
                  </div>

                  {simulationResult.success && simulationResult.hash && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>BLOCK HASH</span>
                        <span>SHA-256</span>
                      </div>
                      <div className="text-[10px] font-mono text-gold break-all bg-black/40 p-2.5 rounded border border-white/5 selection:bg-gold/20 select-all">
                        {simulationResult.hash}
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-600">
                        <span>GAS USED: 0</span>
                        <span>CONGRUENT: YES</span>
                        <span>INDEX: #{simulationResult.index}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {!isSimulating && !simulationResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500"
                >
                  <Icon name="cpu" size={48} className="text-zinc-600 stroke-[1]" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    Ожидание трансляции...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/5 pt-4 text-center">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              Digital Tenge DLT Consensus Network v2.6
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
