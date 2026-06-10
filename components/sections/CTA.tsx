"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import PartnerMarquee from "@/components/ui/PartnerMarquee";
import Magnetic from "@/components/motion/Magnetic";

export default function CTA() {
  const t = useTranslations("CTA");
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
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden border-t border-glass-border"
    >
      
      {/* Декоративные вращающиеся круги на фоне */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-forest-light/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-t border-dashed border-gold-muted/5 animate-[spin_40s_linear_infinite] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10 text-center">
        
        {/* Бегущая строка ключевых слов (эффект Magic UI) */}
        <PartnerMarquee 
          items={keywords} 
          speed="slow" 
          className="mb-12 opacity-80" 
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
              <Image
                src="/images/logo/ddc-logo.svg"
                alt="DDC"
                width={48}
                height={48}
                priority
                className="pointer-events-none transition-transform duration-[2s] hover:rotate-[360deg]"
              />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-6 block relative z-10">
              {t("overline")}
            </span>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight relative z-10">
              {t("titleLine1")} <br className="hidden sm:inline" />
              <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
            </h2>

            <p className="text-sm sm:text-base text-muted font-sans font-light leading-relaxed max-w-2xl mx-auto mb-10 relative z-10">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center relative z-10">
              <Magnetic>
                <ShimmerButton
                  variant="gold"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                  onClick={() => {
                    window.location.href = "/contact";
                  }}
                >
                  {t("ctaPrimary")}
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 stroke-current" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
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
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 stroke-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.74a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
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
          className="mt-12 opacity-80" 
        />

      </div>
    </section>
  );
}

