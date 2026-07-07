"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import GlassCard from "@/components/ui/GlassCard";
import { useTranslations } from "next-intl";
import DigitalTengeSimulator from "@/components/sections/DigitalTengeSimulator";

export default function DigitalPage() {
  const t = useTranslations("DigitalPage");

  const comparisonData = [
    {
      feature: t("rows.form.name"),
      cash: t("rows.form.cash"),
      nonCash: t("rows.form.nonCash"),
      cbdc: t("rows.form.cbdc"),
    },
    {
      feature: t("rows.issuer.name"),
      cash: t("rows.issuer.cash"),
      nonCash: t("rows.issuer.nonCash"),
      cbdc: t("rows.issuer.cbdc"),
    },
    {
      feature: t("rows.offline.name"),
      cash: t("rows.offline.cash"),
      nonCash: t("rows.offline.nonCash"),
      cbdc: t("rows.offline.cbdc"),
    },
    {
      feature: t("rows.programmable.name"),
      cash: t("rows.programmable.cash"),
      nonCash: t("rows.programmable.nonCash"),
      cbdc: t("rows.programmable.cbdc"),
    },
    {
      feature: t("rows.speed.name"),
      cash: t("rows.speed.cash"),
      nonCash: t("rows.speed.nonCash"),
      cbdc: t("rows.speed.cbdc"),
    },
  ];

  return (
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            <BubbleText text={t("titleLine1")} /> <br />
            <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
          </h1>
          <p className="text-lg text-zinc-300 font-light leading-relaxed">
            <BubbleText text={t("subtitle")} />
          </p>
        </motion.div>

        {/* Секция архитектуры */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="layers" size={24} />
              </div>
              <h2 className="text-lg font-bold text-white mb-3">{t("card1Title")}</h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {t("card1Desc")}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Stack:</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="Hyperledger Fabric">
                  <Icon name="hyperledger" size={14} />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="Golang">
                  <Icon name="golang" size={14} />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="Solidity">
                  <Icon name="solidity" size={14} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="cpu" size={24} />
              </div>
              <h2 className="text-lg font-bold text-white mb-3">{t("card2Title")}</h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {t("card2Desc")}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Stack:</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="EVM / Ethereum">
                  <Icon name="ethereum" size={14} />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="Solidity">
                  <Icon name="solidity" size={14} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/5 hover:border-gold/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                <Icon name="refresh" size={24} />
              </div>
              <h2 className="text-lg font-bold text-white mb-3">{t("card3Title")}</h2>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {t("card3Desc")}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Stack:</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="Java / JavaCard">
                  <Icon name="java" size={14} />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-gold hover:border-gold/30 hover:bg-white/[0.06] transition-all duration-300" title="NFC">
                  <Icon name="phone" size={14} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Секция Сравнения форм денег */}
        <div className="mb-24">
          <h2 className="font-display text-2xl sm:text-4xl text-white mb-8 font-normal tracking-tight">
            {t("compareTitle")} <span className="text-gradient-gold">{t("compareAccent")}</span>
          </h2>
          <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-charcoal/20 backdrop-blur-md">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm font-sans font-light">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider font-semibold text-gold-light">
                  <th className="p-5">{t("thFeature")}</th>
                  <th className="p-5">{t("thCash")}</th>
                  <th className="p-5">{t("thNonCash")}</th>
                  <th className="p-5 text-white">{t("thCbdc")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {comparisonData.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="p-5 font-semibold text-white">{row.feature}</td>
                    <td className="p-5">{row.cash}</td>
                    <td className="p-5">{row.nonCash}</td>
                    <td className="p-5 text-white font-medium bg-forest/10 border-x border-forest-light/10">{row.cbdc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Свайп-подсказка для мобильных экранов */}
          <div className="flex justify-end mt-3 text-xs text-zinc-400 gap-1.5 lg:hidden px-2">
            <span>{t("swipeHint")}</span>
            <Icon name="arrow-right" size={14} className="animate-pulse" />
          </div>
        </div>

        {/* Симулятор смарт-контрактов */}
        <div className="mb-24">
          <DigitalTengeSimulator />
        </div>

        {/* Образовательный инсайт для инженеров */}
        <div className="bg-charcoal/30 border border-white/5 rounded-3xl p-8 sm:p-12">
          <div className="flex gap-4 items-start mb-6">
            <Icon name="database" size={32} className="text-gold shrink-0 mt-1" />
            <div>
              <span className="text-xs uppercase text-gold-light font-semibold tracking-wider">{t("overline")}</span>
              <h2 className="text-xl font-bold text-white tracking-wide">{t("insightTitle")}</h2>
            </div>
          </div>
          <p className="text-zinc-300 font-light leading-relaxed mb-6">
            {t("insightDesc1")}
          </p>
          <p className="text-zinc-300 font-light leading-relaxed">
            {t("insightDesc2")}
          </p>
        </div>

      </div>
    </div>
  );
}
