"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Coins, Zap, ShieldCheck, Share2, BarChart3, Landmark } from "lucide-react";

interface ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export default function Services() {
  const services: ServiceItem[] = [
    {
      icon: Coins,
      title: "Цифровой Тенге",
      description: "Разработка, интеграция и развитие платформы национальной цифровой валюты (CBDC) Республики Казахстан.",
    },
    {
      icon: Zap,
      title: "Мгновенные платежи",
      description: "Обеспечение бесперебойной работы национальной системы мгновенных межбанковских платежей 24/7/365.",
    },
    {
      icon: Landmark,
      title: "Межбанковский клиринг",
      description: "Высокотехнологичные системы клиринга и расчетов, гарантирующие стабильность финансового сектора.",
    },
    {
      icon: ShieldCheck,
      title: "Инфраструктурная безопасность",
      description: "Защита критических узлов финансовой сети с использованием передовых отечественных алгоритмов шифрования.",
    },
    {
      icon: Share2,
      title: "Открытый банкинг (Open API)",
      description: "Разработка единых стандартов технологического взаимодействия для финтех-компаний и банков второго уровня.",
    },
    {
      icon: BarChart3,
      title: "Аналитика Big Data",
      description: "Анализ макроэкономических финансовых потоков и разработка систем прогнозного моделирования рынка.",
    },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="services" className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      {/* Декоративный бэкграунд */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок секции */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
            направления деятельности
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6">
            Национальные финансовые <br />
            <span className="text-gradient-gold font-medium">технологии и решения</span>
          </h2>
          <p className="text-zinc-400 font-sans font-light leading-relaxed">
            DDC создает цифровую основу для следующего поколения финансовых сервисов Казахстана, сочетая государственную надежность с инновациями мирового уровня.
          </p>
        </motion.div>

        {/* Сетка услуг */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div key={index} variants={cardVariants} className="h-full">
                <GlassCard className="h-full flex flex-col p-8 border-white/5 hover:border-gold/20">
                  <div className="w-12 h-12 rounded-lg bg-forest/30 border border-forest-light/20 flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-sans font-semibold text-white tracking-wide mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
        
      </div>
    </section>
  );
}
