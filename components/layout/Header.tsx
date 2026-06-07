"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "../ui/Button";
import Magnetic from "../motion/Magnetic";

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

  const languages = ["kz", "ru", "en"];
  const currentLang = locale.toUpperCase();

  const cycleLanguage = () => {
    const nextIdx = (languages.indexOf(locale) + 1) % languages.length;
    router.replace(pathname, { locale: languages[nextIdx] });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-[clamp(16px,5vw,80px)] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            {/* Official DDC emblem */}
            <span className="relative block h-10 w-10 shrink-0 rounded-full ring-1 ring-gold/30 overflow-hidden transition-transform duration-700 group-hover:rotate-[360deg]">
              <Image
                src="/images/logo/ddc-emblem.png"
                alt="DDC"
                fill
                sizes="40px"
                className="object-cover pointer-events-none"
                priority
              />
            </span>
            <div>
              <span className="font-heading font-bold text-xl tracking-wider text-white">DDC</span>
              <span className="block text-[8px] text-gold font-mono tracking-widest leading-none uppercase">
                Subsidiary of NBK
              </span>
            </div>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-heading text-sm transition-colors relative py-1 hover:text-white ${
                    isActive ? "text-white font-medium" : "text-gray-light"
                  }`}
                >
                  {link.name}
                  {/* Smooth hover indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-gold-light"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right action panel */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher */}
            <button
              onClick={cycleLanguage}
              className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-gray-light hover:text-gold transition-colors select-none cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang}</span>
            </button>

            {/* Contact Button */}
            <Link href="/contact">
              <Magnetic>
                <Button variant="gold" size="sm">
                  {t("contact")}
                </Button>
              </Magnetic>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-gold transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col justify-between pt-32 pb-16 px-8 lg:hidden"
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
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-heading text-2xl tracking-wide block ${
                        isActive ? "text-gold font-semibold" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile menu bottom action panel */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-sm text-gray-light">Язык интерфейса:</span>
                <button
                  onClick={cycleLanguage}
                  className="flex items-center gap-2 text-sm font-mono font-bold text-white hover:text-gold"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLang}</span>
                </button>
              </div>

              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <Button variant="gold" size="lg" className="w-full">
                  {t("contact")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
