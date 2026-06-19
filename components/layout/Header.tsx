"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import TransitionLink from "../motion/TransitionLink";
import CinematicThemeSwitcher from "../ui/cinematic-theme-switcher";
import Icon from "../ui/Icon";
import { AccessibilityTrigger } from "../ui/AccessibilityPanel";

const LANGUAGES = ["kz", "ru", "en"];

// Accessible segmented KZ / RU / EN switcher, styled as a liquid-glass pill.
// Hoisted to module scope so it isn't re-created on every Header render.
function LanguageSwitcher({
  locale,
  onSwitch,
  size = "sm",
}: {
  locale: string;
  onSwitch: (lng: string) => void;
  size?: "sm" | "lg";
}) {
  return (
    <div
      role="group"
      aria-label="Тіл / Язык / Language"
      className="inline-flex items-center gap-0.5 liquid-glass rounded-full p-1 relative z-10"
    >
      {LANGUAGES.map((lng) => {
        const active = locale === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => onSwitch(lng)}
            aria-label={lng.toUpperCase()}
            aria-pressed={active}
            className={`font-mono font-bold tracking-wider rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 flex items-center justify-center relative transition-colors duration-300 ${
              size === "lg" ? "px-4 min-h-[44px] min-w-[44px] text-sm" : "px-3 py-1.5 min-h-[32px] min-w-[32px] text-xs"
            } ${active ? "text-black z-10 font-bold" : "text-muted hover:text-gold z-10"}`}
          >
            {active && (
              <motion.div
                layoutId={`activeLanguageBg-${size}`}
                className="absolute inset-0 bg-gold rounded-full -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

const PAGE_SUMMARIES: Record<string, Record<string, string>> = {
  "/": {
    ru: "Цифровые решения для финансовой стабильности государства",
    kz: "Мемлекеттің қаржылық тұрақтылығы үшін цифрлық шешімдер",
    en: "Digital solutions for the financial stability of the state",
  },
  "/about": {
    ru: "О Центре: история, ценности, руководство и основатель",
    kz: "Орталық туралы: тарихы, құндылықтары, басшылығы және құрылтайшысы",
    en: "About the Center: history, values, leadership and founder",
  },
  "/services": {
    ru: "Разработка систем, IT-услуги и информационная безопасность",
    kz: "Жүйелерді әзірлеу, IT-қызметтер және ақпараттық қауіпсіздік",
    en: "Systems development, IT services and information security",
  },
  "/mission": {
    ru: "Технологическое ядро финансовой системы Казахстана",
    kz: "Қазақстанның қаржы жүйенің технологиялық өзегі",
    en: "Technological core of the financial system of Kazakhstan",
  },
  "/news": {
    ru: "Актуальные события, пресс-релизы и технологические обновления",
    kz: "Өзекті оқиғалар, пресс-релиздер және технологиялық жаңартулар",
    en: "Current events, press releases and technological updates",
  },
  "/careers": {
    ru: "Вакансии, стажировки и карьерные возможности в DDC",
    kz: "DDC-дегі бос жұмыс орындары, тағылымдамалар және мансаптық мүмкіндіктер",
    en: "Vacancies, internships and career opportunities at DDC",
  },
  "/contact": {
    ru: "Связь с нами, адрес, карта и контакт-центр 1477",
    kz: "Бізбен байланыс, мекенжай, карта және 1477 байланыс орталығы",
    en: "Contact us, address, map and contact center 1477",
  },
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<{ name: string; href: string } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "light"
    ? "/images/logo/ddc_logo_light_theme.png"
    : "/images/logo/ddc_logo_for_dark_theme.png";

  const t = useTranslations("Header");
  const tA11y = useTranslations("A11y");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      const lenis = (window as any).__lenis;
      if (lenis) lenis.start();
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnterLink = (link: { name: string; href: string }) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredLink(link);
  };

  const handleMouseLeaveLink = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLink(null);
    }, 200);
  };

  const navLinks: { name: string; href: string }[] = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("mission"), href: "/mission" },
    { name: t("news"), href: "/news" },
    { name: t("careers"), href: "/careers" },
    { name: t("contacts"), href: "/contact" },
  ];

  // Sliding "cursor" pill for the desktop nav: follows hover, and rests on the
  // active route when the pointer leaves. Adapted to the liquid-glass design.
  const navListRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  const movePillTo = (el: HTMLLIElement | null) => {
    if (!el) return;
    setPill({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  };

  const restPill = () => {
    const activeIdx = navLinks.findIndex(
      (l) => l.href === pathname || (l.href !== "/" && pathname.startsWith(l.href.split("#")[0]))
    );
    if (activeIdx >= 0 && tabRefs.current[activeIdx]) {
      movePillTo(tabRefs.current[activeIdx]);
    } else {
      setPill((p) => ({ ...p, opacity: 0 }));
    }
  };

  // Park the pill on the active route on mount and whenever the route, locale or scroll state changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      restPill();
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale, isScrolled]);

  const switchLocale = (lng: string) => {
    if (lng === locale) return;
    router.replace(pathname, { locale: lng });
  };

  return (
    <>
      <header
        className={`!fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1300px] transition-all duration-500 rounded-full py-3 px-6 sm:px-8 ${
          isScrolled
            ? "liquid-glass-strong shadow-card"
            : "liquid-glass shadow-lg"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo (mark only — clean & compact) */}
          <TransitionLink
            href="/"
            aria-label={tA11y("logoLabel")}
            className="flex items-center group select-none shrink-0"
          >
            <Image
              src={logoSrc}
              alt="DDC — Центр цифрового развития НБК"
              width={44}
              height={44}
              priority
              className="transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-95 pointer-events-none"
            />
          </TransitionLink>

          {/* Desktop menu — liquid-glass pill with a sliding cursor highlight */}
          <ul
            ref={navListRef}
            onMouseLeave={() => {
              restPill();
              handleMouseLeaveLink();
            }}
            className="hidden xl:flex items-center relative liquid-glass border border-glass-border p-1.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            {navLinks.map((link, idx) => {
              const isActive =
                link.href === pathname ||
                (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
              return (
                <li
                  key={link.name}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  onMouseEnter={(e) => {
                    movePillTo(e.currentTarget);
                    handleMouseEnterLink(link);
                  }}
                  onMouseLeave={handleMouseLeaveLink}
                  className="relative z-10"
                >
                  <TransitionLink
                    href={link.href}
                    className={`relative block px-3 py-2 rounded-full text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-gold" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </TransitionLink>
                </li>
              );
            })}

            {/* Sliding glass cursor */}
            <motion.li
              aria-hidden
              animate={pill}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="absolute inset-y-1.5 z-0 rounded-full bg-white/[0.1] border border-gold/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            />
          </ul>

          {/* Right action panel */}
          <div className="hidden xl:flex items-center gap-4">
            {/* Accessibility (версия для слабовидящих) */}
            <AccessibilityTrigger />

            {/* Theme Switcher */}
            <CinematicThemeSwitcher />

            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} onSwitch={switchLocale} />
          </div>

          {/* Mobile action panel — a11y always surfaced beside the menu button */}
          <div className="xl:hidden flex items-center gap-2">
            <AccessibilityTrigger />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full liquid-glass text-foreground hover:text-gold transition-colors focus-visible:outline-none"
              aria-label={tA11y("toggleMobileMenu")}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
            </button>
          </div>
        </div>

        {/* Hover preview panel */}
        <AnimatePresence>
          {hoveredLink && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeaveLink}
              className="absolute top-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 w-[340px] liquid-glass-strong border border-gold/25 p-5 rounded-2xl shadow-2xl z-50 text-left pointer-events-auto flex flex-col gap-2"
            >
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-forest/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
              
              <h4 className="text-xs uppercase tracking-[0.15em] text-gold font-bold relative z-10">
                {hoveredLink.name}
              </h4>
              <p className="text-xs text-zinc-300 dark:text-zinc-300 font-light leading-relaxed relative z-10">
                {PAGE_SUMMARIES[hoveredLink.href]?.[locale] || ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu overlay — full-screen liquid glass */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            data-hover="gold"
            style={{ background: "rgba(8,8,10,0.9)" }}
            className="fixed inset-0 z-40 liquid-glass-strong rounded-none flex flex-col justify-start gap-8 pt-32 pb-12 px-8 xl:hidden overflow-y-auto max-h-screen"
          >
            {/* Menu links */}
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                      delay: idx * 0.04
                    }}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-heading text-2xl tracking-wide block ${
                        isActive ? "text-gold font-semibold" : "text-foreground"
                      }`}
                    >
                      {link.name}
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile menu bottom action panel */}
            <div className="flex flex-col gap-6 mt-auto pt-6 border-t border-glass-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{t("language")}</span>
                <LanguageSwitcher locale={locale} onSwitch={switchLocale} size="lg" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
