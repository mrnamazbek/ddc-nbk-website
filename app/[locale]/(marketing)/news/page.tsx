"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ENTRANCE_DURATION,
  ENTRANCE_EASE,
  STAGGER,
  VIEWPORT_ONCE,
} from "@/components/motion/ScrollReveal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useA11y } from "@/components/theme/AccessibilityProvider";
import {
  getLinkedInPostUrl,
  LINKEDIN_NEWS_INDEX,
  NEWS_PAGE_SIZE,
  type NewsCategory,
} from "@/lib/news/linkedin";
import { cn } from "@/lib/utils";

const categories: Array<"all" | NewsCategory> = [
  "all",
  "aiData",
  "infrastructure",
  "people",
  "organization",
];

export default function NewsPage() {
  const t = useTranslations("NewsPage");
  const { enabled: a11yEnabled } = useA11y();
  const reduce = useReducedMotion() || a11yEnabled;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [page, setPage] = useState(1);

  const filteredNews = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return LINKEDIN_NEWS_INDEX.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const searchableText = [item.title, item.summary, ...item.searchTerms]
        .join(" ")
        .toLocaleLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / NEWS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * NEWS_PAGE_SIZE,
    currentPage * NEWS_PAGE_SIZE,
  );
  const firstVisible = filteredNews.length === 0 ? 0 : (currentPage - 1) * NEWS_PAGE_SIZE + 1;
  const lastVisible = Math.min(currentPage * NEWS_PAGE_SIZE, filteredNews.length);

  const changePage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    document.getElementById("news-results")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ENTRANCE_DURATION.title, ease: ENTRANCE_EASE }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            {t("overline")}
          </p>
          <h1 className="font-display text-4xl leading-[0.96] text-[var(--text-primary)] sm:text-6xl">
            {t("titleLine1")} <span className="text-[var(--color-gold)]">{t("titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
            {t("subtitle")}
          </p>
        </motion.header>

        <section aria-label={t("archiveLabel")} className="mt-12">
          <div className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--glass-border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-5">
            <label className="sr-only" htmlFor="news-search">
              {t("searchLabel")}
            </label>
            <input
              id="news-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={t("searchPlaceholder")}
              className="min-h-11 w-full rounded-[var(--radius-input)] border border-[var(--glass-border)] bg-[var(--surface-elevated)] px-4 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--color-gold)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold-soft)]"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterLabel")}>
              {categories.map((item) => {
                const isActive = category === item;

                return (
                  <Button
                    key={item}
                    type="button"
                    variant={isActive ? "gold" : "ghost"}
                    size="sm"
                    aria-pressed={isActive}
                    onClick={() => {
                      setCategory(item);
                      setPage(1);
                    }}
                    className={cn(
                      "min-h-9 px-3 text-xs",
                      isActive && "border-[var(--color-gold)] text-[var(--text-primary)]",
                    )}
                  >
                    {t(`filters.${item}`)}
                  </Button>
                );
              })}
            </div>
          </div>

          <div id="news-results" className="mt-8 scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {t("results", { count: filteredNews.length })}
              </p>
              {filteredNews.length > 0 ? (
                <p className="text-sm text-[var(--text-tertiary)]">
                  {t("showing", { from: firstVisible, to: lastVisible, count: filteredNews.length })}
                </p>
              ) : null}
            </div>

            {paginatedNews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedNews.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{
                      duration: ENTRANCE_DURATION.card,
                      delay: reduce ? 0 : Math.min(index * STAGGER.tight, STAGGER.loose),
                      ease: ENTRANCE_EASE,
                    }}
                    className="group flex min-h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--glass-border)] bg-[var(--surface)] shadow-[var(--shadow-soft)] hover:border-[var(--glass-border-gold)] hover:shadow-[var(--shadow-float)]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-elevated)]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--color-gold)]">
                          <Icon name="linkedin" size={44} />
                        </div>
                      )}
                      {item.featured ? (
                        <span className="absolute left-4 top-4 rounded-[var(--radius-button)] border border-[var(--glass-border-gold)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                          {t("featured")}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.15em]">
                        <span className="text-[var(--color-gold)]">{t(`filters.${item.category}`)}</span>
                        <span className="text-[var(--text-tertiary)]">{t(`sources.${item.source}`)}</span>
                      </div>
                      <h2 className="mt-4 font-display text-2xl leading-tight text-[var(--text-primary)]">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{item.summary}</p>
                      <a
                        href={getLinkedInPostUrl(item.activityId)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto pt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-[var(--color-gold)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                      >
                        {t("openLinkedIn")}
                        <Icon name="arrow-up-right" size={16} />
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--radius-card)] border border-[var(--glass-border)] bg-[var(--surface)] px-6 py-16 text-center">
                <h2 className="font-display text-2xl text-[var(--text-primary)]">{t("noResultsTitle")}</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                  {t("noResultsDescription")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setPage(1);
                  }}
                >
                  {t("clearFilters")}
                </Button>
              </div>
            )}
          </div>

          {totalPages > 1 ? (
            <nav aria-label={t("paginationLabel")} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button type="button" variant="outline" size="sm" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                <Icon name="arrow-left" size={16} />
                {t("previous")}
              </Button>
              <span className="text-sm text-[var(--text-secondary)]">{t("page", { current: currentPage, total: totalPages })}</span>
              <Button type="button" variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
                {t("next")}
                <Icon name="arrow-right" size={16} />
              </Button>
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
