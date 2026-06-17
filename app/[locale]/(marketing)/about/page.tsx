"use client";

import { motion } from "framer-motion";
import Icon, { IconName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Timeline from "@/components/sections/Timeline";
import Leadership from "@/components/sections/Leadership";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const router = useRouter();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const values: { icon: IconName; title: string; text: string }[] = [
    {
      icon: "compass",
      title: t("v1Title"),
      text: t("v1Text"),
    },
    {
      icon: "users",
      title: t("v2Title"),
      text: t("v2Text"),
    },
    {
      icon: "shield-check",
      title: t("v3Title"),
      text: t("v3Text"),
    },
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок страницы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-lg text-zinc-300 font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Секция миссии */}
        <div id="mission" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-12 border-b border-white/5">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">{t("missionTitle")}</h2>
            <p className="text-zinc-300 font-light leading-relaxed mb-6">
              {t("missionDesc1")}
            </p>
            <p className="text-zinc-300 font-light leading-relaxed">
              {t("missionDesc2")}
            </p>
          </div>
          <div className="lg:col-span-5 bg-charcoal/40 border border-white/5 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex gap-4 items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold">
                <Icon name="bank" size={24} />
              </div>
              <div>
                <span className="text-xs uppercase text-gold font-medium tracking-wider">{t("founderBadge")}</span>
                <h3 className="text-base font-bold text-white">{t("founderTitle")}</h3>
              </div>
            </div>
            <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
              {t("founderDesc")}
            </p>
            <a
              href="https://nationalbank.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-gold flex items-center gap-1 hover:text-gold-light transition-colors duration-300"
            >
              {t("founderLink")}
              <Icon name="arrow-up-right" size={14} />
            </a>
          </div>
        </div>

        {/* Ценности */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {values.map((val, idx) => {
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-charcoal/20 border border-white/5 p-8 rounded-2xl hover:border-gold/20 transition-colors duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                  <Icon name={val.icon} size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">{val.title}</h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">{val.text}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Секция CTA к карьере */}
        <div className="mt-24 bg-gradient-to-r from-forest-dark to-charcoal border border-forest-mid/30 p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#52B78805_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">{t("ctaTitle")}</h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
              {t("ctaDesc")}
            </p>
          </div>
          <Button variant="gold" size="lg" className="shrink-0 flex items-center gap-2 group" onClick={() => router.push("/careers")}>
            {t("ctaBtn")}
            <Icon name="arrow-up-right" size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

      </div>

      <Timeline />
      <Leadership />
    </div>
  );
}
