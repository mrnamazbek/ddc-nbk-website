"use client";

import { useTranslations } from "next-intl";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { BubbleText } from "@/components/ui/BubbleText";

/**
 * Параллакс-витрина (HeroParallax) — тематические плитки технологий/финтеха/ИИ
 * (иконки Icons8, монохромные, тонированные под бренд DDC) вместо фотографий
 * команды и мероприятий. Заголовок берётся из i18n-неймспейса "Digital" (KZ/RU/EN),
 * подписи плиток — из неймспейса "Showcase".
 */

const productDefs = [
  // Ряд 1
  { key: "aiAnalytics", link: "/analytics", icon: "/images/showcase/icons/ai-neural-network-animated.gif" },
  { key: "cloudInfra", link: "/digital", icon: "/images/showcase/icons/cloud-computing.png" },
  { key: "cybersecurity", link: "/security", icon: "/images/showcase/icons/cybersecurity-shield.png" },
  { key: "blockchain", link: "/digital", icon: "/images/showcase/icons/blockchain.png" },
  { key: "financialAnalytics", link: "/analytics", icon: "/images/showcase/icons/bar-chart-animated.gif" },
  // Ряд 2
  { key: "dataCenter", link: "/analytics", icon: "/images/showcase/icons/server.png" },
  { key: "apiIntegrations", link: "/services", icon: "/images/showcase/icons/api-integration.png" },
  { key: "automation", link: "/services", icon: "/images/showcase/icons/automation.png" },
  { key: "mobilePayments", link: "/digital", icon: "/images/showcase/icons/mobile-payment.png" },
  { key: "digitalCurrency", link: "/digital", icon: "/images/showcase/icons/digital-currency.png" },
  // Ряд 3
  { key: "digitalInfra", link: "/about", icon: "/images/showcase/icons/globe-animated.gif" },
  { key: "softwareDev", link: "/services", icon: "/images/showcase/icons/development.png" },
] as const;

export default function Showcase() {
  const t = useTranslations("Digital");
  const tShowcase = useTranslations("Showcase");

  const products = productDefs.map(({ key, link, icon }) => ({
    title: tShowcase(key),
    link,
    icon,
  }));

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
