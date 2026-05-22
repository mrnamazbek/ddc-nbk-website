"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TimelineItem {
  year: string;
  title: string;
  text: string;
  svgIcon: React.ReactNode;
}

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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const timelineItems: TimelineItem[] = [
    {
      year: "Миссия",
      title: "Финансовая стабильность",
      text: "Разработка технологических систем, формирующих каркас надежности всей платежной инфраструктуры страны.",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21h18M5 21V10m14 11V10M2 10h20M12 3L2 10h20L12 3z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      year: "Инновации",
      title: "Финтех-лидерство",
      text: "Интеграция передовых решений (блокчейн, смарт-контракты, Big Data) в государственные институты.",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      year: "Стандарты",
      title: "Абсолютная безопасность",
      text: "Соответствие жестким требованиям информационной безопасности Республики Казахстан и мировым стандартам.",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-[#08080a] overflow-hidden border-t border-white/5">
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
            <motion.span variants={textVariants} className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
              о нашей организации
            </motion.span>
            
            <motion.h2 variants={textVariants} className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-8 leading-tight">
              Центр развития цифровых технологий <br />
              <span className="text-gradient-gold font-medium">Национального Банка</span>
            </motion.h2>
            
            <motion.p variants={textVariants} className="text-base text-zinc-400 font-sans font-light leading-relaxed mb-12 text-lg">
              Digital Development Center (DDC) является специализированным технологическим крылом Национального Банка Казахстана. Мы разрабатываем и поддерживаем ключевые государственные финансовые платформы, включая инфраструктуру Цифрового Тенге и межбанковских платежей, обеспечивая интеграцию передовых IT-решений в национальный финансовый сектор.
            </motion.p>

            {/* Таймлайн / Принципы */}
            <div className="space-y-8 relative">
              {/* Золотая линия таймлайна слева */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-brand-blue-light to-transparent opacity-30" />

              {timelineItems.map((item, idx) => {
                return (
                  <motion.div
                    key={idx}
                    variants={textVariants}
                    className="flex gap-6 relative z-10 group animate-hover"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold group-hover:border-gold/50 group-hover:bg-brand-blue/20 transition-all duration-300 shrink-0">
                      {item.svgIcon}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-gold tracking-wider uppercase block mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-sans font-semibold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
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
            
            {/* Передний фон: saka_refractive_glass */}
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden border border-gold/20 shadow-[0_8px_30px_rgba(201,168,76,0.2)] z-20 transition-transform duration-700 hover:scale-[1.03] translate-y-4">
              <Image
                src="/images/saka_refractive_glass.png"
                alt="Жидкое стекло с сакральной геометрией ЦЦР"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Мягкие свечения */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue-mid/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
