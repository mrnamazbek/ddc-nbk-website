"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import GlassCard from "@/components/ui/GlassCard";
import TextReveal from "@/components/ui/TextReveal";

interface SecurityFeature {
  title: string;
  description: string;
  tag: string;
  hoverAccent: "gold" | "blue";
  svgIcon: React.ReactNode;
}

export default function Security() {
  const containerRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  itemsRef.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      // Анимация левой интерактивной консоли при скролле
      gsap.fromTo(
        consoleRef.current,
        { scale: 0.93, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: consoleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Анимация заголовка
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Плавное появление фичей безопасности по очереди при скролле
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const securityFeatures: SecurityFeature[] = [
    {
      title: "Государственная Криптография",
      description: "Интеграция национальных стандартов шифрования СТ РК и алгоритмов ГОСТ 34.311 для защиты транзакций.",
      tag: "СТ РК / ГОСТ",
      hoverAccent: "gold",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: "Круглосуточный CSOC",
      description: "Мониторинг угроз и оперативное реагирование на инциденты безопасности в режиме 24/7/365 на государственном уровне.",
      tag: "Zero Trust",
      hoverAccent: "blue",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" />
          <path d="M2 12h20M12 2v20" stroke="currentColor" strokeDasharray="2 2" />
        </svg>
      ),
    },
    {
      title: "Аппаратная Защита HSM",
      description: "Изолированное выполнение криптографических операций в защищенных аппаратных модулях высшего класса защиты.",
      tag: "HSM PCI-DSS",
      hoverAccent: "gold",
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" />
          <path d="M6 12h4m4 0h4M6 15h2m8 0h2" stroke="currentColor" strokeLinecap="round" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section 
      id="security" 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Текстурная сетка и свечения */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-blue-mid/5 rounded-full blur-[160px] pointer-events-none transform -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[140px] pointer-events-none transform -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Левая сторона: Футуристическая панель мониторинга безопасности */}
          <div className="lg:col-span-5 flex justify-center relative order-last lg:order-first">
            <div
              ref={consoleRef}
              className="w-full max-w-[400px] aspect-[4/5] relative"
            >
              <GlassCard
                hoverAccent="blue"
                className="w-full h-full relative flex flex-col justify-between p-6 overflow-hidden group"
              >
                {/* Диагональные линии сканирования */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-blue-light/[0.02] via-transparent to-brand-blue-light/[0.02] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-blue-light/30 to-transparent animate-[scan_6s_linear_infinite]" />
                
                {/* Шапка консоли мониторинга */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-light opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue-light"></span>
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                      ddc csoc // live status
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue-light/20 text-[9px] font-mono text-brand-blue-light uppercase tracking-wider">
                    level 5 secured
                  </div>
                </div>

                {/* Геометрический Сакский Щит Защиты */}
                <div className="my-8 flex justify-center items-center relative h-48">
                  {/* Крутящиеся цифровые кольца */}
                  <div className="absolute w-44 h-44 border border-brand-blue-light/10 rounded-full flex items-center justify-center animate-spin-slow" />
                  <div className="absolute w-36 h-36 border border-dashed border-gold/15 rounded-full animate-spin-slow [animation-direction:reverse] [animation-duration:12s]" />
                  
                  {/* 3D Сакский щит с золотой оправой */}
                  <svg
                    width="110"
                    height="130"
                    viewBox="0 0 110 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter drop-shadow-[0_15px_30px_rgba(0,92,187,0.25)] relative z-10 transition-transform duration-500 group-hover:scale-105"
                  >
                    <path
                      d="M55 0L10 17v41c0 34 23 59 45 72 22-13 45-38 45-72V17L55 0Z"
                      fill="url(#shieldGradDark)"
                      stroke="url(#shieldBorderGold)"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M55 14L21 27v31c0 25 17 44 34 54 17-10 34-29 34-54V27L55 14Z"
                      stroke="url(#shieldInnerStrokeBlue)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <defs>
                      <linearGradient id="shieldGradDark" x1="0" y1="0" x2="110" y2="130" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#0b132b" />
                        <stop offset="100%" stopColor="#02040a" />
                      </linearGradient>
                      <linearGradient id="shieldBorderGold" x1="0" y1="0" x2="110" y2="130" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#E8C87A" />
                        <stop offset="50%" stopColor="#C9A84C" />
                        <stop offset="100%" stopColor="#8B7035" />
                      </linearGradient>
                      <linearGradient id="shieldInnerStrokeBlue" x1="0" y1="0" x2="110" y2="130" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#005cbb" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Иконка замка в центре щита */}
                  <div className="absolute z-20 text-gold flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-[1.5] animate-pulse" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" />
                    </svg>
                  </div>
                </div>

                {/* Метрики безопасности на панели */}
                <div className="space-y-3.5 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">THREAT MITIGATION RATE</span>
                    <span className="text-brand-blue-light font-bold">99.9997%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[99.9997%] bg-brand-blue-light rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>ACTIVE AES-256 TUNNELS</span>
                    <span className="text-gold font-bold">14,802 / SEC</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Правая сторона: Контент */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div ref={headerRef}>
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
                SECURITY & COMPLIANCE
              </span>
              
              <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6 leading-tight">
                Институциональный класс <br />
                <span className="text-gradient-gold font-medium">защиты данных</span>
              </h2>
            </div>
            
            <TextReveal 
              text="Архитектура систем ЦЦР и Национального Банка РК строится на концепции «нулевого доверия» (Zero Trust). Все транзакции, межсистемные шлюзы и криптографические протоколы соответствуют государственным и международным регламентам информационной безопасности высшего уровня надежности." 
              className="mb-8"
            />

            {/* Карточки фичей безопасности */}
            <div className="space-y-4">
              {securityFeatures.map((feat, idx) => {
                return (
                  <div 
                    key={idx} 
                    ref={addToRefs}
                  >
                    <GlassCard
                      hoverAccent={feat.hoverAccent}
                      className="p-5 flex items-center justify-between border-white/5"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                          feat.hoverAccent === "gold"
                            ? "bg-gold/10 border border-gold/20 text-gold"
                            : "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-light"
                        }`}>
                          {feat.svgIcon}
                        </div>
                        <div>
                          <h4 className="text-base font-sans font-semibold text-white mb-1">
                            {feat.title}
                          </h4>
                          <p className="text-xs font-sans font-light text-zinc-400 leading-relaxed max-w-xl">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                      
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                        {feat.tag}
                      </span>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


