"use client";

import { createContext, useContext, useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface TransitionApi {
  /** Navigate to `href` using instant Next.js client-side routing. */
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionApi | null>(null);

export function usePageTransition(): TransitionApi {
  const ctx = useContext(TransitionContext);
  if (!ctx) return { navigate: () => {}, isTransitioning: false };
  return ctx;
}

/**
 * Lightweight navigation provider. We deliberately do NOT play a full-screen
 * fade/cover transition — it gated navigation behind a ~0.4s black overlay and
 * felt laggy. Next.js App Router client navigation is already fast; here we just
 * forward to router.push so route changes feel instant and snappy. Per-page
 * entrance polish is handled by the in-view section animations themselves.
 */
export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return;
      router.push(href);
    },
    [pathname, router],
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning: false }}>
      {children}
    </TransitionContext.Provider>
  );
}
