"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("RU");
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
    { name: "О нас", href: "/about" },
    { name: "Услуги", href: "/services" },
    { name: "Технологии", href: "/digital" },
    { name: "Безопасность", href: "/security" },
    { name: "Новости", href: "/news" },
    { name: "Карьера", href: "/careers" },
  ];

  const languages = ["KZ", "RU", "EN"];

  // Переключение языка (демонстрационное)
  const cycleLanguage = () => {
    const nextIdx = (languages.indexOf(currentLang) + 1) % languages.length;
    setCurrentLang(languages[nextIdx]);
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
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            {/* Гербовый щит в Сакском стиле (абстрактный SVG) */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-700 group-hover:rotate-[360deg] pointer-events-none"
            >
              <rect x="10" y="10" width="80" height="80" rx="40" fill="url(#green_grad)" />
              <rect x="15" y="15" width="70" height="70" rx="35" stroke="url(#gold_grad)" strokeWidth="2" />
              {/* Геометрия сакского беркута/солнца */}
              <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fill="url(#gold_grad)" />
              <defs>
                <linearGradient id="green_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0F251A" />
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
          </Link>

          {/* Десктоп-меню */}
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
                  {/* Плавная линия наведения */}
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

          {/* Правая панель действий */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Переключатель языка */}
            <button
              onClick={cycleLanguage}
              className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-gray-light hover:text-gold transition-colors select-none cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang}</span>
            </button>

            {/* Золотая кнопка связи */}
            <Link href="/contact">
              <Button variant="gold" size="sm">
                Связаться
              </Button>
            </Link>
          </div>

          {/* Кнопка мобильного меню */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-gold transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Мобильное меню-оверлей */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col justify-between pt-32 pb-16 px-8 lg:hidden"
          >
            {/* Ссылки меню */}
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

            {/* Нижняя панель действий мобильного меню */}
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
                  Связаться <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
