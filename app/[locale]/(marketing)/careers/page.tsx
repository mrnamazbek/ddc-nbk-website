import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon, { IconName } from "@/components/ui/Icon";

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

function formatSalary(salary: any) {
  if (!salary) return "Не указана";
  const { from, to, currency } = salary;
  const currSymbol = currency === "RUR" ? "₽" : currency === "KZT" ? "₸" : currency;
  if (from && to) return `от ${from} до ${to} ${currSymbol}`;
  if (from) return `от ${from} ${currSymbol}`;
  if (to) return `до ${to} ${currSymbol}`;
  return "Не указана";
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
}

async function getVacancies(): Promise<Job[]> {
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
      return data.items.map((item: any) => ({
        title: item.name,
        department: item.department?.name || "Центр цифрового развития",
        location: item.area?.name || "Астана",
        type: item.employment?.name || "Полная занятость",
        badgeVariant: (item.name.toLowerCase().includes("senior") || item.name.toLowerCase().includes("director")) 
          ? ("gold" as const) 
          : (item.name.toLowerCase().includes("junior") ? ("gray" as const) : ("green" as const)),
        salary: formatSalary(item.salary),
        experience: item.experience?.name || "Опыт не указан",
        published: formatDate(item.published_at),
        url: item.alternate_url || "https://almaty.hh.kz/employer/28161",
      }));
    }
    return FALLBACK_JOBS;
  } catch (e) {
    console.error("Failed to fetch vacancies from HH API, using fallback jobs", e);
    return FALLBACK_JOBS;
  }
}

export default async function CareersPage() {
  const jobs = await getVacancies();

  const values: { icon: IconName; title: string; text: string }[] = [
    {
      icon: "compass",
      title: "Инновации",
      text: "Стремление внедрять передовые технологии и быть лидерами цифровой трансформации финансового сектора."
    },
    {
      icon: "users2",
      title: "Прозрачность",
      text: "Открытость во внутренних и внешних процессах, честность с клиентами, партнерами и каждым сотрудником."
    },
    {
      icon: "award",
      title: "Качество",
      text: "Непрерывное совершенствование ИТ-продуктов и процессов для соответствия наивысшим международным стандартам."
    },
    {
      icon: "shield",
      title: "Надёжность",
      text: "Гарантия высочайшей отказоустойчивости, безопасности и стабильности всех государственных ИТ-решений."
    },
    {
      icon: "bank",
      title: "Партнерство",
      text: "Тесное сотрудничество с Национальным Банком и его дочерними организациями для эффективной реализации проектов."
    }
  ];

  const whyUsPoints = [
    "Рабочая среда построена на технологиях Oracle, Sybase, IBM, Microsoft, где ежедневно решаются нетривиальные задачи в системной интеграции и сложной архитектуре.",
    "Мы сплоченная команда с ясными ценностями и признанной ISO системой качества, где работа — это уровень профессионализма и взаимной поддержки.",
    "Мы охватываем все уровни ответственности от системной архитектуры до поддержки, обеспечивая сотрудникам гибкий рост и возможность вращаться в разных ролях.",
    "Вы получите уникальный опыт работы над системными государственными задачами и возможность расти в сложной крупной инфраструктуре Нацбанка РК."
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden min-h-screen pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Заголовок страницы */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-mono font-medium mb-4 block">
            Центр цифрового развития Национального Банка Казахстана
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white mb-6">
            Центр в поиске <br />
            <span className="text-gradient-gold font-medium">новых талантов</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            АО «Центр цифрового развития Национального Банка Казахстана» — стратегический партнер цифровой трансформации финансового сектора. С 2022 года компания разрабатывает, внедряет и сопровождает государственные информационные системы для Национального Банка и его дочерних организаций.
          </p>
        </div>

        {/* Миссия и Видение */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <GlassCard hoverAccent="gold" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
              <Icon name="compass" size={20} className="text-gold" />
              Миссия
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Быть лидером в цифровой трансформации, обеспечивая Национальный Банк и его дочерние структуры передовыми IT-решениями, которые ускоряют инновации, обеспечивают стабильность и устанавливают новые стандарты качества в управлении данными и технологиями.
            </p>
          </GlassCard>

          <GlassCard hoverAccent="forest" variant="liquid" isTiltEnabled={false} className="p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 tracking-wide flex items-center gap-3">
              <Icon name="eye" size={20} className="text-forest-light" />
              Видение
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Мы стремимся стать эталоном в области цифровой трансформации, развивая и внедряя передовые IT-решения для Национального Банка и его дочерних структур. Мы видим себя ключевым партнёром, способным обеспечивать инновации, высокую надёжность и эффективность всех технологических процессов, прокладывая путь для других организаций к цифровому будущему.
            </p>
          </GlassCard>
        </div>

        {/* Ценности компании */}
        <div className="mb-24">
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-8 font-normal tracking-tight">
            Наши <span className="text-gradient-gold">ценности</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((v, idx) => {
              return (
                <GlassCard key={idx} hoverAccent="gold" variant="glass" isTiltEnabled={false} className="p-6 border border-white/5 hover:border-gold/15 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-forest/20 border border-forest-light/10 flex items-center justify-center text-gold mb-4 shrink-0">
                      <Icon name={v.icon} size={20} />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 tracking-wide">{v.title}</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">{v.text}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Почему именно мы? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-12 border-b border-white/5">
          <div className="lg:col-span-7">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Почему именно мы?</h3>
            <ul className="space-y-4">
              {whyUsPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  <Icon name="check-circle" size={20} className="text-forest-light shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-5 bg-charcoal/40 border border-white/5 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-forest/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold mb-6">
              <Icon name="zap" size={24} />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Начните свой путь в DDC</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
              Если вы хотите работать над системными государственными задачами, расти в сложной крупной инфраструктуре и быть частью технологической базы Национального Банка — присоединяйтесь к ЦЦР НБК!
            </p>
            <a href="#jobs-list" className="w-full block">
              <Button variant="gold" className="w-full justify-center text-xs">
                Посмотреть вакансии ({jobs.length})
              </Button>
            </a>
          </div>
        </div>

        {/* Список вакансий */}
        <div id="jobs-list" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl sm:text-4xl text-white font-normal tracking-tight">
              Открытые <span className="text-gradient-gold">вакансии ({jobs.length})</span>
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Актуально на: {new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
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
                      <span className="text-xs text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400 font-light flex items-center gap-1.5">
                        <Icon name="map-pin" size={14} />
                        {job.location}
                      </span>
                      <span className="text-xs text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400 font-light flex items-center gap-1.5">
                        <Icon name="clock" size={14} />
                        {job.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500 font-light">
                      <span>Опыт работы: <strong className="text-zinc-300 font-semibold">{job.experience}</strong></span>
                      <span>Заработная плата: <strong className="text-gold font-semibold">{job.salary}</strong></span>
                      {job.published && (
                        <>
                          <span className="text-zinc-600">|</span>
                          <span>Опубликовано: <strong className="text-zinc-400">{job.published}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="self-start md:self-auto">
                    <Button variant="outline" className="flex items-center justify-center gap-2 group whitespace-nowrap">
                      Откликнуться
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
