"use client";

import { motion, useReducedMotion } from "framer-motion";
import FinancialInform from "@/components/ui/FinancialInform";
import { BubbleText } from "@/components/ui/BubbleText";
import GlassCard from "@/components/ui/GlassCard";
import Icon from "@/components/ui/Icon";
import { useTranslations } from "next-intl";
import MonetaryPolicySimulator from "@/components/sections/MonetaryPolicySimulator";
import { useA11y } from "@/components/theme/AccessibilityProvider";

export default function AnalyticsPage() {
  const t = useTranslations("AnalyticsPage");
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;

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
      title: t("tip1Title"),
      desc: t("tip1Desc"),
    },
    {
      title: t("tip2Title"),
      desc: t("tip2Desc"),
    },
    {
      title: t("tip3Title"),
      desc: t("tip3Desc"),
    },
  ];

  return (
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
            <BubbleText text={t("titleLine1")} /> <br />
            <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
          </h1>
          <p className="text-lg text-text-secondary font-light leading-relaxed">
            <BubbleText text={t("description")} />
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
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold-light">
                  <Icon name="database" size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-gold-light uppercase">Big Data Stack</span>
                  <h2 className="text-lg font-bold text-foreground tracking-wide">
                    {t("pipelineTitle")}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-text-secondary font-light leading-relaxed mb-6">
                {t("pipelineDesc")}
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-forest/20 border border-forest-light/10 text-gold-light flex items-center justify-center shrink-0 mt-0.5" title="Apache Kafka">
                    <Icon name="kafka" size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t("ingestionTitle")}</h3>
                    <p className="text-xs text-text-secondary font-light mt-0.5">{t("ingestionDesc")}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-14 h-8 rounded-lg bg-forest/20 border border-forest-light/10 text-gold-light flex items-center justify-center gap-1.5 shrink-0 mt-0.5" title="PostgreSQL & ClickHouse">
                    <Icon name="postgresql" size={16} />
                    <Icon name="clickhouse" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t("storageTitle")}</h3>
                    <p className="text-xs text-text-secondary font-light mt-0.5">{t("storageDesc")}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-14 h-8 rounded-lg bg-forest/20 border border-forest-light/10 text-gold-light flex items-center justify-center gap-1.5 shrink-0 mt-0.5" title="Apache Airflow & dbt">
                    <Icon name="airflow" size={16} />
                    <Icon name="dbt" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{t("orchTitle")}</h3>
                    <p className="text-xs text-text-secondary font-light mt-0.5">{t("orchDesc")}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Симулятор монетарной политики */}
        <div className="mb-24">
          <MonetaryPolicySimulator />
        </div>

        {/* Database Developer / Data Engineer School */}
        <div className="mb-24">
          <motion.div
            variants={containerVariants}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-3">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-3 block">
                {t("schoolOverline")}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-foreground mb-8 font-normal tracking-tight">
                {t("schoolTitle")} <span className="text-gradient-gold">{t("schoolTitleAccent")}</span>
              </h2>
            </div>

            {dbOptimizationTips.map((tip, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-charcoal/20 border border-border p-8 rounded-2xl hover:border-gold/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold-light mb-6">
                    <Icon name="cpu" size={20} />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-3 tracking-wide">{tip.title}</h3>
                  <p className="text-xs text-text-secondary font-light leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Career Advice Block */}
        <div className="theme-on-forest bg-gradient-to-r from-forest-dark to-charcoal border border-border rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="brand-dot-grid absolute inset-0 pointer-events-none" />

          <div className="flex gap-4 items-start mb-6">
            <Icon name="server" size={32} className="text-gold-light shrink-0 mt-1" />
            <div>
              <span className="text-xs uppercase text-gold-light font-semibold tracking-wider">{t("careerOverline")}</span>
              <h2 className="text-xl font-bold text-white tracking-wide">{t("careerTitle")}</h2>
            </div>
          </div>

          <p className="text-zinc-300 font-light leading-relaxed mb-6">
            {t("careerDesc")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-300 font-light">
            <div className="flex gap-2">
              <span className="text-gold-light font-bold">•</span>
              <span>{t.rich("careerBullet1", { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold-light font-bold">•</span>
              <span>{t.rich("careerBullet2", { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold-light font-bold">•</span>
              <span>{t.rich("careerBullet3", { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gold-light font-bold">•</span>
              <span>{t.rich("careerBullet4", { strong: (chunks) => <strong>{chunks}</strong> })}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
