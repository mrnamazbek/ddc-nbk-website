"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MorphLoader } from "@/components/ui/animated-micro-loaders";
import { cn } from "@/lib/utils";

interface ThreeModelLoadingOverlayProps {
  visible?: boolean;
  progress?: number;
  label?: string;
  mode?: "fixed" | "absolute";
  className?: string;
}

export default function ThreeModelLoadingOverlay({
  visible = true,
  progress,
  label = "Loading 3D scene",
  mode = "fixed",
  className,
}: ThreeModelLoadingOverlayProps) {
  const normalizedProgress = typeof progress === "number"
    ? Math.max(0, Math.min(100, Math.round(progress)))
    : undefined;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={label}
          initial={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            mode === "fixed" ? "fixed inset-0" : "absolute inset-0",
            "pointer-events-none z-[80] flex items-center justify-center px-6",
            className,
          )}
        >
          <div className="relative overflow-hidden rounded-full border border-gold/20 bg-[#031009]/72 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(232,200,122,0.18),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(82,183,136,0.16),transparent_46%)]" />
            <div className="relative flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-gold/15 bg-gold/[0.06] text-gold-light shadow-[0_0_24px_rgba(201,168,76,0.22)]">
                <MorphLoader size={28} color="#E8C87A" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-light">
                  {label}
                </p>
                {normalizedProgress !== undefined ? (
                  <p className="mt-1 text-[11px] text-white/55">{normalizedProgress}%</p>
                ) : (
                  <p className="mt-1 text-[11px] text-white/55">Preparing cinematic assets</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
