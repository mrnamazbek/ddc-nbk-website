"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import TransitionLink from "../motion/TransitionLink";
import CinematicThemeSwitcher from "../ui/cinematic-theme-switcher";
import Icon from "../ui/Icon";
import { AccessibilityTrigger } from "../ui/AccessibilityPanel";
import { useA11y } from "../theme/AccessibilityProvider";
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

// Accessible dropdown-based language selector, rendered via React Portal to prevent clipping from navbar overflow styles.
function LanguageSwitcher({
  locale,
  onSwitch,
  size = "sm",
}: {
  locale: string;
  onSwitch: (lng: string) => void;
  size?: "sm" | "lg";
}) {
  const a11y = useA11y();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  
  const showMenu = open || (mounted && a11y.enabled);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  useEffect(() => {
    if (open) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const clickedOutsideButton = dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(e.target as Node);
      
      if (clickedOutsideButton && clickedOutsideMenu) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const dropdownStyle: React.CSSProperties = coords
    ? size === "lg"
      ? {
          position: "fixed",
          top: `${coords.top - 12}px`,
          left: `${coords.left}px`,
          transform: "translateY(-100%)",
        }
      : {
          position: "fixed",
          top: `${coords.top + coords.height + 18}px`,
          left: `${coords.left + coords.width - 160}px`,
        }
    : {};

  const menuContent = (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: size === "lg" ? -15 : 15, scale: 0.95, rotateX: size === "lg" ? 12 : -12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: size === "lg" ? -10 : 10, scale: 0.95, rotateX: size === "lg" ? -8 : 8, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onMouseLeave={() => setHoveredIndex(null)}
          data-hover="gold"
          style={
            size === "lg"
              ? {
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  right: "0",
                  backfaceVisibility: "hidden",
                  perspective: 1000,
                  transformStyle: "preserve-3d"
                }
              : {
                  ...dropdownStyle,
                  backfaceVisibility: "hidden",
                  perspective: 1000,
                  transformStyle: "preserve-3d"
                }
          }
          className="language-switcher-menu w-40 glass-card py-1.5 shadow-glass z-[9999] transform-gpu"
        >
          {LANGUAGES.map((lng, idx) => {
            const active = locale === lng;
            const isHovered = hoveredIndex === idx;
            const showHighlight = hoveredIndex !== null ? isHovered : active;

            return (
              <button
                key={lng}
                onClick={() => {
                  onSwitch(lng);
                  setOpen(false);
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`relative flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-left transition-colors font-mono tracking-wider z-10 ${
                  active ? "active text-gold font-bold" : "text-muted hover:text-gold"
                }`}
              >
                <span className="text-sm select-none">{LANGUAGE_FLAGS[lng]}</span>
                <span className="flex-1">{LANGUAGE_LABELS[lng]}</span>
                {active && <Check className="h-3.5 w-3.5 text-gold" />}

                {showHighlight && (
                  <motion.div
                    layoutId={size === "lg" ? "langHighlightMobile" : "langHighlightDesktop"}
                    className="absolute inset-x-1.5 inset-y-1 rounded-[18px] bg-white/[0.08] border border-gold/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-label="Select Language"
        aria-expanded={open}
        className={`language-switcher-trigger font-mono font-bold tracking-wider rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 flex items-center justify-center gap-2 transition-all duration-300 liquid-glass border border-white/10 text-white ${size === "lg"
            ? "px-5 py-2 text-sm min-h-[44px] min-w-[120px]"
            : "px-3.5 py-1.5 text-xs min-h-11 min-w-[85px]"
          }`}
      >
        <span className="text-sm select-none">{LANGUAGE_FLAGS[locale]}</span>
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
            } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted && (
        size === "lg" 
          ? menuContent 
          : createPortal(menuContent, document.body)
      )}
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

  const [navMenuCoords, setNavMenuCoords] = useState<{ left: number; width: number } | null>(null);

  const updateMenuCoords = () => {
    if (navListRef.current) {
      const rect = navListRef.current.getBoundingClientRect();
      setNavMenuCoords({
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    updateMenuCoords();
    // Add small delay to ensure rendering finished
    const timer = setTimeout(updateMenuCoords, 100);
    window.addEventListener("resize", updateMenuCoords);
    window.addEventListener("scroll", updateMenuCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMenuCoords);
      window.removeEventListener("scroll", updateMenuCoords);
    };
  }, [isScrolled]);

  const targetLeft = hoveredLink && navMenuCoords ? navMenuCoords.left : 0;

  return (
    <>
      <header
        style={{ backfaceVisibility: "hidden", overflow: "visible" }}
        className={`!fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1300px] transition-all duration-500 rounded-full py-2.5 px-5 sm:px-7 !overflow-visible transform-gpu ${isScrolled
            ? "liquid-glass-strong shadow-card"
            : "liquid-glass shadow-lg"
          }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo (emblem + text logo — clean & compact) */}
          <TransitionLink
            href="/"
            aria-label={tA11y("logoLabel")}
            className="flex min-h-11 min-w-11 items-center gap-4.5 group select-none shrink-0 text-foreground"
          >
            <DDCLogo
              title="DDC — Центр цифрового развития НБК"
              className="h-[42px] w-[38px] transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-95 shrink-0"
            />
            <div className="hidden min-[370px]:flex flex-col justify-center min-w-0 font-sans tracking-wide">
              <div className="flex flex-col leading-[1.05] uppercase">
                <span className="font-heading font-black text-[9px] sm:text-[9.5px] tracking-[0.05em] text-white">
                  Digital
                </span>
                <span className="font-heading font-black text-[9px] sm:text-[9.5px] tracking-[0.05em] text-white">
                  Development
                </span>
                <span className="font-heading font-black text-[9px] sm:text-[9.5px] tracking-[0.05em] text-white">
                  Center
                </span>
              </div>
              <span className="font-sans font-semibold text-[7px] sm:text-[7.5px] tracking-[0.04em] text-gold uppercase mt-0.5 whitespace-nowrap block">
                National Bank of Kazakhstan
              </span>
            </div>
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
                    className={`relative flex items-center px-3 py-2 rounded-full text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${isActive ? "text-gold" : "text-muted hover:text-foreground"
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
            <NavPreviewCard link={hoveredLink} locale={locale} width={navMenuCoords?.width} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay — full-screen glass panel.
          NOTE: we deliberately do NOT use the `.liquid-glass-strong` class here.
          That class is authored as unlayered CSS, so its `position: relative`,
          `overflow: hidden` and `border-radius` win the cascade over Tailwind's
          *layered* `.fixed`/`.overflow-y-auto`/`.rounded-none` utilities — which
          left this panel `position: relative`, sitting in document flow at the
          page top. It looked fine at scrollY 0 but appeared "not to open" once
          the user had scrolled down. The glass look is applied inline instead so
          nothing overrides `position: fixed`. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-hover="gold"
            style={{
              position: "fixed",
              background: "rgba(8,8,10,0.94)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
            }}
            className="inset-0 z-40 flex flex-col justify-start pt-28 pb-10 px-8 xl:hidden overflow-y-auto"
          >
            {/* Menu links — right-aligned, separated by thin hairlines so each
                row is a comfortable full-width tap target. */}
            <nav className="flex flex-col">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                      delay: idx * 0.035
                    }}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block w-full py-3.5 text-right font-heading text-xl tracking-wide transition-colors duration-300 ${idx !== 0 ? "border-t border-white/[0.07]" : ""
                        } ${isActive ? "text-gold font-semibold" : "text-foreground active:text-gold"
                        }`}
                    >
                      {link.name}
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom action panel — right-aligned to match the menu items */}
            <div className="flex flex-col gap-5 mt-auto pt-6 border-t border-white/[0.07]">
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-muted">{t("theme")}</span>
                <CinematicThemeSwitcher />
              </div>
              <div className="flex items-center justify-end gap-4">
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
