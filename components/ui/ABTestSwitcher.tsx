"use client";

import { useEffect, useState } from "react";
import { ABVariant, setABVariant } from "@/lib/abTest";
import { cn } from "@/lib/utils";

interface ABTestSwitcherProps {
  pageKey: string;
  current: ABVariant | null;
}

export default function ABTestSwitcher({ pageKey, current }: ABTestSwitcherProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !current) return null;

  const toggle = () => {
    const next: ABVariant = current === "A" ? "B" : "A";
    setABVariant(pageKey, next);
    
    // Add query parameter dynamically or reload to apply changes cleanly
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.location.href = url.pathname + url.search;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      <button
        onClick={toggle}
        className={cn(
          "px-4 py-2.5 rounded-full text-xs font-mono font-medium tracking-wider shadow-2xl border transition-all duration-300 flex items-center gap-2.5 cursor-pointer backdrop-blur-md",
          current === "B"
            ? "bg-forest-light/20 text-gold-light border-gold/40 hover:border-gold hover:shadow-gold/20"
            : "bg-charcoal/80 text-zinc-300 border-white/10 hover:border-white/30 hover:shadow-white/5"
        )}
        title="Переключить вариант A/B тестирования"
      >
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            current === "B" ? "bg-gold" : "bg-emerald-400"
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            current === "B" ? "bg-gold" : "bg-emerald-500"
          )}></span>
        </span>
        <span>A/B TEST: VARIANT {current}</span>
        <span className="text-[10px] text-zinc-400 border-l border-white/10 pl-2">
          {current === "A" ? "Standard" : "WebGL 3D"}
        </span>
      </button>
    </div>
  );
}
