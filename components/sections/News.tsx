"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface NewsItem {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
  hoverAccent: "blue" | "gold";
}

export default function News() {
  const newsList: NewsItem[] = [
    {
      category: "Пилотный проект",
      title: "Успешная интеграция Цифрового Тенге в оффлайн-режиме",
      excerpt: "Завершен первый этап тестирования двусторонних оффлайн-платежей на мобильных устройствах и смарт-картах в отдаленных регионах.",
      date: "18 Мая 2026",
      readTime: "5 мин",
      gradient: "from-brand-blue-dark/50 via-charcoal to-[#08080a]",
      hoverAccent: "blue",
    },
    {
      category: "Интеграция",
      title: "Подключение пяти крупнейших банков к платформе Open API",
      excerpt: "Внедрение единых стандартов открытого банкинга позволяет автоматизировать мгновенный межбанковский обмен информацией.",
      date: "04 Мая 2026",
      readTime: "4 мин",
      gradient: "from-gold-dark/40 via-charcoal to-[#08080a]",
      hoverAccent: "gold",
    },
    {
      category: "Релиз",
      title: "Опубликован технический Whitepaper архитектуры CBDC 2.0",
      excerpt: "Новый документ подробно описывает механизмы смарт-контрактов для маркирования целевых государственных субсидий.",
      date: "22 Апреля 2026",
      readTime: "8 мин",
      gradient: "from-[#002d62]/50 via-charcoal to-[#08080a]",
      hoverAccent: "blue",
    },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
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
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="news" className="relative w-full py-24 sm:py-32 bg-[#08080a] overflow-hidden border-t border-white/5">
      {/* Декоративное сияние в стиле DDC Digital Blue и NBK Premium Gold */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Шапка секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={headerVariants}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
              пресс-центр ddc
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
              Последние события <br />
              <span className="text-gradient-gold font-medium">и технологические релизы</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button variant="outline" className="flex items-center gap-2 group cursor-pointer">
              Все публикации
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-current" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          </motion.div>
        </div>

        {/* Сетка карточек */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {newsList.map((news, index) => (
            <motion.div key={index} variants={cardVariants} className="h-full">
              <GlassCard 
                hoverAccent={news.hoverAccent}
                className="h-full flex flex-col p-0 border-white/5 overflow-hidden group"
              >
                
                {/* Abstract gradient cover background in card header */}
                <div className={`w-full h-48 bg-gradient-to-br ${news.gradient} relative overflow-hidden flex items-center justify-center border-b border-white/5`}>
                  {/* Тонкие геометрические паттерны линий для эффекта ценных бумаг/технологий */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                  
                  {/* Вращающаяся золотая сфера на фоне */}
                  <div className="absolute w-32 h-32 rounded-full bg-gold/10 blur-xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                  
                  {/* Категория (Badge) */}
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold bg-white/10 text-gold-light border border-white/10 px-3 py-1 rounded-md backdrop-blur-md">
                    {news.category}
                  </span>
                </div>

                {/* Текстовая область */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Дата и время */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-sans font-light">
                      <div className="flex items-center gap-1.5">
                        <svg 
                          className="w-3.5 h-3.5 stroke-current" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
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

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:text-gold-light transition-colors duration-300 cursor-pointer">
                    Читать полностью
                    <svg 
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 stroke-current" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
