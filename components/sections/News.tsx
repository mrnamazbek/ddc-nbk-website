"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

interface NewsItem {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
  hoverAccent: "forest" | "gold";
}

export default function News() {
  const t = useTranslations("NewsPage");
  const router = useRouter();

  const newsList: NewsItem[] = [
    {
      category: t("articles.a7.category"),
      title: t("articles.a7.title"),
      excerpt: t("articles.a7.excerpt"),
      date: t("articles.a7.date"),
      readTime: t("articles.a7.readTime"),
      gradient: "from-[#8B7035]/30 via-charcoal to-[#08080a]",
      hoverAccent: "gold",
    },
    {
      category: t("articles.a1.category"),
      title: t("articles.a1.title"),
      excerpt: t("articles.a1.excerpt"),
      date: t("articles.a1.date"),
      readTime: t("articles.a1.readTime"),
      gradient: "from-forest-dark/50 via-charcoal to-[#08080a]",
      hoverAccent: "forest",
    },
    {
      category: t("articles.a2.category"),
      title: t("articles.a2.title"),
      excerpt: t("articles.a2.excerpt"),
      date: t("articles.a2.date"),
      readTime: t("articles.a2.readTime"),
      gradient: "from-gold-dark/40 via-charcoal to-[#08080a]",
      hoverAccent: "gold",
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
    <section id="news" className="relative w-full py-24 sm:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={headerVariants}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4 block">
              {t("overline")}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-tight text-left">
              {t("titleLine1")} <br />
              <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              onClick={() => router.push("/news")}
              className="flex items-center gap-2 group cursor-pointer"
            >
              {t("viewAll")}
              <Icon name="arrow-right" size={16} />
            </Button>
          </motion.div>
        </div>

        {/* Card grid */}
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
                className="h-full flex flex-col p-0 border-glass-border overflow-hidden group"
              >
                
                {/* Abstract gradient cover background in card header */}
                <div className={`w-full h-48 bg-gradient-to-br ${news.gradient} relative overflow-hidden flex items-center justify-center border-b border-glass-border`}>
                  {/* Тонкие геометрические паттерны линий для эффекта ценных бумаг/технологий */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                  
                  {/* Вращающаяся золотая сфера на фоне */}
                  <div className="absolute w-32 h-32 rounded-full bg-gold/10 blur-xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                  
                  {/* Категория (Badge) */}
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold liquid-glass text-gold-light px-3 py-1 rounded-md">
                    {news.category}
                  </span>
                </div>

                {/* Текстовая область */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Дата и время */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-sans font-light">
                      <div className="flex items-center gap-1.5">
                        <Icon name="calendar" size={14} />
                        {news.date}
                      </div>
                      <span>•</span>
                      <span>{news.readTime} {t("readTimeSuffix")}</span>
                    </div>

                    <h3 className="text-lg font-sans font-bold text-foreground tracking-wide mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                      {news.title}
                    </h3>
                    
                    <p className="text-sm font-sans font-light text-muted leading-relaxed line-clamp-3 mb-6">
                      {news.excerpt}
                    </p>
                  </div>

                  <div 
                    onClick={() => router.push("/news")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:text-gold-light transition-colors duration-300 cursor-pointer"
                  >
                    {t("readMore")}
                    <Icon name="arrow-right" size={14} />
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
