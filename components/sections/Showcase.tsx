"use client";

import { useTranslations } from "next-intl";
import { HeroParallax } from "@/components/ui/hero-parallax";

/**
 * Параллакс-витрина (HeroParallax) с реальными активами DDC:
 * 3D-рендеры (шанырак / бүркіт / тенге), архитектура НБК, стеклянные текстуры,
 * фотографии руководства и событий из extracted-материалов. Заголовок берётся
 * из i18n-неймспейса "Digital" (KZ/RU/EN).
 */

const products = [
  // Ряд 1
  { title: "Архитектура НБК", link: "/about", thumbnail: "/images/nbk_architecture.png" },
  { title: "Saka Core", link: "/digital", thumbnail: "/images/saka_core_render.png" },
  { title: "Liquid Glass", link: "/digital", thumbnail: "/images/backgrounds/liquid_glass_flow.png" },
  { title: "Шанырак", link: "/", thumbnail: "/images/3d/shanyrak-gold.png" },
  { title: "События ЦДО", link: "/news", thumbnail: "/images/showcase/news-1.jpeg" },
  // Ряд 2
  { title: "Степной горизонт", link: "/about", thumbnail: "/images/backgrounds/steppe-horizon-abstract.png" },
  { title: "Refractive Glass", link: "/digital", thumbnail: "/images/saka_refractive_glass.png" },
  { title: "Бүркіт", link: "/", thumbnail: "/images/3d/burkit-eagle-gold.png" },
  { title: "Новости ЦДО", link: "/news", thumbnail: "/images/showcase/news-2.jpeg" },
  { title: "Руководство", link: "/about", thumbnail: "/images/team/Amardinov.jpg" },
  // Ряд 3
  { title: "Цифровой тенге", link: "/digital", thumbnail: "/images/3d/tenge-coin-gold.png" },
  { title: "Glass Card", link: "/digital", thumbnail: "/images/backgrounds/glass-card-bg.png" },
  { title: "Правление", link: "/about", thumbnail: "/images/team/Durmagambetov.jpg" },
  { title: "Команда", link: "/about", thumbnail: "/images/team/Kentbekov.jpg" },
  { title: "Эксперты", link: "/about", thumbnail: "/images/team/Imajanov.jpg" },
];

export default function Showcase() {
  const t = useTranslations("Digital");

  return (
    <HeroParallax
      products={products}
      title={
        <>
          {t("titleLine1")}{" "}
          <span className="text-gradient-forest">{t("titleAccent")}</span>
        </>
      }
      subtitle={t("subtitle")}
    />
  );
}
