import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon, { IconName } from "@/components/ui/Icon";
import DDCEventGallery from "@/components/sections/DDCEventGallery";
import CareerCenterSection from "@/components/sections/CareerCenterSection";
import { getTranslations } from "next-intl/server";
import JobApplicationForm from "@/components/sections/JobApplicationForm";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { BubbleText } from "@/components/ui/BubbleText";
import ScrollReveal, { ENTRANCE_DURATION, STAGGER } from "@/components/motion/ScrollReveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { AutoRevealingHeading } from "@/components/motion/AutoRevealingHeading";


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

const HH_EMPLOYER_URL = "https://almaty.hh.kz/employer/28161";

/**
 * Locale-neutral fallback data, used when the HH API is unreachable.
 *
 * Everything here is a key or a raw value — never display text. The previous
 * version stored rendered Russian strings ("Не указана", "3 июня", the job
 * titles and departments) and only ran location/type/experience through the
 * translator, so English and Kazakh visitors saw a half-Russian vacancy list
 * whenever the API call failed — which is exactly what it does today.
 */
interface FallbackJob {
  titleKey: string;
  deptKey: string;
  expKey: string;
  badgeVariant: Job["badgeVariant"];
  salary: HHSalary | null;
  /** ISO date; rendered via `formatDate` in the active locale. */
  publishedAt: string;
}

const kzt = (from: number): HHSalary => ({ from, to: null, currency: "KZT", gross: false });

const FALLBACK_JOBS: FallbackJob[] = [
  { titleKey: "socAnalyst",              deptKey: "infosec",           expKey: "exp1To3",        badgeVariant: "green", salary: null,          publishedAt: "2026-06-05" },
  { titleKey: "directorItApplications",  deptKey: "itApplications",    expKey: "expMoreThan6",   badgeVariant: "gold",  salary: null,          publishedAt: "2026-06-03" },
  { titleKey: "chiefSpecialistPlanning", deptKey: "planningEconomics", expKey: "exp3To6",        badgeVariant: "gray",  salary: null,          publishedAt: "2026-06-03" },
  { titleKey: "chiefSpecialistCnb",      deptKey: "hr",                expKey: "exp3To6",        badgeVariant: "gray",  salary: null,          publishedAt: "2026-05-26" },
  { titleKey: "helpdeskSpecialist",      deptKey: "helpdesk",          expKey: "exp1To3",        badgeVariant: "green", salary: null,          publishedAt: "2026-05-20" },
  { titleKey: "middleDevops",            deptKey: "devops",            expKey: "exp1To3",        badgeVariant: "green", salary: kzt(800_000),  publishedAt: "2026-05-14" },
  { titleKey: "seniorDataEngineer",      deptKey: "dataManagement",    expKey: "exp3To6",        badgeVariant: "gold",  salary: kzt(1_000_000), publishedAt: "2026-05-14" },
  { titleKey: "middleDataEngineer",      deptKey: "dataManagement",    expKey: "exp1To3",        badgeVariant: "green", salary: kzt(600_000),  publishedAt: "2026-05-14" },
  { titleKey: "juniorDataEngineer",      deptKey: "dataManagement",    expKey: "expNoExperience", badgeVariant: "gray", salary: kzt(400_000),  publishedAt: "2026-05-14" },
];

/** Maps the Russian department names the HH API returns onto our i18n keys. */
const HH_DEPARTMENT_KEYS: Record<string, string> = {
  "информационная безопасность": "infosec",
  "прикладные ит-решения": "itApplications",
  "планово-экономический отдел": "planningEconomics",
  "управление персоналом (hr)": "hr",
  "служба поддержки пользователей": "helpdesk",
  "инфраструктура и devops": "devops",
  "управление данными": "dataManagement",
};

function translateExperience(expName: string | undefined, t: Translator) {
  if (!expName) return "";
  const name = expName.toLowerCase();
  if (name.includes("нет") || name.includes("без")) return t("expNoExperience");
  if (name.includes("1") || (name.includes("3") && name.includes("год"))) return t("exp1To3");
  if (name.includes("3") || (name.includes("6") && name.includes("лет"))) return t("exp3To6");
  if (name.includes("более")) return t("expMoreThan6");
  return expName;
}

/* The helpers below used to inline the Russian/Kazakh/English wording in
   `locale === ...` ternaries. They now read from the catalogue, so adding a
   locale needs no code change — only new message keys. */

function translateType(typeName: string | undefined, t: Translator) {
  if (!typeName) return "";
  const name = typeName.toLowerCase();
  if (name.includes("полная") || name.includes("full")) return t("typeFullTime");
  return typeName;
}

function translateLocation(locName: string | undefined, t: Translator) {
  if (!locName) return "";
  const name = locName.toLowerCase();
  if (name.includes("астана") || name.includes("astana")) return t("locAstana");
  if (name.includes("алматы") || name.includes("almaty")) return t("locAlmaty");
  return locName;
}

function translateDepartment(deptName: string | undefined, t: Translator) {
  if (!deptName) return t("deptDefault");
  const key = HH_DEPARTMENT_KEYS[deptName.trim().toLowerCase()];
  // Unknown departments keep HH's own wording rather than a wrong guess.
  return key ? t(`departments.${key}`) : deptName;
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
        // HH only ever returns the vacancy name in Russian, so this one field
        // stays in its source language; everything around it is localised.
        title: item.name,
        department: translateDepartment(item.department?.name, t),
        location: translateLocation(item.area?.name, t),
        type: translateType(item.employment?.name, t),
        badgeVariant: (item.name.toLowerCase().includes("senior") || item.name.toLowerCase().includes("director"))
          ? ("gold" as const)
          : (item.name.toLowerCase().includes("junior") ? ("gray" as const) : ("green" as const)),
        salary: formatSalary(item.salary, t),
        experience: translateExperience(item.experience?.name, t),
        published: formatDate(item.published_at, locale),
        url: item.alternate_url || HH_EMPLOYER_URL,
      }));
    }
    return getFallbackJobs(locale, t);
  } catch (e) {
    console.error("Failed to fetch vacancies from HH API, using fallback jobs", e);
    return getFallbackJobs(locale, t);
  }
}

function getFallbackJobs(locale: string, t: Translator): Job[] {
  return FALLBACK_JOBS.map((job) => ({
    title: t(`jobs.${job.titleKey}`),
    department: t(`departments.${job.deptKey}`),
    location: t("locAstana"),
    type: t("typeFullTime"),
    badgeVariant: job.badgeVariant,
    salary: formatSalary(job.salary, t),
    experience: t(job.expKey),
    published: formatDate(job.publishedAt, locale),
    url: HH_EMPLOYER_URL,
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
    <div className="relative w-full bg-transparent overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">

        {/* Заголовок страницы */}
        <div className="max-w-3xl mb-16">
          <ScrollReveal blur={6} distance={16} duration={ENTRANCE_DURATION.label}>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-mono font-medium mb-4 block">
              {t("overline")}
            </span>
          </ScrollReveal>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            <RevealWords text={t("titleLine1")} delay={0.08} useBubbleText />{" "}
            <br />
            <RevealWords
              text={t("titleAccent")}
              delay={0.3}
              useBubbleText
              bubbleActiveClassName="text-gold font-black"
            />
          </h1>
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.subtitle} delay={0.2}>
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
              <BubbleText text={t("subtitle")} />
            </p>
          </ScrollReveal>
        </div>

        {/* Миссия и Видение */}
        <StaggerGroup stagger={STAGGER.base} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <StaggerItem duration={ENTRANCE_DURATION.card} className="h-full">
            <GlassCard hoverAccent="gold" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5 h-full">
              <h2 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
                <Icon name="compass" size={20} className="text-gold-light" />
                <BubbleText text={t("missionTitle")} />
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                <BubbleText text={t("missionDesc")} />
              </p>
            </GlassCard>
          </StaggerItem>

          <StaggerItem duration={ENTRANCE_DURATION.card} className="h-full">
            <GlassCard hoverAccent="forest" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5 h-full">
              <h2 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
                <Icon name="eye" size={20} className="text-forest-light" />
                <BubbleText text={t("visionTitle")} />
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                <BubbleText text={t("visionDesc")} />
              </p>
            </GlassCard>
          </StaggerItem>
        </StaggerGroup>

        {/* Ценности компании */}
        <div className="mb-24">
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title}>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-8 font-normal tracking-tight">
              {t("valuesTitle")} <span className="text-gradient-gold">{t("valuesAccent")}</span>
            </h2>
          </ScrollReveal>
          <StaggerGroup stagger={STAGGER.base} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((v, idx) => (
              <StaggerItem key={idx} duration={ENTRANCE_DURATION.card}>
                <GlassCard hoverAccent="gold" variant="glass" isTiltEnabled={false} className="p-6 border border-white/5 hover:border-gold/15 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold-light mb-4 shrink-0">
                      <Icon name={v.icon} size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 tracking-wide">
                      <BubbleText text={v.title} />
                    </h3>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      <BubbleText text={v.text} />
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Культура CENTER */}
        <CareerCenterSection />

        {/* Почему именно мы? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-12">
          <div className="lg:col-span-7">
            <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title}>
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">{t("whyUsTitle")}</h2>
            </ScrollReveal>
            <div className="space-y-4">
              {whyUsPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  <Icon name="check-circle" size={20} className="text-forest-light shrink-0 mt-0.5" />
                  <AutoRevealingHeading text={point} splitBy="word" delay={0.025} className="flex-1 min-w-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка «Почему именно мы?» — только Lottie-иллюстрация */}
          <ScrollReveal direction="right" distance={40} duration={ENTRANCE_DURATION.card} delay={0.15} className="lg:col-span-5 relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-forest/20 rounded-full blur-2xl pointer-events-none" />
            <LottieAnimation
              src="/animations/career-programmer-code.json"
              label="DDC engineer writing production code"
              className="mb-0"
              frameClassName="min-h-[320px] sm:min-h-[380px] lg:min-h-[440px]"
              animationClassName="max-h-[440px] scale-[1.12] w-full"
            />
          </ScrollReveal>
        </div>

        {/* Отдельная секция призыва «Начните свой путь в DDC» */}
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.card} className="mb-24">
          <GlassCard
            hoverAccent="gold"
            variant="liquid-strong"
            isTiltEnabled={false}
            className="relative overflow-hidden p-8 sm:p-12 flex flex-col items-center text-center"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="relative text-2xl sm:text-3xl font-bold text-white mb-3 tracking-wide">
              {t("startJourneyTitle")}
            </h2>
            <p className="relative text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mb-8">
              {t("startJourneyDesc")}
            </p>
            <a href="#jobs-list" className="relative inline-block">
              <Button variant="gold" className="justify-center">
                {t("viewVacancies", { count: jobs.length })}
              </Button>
            </a>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.card}>
          <DDCEventGallery />
        </ScrollReveal>

        {/* Список вакансий */}
        <div id="jobs-list" className="scroll-mt-24">
          <ScrollReveal blur={10} duration={ENTRANCE_DURATION.title}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl sm:text-4xl text-white font-normal tracking-tight">
                {t("openVacanciesTitle", { count: jobs.length })} <span className="text-gradient-gold">{t("openVacanciesAccent", { count: jobs.length })}</span>
              </h2>
              <span className="text-xs text-zinc-300 font-mono">
                {t("actualDate", { date: todayStr })}
              </span>
            </div>
          </ScrollReveal>

          <StaggerGroup stagger={STAGGER.tight} className="grid grid-cols-1 gap-6">
            {jobs.map((job, idx) => (
              <StaggerItem key={idx} duration={ENTRANCE_DURATION.card}>
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

                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 self-start md:self-auto">
                    <Button variant="outline" className="flex items-center justify-center gap-2 group whitespace-nowrap">
                      {t("applyBtn")}
                      <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </a>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Форма подачи отклика с ИТ-тестом */}
        <ScrollReveal blur={10} duration={ENTRANCE_DURATION.card} className="mt-24">
          <JobApplicationForm jobs={jobs} />
        </ScrollReveal>

      </div>
    </div>
  );
}
