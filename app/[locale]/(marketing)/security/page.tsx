"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, ShieldAlert, Key, Globe, Eye } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function SecurityPage() {
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

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Zero Trust Architecture",
      description: "Все сервисы и запросы к API проходят обязательную взаимную проверку подлинности (mTLS) и авторизацию на каждом шаге.",
    },
    {
      icon: Lock,
      title: "Стандарты ГОСТ СТ РК",
      description: "Применение государственных стандартов шифрования и хэширования гарантирует защиту от несанкционированного доступа.",
    },
    {
      icon: ShieldAlert,
      title: "Непрерывный пентестинг",
      description: "Ежегодный независимый аудит безопасности и регулярные учения по кибербезопасности для выявления потенциальных уязвимостей.",
    },
    {
      icon: Key,
      title: "Аппаратный слой HSM",
      description: "Криптографические ключи и корневые сертификаты систем хранятся на специализированном оборудовании, исключающем копирование.",
    },
    {
      icon: Globe,
      title: "ISO/IEC 27001",
      description: "Соответствие международным стандартам информационной безопасности и управления операционными рисками.",
    },
    {
      icon: Eye,
      title: "Полный аудит логов",
      description: "Использование систем SIEM для централизованного сбора и анализа событий безопасности в режиме реального времени.",
    },
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
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
            БЕЗОПАСНОСТЬ И КОМПЛАЕНС
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Защита критической <br />
            <span className="text-gradient-gold font-medium">инфраструктуры</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Политика кибербезопасности DDC объединяет государственную строгость с передовыми международными практиками защиты финансовых данных.
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
            const PillarIcon = pillar.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className="h-full">
                <GlassCard className="h-full flex flex-col p-8 border-white/5 hover:border-gold/20">
                  <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6 shrink-0">
                    <PillarIcon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-sans font-semibold text-white tracking-wide mb-3">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Сертификация */}
        <div className="mt-24 bg-charcoal/30 border border-white/5 rounded-3xl p-8 sm:p-12 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
                Соответствие государственным регуляторным требованиям
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Информационные системы DDC проходят обязательную государственную экспертизу на соответствие требованиям информационной безопасности Республики Казахстан. Мы тесно сотрудничаем с Государственной Технической Службой (ГТС КНБ РК) для мониторинга угроз и защиты каналов связи.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center gap-6">
              <div className="border border-gold/30 bg-gold/5 px-6 py-4 rounded-xl text-center">
                <span className="text-xs uppercase text-gold font-semibold tracking-wider block mb-1">класс защиты</span>
                <span className="text-2xl font-bold text-white font-mono">1Г (Высший)</span>
              </div>
              <div className="border border-forest-light/30 bg-forest/5 px-6 py-4 rounded-xl text-center">
                <span className="text-xs uppercase text-forest-light font-semibold tracking-wider block mb-1">Стандарт</span>
                <span className="text-2xl font-bold text-white font-mono">ISO 27001</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
