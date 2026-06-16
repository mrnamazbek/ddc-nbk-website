"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import Icon, { IconName } from "@/components/ui/Icon";

interface ServiceItem {
  number: string;
  key: string;
  hoverAccent: "forest" | "gold";
  iconName: IconName;
}

export default function Services() {
  const t = useTranslations("Services");
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  cardsRef.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      // Анимация заголовка при появлении на экране
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Плавное стагерное появление карточек услуг при скролле
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const services: ServiceItem[] = [
    {
      number: "01",
      key: "s1",
      hoverAccent: "gold",
      iconName: "contact-center",
    },
    {
      number: "02",
      key: "s2",
      hoverAccent: "forest",
      iconName: "procurement",
    },
    {
      number: "03",
      key: "s3",
      hoverAccent: "forest",
      iconName: "database",
    },
    {
      number: "04",
      key: "s4",
      hoverAccent: "gold",
      iconName: "it-services",
    },
    {
      number: "05",
      key: "s5",
      hoverAccent: "forest",
      iconName: "development",
    },
    {
      number: "06",
      key: "s6",
      hoverAccent: "forest",
      iconName: "shield",
    },
  ];

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden border-t border-glass-border"
    >

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-left max-w-4xl mb-20"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-muted font-sans font-normal leading-relaxed max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <div 
                key={index} 
                ref={addToRefs} 
                className="h-full group"
              >
                <GlassCard 
                  hoverAccent={service.hoverAccent}
                  className="h-full flex flex-col p-8 justify-between relative"
                >
                  <div>
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-12 h-12 rounded-xl liquid-glass flex items-center justify-center transition-all duration-300 ${
                        service.hoverAccent === "gold"
                          ? "text-gold group-hover:bg-gold/10"
                          : "text-forest-light group-hover:bg-forest/10"
                      }`} data-hover={service.hoverAccent}>
                        <Icon name={service.iconName} size={24} />
                      </div>
                      
                      <span className="text-sm font-mono font-bold text-zinc-600 group-hover:text-muted transition-colors">
                        {service.number}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-sans font-semibold text-foreground tracking-wide mb-4 group-hover:text-zinc-100 transition-colors">
                      {t(`${service.key}.title`)}
                    </h3>

                    <p className="text-sm font-sans font-normal text-muted leading-relaxed group-hover:text-muted transition-colors">
                      {t(`${service.key}.desc`)}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="mt-8 pt-6 border-t border-glass-border flex items-center justify-between opacity-60 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                      {t("status")}
                    </span>
                    <Icon name="arrow-right" size={16} className={service.hoverAccent === "gold" ? "text-gold" : "text-forest-light"} />
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}

