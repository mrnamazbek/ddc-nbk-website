"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Icon from "@/components/ui/Icon";
import { useTranslations, useLocale } from "next-intl";

interface NewsArticle {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
  link: string;
}

export default function NewsPage() {
  const t = useTranslations("NewsPage");
  const locale = useLocale();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const allNews: NewsArticle[] = [
    {
      category: t("articles.a1.category"),
      title: t("articles.a1.title"),
      excerpt: t("articles.a1.excerpt"),
      date: t("articles.a1.date"),
      readTime: t("articles.a1.readTime"),
      gradient: "from-[#1A3D2B] via-[#0F251A] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
    },
    {
      category: t("articles.a2.category"),
      title: t("articles.a2.title"),
      excerpt: t("articles.a2.excerpt"),
      date: t("articles.a2.date"),
      readTime: t("articles.a2.readTime"),
      gradient: "from-[#8B7035] via-[#58461F] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
    },
    {
      category: t("articles.a3.category"),
      title: t("articles.a3.title"),
      excerpt: t("articles.a3.excerpt"),
      date: t("articles.a3.date"),
      readTime: t("articles.a3.readTime"),
      gradient: "from-[#2D6A4F] via-[#102A1E] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
    },
    {
      category: t("articles.a4.category"),
      title: t("articles.a4.title"),
      excerpt: t("articles.a4.excerpt"),
      date: t("articles.a4.date"),
      readTime: t("articles.a4.readTime"),
      gradient: "from-[#1A3D2B] via-[#8B7035] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
    },
    {
      category: t("articles.a5.category"),
      title: t("articles.a5.title"),
      excerpt: t("articles.a5.excerpt"),
      date: t("articles.a5.date"),
      readTime: t("articles.a5.readTime"),
      gradient: "from-[#52B788] via-[#1A3D2B] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
    },
    {
      category: t("articles.a6.category"),
      title: t("articles.a6.title"),
      excerpt: t("articles.a6.excerpt"),
      date: t("articles.a6.date"),
      readTime: t("articles.a6.readTime"),
      gradient: "from-[#8B7035] via-[#2D6A4F] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
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
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            {t("subtitle")}
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
              <a href={news.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                <GlassCard className="h-full flex flex-col p-0 border-white/5 hover:border-gold/20 overflow-hidden group">
                  
                  {/* Abstract gradient cover background */}
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
                          <Icon name="calendar" size={14} />
                          {news.date}
                        </div>
                        <span>•</span>
                        <span>{news.readTime} {t("readTimeSuffix")}</span>
                      </div>

                      <h3 className="text-lg font-sans font-bold text-white tracking-wide mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                        {news.title}
                      </h3>
                      
                      <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                        {news.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-gold group-hover:text-gold-light transition-colors duration-300">
                      {t("readMore")}
                      <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </GlassCard>
              </a>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
