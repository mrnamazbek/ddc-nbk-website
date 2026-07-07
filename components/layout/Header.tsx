"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import TransitionLink from "../motion/TransitionLink";
import CinematicThemeSwitcher from "../ui/cinematic-theme-switcher";
import Icon from "../ui/Icon";
import { AccessibilityTrigger } from "../ui/AccessibilityPanel";
import NavPreviewCard from "./NavPreview";
import DDCLogo from "../ui/DDCLogo";
import { TextRollHover } from "../ui/text-roll-hover";
import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
} from "../ui/text-stagger-hover";

const LANGUAGES = ["kz", "ru", "en"];
const LANGUAGE_LABELS: Record<string, string> = {
  kz: "Қазақша",
  ru: "Русский",
  en: "English",
};
const LANGUAGE_FLAGS: Record<string, string> = {
  kz: "🇰🇿",
  ru: "🇷🇺",
  en: "🇬🇧",
};

// Accessible dropdown-based language selector, styled conforming to repository design.
function LanguageSwitcher({
  locale,
  onSwitch,
  size = "sm",
}: {
  locale: string;
  onSwitch: (lng: string) => void;
  size?: "sm" | "lg";
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-label="Select Language"
        aria-expanded={open}
        className={`font-mono font-bold tracking-wider rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 flex items-center justify-center gap-2 transition-all duration-300 liquid-glass border border-white/10 text-white ${
          size === "lg"
            ? "px-5 py-2 text-sm min-h-[44px] min-w-[120px]"
            : "px-3.5 py-1.5 text-xs min-h-11 min-w-[85px]"
        }`}
      >
        <span className="text-sm select-none">{LANGUAGE_FLAGS[locale]}</span>
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            data-hover="gold"
            style={{ backfaceVisibility: "hidden" }}
            className={`absolute w-40 glass-card py-1.5 shadow-glass z-[70] transform-gpu ${
              size === "lg" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"
            }`}
          >
            {LANGUAGES.map((lng) => {
              const active = locale === lng;
              return (
                <button
                  key={lng}
                  onClick={() => {
                    onSwitch(lng);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-left transition-colors font-mono tracking-wider ${
                    active
                      ? "text-gold font-bold bg-white/5"
                      : "text-muted hover:text-gold hover:bg-gold/10"
                  }`}
                >
                  <span className="text-sm select-none">{LANGUAGE_FLAGS[lng]}</span>
                  <span className="flex-1">{LANGUAGE_LABELS[lng]}</span>
                  {active && <Check className="h-3.5 w-3.5 text-gold" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<{ name: string; href: string; left: number; width: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      const lenis = window.__lenis;
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      const lenis = window.__lenis;
      if (lenis) lenis.start();
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnterLink = (link: { name: string; href: string }, el: HTMLLIElement) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = el.getBoundingClientRect();
    setHoveredLink({
      ...link,
      left: rect.left,
      width: rect.width,
    });
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

  const targetLeft = hoveredLink
    ? Math.max(
        20,
        Math.min(
          hoveredLink.left - 200 + hoveredLink.width / 2,
          typeof window !== "undefined" ? window.innerWidth - 420 : hoveredLink.left
        )
      )
    : 0;

  return (
    <>
      <header
        style={{ backfaceVisibility: "hidden", overflow: "visible" }}
        className={`!fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1300px] transition-all duration-500 rounded-full py-2.5 px-5 sm:px-7 !overflow-visible transform-gpu ${
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
            className="flex items-center group select-none shrink-0 text-foreground"
          >
            <DDCLogo
              title="DDC — Центр цифрового развития НБК"
              className="h-[42px] w-[38px] transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-95"
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
                    handleMouseEnterLink(link, e.currentTarget);
                  }}
                  onMouseLeave={handleMouseLeaveLink}
                  className="relative z-10"
                >
                  <TransitionLink
                    href={link.href}
                    className={`relative flex items-center px-3 py-2 rounded-full text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-gold" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <TextStaggerHover>
                      <TextStaggerHoverActive animation="top">
                        {link.name}
                      </TextStaggerHoverActive>
                      <TextStaggerHoverHidden animation="bottom">
                        {link.name}
                      </TextStaggerHoverHidden>
                    </TextStaggerHover>
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

      </header>

      {/* Hover preview panel — rendered OUTSIDE <header> on purpose: the header's
          liquid-glass sets `overflow:hidden` and has a transform, which would clip
          any descendant positioned below it. As a fixed sibling it escapes that. */}
      <AnimatePresence>
        {hoveredLink && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92, rotateX: -14, filter: "blur(10px)", left: targetLeft }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", left: targetLeft }}
            exit={{ opacity: 0, y: 12, scale: 0.94, rotateX: 8, filter: "blur(8px)" }}
            transition={{
              left: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.18, ease: "easeOut" },
              filter: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              default: { duration: 0.34, ease: [0.16, 1, 0.3, 1] }
            }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeaveLink}
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 0%",
              willChange: "transform, opacity, filter, left",
            }}
            className="hidden xl:block fixed top-[5.25rem] z-[60] pointer-events-auto"
          >
            <NavPreviewCard link={hoveredLink} locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>

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
                      <TextStaggerHover>
                        <TextStaggerHoverActive animation="top">
                          {link.name}
                        </TextStaggerHoverActive>
                        <TextStaggerHoverHidden animation="bottom">
                          {link.name}
                        </TextStaggerHoverHidden>
                      </TextStaggerHover>
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile menu bottom action panel */}
            <div className="flex flex-col gap-6 mt-auto pt-6 border-t border-glass-border">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
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
