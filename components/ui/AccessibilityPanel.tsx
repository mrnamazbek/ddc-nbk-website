"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import {
  useA11y,
  type A11yScale,
  type A11yScheme,
  type A11ySpacing,
} from "@/components/theme/AccessibilityProvider";

const SCALES: A11yScale[] = [100, 125, 150, 200];
const SPACINGS: A11ySpacing[] = ["n", "m", "l"];
const SCHEMES: { id: A11yScheme; swatchBg: string; swatchFg: string }[] = [
  { id: "bw", swatchBg: "#ffffff", swatchFg: "#000000" },
  { id: "wb", swatchBg: "#000000", swatchFg: "#ffffff" },
  { id: "blue", swatchBg: "#9dd2ff", swatchFg: "#06214a" },
];

/**
 * "Версия для слабовидящих" — accessibility control + panel.
 * The trigger lives in the header utility zone; the panel itself is rendered
 * with SOLID high-contrast styling so a low-vision user can operate it before
 * the rest of the page reflows.
 */
export default function AccessibilityPanel() {
  const t = useTranslations("A11y");
  const a11y = useA11y();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc to close + restore focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("trigger")}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t("trigger")}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full liquid-glass text-foreground hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
      >
        <Icon name="eye" size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] bg-black/60"
              aria-hidden
            />

            {/* Panel — solid, high-contrast, large text (independent of a11y mode) */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed right-3 top-3 z-[100] w-[min(92vw,360px)] rounded-2xl border-2 border-black bg-white text-black shadow-2xl outline-none"
            >
              <div className="flex items-center justify-between gap-3 border-b-2 border-black px-5 py-4">
                <h2 id={titleId} className="flex items-center gap-2 text-lg font-bold leading-tight">
                  <Icon name="eye" size={22} />
                  {t("title")}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label={t("close")}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border-2 border-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <Icon name="x" size={22} />
                </button>
              </div>

              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5 text-[15px]">
                {/* Font size */}
                <Group label={t("fontSize")}>
                  {SCALES.map((s) => (
                    <Chip key={s} active={a11y.enabled && a11y.scale === s} onClick={() => a11y.setScale(s)}>
                      <span style={{ fontSize: `${0.8 + (s - 100) / 250}rem` }}>А</span>
                      <span className="ml-1 text-xs opacity-70">{s}%</span>
                    </Chip>
                  ))}
                </Group>

                {/* Color scheme */}
                <Group label={t("scheme")}>
                  {SCHEMES.map((sc) => (
                    <Chip
                      key={sc.id}
                      active={a11y.enabled && a11y.scheme === sc.id}
                      onClick={() => a11y.setScheme(sc.id)}
                      label={t(`scheme${sc.id === "bw" ? "Bw" : sc.id === "wb" ? "Wb" : "Blue"}`)}
                    >
                      <span
                        aria-hidden
                        className="flex h-6 w-6 items-center justify-center rounded border border-black text-xs font-bold"
                        style={{ background: sc.swatchBg, color: sc.swatchFg }}
                      >
                        Аа
                      </span>
                    </Chip>
                  ))}
                </Group>

                {/* Letter spacing */}
                <Group label={t("spacing")}>
                  {SPACINGS.map((sp) => (
                    <Chip key={sp} active={a11y.enabled && a11y.spacing === sp} onClick={() => a11y.setSpacing(sp)}>
                      {t(`spacing${sp === "n" ? "N" : sp === "m" ? "M" : "L"}`)}
                    </Chip>
                  ))}
                </Group>

                {/* Toggles */}
                <Group label={t("images")}>
                  <Chip active={a11y.enabled && a11y.grayscale} onClick={() => a11y.setGrayscale(!a11y.grayscale)}>
                    {a11y.enabled && a11y.grayscale ? t("on") : t("off")}
                  </Chip>
                </Group>
                <Group label={t("serif")}>
                  <Chip active={a11y.enabled && a11y.serif} onClick={() => a11y.setSerif(!a11y.serif)}>
                    {a11y.enabled && a11y.serif ? t("on") : t("off")}
                  </Chip>
                </Group>

                {/* Reset → normal version */}
                <button
                  type="button"
                  onClick={() => a11y.reset()}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-2 text-base font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <Icon name="x" size={18} />
                  {t("reset")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 block text-xs font-bold uppercase tracking-wide">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`flex min-h-[44px] items-center justify-center gap-1 rounded-lg border-2 border-black px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
        active ? "bg-black text-white" : "bg-white text-black hover:bg-black/10"
      }`}
    >
      {children}
    </button>
  );
}
