"use client";

import React, { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";
import { BubbleText } from "@/components/ui/BubbleText";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import Icon from "@/components/ui/Icon";
import ScrollReveal, { ENTRANCE_EASE, ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { LeaderProfileModal } from "@/components/ui/LeaderProfileModal";

interface Leader {
  id: string;
  name: { ru: string; en: string; kz: string };
  role: { ru: string; en: string; kz: string };
  img: string;
  desc?: { ru: string; en: string; kz: string };
  /** Not every leader has a public profile yet — the button only renders when set. */
  linkedinUrl?: string;
}

function LeaderCard({
  leader,
  locale,
  isChairman = false,
  isDeputy = false,
  sizes = "320px",
  cometCardClass = "",
  viewProfileLabel,
  onViewProfile,
}: {
  leader: Leader;
  locale: "ru" | "en" | "kz";
  isChairman?: boolean;
  isDeputy?: boolean;
  sizes?: string;
  cometCardClass?: string;
  viewProfileLabel: string;
  onViewProfile: (leader: Leader) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const tag = isChairman ? "#CHAIRMAN" : isDeputy ? "#DEPUTY" : null;

  // The whole card is the click target (not just the small label below) —
  // a real <button> wrapper gives free keyboard/focus/screen-reader behavior,
  // and since nothing inside it is itself a nested interactive element, this
  // stays valid, unambiguous markup.
  return (
    <button
      type="button"
      onClick={() => onViewProfile(leader)}
      aria-label={`${viewProfileLabel}: ${leader.name[locale]}`}
      className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
    >
      <CometCard className={cn("p-4 bg-charcoal/40 border border-glass-border rounded-[16px] shadow-xl group transition-colors duration-300 group-hover:border-gold/20", cometCardClass)}>
        <div className={cn(
          "relative aspect-[3/4] w-full rounded-[12px] overflow-hidden bg-neutral-900 border border-white/5 mb-4",
          !isLoaded && "animate-pulse bg-zinc-800"
        )}>
          <Image
            src={leader.img}
            alt={leader.name[locale]}
            fill
            sizes={sizes}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "object-cover saturate-[0.85] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105",
              !isLoaded ? "opacity-0" : "opacity-100"
            )}
          />
        </div>
        <div className="font-sans">
          {tag && (
            <div className={cn(
              "text-[9px] font-mono tracking-[0.2em] uppercase mb-1",
              isChairman ? "text-gold" : "text-zinc-500"
            )}>
              {tag}
            </div>
          )}
          <h4 className={cn(
            "font-bold text-foreground mb-1 leading-tight",
            isChairman ? "text-lg" : "text-base"
          )}>
            {leader.name[locale]}
          </h4>
          <p className={cn(
            "font-mono uppercase tracking-wider leading-relaxed mb-3",
            isChairman ? "text-xs text-zinc-400" : isDeputy ? "text-[10px] text-zinc-400" : "text-[10px] text-gold"
          )}>
            {leader.role[locale]}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-gold-light transition-colors duration-300 group-hover:text-gold">
            {viewProfileLabel}
            <Icon name="arrow-right" size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </CometCard>
    </button>
  );
}

export default function Leadership() {
  const t = useTranslations("Leadership");
  const locale = useLocale() as "ru" | "en" | "kz";
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPillars, setShowPillars] = useState(false);
  const [activeLeader, setActiveLeader] = useState<Leader | null>(null);
  const { prefersReducedMotion } = useA11y();

  // Данные для Совета директоров
  const boardOfDirectors: Leader[] = [
    {
      id: "b1",
      name: {
        ru: "Жаленов Бинур Муратович",
        en: "Binur M. Zhalenov",
        kz: "Жәленов Бинұр Мұратұлы",
      },
      role: {
        ru: "Председатель Совета директоров Общества, Заместитель Председателя Национального Банка Республики Казахстан",
        en: "Chairman of the Board of Directors, Deputy Governor of the National Bank of Kazakhstan",
        kz: "Қоғамның Директорлар кеңесінің төрағасы, Қазақстан Республикасы Ұлттық Банкі Төрағасының орынбасары",
      },
      img: "/images/team/Zhalenov_Binur.jpg",
      linkedinUrl: "https://www.linkedin.com/in/binur-zhalenov/",
    },
    {
      id: "b2",
      name: {
        ru: "Узбеков Асхат Архатович",
        en: "Askhat A. Uzbekov",
        kz: "Өзбеков Асхат Архатұлы",
      },
      role: {
        ru: "Член Совета директоров, Директор департамента информационных технологий Национального Банка Республики Казахстан",
        en: "Member of the Board of Directors, Director of the IT Department of the National Bank of Kazakhstan",
        kz: "Директорлар кеңесінің мүшесі, Қазақстан Республикасы Ұлттық Банкінің Ақпараттық технологиялар департаментінің директоры",
      },
      img: "/images/team/Uzbekov_Askhat.png",
      linkedinUrl: "https://www.linkedin.com/in/askhat-uzbekov-1781b15/",
    },
    {
      id: "b3",
      name: {
        ru: "Конирбаев Баян Кайратович",
        en: "Bayan K. Konirbayev",
        kz: "Қоңырбаев Баян Қайратұлы",
      },
      role: {
        ru: "Член Совета директоров Общества - независимый директор",
        en: "Member of the Board of Directors - Independent Director",
        kz: "Қоғамның Директорлар кеңесінің мүшесі - тәуелсіз директор",
      },
      img: "/images/team/Bayan_Kb.png",
      linkedinUrl: "https://www.linkedin.com/in/bayan-konirbayev-21934522/",
    },
    {
      id: "b4",
      name: {
        ru: "Аринова Айжан Бейбытовна",
        en: "Aizhan B. Arinova",
        kz: "Аринова Айжан Бейбітқызы",
      },
      role: {
        ru: "Член Совета директоров, Директор Департамента цифровой трансформации",
        en: "Member of the Board of Directors, Director of the Digital Transformation Department",
        kz: "Директорлар кеңесінің мүшесі, Сандық трансформация департаментінің директоры",
      },
      img: "/images/team/Arinova_Aizhan.jpg",
      linkedinUrl: "https://www.linkedin.com/in/aizhanarinova/?locale=en",
    },
    {
      id: "b5",
      name: {
        ru: "Алпамысов Абай Абдисаметович",
        en: "Abai A. Alpamysov",
        kz: "Алпамысов Абай Әбдісаметұлы",
      },
      role: {
        ru: "Член Совета директоров Общества - независимый директор",
        en: "Member of the Board of Directors - Independent Director",
        kz: "Қоғамның Директорлар кеңесінің мүшесі - тәуелсіз директор",
      },
      img: "/images/team/Alpamysov_Abai.png",
      linkedinUrl: "https://www.linkedin.com/in/abay-alpamyssov-8965b018/",
    },
    {
      id: "b6",
      name: {
        ru: "Амардинов Малик Алимжанович",
        en: "Malik A. Amardinov",
        kz: "Амардинов Мәлік Әлімжанұлы",
      },
      role: {
        ru: "Член Совета директоров Общества - Председатель Правления",
        en: "Member of the Board of Directors - Chairman of the Management Board",
        kz: "Қоғамның Директорлар кеңесінің мүшесі - Басқарма төрағасы",
      },
      img: "/images/team/Amardinov.jpg",
      linkedinUrl: "https://www.linkedin.com/in/malik-amardinov-790a8498/",
    },
    {
      id: "b7",
      name: {
        ru: "Марат Аскар",
        en: "Askar Marat",
        kz: "Марат Асқар",
      },
      role: {
        ru: "Член Совета директоров Общества - независимый директор",
        en: "Member of the Board of Directors - Independent Director",
        kz: "Қоғамның Директорлар кеңесінің мүшесі - тәуелсіз директор",
      },
      img: "/images/team/Marat_Askar.png",
      linkedinUrl: "https://www.linkedin.com/in/askar-marat-05205456/",
    },
  ];

  // Данные для Правления
  const managementBoard: Leader[] = [
    {
      id: "m1",
      name: {
        ru: "Амардинов Малик Алимжанович",
        en: "Malik A. Amardinov",
        kz: "Амардинов Мәлік Әлімжанұлы",
      },
      role: {
        ru: "Председатель Правления",
        en: "Chairman of the Management Board",
        kz: "Басқарма Төрағасы",
      },
      img: "/images/team/Amardinov.jpg",
      linkedinUrl: "https://www.linkedin.com/in/malik-amardinov-790a8498/",
      desc: {
        ru: "Я рад приветствовать вас на официальном сайте ЦЦР! Более 20 лет ЦЦР успешно осуществляет свою деятельность на рынке ИТ-услуг, что позволило сформировать внушительный портфель сложных, но успешно реализованных ИТ-проектов для Национального Банка. Каждый сотрудник нашей компании обладает профессионализмом, стремлением работать и желанием постоянно развиваться.",
        en: "I am pleased to welcome you to the official DDC website! For over 20 years, DDC has been successfully operating in the IT services market, building a strong portfolio of complex IT projects for the National Bank. Every employee of our company possesses professionalism, drive, and a commitment to continuous growth.",
        kz: "Сіздерді ЦЦР-дың ресми сайтында қарсы алуға қуаныштымын! 20 жылдан астам уақыт бойы ЦЦР АТ-қызмет көрсету нарығында табысты жұмыс істеп келеді, бұл Ұлттық Банк үшін күрделі де маңызды жобалардың үлкен портфелін қалыптастыруға мүмкіндік берді. Біздің әрбір қызметкеріміз кәсібилігімен және үнемі дамуға деген ұмтылысымен ерекшеленеді.",
      },
    },
    {
      id: "m2",
      name: {
        ru: "Дурмагамбетов Ерлан Дмитриевич",
        en: "Erlan D. Durmagambetov",
        kz: "Дүрмағамбетов Ерлан Дмитриевич",
      },
      role: {
        ru: "Первый заместитель Председателя Правления Общества",
        en: "First Deputy Chairman of the Management Board",
        kz: "Қоғам Басқармасы Төрағасының бірінші орынбасары",
      },
      img: "/images/team/Durmagambetov.jpg",
      linkedinUrl: "https://www.linkedin.com/in/yerlan-durmagambetov-586b4082/",
      desc: {
        ru: "Цифровая трансформация Национального Банка требует синергии передовых технологий, сильной инженерной команды и строгих стандартов качества.",
        en: "Digital transformation of the National Bank requires synergy of advanced technologies, a strong engineering team, and strict quality standards.",
        kz: "Ұлттық Банктің цифрлық трансформациясы озық технологиялардың, мықты инженерлік команданың және қатаң сапа стандарттарының синергиясын талап етеді.",
      },
    },
    {
      id: "m3",
      name: {
        ru: "Кентбеков Аргын Салаватович",
        en: "Argyn S. Kentbekov",
        kz: "Кентбеков Арғын Салауатұлы",
      },
      role: {
        ru: "Заместитель Председателя Правления Общества",
        en: "Deputy Chairman of the Management Board",
        kz: "Қоғам Басқармасы Төрағасының орынбасары",
      },
      img: "/images/team/Kentbekov.jpg",
      linkedinUrl: "https://www.linkedin.com/in/argyn-kentbekov-9a8b7a133/",
      desc: {
        ru: "Мы обеспечиваем бесперебойную эксплуатацию ключевых ИТ-систем и развитие государственного портала закупок, повышая прозрачность процессов.",
        en: "We ensure the uninterrupted operation of key IT systems and the development of the state procurement portal, increasing process transparency.",
        kz: "Біз процестердің ашықтығын арттыра отырып, негізгі АТ-жүйелерінің үздіксіз жұмысын және мемлекеттік сатып алу порталының дамуын қамтамасыз етеміз.",
      },
    },
    {
      id: "m4",
      name: {
        ru: "Имажанов Бахытжан Гылымбекович",
        en: "Bakhytzhan G. Imazhanov",
        kz: "Имажанов Бақытжан Ғылымбекұлы",
      },
      role: {
        ru: "Заместитель Председателя Правления Общества",
        en: "Deputy Chairman of the Management Board",
        kz: "Қоғам Басқармасы Төрағасының орынбасары",
      },
      img: "/images/team/Imajanov.jpg",
      linkedinUrl: "https://www.linkedin.com/in/bakhytzhan-imazhanov-759b577b/",
      desc: {
        ru: "Информационная безопасность и киберустойчивость — фундамент цифрового развития финансовой инфраструктуры нашей страны.",
        en: "Information security and cyber resilience are the foundation of the digital development of our country's financial infrastructure.",
        kz: "Ақпараттық қауіпсіздік пен кибертұрақтылық — еліміздің қаржылық инфрақұрылымын цифрлық дамытудың негізі болып табылады.",
      },
    },
  ];

  useGSAP(
    () => {
      // Анимация центрального ствола (вертикальной линии) — the tree's
      // "trunk" reveal stays scroll-scrubbed (grows continuously as you
      // scroll through the org chart), same idea as the Timeline section's
      // vertical line. Branches and cards below use the shared framer-motion
      // entrance system instead (no bounce, one-time trigger).
      gsap.fromTo(
        ".tree-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".tree-container",
            start: "top 40%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="leadership"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Заголовок секции */}
        <div className="max-w-3xl mb-20">
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.label}>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
              {t("overline")}
            </span>
          </ScrollReveal>
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-foreground mb-6 leading-tight">
            <RevealWords text={t("titleLine1")} delay={0.08} useBubbleText />{" "}
            <RevealWords
              text={t("titleAccent")}
              delay={0.3}
              useBubbleText
              bubbleActiveClassName="text-gold font-black"
            />
          </h2>
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.2}>
            <p className="text-sm sm:text-base font-sans font-light text-muted leading-relaxed">
              <BubbleText text={t("subtitle")} />
            </p>
          </ScrollReveal>
        </div>

        {/* Интерактивное иерархическое дерево */}
        <div className="tree-container relative w-full flex flex-col items-center">

          {/* Ствол дерева (вертикальная направляющая линия) */}
          <div className="tree-spine hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-forest-light via-gold/60 to-forest-dark z-0" />

          {/* ==========================================================
              РАЗДЕЛ 1: СОВЕТ ДИРЕКТОРОВ (Board of Directors)
              ========================================================== */}
          <div className="w-full mb-28 relative z-10">
            <div className="flex justify-center mb-16">
              <h3 className="px-6 py-2.5 rounded-full bg-forest-dark/40 border border-forest-light/30 backdrop-blur-md text-gold text-xs font-mono tracking-[0.2em] uppercase shadow-lg shadow-black/30">
                {locale === "en"
                  ? "Board of Directors"
                  : locale === "kz"
                  ? "Директорлар кеңесі"
                  : "Совет директоров"}
              </h3>
            </div>

            <div className="flex flex-col gap-12 md:gap-4 w-full">
              {/* 1. Председатель Совета Директоров (по центру) */}
              <div className="tree-node w-full flex flex-col items-center mb-6">
                <ScrollReveal scale={0.94} duration={ENTRANCE_DURATION.card} className="w-full max-w-[340px] relative z-10">
                  <LeaderCard
                    leader={boardOfDirectors[0]}
                    locale={locale}
                    viewProfileLabel={t("viewProfile")}
                    onViewProfile={setActiveLeader}
                  />
                </ScrollReveal>

                {/* Button to toggle strategic vision */}
                <button
                  onClick={() => setShowPillars(!showPillars)}
                  aria-expanded={showPillars}
                  aria-controls="strategic-pillars"
                  className="mt-4 flex min-h-11 items-center gap-2 rounded-full border border-gold/30 bg-charcoal/50 px-5 py-2.5 text-xs font-mono uppercase tracking-[0.1em] text-gold transition-all duration-300 hover:border-gold hover:bg-forest/20 cursor-pointer shadow-lg hover:shadow-gold/10 z-10"
                >
                  <Icon name={showPillars ? "minus" : "eye"} size={14} className="text-gold" />
                  {locale === "en" ? "Strategic Vision" : locale === "kz" ? "Стратегиялық көзқарас" : "Стратегическое видение"}
                </button>

                {/* 5 Pillars Accordion container */}
                <AnimatePresence initial={false}>
                  {showPillars && (
                    <motion.div
                      id="strategic-pillars"
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full max-w-2xl mt-6 px-4 overflow-hidden relative z-10"
                    >
                      <div className="p-6 sm:p-8 bg-charcoal/40 border border-glass-border rounded-[24px] backdrop-blur-md shadow-2xl relative">
                        <div className="text-left mb-6">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono block mb-1">
                            {t("pillars.overline")}
                          </span>
                          <h4 className="text-base sm:text-lg font-display text-white font-medium">
                            {t("pillars.title")}
                          </h4>
                        </div>

                        <div className="space-y-6">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="flex gap-4 items-start group">
                              <div className="w-8 h-8 rounded-lg bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold text-xs font-mono font-bold shrink-0">
                                0{num}
                              </div>
                              <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0 flex-1 text-left">
                                <h5 className="text-sm font-semibold text-white mb-1.5 group-hover:text-gold transition-colors duration-300">
                                  {t(`pillars.p${num}.title`)}
                                </h5>
                                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                                  {t(`pillars.p${num}.desc`)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Остальные члены Совета директоров в шахматном порядке */}
              {boardOfDirectors.slice(1).map((leader, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={leader.id}
                    className={`tree-node w-full flex flex-col md:flex-row items-center justify-center relative ${
                      isLeft ? "md:pr-[50%]" : "md:pl-[50%]"
                    }`}
                  >
                    {/* Горизонтальная ветвь дерева */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 0.5, ease: ENTRANCE_EASE }}
                      className={`tree-branch hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r ${
                        isLeft
                          ? "from-transparent to-gold/30 left-[15%] w-[35%] origin-right"
                          : "from-gold/30 to-transparent right-[15%] w-[35%] origin-left"
                      }`}
                    />

                    {/* Точка соединения со стволом */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold border border-black z-20" />

                    <ScrollReveal
                      direction={isLeft ? "left" : "right"}
                      distance={40}
                      duration={ENTRANCE_DURATION.card}
                      delay={0.15}
                      className="tree-card-wrapper w-full max-w-[340px] relative z-10"
                    >
                      <LeaderCard
                        leader={leader}
                        locale={locale}
                        viewProfileLabel={t("viewProfile")}
                        onViewProfile={setActiveLeader}
                      />
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==========================================================
              РАЗДЕЛ 2: ПРАВЛЕНИЕ (Management Board)
              ========================================================== */}
          <div className="w-full relative z-10">
            <div className="flex justify-center mb-16">
              <h3 className="px-6 py-2.5 rounded-full bg-forest-dark/40 border border-forest-light/30 backdrop-blur-md text-gold text-xs font-mono tracking-[0.2em] uppercase shadow-lg shadow-black/30">
                {locale === "en"
                  ? "Management Board"
                  : locale === "kz"
                  ? "Басқарма"
                  : "Правление"}
              </h3>
            </div>

            {/* 1. Председатель Правления (Карточка + Обращение) */}
            <div className="tree-node w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-24 max-w-5xl mx-auto">
              <ScrollReveal direction="left" distance={40} duration={ENTRANCE_DURATION.card} className="tree-card-wrapper w-full max-w-[360px] flex-shrink-0">
                <LeaderCard
                  leader={managementBoard[0]}
                  locale={locale}
                  isChairman
                  sizes="360px"
                  cometCardClass="bg-charcoal/50 border-gold/20 shadow-2xl"
                  viewProfileLabel={t("viewProfile")}
                  onViewProfile={setActiveLeader}
                />
              </ScrollReveal>

              {/* Обращение Председателя */}
              <ScrollReveal direction="right" distance={40} duration={ENTRANCE_DURATION.card} delay={0.15} className="flex-1 max-w-xl text-left bg-charcoal/20 border border-glass-border rounded-[24px] p-6 sm:p-8 backdrop-blur-md shadow-lg relative">
                {/* Декоративная кавычка */}
                <span className="absolute top-2 right-6 text-7xl font-serif text-gold/15 select-none pointer-events-none">&rdquo;</span>
                <h4 className="text-lg font-display text-gold font-medium mb-4">
                  {locale === "en"
                    ? "Welcome Message"
                    : locale === "kz"
                    ? "Басқарма Төрағасының үндеуі"
                    : "Обращение Председателя"}
                </h4>
                <p className="text-sm sm:text-base font-sans font-light text-foreground/80 leading-relaxed mb-6 italic">
                  {managementBoard[0].desc?.[locale]}
                </p>
                <div className="border-t border-glass-border pt-4">
                  <span className="text-xs text-zinc-300 uppercase tracking-widest font-mono block">
                    {managementBoard[0].name[locale]}
                  </span>
                </div>
              </ScrollReveal>
            </div>

            {/* 2. Заместители Председателя Правления (В ряд/Сетка) */}
            <StaggerGroup stagger={STAGGER.base} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {managementBoard.slice(1).map((leader) => (
                <StaggerItem key={leader.id} scale={0.94} duration={ENTRANCE_DURATION.card} className="tree-node flex flex-col items-center">
                  <div className="tree-card-wrapper w-full max-w-[320px]">
                    <LeaderCard
                      leader={leader}
                      locale={locale}
                      isDeputy
                      viewProfileLabel={t("viewProfile")}
                      onViewProfile={setActiveLeader}
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

          </div>

        </div>

      </div>

      <LeaderProfileModal
        leader={
          activeLeader
            ? {
                name: activeLeader.name[locale],
                role: activeLeader.role[locale],
                img: activeLeader.img,
                desc: activeLeader.desc?.[locale],
                linkedinUrl: activeLeader.linkedinUrl,
              }
            : null
        }
        closeLabel={t("closeProfile")}
        onClose={() => setActiveLeader(null)}
      />
    </section>
  );
}
