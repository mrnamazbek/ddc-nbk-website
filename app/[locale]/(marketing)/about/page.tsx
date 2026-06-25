"use client";

import { motion } from "framer-motion";
import Icon, { IconName } from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Timeline from "@/components/sections/Timeline";
import Leadership from "@/components/sections/Leadership";
import DDCEventGallery from "@/components/sections/DDCEventGallery";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";

const BaseModelViewer = dynamic(() => import("@/components/three/scene/BaseModelViewer"), { ssr: false });


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
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-32 pb-24 font-sans">
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
        <div id="mission" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 pb-12">
          <div className="lg:col-span-6">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">{t("missionTitle")}</h2>
            <p className="text-zinc-300 font-light leading-relaxed mb-6">
              {t("missionDesc1")}
            </p>
            <p className="text-zinc-300 font-light leading-relaxed">
              {t("missionDesc2")}
            </p>
          </div>
          <div className="lg:col-span-6 min-h-[380px] relative overflow-hidden flex items-center justify-center">
            <BaseModelViewer />
          </div>
        </div>

        {/* Секция учредителя (Национальный Банк) */}
        <GlassCard 
          hoverAccent="gold" 
          variant="liquid-strong" 
          className="w-full p-8 sm:p-12 border-glass-border relative overflow-hidden text-left mb-24"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold">
                  <Icon name="bank" size={24} />
                </div>
                <div>
                  <span className="text-xs uppercase text-gold font-medium tracking-wider">{t("founderBadge")}</span>
                  <h3 className="text-xl font-bold text-white">{t("founderTitle")}</h3>
                </div>
              </div>
              <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-3xl">
                {t("founderDesc")}
              </p>
            </div>
            <a
              href="https://nationalbank.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold flex items-center gap-1 hover:text-gold-light transition-colors duration-300 shrink-0 relative z-10"
            >
              {t("founderLink")}
              <Icon name="arrow-up-right" size={16} />
            </a>
          </div>
        </GlassCard>

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
              <motion.div key={idx} variants={itemVariants}>
                <GlassCard
                  hoverAccent="gold"
                  variant="liquid"
                  className="p-8 h-full text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
                    <Icon name={val.icon} size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-wide">{val.title}</h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">{val.text}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Секция CTA к карьере */}
        <GlassCard
          hoverAccent="forest"
          variant="liquid-strong"
          className="mt-24 p-8 sm:p-12 border-forest-mid/30 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden text-left"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#52B78805_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">{t("ctaTitle")}</h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
              {t("ctaDesc")}
            </p>
          </div>
          <Button variant="gold" size="lg" className="shrink-0 flex items-center gap-2 group relative z-10" onClick={() => router.push("/careers")}>
            {t("ctaBtn")}
            <Icon name="arrow-up-right" size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </GlassCard>

      </div>

      <DDCEventGallery />
      <Timeline />
      <Leadership />
    </div>
  );
}
