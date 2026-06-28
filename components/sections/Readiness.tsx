"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";
import Icon, { IconName } from "@/components/ui/Icon";

type ReadinessItem = {
  key: "routes" | "contacts" | "accessibility" | "proof";
  icon: IconName;
  href: string;
  accent: "forest" | "gold";
};

const ITEMS: ReadinessItem[] = [
  { key: "routes", icon: "globe", href: "/services", accent: "gold" },
  { key: "contacts", icon: "contact-center", href: "/contact", accent: "forest" },
  { key: "accessibility", icon: "eye", href: "/faq", accent: "forest" },
  { key: "proof", icon: "database", href: "/news", accent: "gold" },
];

export default function Readiness() {
  const t = useTranslations("Readiness");

  return (
    <section id="readiness" className="relative w-full overflow-hidden bg-background py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,168,76,0.09),transparent_28%),radial-gradient(circle_at_80%_62%,rgba(26,99,71,0.13),transparent_32%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 sm:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span className="mb-4 block font-mono text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("overline")}
          </span>
          <h2 className="font-display text-4xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">
            {t("title")}{" "}
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{t("subtitle")}</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["build", "audit", "content"].map((key) => (
              <div key={key} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/80">{t(`chips.${key}.label`)}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{t(`chips.${key}.value`)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={item.href} className="group block h-full">
                <GlassCard hoverAccent={item.accent} className="h-full p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] ${
                        item.accent === "gold" ? "text-gold" : "text-forest-light"
                      } bg-white/[0.03]`}
                    >
                      <Icon name={item.icon} size={22} />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-gold">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{t(`items.${item.key}.desc`)}</p>
                  <div className="mt-6 flex items-center gap-2 border-t border-glass-border pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold/80">
                    {t("open")}
                    <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
