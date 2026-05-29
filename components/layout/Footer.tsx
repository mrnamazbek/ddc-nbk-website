"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Решения",
      links: [
        { name: "Государственный сектор", href: "/services#gov" },
        { name: "Финансовые институты", href: "/services#finance" },
        { name: "Цифровой Тенге", href: "/digital#tenge" },
        { name: "Открытый Банкинг", href: "/digital#open-banking" },
      ],
    },
    {
      title: "Организация",
      links: [
        { name: "О компании", href: "/about" },
        { name: "Безопасность", href: "/security" },
        { name: "Пресс-центр", href: "/news" },
        { name: "Карьера в DDC", href: "/careers" },
      ],
    },
    {
      title: "Контакты",
      links: [
        { name: "Пресс-служба", href: "mailto:press@ddc-nbk.kz" },
        { name: "Поддержка API", href: "/contact#support" },
        { name: "Офис в Алматы", href: "/contact#almaty" },
        { name: "Офис в Астане", href: "/contact#astana" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-20 pb-12 relative overflow-hidden">
      {/* Soft gradient glows */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-forest-dark/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[20vw] h-[20vh] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-[clamp(16px,5vw,80px)]">
        {/* Top of footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 select-none">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="40" fill="#0a1a11" />
                <rect x="15" y="15" width="70" height="70" rx="35" stroke="#C9A84C" strokeWidth="2" />
                <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fill="#C9A84C" />
              </svg>
              <div>
                <span className="font-heading font-bold text-lg tracking-wider text-white">DDC</span>
                <span className="block text-[7px] text-gold font-mono tracking-widest leading-none uppercase">
                  Digital Development Center
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-light max-w-sm leading-relaxed">
              Официальный технологический партнер и дочерняя организация Национального Банка Республики Казахстан. Мы строим устойчивую цифровую финансовую экосистему будущего.
            </p>
            <div className="text-xs text-gold/80 font-mono tracking-wide">
              Лицензия АРРФР №1.2.345/67 от 12.05.2024
            </div>
          </div>

          {/* Links columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="text-xs font-mono tracking-widest text-gold uppercase">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-light hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom of footer */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-light">
              © {currentYear} ТОО «Центр цифрового развития Национального Банка РК» (DDC). Все права защищены.
            </span>
            <span className="text-[10px] text-gray-mid leading-relaxed">
              Информация, размещенная на данном ресурсе, носит официальный характер и охраняется законодательством Республики Казахстан.
            </span>
          </div>

          <div className="flex gap-6 text-xs text-gray-light">
            <Link href="/security" className="hover:text-gold transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/security" className="hover:text-gold transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
