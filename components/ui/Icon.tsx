"use client";

import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import * as Iconsax from "iconsax-react";
import { motion, useReducedMotion } from "framer-motion";
import { useIconSystem } from "../theme/IconSystemProvider";
import { cn } from "@/lib/utils";

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
  | "palette";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  animate?: boolean;
}

// Маппинг для MingCute (Iconify)
const mingcuteMap: Record<IconName, string> = {
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
  send: "mingcute:send-line",
  users: "mingcute:group-line",
  compass: "mingcute:compass-line",
  award: "mingcute:award-line",
  shield: "mingcute:shield-line",
  users2: "mingcute:group-line",
  "contact-center": "mingcute:headphone-line",
  procurement: "mingcute:shopping-cart-1-line",
  "it-services": "mingcute:settings-1-line",
  development: "mingcute:code-line",
  palette: "mingcute:palette-line",
};

// Маппинг для Solar (Iconify)
const solarMap: Record<IconName, string> = {
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
  send: "solar:send-square-linear",
  users: "solar:users-group-two-rounded-linear",
  compass: "solar:compass-linear",
  award: "solar:cup-linear",
  shield: "solar:shield-linear",
  users2: "solar:users-group-rounded-linear",
  "contact-center": "solar:headphones-round-linear",
  procurement: "solar:cart-linear",
  "it-services": "solar:settings-linear",
  development: "solar:code-linear",
  palette: "solar:palette-linear",
};

// Маппинг для Iconsax (локальные React компоненты)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconsaxMap: Record<IconName, React.ComponentType<any>> = {
  menu: Iconsax.HambergerMenu,
  x: Iconsax.CloseCircle,
  "arrow-right": Iconsax.ArrowRight,
  "arrow-left": Iconsax.ArrowLeft,
  "arrow-up-right": Iconsax.ArrowRight, // Iconsax doesn't export ArrowUpRight directly, fallback to ArrowRight
  sun: Iconsax.Sun1,
  moon: Iconsax.Moon,
  "trending-up": Iconsax.TrendUp,
  "trending-down": Iconsax.TrendDown,
  percent: Iconsax.PercentageCircle,
  calendar: Iconsax.Calendar,
  refresh: Iconsax.Refresh,
  home: Iconsax.Home3,
  plus: Iconsax.AddCircle,
  minus: Iconsax.MinusCirlce,
  help: Iconsax.MessageQuestion,
  database: Iconsax.Data,
  cpu: Iconsax.Cpu,
  server: Iconsax.Data, // Iconsax doesn't export Server directly, fallback to Data
  check: Iconsax.TickCircle,
  "shield-check": Iconsax.ShieldSecurity,
  lock: Iconsax.Lock,
  alert: Iconsax.Danger,
  key: Iconsax.Key,
  globe: Iconsax.Global,
  eye: Iconsax.Eye,
  layers: Iconsax.Hierarchy,
  coins: Iconsax.Coin,
  zap: Iconsax.Flash,
  share: Iconsax.Share,
  chart: Iconsax.Chart,
  bank: Iconsax.Bank,
  "check-circle": Iconsax.TickCircle,
  "map-pin": Iconsax.Location,
  phone: Iconsax.Call,
  mail: Iconsax.Sms,
  clock: Iconsax.Clock,
  send: Iconsax.Send2,
  users: Iconsax.People,
  compass: Iconsax.Discover,
  award: Iconsax.Award,
  shield: Iconsax.Shield,
  users2: Iconsax.Profile2User,
  "contact-center": Iconsax.Headphone,
  procurement: Iconsax.ShoppingCart,
  "it-services": Iconsax.Setting2,
  development: Iconsax.Code,
  palette: Iconsax.Colorfilter,
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
    if (iconSystem === "iconsax") {
      const IconsaxComponent = iconsaxMap[name];
      if (IconsaxComponent) {
        // color="currentColor" is REQUIRED — Iconsax defaults to #292D32 (dark),
        // which is invisible on our dark theme. This is why Iconsax "wasn't working".
        return <IconsaxComponent size={size} variant="Linear" color="currentColor" className="w-full h-full" />;
      }
    }

    if (iconSystem === "solar") {
      const solarIcon = solarMap[name];
      return <IconifyIcon icon={solarIcon} width={size} height={size} className="w-full h-full" />;
    }

    // По умолчанию MingCute
    const mingcuteIcon = mingcuteMap[name];
    return <IconifyIcon icon={mingcuteIcon} width={size} height={size} className="w-full h-full" />;
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
