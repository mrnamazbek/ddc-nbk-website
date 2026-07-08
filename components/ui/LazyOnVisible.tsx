"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
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
  }, [rootMargin, shouldMount]);

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight }}>
      {shouldMount ? children : null}
    </div>
  );
}
