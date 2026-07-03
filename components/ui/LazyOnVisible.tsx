"use client";

import { ReactNode } from "react";

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
}: LazyOnVisibleProps) {
  return (
    <div id={id} className={className} style={{ minHeight }}>
      {children}
    </div>
  );
}
