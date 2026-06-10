"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Magnetic from "../motion/Magnetic";
import TransitionLink from "../motion/TransitionLink";
import CinematicThemeSwitcher from "../ui/cinematic-theme-switcher";

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
      className="inline-flex items-center gap-0.5 liquid-glass rounded-full p-1"
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
            className={`font-mono font-bold tracking-wider rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
              size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
            } ${active ? "bg-gold text-black" : "text-gray-light hover:text-gold"}`}
          >
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = useTranslations("Header");
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

  const navLinks: { name: string; href: string }[] = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("mission"), href: "/about#mission" },
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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1300px] transition-all duration-500 rounded-full ${
          isScrolled
            ? "liquid-glass-strong shadow-2xl py-3 px-6 sm:px-8"
            : "liquid-glass shadow-lg py-4 px-6 sm:px-8"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <TransitionLink href="/" className="flex items-center gap-3 group select-none">
            <Image
              src="/images/logo/ddc-logo.svg"
              alt="DDC — Центр цифрового развития НБК"
              width={42}
              height={42}
              priority
              className="transition-transform duration-700 group-hover:rotate-[120deg] pointer-events-none"
            />
            <div>
              <span className="font-heading font-bold text-xl tracking-wider text-white">DDC</span>
              <span className="block text-[8px] text-gold font-mono tracking-widest leading-none uppercase">
                Subsidiary of NBK
              </span>
            </div>
          </TransitionLink>

          {/* Desktop menu — liquid-glass pill with a sliding cursor highlight */}
          <ul
            ref={navListRef}
            onMouseLeave={restPill}
            className="hidden xl:flex items-center relative liquid-glass border border-white/10 p-1.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
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
                  onMouseEnter={(e) => movePillTo(e.currentTarget)}
                  className="relative z-10"
                >
                  <TransitionLink
                    href={link.href}
                    className={`relative block px-3 py-2 rounded-full text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-gold" : "text-gray-light hover:text-white"
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
            {/* Theme Switcher */}
            <CinematicThemeSwitcher />

            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} onSwitch={switchLocale} />

            {/* Procurement Portal Button */}
            <a href="https://zakup.nationalbank.kz" target="_blank" rel="noopener noreferrer">
              <Magnetic>
                <Button variant="gold" size="sm">
                  {t("procurementPortal")}
                </Button>
              </Magnetic>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-full liquid-glass text-white hover:text-gold transition-colors focus-visible:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
            style={{ background: "rgba(8,8,10,0.82)" }}
            className="fixed inset-0 z-40 liquid-glass-strong rounded-none flex flex-col justify-between pt-32 pb-16 px-8 xl:hidden"
          >
            {/* Menu links */}
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <TransitionLink
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-heading text-2xl tracking-wide block ${
                        isActive ? "text-gold font-semibold" : "text-white"
                      }`}
                    >
                      {link.name}
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile menu bottom action panel */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-sm text-gray-light">Тіл / Язык:</span>
                <LanguageSwitcher locale={locale} onSwitch={switchLocale} size="lg" />
              </div>

              <a href="https://zakup.nationalbank.kz" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="gold" size="lg" className="w-full">
                  {t("procurementPortal")} <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
