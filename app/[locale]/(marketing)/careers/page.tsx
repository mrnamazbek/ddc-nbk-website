import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon, { IconName } from "@/components/ui/Icon";
import DDCEventGallery from "@/components/sections/DDCEventGallery";
import { getTranslations } from "next-intl/server";


type Translator = (key: string, values?: Record<string, string | number>) => string;
interface HHSalary { from: number | null; to: number | null; currency: string; gross: boolean; }
interface HHVacancy {
  name: string;
  department?: { name?: string } | null;
  area?: { name?: string } | null;
  employment?: { name?: string } | null;
  salary?: HHSalary | null;
  experience?: { name?: string } | null;
  published_at?: string;
  alternate_url?: string;
}

interface Job {
  title: string;
  department: string;
  location: string;
  type: string;
  badgeVariant: "gold" | "green" | "gray";
  salary: string;
  experience: string;
  published: string;
  url: string;
}

const FALLBACK_JOBS: Job[] = [
  {
    title: "SOC Analyst L1/L2",
    department: "Информационная безопасность",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "green",
    salary: "Не указана",
    experience: "1–3 года",
    published: "5 июня",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Director of IT Applications",
    department: "Прикладные ИТ-решения",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "gold",
    salary: "Не указана",
    experience: "Более 6 лет",
    published: "3 июня",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Главный специалист планово-экономического отдела",
    department: "Планово-экономический отдел",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "gray",
    salary: "Не указана",
    experience: "3–6 лет",
    published: "3 июня",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Главный специалист по компенсациям и льготам (C&B)",
    department: "Управление персоналом (HR)",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "gray",
    salary: "Не указана",
    experience: "3–6 лет",
    published: "26 мая",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Специалист службы поддержки пользователей (IT Help Desk)",
    department: "Служба поддержки пользователей",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "green",
    salary: "Не указана",
    experience: "1–3 года",
    published: "20 мая",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Middle DevOps Engineer",
    department: "Инфраструктура и DevOps",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "green",
    salary: "от 800 000 ₸",
    experience: "1–3 года",
    published: "14 мая",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Senior Data Engineer",
    department: "Управление данными",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "gold",
    salary: "от 1 000 000 ₸",
    experience: "3–6 лет",
    published: "14 мая",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Middle Data Engineer",
    department: "Управление данными",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "green",
    salary: "от 600 000 ₸",
    experience: "1–3 года",
    published: "14 мая",
    url: "https://almaty.hh.kz/employer/28161"
  },
  {
    title: "Junior Data Engineer",
    department: "Управление данными",
    location: "Астана",
    type: "Полная занятость",
    badgeVariant: "gray",
    salary: "от 400 000 ₸",
    experience: "Без опыта",
    published: "14 мая",
    url: "https://almaty.hh.kz/employer/28161"
  }
];

function translateExperience(expName: string | undefined, t: Translator) {
  if (!expName) return "";
  const name = expName.toLowerCase();
  if (name.includes("нет") || name.includes("без")) return t("expNoExperience");
  if (name.includes("1") || (name.includes("3") && name.includes("год"))) return t("exp1To3");
  if (name.includes("3") || (name.includes("6") && name.includes("лет"))) return t("exp3To6");
  if (name.includes("более")) return t("expMoreThan6");
  return expName;
}

function translateType(typeName: string | undefined, locale: string) {
  if (!typeName) return "";
  const name = typeName.toLowerCase();
  if (name.includes("полная") || name.includes("full")) {
    return locale === "kz" ? "Толық жұмыс күні" : locale === "en" ? "Full-time" : "Полная занятость";
  }
  return typeName;
}

function translateLocation(locName: string | undefined, locale: string) {
  if (!locName) return "";
  const name = locName.toLowerCase();
  if (name.includes("астана") || name.includes("astana")) {
    return locale === "kz" ? "Астана" : locale === "en" ? "Astana" : "Астана";
  }
  if (name.includes("алматы") || name.includes("almaty")) {
    return locale === "kz" ? "Алматы" : locale === "en" ? "Almaty" : "Алматы";
  }
  return locName;
}

function formatSalary(salary: HHSalary | null | undefined, t: Translator) {
  if (!salary) return t("noSalary");
  const { from, to, currency } = salary;
  const currSymbol = currency === "RUR" ? "₽" : currency === "KZT" ? "₸" : currency;
  if (from && to) return t("salaryFromTo", { from, to, curr: currSymbol });
  if (from) return t("salaryFrom", { from, curr: currSymbol });
  if (to) return t("salaryTo", { to, curr: currSymbol });
  return t("noSalary");
}

function formatDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "kz" ? "kk-KZ" : locale === "en" ? "en-US" : "ru-RU", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
}

async function getVacancies(locale: string, t: Translator): Promise<Job[]> {
  try {
    const res = await fetch("https://api.hh.ru/vacancies?employer_id=28161", {
      headers: {
        "User-Agent": "DDC-Website/1.0 (info@bsbnb.kz)",
        "HH-User-Agent": "DDC-Website/1.0 (info@bsbnb.kz)",
      },
      next: { revalidate: 3600 }, // кэш на 1 час (ISR)
    });
    if (!res.ok) {
      throw new Error(`HH API returned status ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map((item: HHVacancy) => ({
        title: item.name,
        department: item.department?.name || (locale === "kz" ? "Цифрлық даму орталығы" : locale === "en" ? "Digital Development Center" : "Центр цифрового развития"),
        location: translateLocation(item.area?.name, locale),
        type: translateType(item.employment?.name, locale),
        badgeVariant: (item.name.toLowerCase().includes("senior") || item.name.toLowerCase().includes("director")) 
          ? ("gold" as const) 
          : (item.name.toLowerCase().includes("junior") ? ("gray" as const) : ("green" as const)),
        salary: formatSalary(item.salary, t),
        experience: translateExperience(item.experience?.name, t),
        published: formatDate(item.published_at, locale),
        url: item.alternate_url || "https://almaty.hh.kz/employer/28161",
      }));
    }
    return getFallbackJobs(locale, t);
  } catch (e) {
    console.error("Failed to fetch vacancies from HH API, using fallback jobs", e);
    return getFallbackJobs(locale, t);
  }
}

function getFallbackJobs(locale: string, t: Translator): Job[] {
  return FALLBACK_JOBS.map(job => ({
    ...job,
    location: translateLocation(job.location, locale),
    type: translateType(job.type, locale),
    experience: translateExperience(job.experience, t),
  }));
}

interface CareersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareersPage" });
  const jobs = await getVacancies(locale, t);

  const values: { icon: IconName; title: string; text: string }[] = [
    {
      icon: "compass",
      title: t("v1Title"),
      text: t("v1Text")
    },
    {
      icon: "users2",
      title: t("v2Title"),
      text: t("v2Text")
    },
    {
      icon: "award",
      title: t("v3Title"),
      text: t("v3Text")
    },
    {
      icon: "shield",
      title: t("v4Title"),
      text: t("v4Text")
    },
    {
      icon: "bank",
      title: t("v5Title"),
      text: t("v5Text")
    }
  ];

  const whyUsPoints = [
    t("whyUs1"),
    t("whyUs2"),
    t("whyUs3"),
    t("whyUs4")
  ];

  const todayStr = new Date().toLocaleDateString(locale === "kz" ? "kk-KZ" : locale === "en" ? "en-US" : "ru-RU", { month: "long", year: "numeric" });

  return (
    <div className="relative w-full bg-background overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок страницы */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            {t("titleLine1")} <br />
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Миссия и Видение */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <GlassCard hoverAccent="gold" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
              <Icon name="compass" size={20} className="text-gold-light" />
              {t("missionTitle")}
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {t("missionDesc")}
            </p>
          </GlassCard>

          <GlassCard hoverAccent="forest" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
              <Icon name="eye" size={20} className="text-forest-light" />
              {t("visionTitle")}
            </h2>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {t("visionDesc")}
            </p>
          </GlassCard>
        </div>

        {/* Ценности компании */}
        <div className="mb-24">
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-8 font-normal tracking-tight">
            {t("valuesTitle")} <span className="text-gradient-gold">{t("valuesAccent")}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((v, idx) => {
              return (
                <GlassCard key={idx} hoverAccent="gold" variant="glass" isTiltEnabled={false} className="p-6 border border-white/5 hover:border-gold/15 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light mb-4 shrink-0">
                      <Icon name={v.icon} size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 tracking-wide">{v.title}</h3>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">{v.text}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Почему именно мы? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-12 border-b border-white/5">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">{t("whyUsTitle")}</h2>
            <ul className="space-y-4">
              {whyUsPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  <Icon name="check-circle" size={20} className="text-forest-light shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-5 bg-charcoal/40 border border-white/5 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-forest/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold-light mb-6">
              <Icon name="zap" size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{t("startJourneyTitle")}</h3>
            <p className="text-xs text-zinc-300 font-light leading-relaxed mb-6">
              {t("startJourneyDesc")}
            </p>
            <a href="#jobs-list" className="w-full block">
              <Button variant="gold" className="w-full justify-center text-xs">
                {t("viewVacancies", { count: jobs.length })}
              </Button>
            </a>
          </div>
        </div>

        <DDCEventGallery />

        {/* Список вакансий */}
        <div id="jobs-list" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal tracking-tight">
              {t("openVacanciesTitle", { count: jobs.length })} <span className="text-gradient-gold">{t("openVacanciesAccent", { count: jobs.length })}</span>
            </h2>
            <span className="text-xs text-zinc-300 font-mono">
              {t("actualDate", { date: todayStr })}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <GlassCard className="border-white/5 hover:border-gold/20 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={job.badgeVariant}>{job.department}</Badge>
                      <span className="text-xs text-zinc-300">•</span>
                      <span className="text-xs text-zinc-300 font-light flex items-center gap-1.5">
                        <Icon name="map-pin" size={14} />
                        {job.location}
                      </span>
                      <span className="text-xs text-zinc-300">•</span>
                      <span className="text-xs text-zinc-300 font-light flex items-center gap-1.5">
                        <Icon name="clock" size={14} />
                        {job.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-300 font-light">
                      <span>{t("expLabel")} <strong className="text-zinc-300 font-semibold">{job.experience}</strong></span>
                      <span>{t("salaryLabel")} <strong className="text-gold-light font-semibold">{job.salary}</strong></span>
                      {job.published && (
                        <>
                          <span className="text-zinc-600">|</span>
                          <span>{t("pubLabel")} <strong className="text-zinc-300">{job.published}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="self-start md:self-auto">
                    <Button variant="outline" className="flex items-center justify-center gap-2 group whitespace-nowrap">
                      {t("applyBtn")}
                      <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </a>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
