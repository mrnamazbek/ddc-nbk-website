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
    <section className="theme-on-forest relative w-full bg-[#040c08] px-6 pb-32 pt-28 text-white">
      {/* Heading block — stays at the top of the section, full width. */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-5 inline-block rounded-full border border-gold/20 bg-white/[0.035] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-light">
          {t("overline")}
        </span>
        <h1 className="font-display text-4xl font-normal leading-tight tracking-tight sm:text-6xl">
          <BubbleText text={t("titleLine1")} />{" "}
          <BubbleText text={t("titleAccent")} activeClassName="text-gold font-black" />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/64 sm:text-base">
          <BubbleText text={t("subtitle")} />
        </p>
      </div>

      <ContainerScroll className="mx-auto mt-16 max-w-4xl space-y-6">
        {services.map((service, index) => (
          <CardSticky
            key={service.id}
            index={index}
            baseY={HEADER_OFFSET}
            incrementY={CARD_STEP}
            incrementZ={6}
            // Opaque background: a translucent card would let the cards further
            // down the stack bleed through once they slide underneath.
            className="theme-on-forest rounded-[28px] border border-gold/20 bg-[#071b13] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:p-8"
          >
            <div className="flex items-center gap-6">
              <div className="min-w-0 flex-1">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-light">
                    <Icon name={service.icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-light/80">
                      {service.eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                      <BubbleText text={service.title} />
                    </h2>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/76">
                  <BubbleText text={service.description} />
                </p>

                <ul className="mt-4 grid gap-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-white/70"
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
                  className="w-40 lg:w-52"
                  frameClassName="min-h-40 h-40 lg:min-h-52 lg:h-52"
                  animationClassName="max-h-40 lg:max-h-52"
                />
              </div>
            </div>
          </CardSticky>
        ))}
      </ContainerScroll>
    </section>
  );
}
