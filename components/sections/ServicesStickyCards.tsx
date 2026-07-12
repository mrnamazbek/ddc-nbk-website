"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { ContainerScroll, CardSticky } from "@/components/ui/card-sticky";
import Icon, { IconName } from "@/components/ui/Icon";
import LottieAnimation from "@/components/ui/LottieAnimation";
import PageIntro from "@/components/sections/PageIntro";

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
  { id: 2, icon: "procurement", visual: "/animations/services-fintech-flow.json" },
  { id: 3, icon: "database", visual: "/animations/services-server-sync.json" },
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
    <section className="theme-on-forest relative w-full bg-transparent px-6 pb-36 pt-32 text-foreground sm:pb-44">
      <div className="mx-auto max-w-7xl">
        <PageIntro
          overline={t("overline")}
          titleLine1={t("titleLine1")}
          titleAccent={t("titleAccent")}
          subtitle={t("subtitle")}
        />
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
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="max-w-xl text-base leading-relaxed text-muted">
                  {service.description}
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
