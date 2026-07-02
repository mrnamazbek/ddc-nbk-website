"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CinematicAltynAdamExperience, { CinematicChapter } from "@/components/sections/CinematicAltynAdamExperience";

export default function Mission3D() {
  const t = useTranslations("Mission");

  const steps: CinematicChapter[] = useMemo(
    () => [
      {
        id: 1,
        eyebrow: "01 / Vision",
        title: t("step1Title"),
        description: t("step1Desc"),
      },
      {
        id: 2,
        eyebrow: "02 / Systems",
        title: t("step2Title"),
        description: t("step2Desc"),
      },
      {
        id: 3,
        eyebrow: "03 / Trust",
        title: t("step3Title"),
        description: t("step3Desc"),
      },
      {
        id: 4,
        eyebrow: "04 / Ethics",
        title: t("step4Title"),
        description: t("step4Desc"),
      },
    ],
    [t],
  );

  return (
    <CinematicAltynAdamExperience
      overline={t("overline")}
      title={t("titleLine1")}
      accent={t("titleAccent")}
      trailingTitle={t("titleLine2")}
      subtitle={t("subtitle")}
      chapters={steps}
      finalEyebrow={t("overline")}
      finalTitle={t("titleLine1")}
      finalAccent={t("titleAccent")}
      finalDescription={t("subtitle")}
      scrollLengthClass="min-h-[400vh]"
    />
  );
}
