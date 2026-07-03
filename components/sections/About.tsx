"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import Icon, { IconName } from "@/components/ui/Icon";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import DDCLogo from "@/components/ui/DDCLogo";
import LottieAnimation from "@/components/ui/LottieAnimation";

interface ValueItem {
  key: string;
  iconName: IconName;
}

export default function About({ id = "about" }: { id?: string | null }) {
  const t = useTranslations("About");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  cardsRef.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
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
              <DDCLogo
                title="DDC"
                className="h-6 w-[22px] shrink-0 text-foreground"
              />
              <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium block">
                {t("overline")}
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
              {t("titleLine1")} <br />
              <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
            </h2>

            <TextReveal
              text={t("description")}
              className="mb-8"
              textClassName="text-xl md:text-2xl lg:text-[2.35rem] leading-[1.35]"
            />

            {/* Таймлайн / Принципы */}
            <div className="space-y-8 relative mt-4">
              {/* Золотая линия таймлайна слева */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-forest-light to-transparent opacity-30" />

              {valueItems.map((item) => {
                return (
                  <div
                    key={item.key}
                    ref={addToRefs}
                    className="flex gap-6 relative z-10 group animate-hover"
                  >
                    <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-gold group-hover:bg-glass transition-all duration-300 shrink-0">
                      <AnimatedIcon animationType={item.iconName === "check-circle" ? "bounce" : "scale"}>
                        <Icon name={item.iconName} size={20} />
                      </AnimatedIcon>
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

          {/* Правая сторона: смысловая анимация цифровой финансовой инфраструктуры */}
          <div className="lg:col-span-5 relative w-full">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-forest-mid/20 blur-3xl pointer-events-none" />
            <LottieAnimation
              src="/animations/online-banking-laptop.json"
              label="Digital banking platform and financial data flow"
              className="rounded-[var(--radius-card)]"
              frameClassName="min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] bg-background/50"
              animationClassName="max-h-[520px] scale-[1.03]"
            />
            <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-gold/20 bg-background/70 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold-light backdrop-blur-md">
              ISO 9001
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-forest-light/20 bg-background/70 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-forest-light backdrop-blur-md">
              Digital Core
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
