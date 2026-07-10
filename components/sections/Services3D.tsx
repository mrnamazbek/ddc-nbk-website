"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CinematicAltynAdamExperience, { CinematicChapter } from "@/components/sections/CinematicAltynAdamExperience";

const visualAssets = [
  "/animations/services-fintech-flow.json",
  "/animations/services-server-sync.json",
  "/animations/services-fraud-network.json",
  "/animations/services-secure-folder.json",
  "/animations/services-fraud-network.json",
] as const;

export default function Services3D() {
  const t = useTranslations("ServicesPage");

  const services: CinematicChapter[] = useMemo(
    () => [1, 2, 3, 4, 5].map((id, index) => ({
      id,
      icon: ["contact-center", "procurement", "database", "server", "shield-check"][index] as CinematicChapter["icon"],
      eyebrow: `0${id} / DDC`,
      title: t(`s${id}.title`),
      description: t(`s${id}.description`),
      features: [t(`s${id}.f1`), t(`s${id}.f2`)],
      visualSrc: visualAssets[index],
      visualLabel: t(`s${id}.title`),
    })),
    [t],
  );

  return (
    <CinematicAltynAdamExperience
      overline={t("overline")}
      title={t("titleLine1")}
      accent={t("titleAccent")}
      subtitle={t("subtitle")}
      chapters={services}
      finalEyebrow={t("overline")}
      finalTitle={t("titleLine1")}
      finalAccent={t("titleAccent")}
      finalDescription={t("subtitle")}
      scrollLengthClass="min-h-[430vh]"
    />
  );
}
