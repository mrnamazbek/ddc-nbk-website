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
  rootMargin = "650px 0px",
}: LazyOnVisibleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight }}>
      {visible ? children : null}
    </div>
  );
}
