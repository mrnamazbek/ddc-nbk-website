"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { ContainerScroll, CardSticky } from "@/components/ui/card-sticky";
import Icon, { IconName } from "@/components/ui/Icon";
import { BubbleText } from "@/components/ui/BubbleText";
import LottieAnimation from "@/components/ui/LottieAnimation";

/**
 * The five DDC operational services as a sticky stack: the section heading sits
 * at the TOP (not in a left rail), and each card parks under the one before it
 * as you scroll, so the stack builds up in place.
 *
 * Copy comes from `ServicesPage.*` — unchanged. Each card pairs the copy on the
 * left with its (brand-recoloured) Lottie on the right.
 */
const SERVICES: { id: number; icon: IconName; visual: string }[] = [
  { id: 1, icon: "contact-center", visual: "/animations/services-contact-center.json" },
  { id: 2, icon: "procurement", visual: "/animations/services-server-sync.json" },
  { id: 3, icon: "database", visual: "/animations/services-fintech-flow.json" },
  { id: 4, icon: "server", visual: "/animations/services-secure-folder.json" },
  { id: 5, icon: "shield-check", visual: "/animations/services-fraud-network.json" },
];

// The header is fixed, so the stack parks below it rather than at the very top.
const HEADER_OFFSET = 104;
const CARD_STEP = 56;

export default function ServicesStickyCards() {
  const t = useTranslations("ServicesPage");

  const services = useMemo(
    () =>
      SERVICES.map((service) => ({
        ...service,
        eyebrow: `0${service.id} / DDC`,
        title: t(`s${service.id}.title`),
        description: t(`s${service.id}.description`),
        features: [t(`s${service.id}.f1`), t(`s${service.id}.f2`)],
      })),
    [t],
  );

  return (
    <section className="theme-on-forest relative w-full bg-background px-6 pb-36 pt-28 text-foreground sm:pb-44">
      {/* Heading block — stays at the top of the section, full width. */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-5 inline-block rounded-[var(--radius-pill)] border border-[var(--glass-border-gold)] bg-[var(--glass-bg)] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-light">
          {t("overline")}
        </span>
        <h1 className="font-display text-4xl font-normal leading-tight tracking-tight text-foreground sm:text-6xl">
          <BubbleText text={t("titleLine1")} />{" "}
          <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          <BubbleText text={t("subtitle")} />
        </p>
      </div>

      <ContainerScroll className="mx-auto mt-16 max-w-5xl space-y-8">
        {services.map((service, index) => (
          <CardSticky
            key={service.id}
            index={index}
            baseY={HEADER_OFFSET}
            incrementY={CARD_STEP}
            incrementZ={6}
            className="ddc-service-card theme-on-forest p-8 sm:p-10 lg:min-h-[22rem] lg:p-12"
          >
            <div className="flex min-h-full items-center gap-8 lg:gap-12">
              <div className="min-w-0 flex-1">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-input)] border border-[var(--glass-border-gold)] bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] text-gold-light">
                    <Icon name={service.icon} size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">
                      {service.eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      <BubbleText text={service.title} />
                    </h2>
                  </div>
                </div>

                <p className="max-w-xl text-base leading-relaxed text-muted">
                  <BubbleText text={service.description} />
                </p>

                <ul className="mt-4 grid gap-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <Icon name="check-circle" size={14} className="mt-0.5 shrink-0 text-forest-light" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual column — hidden below sm, where the card is too narrow
                  to give it room without squeezing the copy. */}
              <div className="hidden shrink-0 sm:block">
                <LottieAnimation
                  src={service.visual}
                  label={service.title}
                  shell
                  className="w-52 lg:w-64 xl:w-72"
                  frameClassName="h-52 min-h-52 lg:h-64 lg:min-h-64 xl:h-72 xl:min-h-72"
                  animationClassName="max-h-52 lg:max-h-64 xl:max-h-72"
                />
              </div>
            </div>
          </CardSticky>
        ))}
      </ContainerScroll>
    </section>
  );
}
