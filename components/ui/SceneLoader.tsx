"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Брендовое состояние загрузки/ошибки для тяжёлых 3D/WebGL-сцен.
 * Заполняет контейнер родителя целиком (родитель обязан иметь фиксированную
 * высоту — layout shift исключается на уровне вызывающего кода), работает в
 * light/dark через токены и корректно читается скринридером (role="status").
 */
export function SceneLoader({
  label,
  progress,
  className,
}: {
  label: string;
  /** 0..100, если известен; без значения — бесконечный спиннер. */
  progress?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-4",
        "rounded-[var(--radius-card)] bg-glass",
        className,
      )}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-gold/20 border-t-gold animate-spin" />
        <Image
          src="/images/logo/ddc-emblem.svg"
          alt=""
          width={28}
          height={28}
          className="opacity-70"
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
        {label}
        {typeof progress === "number" ? ` ${Math.round(progress)}%` : ""}
      </span>
    </div>
  );
}

/**
 * Тихий статичный fallback, когда сцена не смогла загрузиться: эмблема на
 * стеклянной карточке. Никаких спиннеров навсегда — состояние терминальное.
 */
export function SceneFallback({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "rounded-[var(--radius-card)] bg-glass",
        className,
      )}
    >
      <Image
        src="/images/logo/ddc-emblem.svg"
        alt=""
        width={72}
        height={72}
        className="opacity-40"
      />
    </div>
  );
}
