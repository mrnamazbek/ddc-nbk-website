"use client";

import { useTranslations } from "next-intl";
import Icon, { IconName } from "@/components/ui/Icon";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import DDCLogo from "@/components/ui/DDCLogo";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { BubbleText } from "@/components/ui/BubbleText";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";

import { motion } from "framer-motion";

interface ValueItem {
  key: string;
  iconName: IconName;
}

export default function About({ id = "about" }: { id?: string | null }) {
  const t = useTranslations("About");
  
  const titleAccentWords = t("titleAccent").split(" ");
  const firstAccentWord = titleAccentWords[0] || "";
  const secondAccentWord = titleAccentWords.slice(1).join(" ");

  const valueItems: ValueItem[] = [
    {
      key: "v1",
      iconName: "compass",
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
      className="relative w-full py-24 sm:py-32 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Левая сторона: Описание и таймлайн */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
              <div className="flex items-center gap-3 mb-4">
                <DDCLogo
                  title="DDC"
                  className="h-6 w-6 shrink-0 text-foreground"
                />
                <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium block">
                  {t("overline")}
                </span>
              </div>
            </ScrollReveal>

            <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight flex flex-col items-start gap-1">
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                <BubbleText text={t("titleLine1")} />
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                className="block text-gold font-normal"
              >
                <BubbleText text={firstAccentWord} activeClassName="text-gold font-normal" />
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
                className="block text-gold font-normal"
              >
                <BubbleText text={secondAccentWord} activeClassName="text-gold font-normal" />
              </motion.span>
            </h2>

            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.1} className="mb-8">
              <p className="text-xl md:text-2xl lg:text-[2.35rem] leading-[1.35] text-foreground/85">
                {t("description")}
              </p>
            </ScrollReveal>

            {/* Таймлайн / Принципы */}
            <StaggerGroup stagger={STAGGER.loose} className="space-y-8 relative mt-4">
              {/* Золотая линия таймлайна слева */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-forest-light to-transparent opacity-30" />

              {valueItems.map((item) => (
                <StaggerItem key={item.key} className="flex gap-6 relative z-10 group animate-hover">
                  <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-gold group-hover:bg-glass transition-all duration-300 shrink-0">
                    <AnimatedIcon animationType={item.iconName === "check-circle" ? "bounce" : "scale"}>
                      <Icon name={item.iconName} size={20} />
                    </AnimatedIcon>
                  </div>
                  <div>
                    <h4 className="text-lg font-sans font-semibold text-foreground mb-2 group-hover:text-zinc-100 transition-colors">
                      <BubbleText text={t(`${item.key}.title`)} />
                    </h4>
                    <p className="text-sm font-sans font-normal text-muted leading-relaxed group-hover:text-muted transition-colors">
                      <BubbleText text={t(`${item.key}.text`)} />
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Правая сторона: смысловая анимация цифровой финансовой инфраструктуры.
              Enters from the side — a fixed-size, non-text-driven asset, so it
          never cuts or shrinks when the left column's text length changes
          across locales. */}
          <ScrollReveal direction="left" distance={60} duration={ENTRANCE_DURATION.card} delay={0.15} className="lg:col-span-5 relative w-full">
            <LottieAnimation
              src="/animations/online-banking-laptop.json"
              label="Digital banking platform and financial data flow"
              className="relative"
              frameClassName="min-h-[360px] sm:min-h-[460px] lg:min-h-[560px]"
              animationClassName="max-h-[520px] scale-[1.03]"
            />
            <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-gold/20 bg-background/70 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-gold-light backdrop-blur-md">
              ISO 9001
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-full border border-forest-light/20 bg-background/70 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-forest-light backdrop-blur-md">
              Digital Core
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
