"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Key } from "lucide-react";

export default function Security() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const securityFeatures = [
    {
      icon: Lock,
      title: "Государственная криптография",
      description: "Применение сертифицированных криптографических стандартов СТ РК и алгоритмов шифрования национального уровня.",
    },
    {
      icon: Eye,
      title: "Непрерывный мониторинг (SOC)",
      description: "Собственный круглосуточный центр оперативного управления информационной безопасностью и обнаружения угроз.",
    },
    {
      icon: Key,
      title: "Аппаратная защита HSM",
      description: "Хранение и управление секретными ключами транзакций осуществляется исключительно на изолированных аппаратных модулях безопасности.",
    },
  ];

  return (
    <section id="security" className="relative w-full py-24 sm:py-32 bg-[#F5F5F0] overflow-hidden">
      {/* Легкие геометрические паттерны на фоне для премиум текстуры */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A3D2B0e_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Левая сторона: Анимированный щит (Сакский мотив защиты + кибербезопасность) */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Декоративные круги свечения позади щита */}
            <div className="absolute w-72 h-72 bg-forest/5 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center"
            >
              {/* Крутящиеся кольца тонких технологических линий */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute inset-0 border border-forest/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute inset-4 border border-dashed border-gold-muted/20 rounded-full"
              />
              
              {/* Центральный геральд-щит (SVG со сложным градиентом) */}
              <svg
                width="160"
                height="190"
                viewBox="0 0 160 190"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_10px_20px_rgba(26,61,43,0.15)] relative z-10"
              >
                <path
                  d="M80 0L10 25V85C10 135 45 172 80 190C115 172 150 135 150 85V25L80 0Z"
                  fill="url(#shieldGrad)"
                  stroke="url(#shieldStroke)"
                  strokeWidth="3"
                />
                <path
                  d="M80 20L25 40V85C25 125 52 157 80 170C108 157 135 125 135 85V40L80 20Z"
                  stroke="url(#shieldInnerStroke)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <defs>
                  <linearGradient id="shieldGrad" x1="0" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1A3D2B" />
                    <stop offset="100%" stopColor="#0F251A" />
                  </linearGradient>
                  <linearGradient id="shieldStroke" x1="0" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E8C87A" />
                    <stop offset="50%" stopColor="#C9A84C" />
                    <stop offset="100%" stopColor="#8B7035" />
                  </linearGradient>
                  <linearGradient id="shieldInnerStroke" x1="0" y1="0" x2="160" y2="190" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#52B788" />
                    <stop offset="100%" stopColor="#1A3D2B" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Иконка замка внутри */}
              <div className="absolute z-20 text-gold flex items-center justify-center">
                <ShieldCheck className="w-16 h-16 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Правая сторона: Текстовый блок и фичи */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7"
          >
            <motion.span variants={itemVariants} className="text-xs uppercase tracking-[0.25em] text-forest-mid font-semibold mb-4 block">
              безопасность и соответствие
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-forest mb-8 leading-tight">
              Институциональный класс <br />
              <span className="text-gradient-green font-medium">защиты данных</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-base text-zinc-600 font-sans font-light leading-relaxed mb-12">
              Архитектура систем DDC строится на принципах «нулевого доверия» (Zero Trust). Все транзакции, государственные информационные каналы и модули шифрования проходят многоуровневую государственную и международную сертификацию на соответствие высшим стандартам безопасности финансовых данных.
            </motion.p>

            {/* Сетка фичей безопасности */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityFeatures.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex flex-col bg-white border border-forest/5 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(26,61,43,0.06)]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-forest/5 flex items-center justify-center text-forest-mid mb-4">
                      <FeatIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-sans font-semibold text-forest mb-2">
                      {feat.title}
                    </h4>
                    <p className="text-xs font-sans font-light text-zinc-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
