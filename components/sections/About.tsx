"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Landmark, Award, Shield } from "lucide-react";

export default function About() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const timelineItems = [
    {
      icon: Landmark,
      year: "Миссия",
      title: "Финансовая стабильность",
      text: "Разработка технологических систем, формирующих каркас надежности всей платежной инфраструктуры страны.",
    },
    {
      icon: Award,
      year: "Инновации",
      title: "Финтех-лидерство",
      text: "Интеграция передовых решений (блокчейн, смарт-контракты, Big Data) в государственные институты.",
    },
    {
      icon: Shield,
      year: "Стандарты",
      title: "Абсолютная безопасность",
      text: "Соответствие жестким требованиям информационной безопасности Республики Казахстан и мировым стандартам.",
    },
  ];

  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Левая сторона: Описание и таймлайн */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <motion.span variants={textVariants} className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
              о нашей организации
            </motion.span>
            
            <motion.h2 variants={textVariants} className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-8 leading-tight">
              Центр развития цифровых технологий <br />
              <span className="text-gradient-gold font-medium">Национального Банка</span>
            </motion.h2>
            
            <motion.p variants={textVariants} className="text-base text-zinc-400 font-sans font-light leading-relaxed mb-12">
              Digital Development Center (DDC) является специализированным технологическим крылом Национального Банка Казахстана. Мы разрабатываем и поддерживаем ключевые государственные финансовые платформы, включая инфраструктуру Цифрового Тенге и межбанковских платежей, обеспечивая интеграцию передовых IT-решений в национальный финансовый сектор.
            </motion.p>

            {/* Таймлайн / Принципы */}
            <div className="space-y-8 relative">
              {/* Золотая линия таймлайна слева */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-forest-light to-transparent opacity-30" />

              {timelineItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={textVariants}
                    className="flex gap-6 relative z-10 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-charcoal border border-white/10 flex items-center justify-center text-gold group-hover:border-gold/50 group-hover:bg-forest/20 transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gold tracking-wider uppercase block mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-sans font-semibold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Правая сторона: Премиум-коллаж с параллаксом */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 relative h-[500px] sm:h-[600px] w-full"
          >
            {/* Задний фон: nbk_architecture */}
            <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/images/nbk_architecture.png"
                alt="Здание Национального Банка РК"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover brightness-95"
              />
            </div>
            
            {/* Передний фон: saka_core_render */}
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden border border-gold/20 shadow-gold shadow-md z-20 transition-transform duration-700 hover:scale-[1.03] translate-y-4">
              <Image
                src="/images/saka_core_render.png"
                alt="Сакский орнамент DDC"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Мягкие свечения */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-forest/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
