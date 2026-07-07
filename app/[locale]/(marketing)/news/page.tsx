"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ImagesScrollingAnimation } from "@/components/ui/images-scrolling-animation";
import { BubbleText } from "@/components/ui/BubbleText";

interface NewsArticle {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
  link: string;
  image?: string;
}

export default function NewsPage() {
  const t = useTranslations("NewsPage");
  const locale = useLocale();

  const allNews: NewsArticle[] = [
    {
      category: t("articles.a7.category"),
      title: t("articles.a7.title"),
      excerpt: t("articles.a7.excerpt"),
      date: t("articles.a7.date"),
      readTime: t("articles.a7.readTime"),
      gradient: "from-[#8B7035]/30 via-[#0F251A] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_15_data_factory.jpg",
    },
    {
      category: t("articles.a1.category"),
      title: t("articles.a1.title"),
      excerpt: t("articles.a1.excerpt"),
      date: t("articles.a1.date"),
      readTime: t("articles.a1.readTime"),
      gradient: "from-[#1A3D2B] via-[#0F251A] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_16_key_projects.jpg",
    },
    {
      category: t("articles.a2.category"),
      title: t("articles.a2.title"),
      excerpt: t("articles.a2.excerpt"),
      date: t("articles.a2.date"),
      readTime: t("articles.a2.readTime"),
      gradient: "from-[#8B7035] via-[#58461F] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_1_digital_services.jpg",
    },
    {
      category: t("articles.a3.category"),
      title: t("articles.a3.title"),
      excerpt: t("articles.a3.excerpt"),
      date: t("articles.a3.date"),
      readTime: t("articles.a3.readTime"),
      gradient: "from-[#2D6A4F] via-[#102A1E] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_9_it_architecture.jpg",
    },
    {
      category: t("articles.a4.category"),
      title: t("articles.a4.title"),
      excerpt: t("articles.a4.excerpt"),
      date: t("articles.a4.date"),
      readTime: t("articles.a4.readTime"),
      gradient: "from-[#1A3D2B] via-[#8B7035] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_10_binur_meeting.jpg",
    },
    {
      category: t("articles.a5.category"),
      title: t("articles.a5.title"),
      excerpt: t("articles.a5.excerpt"),
      date: t("articles.a5.date"),
      readTime: t("articles.a5.readTime"),
      gradient: "from-[#52B788] via-[#1A3D2B] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_11_llm_learning.jpg",
    },
    {
      category: t("articles.a6.category"),
      title: t("articles.a6.title"),
      excerpt: t("articles.a6.excerpt"),
      date: t("articles.a6.date"),
      readTime: t("articles.a6.readTime"),
      gradient: "from-[#8B7035] via-[#2D6A4F] to-[#000000]",
      link: `https://nationalbank.kz/${locale === "kz" ? "kz" : locale === "en" ? "en" : "ru"}/news`,
      image: "/images/linkedin/post_13_kfgd_automation.jpg",
    },
  ];

  return (
    <div className="relative w-full bg-transparent min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Заголовок */}
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
            <BubbleText text={t("titleLine1")} /> <br />
            <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
          </h1>
          <p className="text-lg text-zinc-300 font-light leading-relaxed">
            <BubbleText text={t("subtitle")} />
          </p>
        </motion.div>

        {/* Анимация скроллинга публикаций */}
        <ImagesScrollingAnimation
          articles={allNews}
          readTimeSuffix={t("readTimeSuffix")}
          readMoreText={t("readMore")}
        />

      </div>
    </div>
  );
}
