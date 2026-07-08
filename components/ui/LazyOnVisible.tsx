"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useA11y } from "@/components/theme/AccessibilityProvider";

type LazyOnVisibleProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  minHeight?: string;
  rootMargin?: string;
};

export default function LazyOnVisible({
  children,
  className,
  id,
  minHeight = "560px",
  rootMargin = "520px 0px",
}: LazyOnVisibleProps) {
  const { enabled: a11yEnabled } = useA11y();
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (a11yEnabled) return;
    const el = ref.current;
    if (!el || shouldMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldMount(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount, a11yEnabled]);

  if (a11yEnabled) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight }}>
      {shouldMount ? children : null}
    </div>
  );
}
