"use client";

import { useTranslations } from "next-intl";
import { useColorVariant, type ColorVariant } from "@/components/theme/ColorVariantProvider";

function VariantOption({
  active,
  label,
  shortLabel,
  swatches,
  value,
  onSelect,
}: {
  active: boolean;
  label: string;
  shortLabel: string;
  swatches: readonly [string, string];
  value: ColorVariant;
  onSelect: (value: ColorVariant) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className="group relative grid h-11 min-w-11 place-items-center rounded-full border transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
      style={{
        background: active ? "var(--surface)" : "transparent",
        borderColor: active ? "var(--accent-gold)" : "var(--border-primary)",
        boxShadow: active ? "0 0 0 1px var(--accent-gold), var(--shadow-button)" : "none",
      }}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span
          className="h-3 w-3 rounded-full border border-white/35"
          style={{ backgroundColor: swatches[0] }}
        />
        <span
          className="h-3 w-3 rounded-full border border-white/35"
          style={{ backgroundColor: swatches[1] }}
        />
        <span className="font-mono text-[10px] font-bold text-foreground">{shortLabel}</span>
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function ColorVariantSwitcher({
  showLabel = false,
}: {
  showLabel?: boolean;
}) {
  const t = useTranslations("ColorVariant");
  const { variant, setVariant } = useColorVariant();

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label={t("label")}
    >
      {showLabel && <span className="text-sm text-muted">{t("label")}</span>}
      <div className="flex items-center gap-1 rounded-full border border-border bg-glass p-1">
        <VariantOption
          active={variant === "current"}
          label={t("current")}
          shortLabel="A"
          swatches={["var(--brand-current-forest)", "var(--brand-current-gold)"]}
          value="current"
          onSelect={setVariant}
        />
        <VariantOption
          active={variant === "brand"}
          label={t("brand")}
          shortLabel="B"
          swatches={["var(--brandbook-forest)", "var(--brandbook-gold)"]}
          value="brand"
          onSelect={setVariant}
        />
      </div>
    </div>
  );
}
