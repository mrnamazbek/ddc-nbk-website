"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsArticle {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
}

export default function NewsPage() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const allNews: NewsArticle[] = [
    {
      category: "Пилотный проект",
      title: "Успешная интеграция Цифрового Тенге в оффлайн-режиме",
      excerpt: "Завершен первый этап тестирования двусторонних оффлайн-платежей на мобильных устройствах и смарт-картах в отдаленных регионах.",
      date: "18 Мая 2026",
      readTime: "5 мин",
      gradient: "from-[#1A3D2B] via-[#0F251A] to-[#0A0A0A]",
    },
    {
      category: "Интеграция",
      title: "Подключение пяти крупнейших банков к платформе Open API",
      excerpt: "Внедрение единых стандартов открытого банкинга позволяет автоматизировать мгновенный межбанковский обмен информацией.",
      date: "04 Мая 2026",
      readTime: "4 мин",
      gradient: "from-[#8B7035] via-[#58461F] to-[#0A0A0A]",
    },
    {
      category: "Релиз",
      title: "Опубликован технический Whitepaper архитектуры CBDC 2.0",
      excerpt: "Новый документ подробно описывает механизмы смарт-контрактов для маркирования целевых государственных субсидий.",
      date: "22 Апреля 2026",
      readTime: "8 мин",
      gradient: "from-[#2D6A4F] via-[#102A1E] to-[#0A0A0A]",
    },
    {
      category: "События",
      title: "DDC принял участие в Fintech Forum Kazakhstan 2026",
      excerpt: "Руководители Центра представили промежуточные результаты интеграции цифрового тенге в сектор розничных платежей.",
      date: "15 Апреля 2026",
      readTime: "3 мин",
      gradient: "from-[#1A3D2B] via-[#8B7035] to-[#0A0A0A]",
    },
    {
      category: "Образование",
      title: "Запуск стажировок для Junior Database инженеров и аналитиков",
      excerpt: "Совместно с Национальным Банком открыт набор на оплачиваемую годовую стажировку в лабораторию кибербезопасности DDC.",
      date: "02 Апреля 2026",
      readTime: "6 мин",
      gradient: "from-[#52B788] via-[#1A3D2B] to-[#0A0A0A]",
    },
    {
      category: "Технологии",
      title: "Модернизация ядра Instant Payments: переход на кластеры Redis",
      excerpt: "Обновление архитектуры кеширования позволило сократить время подтверждения транзакций до 1.2 секунды под пиковой нагрузкой.",
      date: "20 Марта 2026",
      readTime: "7 мин",
      gradient: "from-[#8B7035] via-[#2D6A4F] to-[#0A0A0A]",
    },
  ];

  return (
    <div className="relative w-full bg-[#0A0A0A] overflow-hidden min-h-screen pt-32 pb-24 font-sans">
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
            ПРЕСС-ЦЕНТР DDC
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            События, релизы <br />
            <span className="text-gradient-gold font-medium">и публикации</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Будьте в курсе последних обновлений, новостей архитектуры Цифрового Тенге и научно-технических отчетов нашей лаборатории.
          </p>
        </motion.div>

        {/* Сетка публикаций */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {allNews.map((news, index) => (
            <motion.div key={index} variants={cardVariants} className="h-full">
              <GlassCard className="h-full flex flex-col p-0 border-white/5 hover:border-gold/20 overflow-hidden group">
                
                {/* Абстрактное градиентное изображение-подложка */}
                <div className={`w-full h-48 bg-gradient-to-br ${news.gradient} relative overflow-hidden flex items-center justify-center border-b border-white/5`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                  <div className="absolute w-32 h-32 rounded-full bg-gold/10 blur-xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                  
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold bg-white/10 text-gold-light border border-white/10 px-3 py-1 rounded-md backdrop-blur-md">
                    {news.category}
                  </span>
                </div>

                {/* Контент */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-sans font-light">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {news.date}
                      </div>
                      <span>•</span>
                      <span>{news.readTime} чтения</span>
                    </div>

                    <h3 className="text-lg font-sans font-bold text-white tracking-wide mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                      {news.title}
                    </h3>
                    
                    <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                      {news.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-gold group-hover:text-gold-light transition-colors duration-300">
                    Читать полностью
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
