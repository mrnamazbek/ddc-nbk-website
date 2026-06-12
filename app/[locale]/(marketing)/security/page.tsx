"use client";

import { motion } from "framer-motion";
import Icon, { IconName } from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { useTranslations } from "next-intl";

export default function SecurityPage() {
  const t = useTranslations("SecurityPage");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const pillars: { icon: IconName; title: string; description: string }[] = [
    {
      icon: "shield-check",
      title: t("p1Title"),
      description: t("p1Desc"),
    },
    {
      icon: "lock",
      title: t("p2Title"),
      description: t("p2Desc"),
    },
    {
      icon: "alert",
      title: t("p3Title"),
      description: t("p3Desc"),
    },
    {
      icon: "key",
      title: t("p4Title"),
      description: t("p4Desc"),
    },
    {
      icon: "globe",
      title: t("p5Title"),
      description: t("p5Desc"),
    },
    {
      icon: "eye",
      title: t("p6Title"),
      description: t("p6Desc"),
    },
  ];

  return (
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      {/* Мягкие свечения */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-lg text-text-secondary font-light leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Столпы кибербезопасности */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pillars.map((pillar, idx) => {
            return (
              <motion.div key={idx} variants={itemVariants} className="h-full">
                <GlassCard className="h-full flex flex-col p-8 border-border hover:border-gold/20">
                  <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6 shrink-0">
                    <Icon name={pillar.icon} size={24} />
                  </div>
                  
                  <h3 className="text-lg font-sans font-semibold text-foreground tracking-wide mb-3">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm font-sans font-light text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Сертификация */}
        <div className="mt-24 bg-charcoal/30 border border-border rounded-3xl p-8 sm:p-12 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-wide">
                {t("certTitle")}
              </h3>
              <p className="text-sm text-text-secondary font-light leading-relaxed">
                {t("certDesc")}
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center gap-6">
              <div className="border border-gold/30 bg-gold/5 px-6 py-4 rounded-xl text-center">
                <span className="text-xs uppercase text-gold font-semibold tracking-wider block mb-1">{t("certClassLabel")}</span>
                <span className="text-2xl font-bold text-foreground font-mono">{t("certClassValue")}</span>
              </div>
              <div className="border border-forest-light/30 bg-forest/5 px-6 py-4 rounded-xl text-center">
                <span className="text-xs uppercase text-forest-light font-semibold tracking-wider block mb-1">{t("certStandardLabel")}</span>
                <span className="text-2xl font-bold text-foreground font-mono">{t("certStandardValue")}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
