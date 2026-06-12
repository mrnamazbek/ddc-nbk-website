"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Icon as IconifyIcon } from "@iconify/react";
import * as Iconsax from "iconsax-react";
import { useIconSystem, IconSystem } from "../theme/IconSystemProvider";
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
  | "development";

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
  "arrow-up-right": "mingcute:arrow-up-right-line",
  sun: "mingcute:sun-line",
  moon: "mingcute:moon-line",
  "trending-up": "mingcute:trending-up-line",
  "trending-down": "mingcute:trending-down-line",
  percent: "mingcute:percent-line",
  calendar: "mingcute:calendar-line",
  refresh: "mingcute:refresh-1-line",
  home: "mingcute:home-5-line",
  plus: "mingcute:add-line",
  minus: "mingcute:minimize-line",
  help: "mingcute:question-line",
  database: "mingcute:database-line",
  cpu: "mingcute:cpu-line",
  server: "mingcute:server-line",
  check: "mingcute:check-line",
  "shield-check": "mingcute:shield-check-line",
  lock: "mingcute:lock-line",
  alert: "mingcute:alert-line",
  key: "mingcute:key-line",
  globe: "mingcute:earth-line",
  eye: "mingcute:eye-line",
  layers: "mingcute:layers-line",
  coins: "mingcute:copper-coin-line",
  zap: "mingcute:flash-line",
  share: "mingcute:share-forward-line",
  chart: "mingcute:bar-chart-line",
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
};

// Маппинг для Solar (Iconify)
const solarMap: Record<IconName, string> = {
  menu: "solar:menu-hamburger-linear",
  x: "solar:close-circle-linear",
  "arrow-right": "solar:arrow-right-linear",
  "arrow-left": "solar:arrow-left-linear",
  "arrow-up-right": "solar:arrow-right-up-linear",
  sun: "solar:sun-2-linear",
  moon: "solar:moon-linear",
  "trending-up": "solar:trending-up-linear",
  "trending-down": "solar:trending-down-linear",
  percent: "solar:percent-linear",
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
  bank: "solar:bank-linear",
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
};

// Маппинг для Iconsax (локальные React компоненты)
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
};

export default function Icon({ name, className, size = 20, animate = true }: IconProps) {
  const { iconSystem } = useIconSystem();
  const shouldReduceMotion = useReducedMotion();

  // Настройка анимаций в зависимости от типа иконки
  const isDirectional = ["arrow-right", "arrow-left", "arrow-up-right"].includes(name);
  const isToggle = ["menu", "x", "sun", "moon"].includes(name);

  // Варианты анимации
  const variants = {
    initial: { scale: 1, x: 0, y: 0, rotate: 0 },
    hover: shouldReduceMotion || !animate ? {} : {
      scale: isToggle ? 1.05 : 1,
      rotate: name === "refresh" ? 180 : 0,
      x: name === "arrow-right" ? 4 : name === "arrow-left" ? -4 : 0,
      y: name === "arrow-up-right" ? -3 : 0,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    },
    tap: shouldReduceMotion || !animate ? {} : {
      scale: 0.9,
      transition: { duration: 0.1 }
    }
  };

  // Отрисовка конкретной системы иконок
  const renderIconContent = () => {
    if (iconSystem === "iconsax") {
      const IconsaxComponent = iconsaxMap[name];
      if (IconsaxComponent) {
        return <IconsaxComponent size={size} variant="linear" className="w-full h-full" />;
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

  return (
    <motion.span
      className={cn("inline-flex items-center justify-center shrink-0 text-current", className)}
      style={{ width: size, height: size }}
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {renderIconContent()}
    </motion.span>
  );
}
