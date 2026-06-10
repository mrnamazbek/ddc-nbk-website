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
  /** Navigate to `href` with a fast fade transition (or instantly if reduced-motion). */
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

// Very fast transition for modern, snappy feel
const DURATION = 0.2;
const EASE = "easeInOut";

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
      // prefers-reduced-motion → skip transition entirely.
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

  // Once the screen is covered (faded out), commit the route change.
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
    }, 1000);
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
            key="fade-transition"
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999, // Ensure it's on top
              backgroundColor: "#000000", // Solid black for a clean fade
              pointerEvents: "auto",
              willChange: "opacity",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "cover" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION, ease: EASE }}
            onAnimationComplete={() => {
              if (phase === "cover") handleCoverComplete();
              else if (phase === "reveal") setPhase("idle");
            }}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}