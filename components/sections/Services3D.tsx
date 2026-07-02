"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CinematicAltynAdamExperience, { CinematicChapter } from "@/components/sections/CinematicAltynAdamExperience";

export default function Services3D() {
  const t = useTranslations("ServicesPage");

  const services: CinematicChapter[] = useMemo(
    () => [
      {
        id: 1,
        icon: "coins",
        eyebrow: "01 / CBDC",
        title: t("s1.title"),
        description: t("s1.description"),
        features: [t("s1.f1"), t("s1.f2"), t("s1.f3")],
        meta: "Hyperledger Fabric / Solidity / Go / HSM",
      },
      {
        id: 2,
        icon: "zap",
        eyebrow: "02 / IPS",
        title: t("s2.title"),
        description: t("s2.description"),
        features: [t("s2.f1"), t("s2.f2"), t("s2.f3")],
        meta: "Java / Spring Boot / Kafka / ISO 20022",
      },
      {
        id: 3,
        icon: "bank",
        eyebrow: "03 / Core",
        title: t("s3.title"),
        description: t("s3.description"),
        features: [t("s3.f1"), t("s3.f2"), t("s3.f3")],
        meta: "C++ / Python / Oracle / IBM MQ",
      },
      {
        id: 4,
        icon: "shield-check",
        eyebrow: "04 / Security",
        title: t("s4.title"),
        description: t("s4.description"),
        features: [t("s4.f1"), t("s4.f2"), t("s4.f3")],
        meta: "Fortinet / HSM / Linux / Crypto Units",
      },
      {
        id: 5,
        icon: "share",
        eyebrow: "05 / Open API",
        title: t("s5.title"),
        description: t("s5.description"),
        features: [t("s5.f1"), t("s5.f2"), t("s5.f3")],
        meta: "Node.js / OAuth2 / GraphQL / Kong",
      },
      {
        id: 6,
        icon: "chart",
        eyebrow: "06 / Data",
        title: t("s6.title"),
        description: t("s6.description"),
        features: [t("s6.f1"), t("s6.f2"), t("s6.f3")],
        meta: "Hadoop / Spark / ClickHouse / Python",
      },
    ],
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
      scrollLengthClass="min-h-[460vh]"
    />
  );
}
