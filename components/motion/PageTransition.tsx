"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";

type Phase = "idle" | "cover" | "reveal";

interface TransitionApi {
  /** Navigate to `href` behind a liquid-glass sweep (or instantly if reduced-motion). */
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionApi | null>(null);

export function usePageTransition(): TransitionApi {
  const ctx = useContext(TransitionContext);
  // Graceful no-op if a link is rendered outside the provider.
  if (!ctx) return { navigate: () => {}, isTransitioning: false };
  return ctx;
}

// 0.55s sits inside the 400–600ms "liquid glass" band (ui-ux-pro-max style #14);
// the easing mirrors the cubic-bezier(0.16,1,0.3,1) used by the glass CSS.
const DURATION = 0.55;
const EASE = [0.16, 1, 0.3, 1] as const;

const GOLD_RIM =
  "linear-gradient(180deg, rgba(232,200,122,0) 0%, rgba(232,200,122,0.9) 50%, rgba(232,200,122,0) 100%)";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");

  const pendingHref = useRef<string | null>(null);
  const fromPath = useRef<string | null>(null);
  const awaitingReveal = useRef(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return;
      // prefers-reduced-motion → skip the glass sweep entirely (ux-guidelines #9/#99).
      if (prefersReduced) {
        router.push(href);
        return;
      }
      // Ignore re-entrant clicks while a transition is mid-flight.
      if (pendingHref.current || awaitingReveal.current) return;
      pendingHref.current = href;
      fromPath.current = pathname;
      setPhase("cover");
    },
    [pathname, prefersReduced, router],
  );

  // Once the glass fully covers the screen, commit the route change.
  const handleCoverComplete = useCallback(() => {
    if (!pendingHref.current) return;
    const href = pendingHref.current;
    pendingHref.current = null;
    awaitingReveal.current = true;
    router.push(href);
    // Safety net: reveal anyway if the route-commit signal is missed.
    safetyTimer.current = setTimeout(() => {
      if (awaitingReveal.current) {
        awaitingReveal.current = false;
        setPhase("reveal");
      }
    }, 1200);
  }, [router]);

  // Reveal the new page only after navigation has actually committed.
  useEffect(() => {
    if (awaitingReveal.current && pathname !== fromPath.current) {
      awaitingReveal.current = false;
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      setPhase("reveal");
    }
  }, [pathname]);

  useEffect(
    () => () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    },
    [],
  );

  const isTransitioning = phase !== "idle";

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="liquid-glass-transition"
            aria-hidden
            data-hover="gold"
            className="liquid-glass-strong"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9990,
              borderRadius: 0,
              pointerEvents: "auto",
              willChange: "transform",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: phase === "cover" ? "0%" : "100%" }}
            exit={{ x: "100%" }}
            transition={{ duration: DURATION, ease: EASE }}
            onAnimationComplete={() => {
              if (phase === "cover") handleCoverComplete();
              else if (phase === "reveal") setPhase("idle");
            }}
          >
            {/* Gold leading-edge rims — the right rim leads while covering,
                the left rim leads while revealing (sweep runs left→right both ways). */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 2,
                height: "100%",
                background: GOLD_RIM,
                boxShadow: "0 0 24px 4px rgba(201,168,76,0.45)",
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 2,
                height: "100%",
                background: GOLD_RIM,
                boxShadow: "0 0 24px 4px rgba(201,168,76,0.45)",
              }}
            />
            {/* Faint shanyrak emblem, visible at peak cover for brand identity. */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.14,
              }}
            >
              <svg width="140" height="140" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#E8C87A" strokeWidth="0.7" />
                <path d="M 20 2 L 20 38 M 2 20 L 38 20" stroke="#E8C87A" strokeWidth="0.45" opacity="0.6" />
                <path d="M 7.27 7.27 C 12 12, 12 28, 7.27 32.73" stroke="#E8C87A" strokeWidth="0.45" opacity="0.5" />
                <path d="M 32.73 7.27 C 28 12, 28 28, 32.73 32.73" stroke="#E8C87A" strokeWidth="0.45" opacity="0.5" />
                <path d="M 7.27 7.27 C 12 12, 28 12, 32.73 7.27" stroke="#E8C87A" strokeWidth="0.45" opacity="0.5" />
                <path d="M 7.27 32.73 C 12 28, 28 28, 32.73 32.73" stroke="#E8C87A" strokeWidth="0.45" opacity="0.5" />
              </svg>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
