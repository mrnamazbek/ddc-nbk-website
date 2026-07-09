"use client";

import { useTranslations } from "next-intl";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { BubbleText } from "@/components/ui/BubbleText";

/**
 * Параллакс-витрина (HeroParallax) — тематические плитки технологий/финтеха/ИИ
 * (иконки Icons8, монохромные, тонированные под бренд DDC) вместо фотографий
 * команды и мероприятий. Заголовок берётся из i18n-неймспейса "Digital" (KZ/RU/EN).
 */

const products = [
  // Ряд 1
  { title: "ИИ и аналитика", link: "/analytics", icon: "/images/showcase/icons/ai-neural-network-animated.gif" },
  { title: "Облачная инфраструктура", link: "/digital", icon: "/images/showcase/icons/cloud-computing.png" },
  { title: "Кибербезопасность", link: "/security", icon: "/images/showcase/icons/cybersecurity-shield.png" },
  { title: "Блокчейн", link: "/digital", icon: "/images/showcase/icons/blockchain.png" },
  { title: "Финансовая аналитика", link: "/analytics", icon: "/images/showcase/icons/bar-chart-animated.gif" },
  // Ряд 2
  { title: "Дата-центр", link: "/analytics", icon: "/images/showcase/icons/server.png" },
  { title: "API-интеграции", link: "/services", icon: "/images/showcase/icons/api-integration.png" },
  { title: "Автоматизация", link: "/services", icon: "/images/showcase/icons/automation.png" },
  { title: "Мобильные платежи", link: "/digital", icon: "/images/showcase/icons/mobile-payment.png" },
  { title: "Цифровая валюта", link: "/digital", icon: "/images/showcase/icons/digital-currency.png" },
  // Ряд 3
  { title: "Цифровая инфраструктура", link: "/about", icon: "/images/showcase/icons/globe-animated.gif" },
  { title: "Разработка ПО", link: "/services", icon: "/images/showcase/icons/development.png" },
];

export default function Showcase() {
  const t = useTranslations("Digital");

  return (
    <HeroParallax
      products={products}
      title={
        <>
          <BubbleText text={t("titleLine1")} />{" "}
          <span className="text-gradient-forest"><BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" /></span>
        </>
      }
      subtitle=<BubbleText text={t("subtitle")} />
    />
  );
}
