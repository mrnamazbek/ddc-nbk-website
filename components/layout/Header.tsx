"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Magnetic from "../motion/Magnetic";
import TransitionLink from "../motion/TransitionLink";

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

  const navLinks = [
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("digital"), href: "/digital" },
    { name: t("security"), href: "/security" },
    { name: t("analytics"), href: "/analytics" },
    { name: t("news"), href: "/news" },
    { name: t("careers"), href: "/careers" },
  ];

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
            {/* Heraldic Shield in Saka style (abstract SVG) */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-700 group-hover:rotate-[360deg] pointer-events-none"
            >
              <rect x="10" y="10" width="80" height="80" rx="40" fill="url(#forest_grad)" />
              <rect x="15" y="15" width="70" height="70" rx="35" stroke="url(#gold_grad)" strokeWidth="2" />
              {/* Geometry of Saka eagle/sun */}
              <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fill="url(#gold_grad)" />
              <defs>
                <linearGradient id="forest_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0a1a11" />
                  <stop offset="1" stopColor="#1A3D2B" />
                </linearGradient>
                <linearGradient id="gold_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8C87A" />
                  <stop offset="0.5" stopColor="#C9A84C" />
                  <stop offset="1" stopColor="#8B7035" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <span className="font-heading font-bold text-xl tracking-wider text-white">DDC</span>
              <span className="block text-[8px] text-gold font-mono tracking-widest leading-none uppercase">
                Subsidiary of NBK
              </span>
            </div>
          </TransitionLink>

          {/* Desktop menu */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/20 border border-white/[0.04] p-1 rounded-full backdrop-blur-md relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TransitionLink
                  key={link.name}
                  href={link.href}
                  className={`font-heading text-sm tracking-wide transition-all duration-300 relative px-4 py-1.5 rounded-full hover:text-white flex items-center justify-center ${
                    isActive ? "text-white font-medium" : "text-gray-light hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Smooth active glass indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 liquid-glass rounded-full -z-10 shadow-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </TransitionLink>
              );
            })}
          </nav>

          {/* Right action panel */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} onSwitch={switchLocale} />

            {/* Contact Button */}
            <TransitionLink href="/contact">
              <Magnetic>
                <Button variant="gold" size="sm">
                  {t("contact")}
                </Button>
              </Magnetic>
            </TransitionLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full liquid-glass text-white hover:text-gold transition-colors focus-visible:outline-none"
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
            className="fixed inset-0 z-40 liquid-glass-strong rounded-none flex flex-col justify-between pt-32 pb-16 px-8 lg:hidden"
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

              <TransitionLink href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="gold" size="lg" className="w-full">
                  {t("contact")} <ArrowRight className="w-4 h-4" />
                </Button>
              </TransitionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
