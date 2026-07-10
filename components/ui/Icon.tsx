"use client";

import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { motion, useReducedMotion } from "framer-motion";
import { useIconSystem } from "../theme/IconSystemProvider";
import { cn } from "@/lib/utils";
import * as TechIcons from "./TechIcons";

// Список доступных семантических имен иконок
export type IconName =
  | "menu"
  | "x"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "sun"
  | "moon"
  | "trending-up"
  | "trending-down"
  | "percent"
  | "calendar"
  | "refresh"
  | "home"
  | "plus"
  | "minus"
  | "help"
  | "database"
  | "cpu"
  | "server"
  | "check"
  | "shield-check"
  | "lock"
  | "alert"
  | "key"
  | "globe"
  | "eye"
  | "layers"
  | "coins"
  | "zap"
  | "share"
  | "chart"
  | "bank"
  | "check-circle"
  | "map-pin"
  | "phone"
  | "mail"
  | "clock"
  | "send"
  | "users"
  | "compass"
  | "award"
  | "shield"
  | "users2"
  | "contact-center"
  | "procurement"
  | "it-services"
  | "development"
  | "code"
  | "palette"
  | "clickhouse"
  | "airflow"
  | "dbt"
  | "oracle"
  | "mastercard"
  | "hyperledger"
  | "express"
  | "kong"
  | "spark"
  | "hadoop"
  | "tableau"
  | "solana"
  | "spring"
  | "kafka"
  | "postgresql"
  | "redis"
  | "java"
  | "golang"
  | "python"
  | "docker"
  | "graphql"
  | "nodejs"
  | "solidity"
  | "cpp"
  | "jira"
  | "confluence"
  | "git"
  | "github"
  | "linkedin"
  | "instagram"
  | "gitlab"
  | "kubernetes"
  | "terraform"
  | "ansible"
  | "nginx"
  | "prometheus"
  | "helm"
  | "dotnet"
  | "html5"
  | "css3"
  | "grpc"
  | "angular"
  | "csharp"
  | "javascript"
  | "nats"
  | "nestjs"
  | "typescript"
  | "ethereum"
  | "grafana"
  | "jenkins"
  | "githubactions";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  animate?: boolean;
}

// Маппинг для MingCute (Iconify)
const mingcuteMap: Partial<Record<IconName, string>> = {
  menu: "mingcute:menu-line",
  x: "mingcute:close-line",
  "arrow-right": "mingcute:arrow-right-line",
  "arrow-left": "mingcute:arrow-left-line",
  "arrow-up-right": "mingcute:arrow-right-up-line",
  sun: "mingcute:sun-line",
  moon: "mingcute:moon-line",
  "trending-up": "mingcute:trending-up-line",
  "trending-down": "mingcute:trending-down-line",
  percent: "mingcute:percentage-line",
  calendar: "mingcute:calendar-line",
  refresh: "mingcute:refresh-1-line",
  home: "mingcute:home-5-line",
  plus: "mingcute:add-line",
  minus: "mingcute:minimize-line",
  help: "mingcute:question-line",
  database: "mingcute:storage-line",
  cpu: "mingcute:chip-line",
  server: "mingcute:server-line",
  check: "mingcute:check-line",
  "shield-check": "mingcute:safe-shield-line",
  lock: "mingcute:lock-line",
  alert: "mingcute:alert-line",
  key: "mingcute:key-2-line",
  globe: "mingcute:earth-line",
  eye: "mingcute:eye-line",
  layers: "mingcute:layers-line",
  coins: "mingcute:copper-coin-line",
  zap: "mingcute:flash-line",
  share: "mingcute:share-forward-line",
  chart: "mingcute:chart-bar-line",
  bank: "mingcute:bank-line",
  "check-circle": "mingcute:check-circle-line",
  "map-pin": "mingcute:map-pin-line",
  phone: "mingcute:phone-line",
  mail: "mingcute:mail-line",
  clock: "mingcute:time-line",
  send: "mingcute:paper-plane-line",
  users: "mingcute:group-line",
  compass: "mingcute:compass-line",
  award: "mingcute:award-line",
  shield: "mingcute:shield-line",
  users2: "mingcute:group-line",
  "contact-center": "mingcute:headphone-line",
  procurement: "mingcute:shopping-cart-1-line",
  "it-services": "mingcute:settings-1-line",
  development: "mingcute:code-line",
  code: "mingcute:code-line",
  palette: "mingcute:palette-line",
};

// Маппинг для Solar (Iconify)
const solarMap: Partial<Record<IconName, string>> = {
  menu: "solar:hamburger-menu-linear",
  x: "solar:close-circle-linear",
  "arrow-right": "solar:arrow-right-linear",
  "arrow-left": "solar:arrow-left-linear",
  "arrow-up-right": "solar:arrow-right-up-linear",
  sun: "solar:sun-2-linear",
  moon: "solar:moon-linear",
  "trending-up": "solar:graph-up-linear",
  "trending-down": "solar:graph-down-linear",
  percent: "solar:sale-linear",
  calendar: "solar:calendar-linear",
  refresh: "solar:restart-linear",
  home: "solar:home-2-linear",
  plus: "solar:add-circle-linear",
  minus: "solar:minus-circle-linear",
  help: "solar:help-outline",
  database: "solar:database-linear",
  cpu: "solar:cpu-linear",
  server: "solar:server-linear",
  check: "solar:check-read-linear",
  "shield-check": "solar:shield-check-linear",
  lock: "solar:lock-linear",
  alert: "solar:info-circle-linear",
  key: "solar:key-linear",
  globe: "solar:global-linear",
  eye: "solar:eye-linear",
  layers: "solar:layers-linear",
  coins: "solar:dollar-minimalistic-linear",
  zap: "solar:bolt-linear",
  share: "solar:share-linear",
  chart: "solar:graph-linear",
  bank: "solar:banknote-linear",
  "check-circle": "solar:check-circle-linear",
  "map-pin": "solar:map-point-linear",
  phone: "solar:phone-linear",
  mail: "solar:letter-linear",
  clock: "solar:clock-circle-linear",
  send: "solar:send-linear",
  users: "solar:users-group-two-rounded-linear",
  compass: "solar:compass-linear",
  award: "solar:cup-linear",
  shield: "solar:shield-linear",
  users2: "solar:users-group-rounded-linear",
  "contact-center": "solar:headphones-round-linear",
  procurement: "solar:cart-linear",
  "it-services": "solar:settings-linear",
  development: "solar:code-linear",
  code: "solar:code-linear",
  palette: "solar:palette-linear",
};

const phosphorMap: Partial<Record<IconName, string>> = {
  menu: "ph:list",
  x: "ph:x-circle",
  "arrow-right": "ph:arrow-right",
  "arrow-left": "ph:arrow-left",
  "arrow-up-right": "ph:arrow-up-right",
  sun: "ph:sun",
  moon: "ph:moon",
  "trending-up": "ph:trend-up",
  "trending-down": "ph:trend-down",
  percent: "ph:percent",
  calendar: "ph:calendar",
  refresh: "ph:arrows-clockwise",
  home: "ph:house",
  plus: "ph:plus-circle",
  minus: "ph:minus-circle",
  help: "ph:question",
  database: "ph:database",
  cpu: "ph:cpu",
  server: "ph:server",
  check: "ph:check",
  "shield-check": "ph:shield-check",
  lock: "ph:lock",
  alert: "ph:info",
  key: "ph:key",
  globe: "ph:globe",
  eye: "ph:eye",
  layers: "ph:stack",
  coins: "ph:coins",
  zap: "ph:lightning",
  share: "ph:share-network",
  chart: "ph:chart-line-up",
  bank: "ph:bank",
  "check-circle": "ph:check-circle",
  "map-pin": "ph:map-pin",
  phone: "ph:phone",
  mail: "ph:envelope",
  clock: "ph:clock",
  send: "ph:paper-plane-tilt",
  users: "ph:users-three",
  compass: "ph:compass",
  award: "ph:trophy",
  shield: "ph:shield",
  users2: "ph:users",
  "contact-center": "ph:headset",
  procurement: "ph:shopping-cart",
  "it-services": "ph:gear-six",
  development: "ph:code",
  code: "ph:code",
  palette: "ph:palette",
};

export default function Icon({ name, className, size = 20, animate = true }: IconProps) {
  const { iconSystem } = useIconSystem();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Отрисовка конкретной системы иконок
  const renderIconContent = () => {
    // Check local tech SVGs first
    const localTechIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      solana: TechIcons.SolanaIcon,
      kafka: TechIcons.KafkaIcon,
      solidity: TechIcons.SolidityIcon,
      cpp: TechIcons.CPPIcon,
      send: TechIcons.SendIcon,
    };

    // Simple Icons: one 24x24 grid, one path, `fill="currentColor"`. That makes
    // the whole tech grid monochrome and impossible to lose against a dark tile
    // (the old `logos:*` set mixed vendor artwork — `logos:express` is a black
    // wordmark at 1.2:1 contrast, `logos:helm` a navy mark at 1.4:1).
    // gRPC is the one tool Simple Icons does not carry; devicon-plain is also
    // single-path currentColor, so it matches.
    const brandMap: Record<string, string> = {
      clickhouse: "simple-icons:clickhouse",
      airflow: "simple-icons:apacheairflow",
      dbt: "simple-icons:dbt",
      oracle: "simple-icons:oracle",
      mastercard: "simple-icons:mastercard",
      hyperledger: "simple-icons:hyperledger",
      express: "simple-icons:express",
      kong: "simple-icons:kong",
      spark: "simple-icons:apachespark",
      hadoop: "simple-icons:apachehadoop",
      tableau: "simple-icons:tableau",
      jira: "simple-icons:jira",
      confluence: "simple-icons:confluence",
      git: "simple-icons:git",
      github: "simple-icons:github",
      linkedin: "simple-icons:linkedin",
      instagram: "simple-icons:instagram",
      gitlab: "simple-icons:gitlab",
      kubernetes: "simple-icons:kubernetes",
      docker: "simple-icons:docker",
      terraform: "simple-icons:terraform",
      ansible: "simple-icons:ansible",
      nginx: "simple-icons:nginx",
      prometheus: "simple-icons:prometheus",
      helm: "simple-icons:helm",
      grafana: "simple-icons:grafana",
      jenkins: "simple-icons:jenkins",
      githubactions: "simple-icons:githubactions",
      dotnet: "simple-icons:dotnet",
      html5: "simple-icons:html5",
      css3: "simple-icons:css3",
      redis: "simple-icons:redis",
      grpc: "devicon-plain:grpc",
      angular: "simple-icons:angular",
      nodejs: "simple-icons:nodedotjs",
      csharp: "simple-icons:csharp",
      postgresql: "simple-icons:postgresql",
      javascript: "simple-icons:javascript",
      java: "simple-icons:openjdk",
      python: "simple-icons:python",
      nats: "simple-icons:natsdotio",
      nestjs: "simple-icons:nestjs",
      typescript: "simple-icons:typescript",
      spring: "simple-icons:spring",
      golang: "simple-icons:go",
      graphql: "simple-icons:graphql",
      ethereum: "simple-icons:ethereum",
    };

    const LocalComponent = localTechIcons[name];
    if (LocalComponent) {
      return <LocalComponent size={size} className="w-full h-full" />;
    }

    const brandIcon = brandMap[name];
    if (brandIcon) {
      return <IconifyIcon icon={brandIcon} width={size} height={size} className="w-full h-full" />;
    }

    if (iconSystem === "phosphor") {
      const phosphorIcon = phosphorMap[name];
      if (phosphorIcon) {
        return <IconifyIcon icon={phosphorIcon} width={size} height={size} className="w-full h-full" />;
      }
    }

    if (iconSystem === "solar") {
      const solarIcon = solarMap[name];
      if (solarIcon) {
        return <IconifyIcon icon={solarIcon} width={size} height={size} className="w-full h-full" />;
      }
    }

    // По умолчанию MingCute
    const mingcuteIcon = mingcuteMap[name];
    if (mingcuteIcon) {
      return <IconifyIcon icon={mingcuteIcon} width={size} height={size} className="w-full h-full" />;
    }

    return null;
  };

  // Hover motion via CSS on the wrapper (so it works for BOTH icon sets, and
  // reacts to a parent `.group` hover OR a direct hover on the icon).
  const hoverClass = () => {
    if (!animate) return "";
    const base = "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";
    switch (name) {
      case "arrow-right":
        return `${base} group-hover:translate-x-1 hover:translate-x-1`;
      case "arrow-left":
        return `${base} group-hover:-translate-x-1 hover:-translate-x-1`;
      case "arrow-up-right":
        return `${base} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hover:translate-x-0.5 hover:-translate-y-0.5`;
      case "refresh":
        return `${base} group-hover:rotate-180 hover:rotate-180 duration-500`;
      default:
        return `${base} group-hover:scale-110 hover:scale-110`;
    }
  };

  const inner = (
    <span className={cn("inline-flex w-full h-full items-center justify-center", hoverClass())}>
      {renderIconContent()}
    </span>
  );

  const outerClass = cn(
    "inline-flex items-center justify-center shrink-0 text-current select-none",
    mounted && animate && !reduce && "svgator-icon",
    mounted && animate && !reduce && `svgator-icon-${name}`
  );

  // Static when animation is off or the user prefers reduced motion.
  if (!animate || reduce) {
    return (
      <span className={cn(outerClass, className)} style={{ width: size, height: size }}>
        {inner}
      </span>
    );
  }

  return (
    <span className={cn(outerClass, className)} style={{ width: size, height: size }}>
      {inner}
    </span>
  );
}
