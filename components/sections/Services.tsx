"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";

interface ServiceItem {
  number: string;
  key: string;
  hoverAccent: "forest" | "gold";
  svgIcon: React.ReactNode;
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
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M12 7v10M8 9.5h8M8 12.5h8" stroke="currentColor" strokeLinecap="round" />
          <path d="M12 3a9 9 0 0 1 6.364 2.636M5.636 18.364a9 9 0 0 1 0-12.728" stroke="currentColor" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      number: "02",
      key: "s2",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="13" cy="7" r="1" fill="currentColor" />
          <circle cx="11" cy="17" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      number: "03",
      key: "s3",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21h18M5 21V10m14 11V10M2 10h20M12 3L2 10h20L12 3z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="1.5" stroke="currentColor" />
          <path d="M9 14h6" stroke="currentColor" />
        </svg>
      ),
    },
    {
      number: "04",
      key: "s4",
      hoverAccent: "gold",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 11l2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      number: "05",
      key: "s5",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" />
          <path d="M7 8h10M7 12h10M7 16h5" stroke="currentColor" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      number: "06",
      key: "s6",
      hoverAccent: "forest",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3v18h18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7-4.8 4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18.7" cy="8" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-black overflow-hidden border-t border-white/5"
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
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="text-zinc-400 font-sans font-light leading-relaxed max-w-2xl text-lg">
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
                          ? "text-gold group-hover:bg-gold/10 group-hover:scale-110"
                          : "text-forest-light group-hover:bg-forest/10 group-hover:scale-110"
                      }`} data-hover={service.hoverAccent}>
                        {service.svgIcon}
                      </div>
                      
                      <span className="text-sm font-mono font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        {service.number}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-sans font-semibold text-white tracking-wide mb-4 group-hover:text-zinc-100 transition-colors">
                      {t(`${service.key}.title`)}
                    </h3>

                    <p className="text-sm font-sans font-light text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                      {t(`${service.key}.desc`)}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                      {t("status")}
                    </span>
                    <svg viewBox="0 0 24 24" className={`w-4 h-4 stroke-[2] transition-transform duration-300 transform group-hover:translate-x-1 ${
                      service.hoverAccent === "gold" ? "text-gold" : "text-forest-light"
                    }`} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

