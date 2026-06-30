"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import { useTheme } from "next-themes";
import TextReveal from "@/components/ui/TextReveal";
import Icon, { IconName } from "@/components/ui/Icon";

interface ValueItem {
  key: string;
  iconName: IconName;
}

export default function About({ id = "about" }: { id?: string | null }) {
  const t = useTranslations("About");
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "light"
    ? "/images/logo/ddc_logo_light_theme.png"
    : "/images/logo/ddc_logo_for_dark_theme.png";
  const bgImgRef = useRef<HTMLDivElement>(null);
  const fgImgRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  cardsRef.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      // 3D-параллакс для коллажа изображений при скролле
      gsap.to(bgImgRef.current, {
        yPercent: -15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(fgImgRef.current, {
        yPercent: 10,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Стагерное появление карточек принципов при скролле
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom bottom",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  const valueItems: ValueItem[] = [
    {
      key: "v1",
      iconName: "clock",
    },
    {
      key: "v2",
      iconName: "check-circle",
    },
    {
      key: "v3",
      iconName: "shield",
    },
  ];

  return (
    <section 
      id={id ?? undefined} 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Левая сторона: Описание и таймлайн */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logoSrc}
                alt="DDC"
                width={24}
                height={24}
                priority
                className="pointer-events-none"
              />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium block">
                {t("overline")}
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
              {t("titleLine1")} <br />
              <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
            </h2>

            <TextReveal text={t("description")} className="mb-8" />

            {/* Таймлайн / Принципы */}
            <div className="space-y-8 relative mt-4">
              {/* Золотая линия таймлайна слева */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-brand-blue-light to-transparent opacity-30" />

              {valueItems.map((item) => {
                return (
                  <div
                    key={item.key}
                    ref={addToRefs}
                    className="flex gap-6 relative z-10 group animate-hover"
                  >
                    <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-gold group-hover:bg-glass transition-all duration-300 shrink-0">
                      <Icon name={item.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-sans font-semibold text-foreground mb-2 group-hover:text-zinc-100 transition-colors">
                        {t(`${item.key}.title`)}
                      </h4>
                      <p className="text-sm font-sans font-normal text-muted leading-relaxed group-hover:text-muted transition-colors">
                        {t(`${item.key}.text`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Правая сторона: Премиум-коллаж с параллаксом */}
          <div className="lg:col-span-5 relative h-[500px] sm:h-[600px] w-full">
            {/* Задний фон: nbk_architecture */}
            <div 
              ref={bgImgRef}
              className="absolute top-0 right-0 w-4/5 h-4/5 rounded-card overflow-hidden border border-glass-border shadow-card transition-transform duration-700 hover:scale-[1.02]"
            >
              <Image
                src="/images/nbk_architecture.png"
                alt="Здание Национального Банка РК"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover brightness-95"
              />
            </div>
            
            {/* Передний фон: liquid_glass_flow */}
            <div 
              ref={fgImgRef}
              className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-card overflow-hidden border border-gold/20 shadow-[0_8px_30px_rgba(201,168,76,0.2)] z-20 transition-transform duration-700 hover:scale-[1.03]"
            >
              <Image
                src="/images/backgrounds/liquid_glass_flow.png"
                alt="Жидкое стекло с национальным орнаментом ЦЦР"
                fill
                priority
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Мягкие свечения */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue-mid/20 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
