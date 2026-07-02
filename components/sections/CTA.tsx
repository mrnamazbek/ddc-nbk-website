"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import PartnerMarquee from "@/components/ui/PartnerMarquee";
import Magnetic from "@/components/motion/Magnetic";
import Icon from "@/components/ui/Icon";
import DDCLogo from "@/components/ui/DDCLogo";

import { useRouter } from "@/i18n/navigation";

export default function CTA() {
  const t = useTranslations("CTA");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Анимация увеличения карточки CTA при прокрутке
      gsap.fromTo(
        cardRef.current,
        { scale: 0.95, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const keywords = [
    "DDC",
    "ЦДО",
    "NATIONAL BANK OF KAZAKHSTAN",
    "КОНТАКТ-ЦЕНТР 1477",
    "ISO 9001",
    "IT-УСЛУГИ",
    "ПОРТАЛ ЗАКУПОК",
    "ИНФОРМАЦИОННАЯ БЕЗОПАСНОСТЬ",
    "ТЕХНОЛОГИЧЕСКИЙ ОПЕРАТОР ДАННЫХ",
    "С 1996 ГОДА",
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden"
    >
      
      {/* Декоративные вращающиеся круги на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-forest-light/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-t border-dashed border-gold-muted/5 animate-[spin_40s_linear_infinite] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 text-center">
        
        {/* Бегущая строка ключевых слов (эффект Magic UI) */}
        <PartnerMarquee 
          items={keywords} 
          speed="slow" 
          className="mb-12" 
        />

        <div
          ref={cardRef}
          className="relative"
        >
          <GlassCard 
            hoverAccent="gold"
            variant="liquid-strong"
            className="border-glass-border p-8 sm:p-16 relative overflow-hidden shadow-card"
          >
            {/* Световой блик внутри панели */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-forest/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Company Logo in Saka style */}
            <div className="flex justify-center mb-6 relative z-10">
              <DDCLogo
                title="DDC"
                className="h-12 w-11 text-foreground transition-transform duration-[2s] hover:rotate-[360deg]"
              />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-6 block relative z-10">
              {t("overline")}
            </span>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight relative z-10">
              {t("titleLine1")} <br className="hidden sm:inline" />
              <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
            </h2>

            <p className="text-sm sm:text-base text-muted font-sans font-normal leading-relaxed max-w-2xl mx-auto mb-10 relative z-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center relative z-10">
              <Magnetic>
                <ShimmerButton
                  variant="gold"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                  onClick={() => {
                    router.push("/contact");
                  }}
                >
                  {t("ctaPrimary")}
                  <Icon name="mail" size={16} />
                </ShimmerButton>
              </Magnetic>
              
              <Magnetic>
                <ShimmerButton
                  variant="forest"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                  onClick={() => {
                    window.location.href = "tel:1477";
                  }}
                >
                  {t("ctaSecondary")}
                  <Icon name="phone" size={16} />
                </ShimmerButton>
              </Magnetic>
            </div>
          </GlassCard>
        </div>

        {/* Вторая бегущая строка, в обратном направлении для красивого визуального баланса */}
        <PartnerMarquee 
          items={[...keywords].reverse()} 
          direction="right"
          speed="slow" 
          className="mt-12" 
        />

      </div>
    </section>
  );
}
