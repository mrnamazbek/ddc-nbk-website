"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import PartnerMarquee from "@/components/ui/PartnerMarquee";

export default function CTA() {
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
    "DIGITAL TENGE",
    "CBDC",
    "BLOCKCHAIN",
    "ZERO TRUST",
    "NATIONAL BANK OF KAZAKHSTAN",
    "DDC FINTECH",
    "BIG DATA",
    "AES-256 CRYPTOGRAPHY",
    "CYBER SECURITY",
    "INSTITUTIONAL GRADE",
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Анимированный фоновый градиент (мягкие переливы в лесно-зеленом стиле DDC) */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-[#0F241A]/40 via-[#08080a] to-[#08080a] opacity-60 pointer-events-none" />
      
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
            className="border-white/5 p-8 sm:p-16 relative overflow-hidden shadow-2xl"
          >
            {/* Световой блик внутри панели */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-forest/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

            <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-6 block relative z-10">
              технологическое партнерство
            </span>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-6 leading-tight relative z-10">
              Создаем технологический <br className="hidden sm:inline" />
              <span className="text-gradient-gold font-medium">суверенитет вместе</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-sans font-light leading-relaxed max-w-2xl mx-auto mb-10 relative z-10">
              Мы открыты к сотрудничеству с финансовыми институтами, финтех-разработчиками и академическими кругами для совместного проектирования будущего платежных экосистем.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center relative z-10">
              <ShimmerButton
                variant="gold"
                className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                onClick={() => {
                  const target = document.getElementById("contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/contact";
                  }
                }}
              >
                Связаться с нами
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
              
              <ShimmerButton
                variant="forest"
                className="w-full sm:w-auto flex items-center justify-center gap-2 group"
                onClick={() => {
                  window.location.href = "/careers";
                }}
              >
                Присоединиться к команде
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-current" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </ShimmerButton>
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

