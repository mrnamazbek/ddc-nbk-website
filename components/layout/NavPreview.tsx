"use client";

import { motion } from "framer-motion";
import Icon, { type IconName } from "@/components/ui/Icon";

type L = "ru" | "kz" | "en";
type T = Record<L, string>;

interface PreviewData {
  icon: IconName;
  tagline: T;
  description: T;
  highlights: { icon: IconName; label: T }[];
}

const OPEN: T = { ru: "Перейти в раздел", kz: "Бөлімге өту", en: "Open section" };

/**
 * Rich, structured content for the desktop nav hover preview — one entry per
 * route. Trilingual. Kept out of Header.tsx so the markup stays lean.
 */
export const NAV_PREVIEWS: Record<string, PreviewData> = {
  "/": {
    icon: "home",
    tagline: { ru: "Обзор", kz: "Шолу", en: "Overview" },
    description: {
      ru: "Цифровые решения для финансовой стабильности государства.",
      kz: "Мемлекеттің қаржылық тұрақтылығы үшін цифрлық шешімдер.",
      en: "Digital solutions for the financial stability of the state.",
    },
    highlights: [
      { icon: "coins", label: { ru: "Цифровой тенге", kz: "Цифрлық теңге", en: "Digital Tenge" } },
      { icon: "layers", label: { ru: "Межбанковский клиринг", kz: "Банкаралық клиринг", en: "Interbank clearing" } },
      { icon: "server", label: { ru: "Госинфраструктура", kz: "Мемлекеттік инфрақұрылым", en: "State infrastructure" } },
    ],
  },
  "/about": {
    icon: "users2",
    tagline: { ru: "Кто мы", kz: "Біз кімбіз", en: "Who we are" },
    description: {
      ru: "История, ценности, руководство и основатель Центра.",
      kz: "Орталықтың тарихы, құндылықтары, басшылығы және құрылтайшысы.",
      en: "The Center's history, values, leadership and founder.",
    },
    highlights: [
      { icon: "award", label: { ru: "История и ценности", kz: "Тарих пен құндылықтар", en: "History & values" } },
      { icon: "users", label: { ru: "Команда руководства", kz: "Басшылық командасы", en: "Leadership team" } },
      { icon: "bank", label: { ru: "Основатель — НБ РК", kz: "Құрылтайшы — ҚРҰБ", en: "Founder — NBK" } },
    ],
  },
  "/services": {
    icon: "it-services",
    tagline: { ru: "Что мы делаем", kz: "Біз не істейміз", en: "What we do" },
    description: {
      ru: "Разработка систем, IT-услуги и информационная безопасность.",
      kz: "Жүйелерді әзірлеу, IT-қызметтер және ақпараттық қауіпсіздік.",
      en: "Systems development, IT services and information security.",
    },
    highlights: [
      { icon: "development", label: { ru: "Разработка систем", kz: "Жүйелерді әзірлеу", en: "Systems development" } },
      { icon: "server", label: { ru: "Центр IT-услуг", kz: "IT-қызметтер орталығы", en: "IT services center" } },
      { icon: "shield", label: { ru: "Информбезопасность", kz: "Ақпараттық қауіпсіздік", en: "Information security" } },
    ],
  },
  "/mission": {
    icon: "compass",
    tagline: { ru: "Зачем мы", kz: "Не үшін", en: "Why we exist" },
    description: {
      ru: "Технологическое ядро финансовой системы Казахстана.",
      kz: "Қазақстанның қаржы жүйесінің технологиялық өзегі.",
      en: "The technological core of Kazakhstan's financial system.",
    },
    highlights: [
      { icon: "chart", label: { ru: "Финансовая стабильность", kz: "Қаржылық тұрақтылық", en: "Financial stability" } },
      { icon: "lock", label: { ru: "Защищённая инфраструктура", kz: "Қорғалған инфрақұрылым", en: "Secure infrastructure" } },
      { icon: "globe", label: { ru: "Технологический суверенитет", kz: "Технологиялық егемендік", en: "Tech sovereignty" } },
    ],
  },
  "/news": {
    icon: "calendar",
    tagline: { ru: "Пресс-центр", kz: "Баспасөз орталығы", en: "Newsroom" },
    description: {
      ru: "Актуальные события, пресс-релизы и технологические обновления.",
      kz: "Өзекті оқиғалар, пресс-релиздер және технологиялық жаңартулар.",
      en: "Current events, press releases and technology updates.",
    },
    highlights: [
      { icon: "send", label: { ru: "Пресс-релизы", kz: "Пресс-релиздер", en: "Press releases" } },
      { icon: "zap", label: { ru: "Обновления продуктов", kz: "Өнім жаңартулары", en: "Product updates" } },
      { icon: "calendar", label: { ru: "События", kz: "Оқиғалар", en: "Events" } },
    ],
  },
  "/careers": {
    icon: "users",
    tagline: { ru: "Присоединяйтесь", kz: "Бізге қосылыңыз", en: "Join us" },
    description: {
      ru: "Вакансии, стажировки и карьерные возможности в DDC.",
      kz: "DDC-дегі бос орындар, тағылымдамалар және мансаптық мүмкіндіктер.",
      en: "Vacancies, internships and career opportunities at DDC.",
    },
    highlights: [
      { icon: "users", label: { ru: "Открытые вакансии", kz: "Ашық вакансиялар", en: "Open roles" } },
      { icon: "award", label: { ru: "Стажировки", kz: "Тағылымдамалар", en: "Internships" } },
      { icon: "globe", label: { ru: "Вакансии hh.kz", kz: "hh.kz вакансиялары", en: "hh.kz vacancies" } },
    ],
  },
  "/contact": {
    icon: "phone",
    tagline: { ru: "Связаться", kz: "Байланысу", en: "Get in touch" },
    description: {
      ru: "Свяжитесь с нами: офисы, карта и контакт-центр 1477.",
      kz: "Бізбен байланысыңыз: кеңселер, карта және 1477 байланыс орталығы.",
      en: "Reach us: offices, map and the 1477 contact center.",
    },
    highlights: [
      { icon: "map-pin", label: { ru: "Офисы: Астана, Алматы", kz: "Кеңселер: Астана, Алматы", en: "Offices: Astana, Almaty" } },
      { icon: "contact-center", label: { ru: "Контакт-центр 1477", kz: "1477 байланыс орталығы", en: "Contact center 1477" } },
      { icon: "mail", label: { ru: "Форма обращения", kz: "Өтініш формасы", en: "Feedback form" } },
    ],
  },
};

import { useRouter } from "@/i18n/navigation";

/** Premium structured hover-preview card for a nav section. */
export default function NavPreviewCard({
  link,
  locale,
}: {
  link: { name: string; href: string };
  locale: string;
}) {
  const data = NAV_PREVIEWS[link.href];
  const router = useRouter();
  if (!data) return null;
  const L = (locale in OPEN ? locale : "en") as L;

  return (
    <div
      onClick={() => router.push(link.href)}
      className="nav-preview-card relative w-[400px] overflow-hidden rounded-2xl border border-gold/20 bg-[#060a08]/98 backdrop-blur-3xl p-5 text-left shadow-2xl cursor-pointer hover:border-gold/40 hover:bg-white/[0.03] active:scale-[0.99] transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(link.href);
        }
      }}
    >
      {/* Header: icon tile + title + tagline */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
          <Icon name={data.icon} size={22} animate={false} />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            {data.tagline[L]}
          </span>
          <h4 className="truncate text-base font-semibold text-white">{link.name}</h4>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-3 text-xs font-light leading-relaxed text-zinc-300">
        {data.description[L]}
      </p>

      {/* Highlights */}
      <ul className="relative z-10 mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
        {data.highlights.map((h, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.16, delay: 0.01 + i * 0.015, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 text-xs text-zinc-200"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-gold/90">
              <Icon name={h.icon} size={13} animate={false} />
            </span>
            <span className="truncate">{h.label[L]}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-xs font-semibold text-gold">
        {OPEN[L]}
        <Icon name="arrow-right" size={14} animate={false} />
      </div>
    </div>
  );
}
