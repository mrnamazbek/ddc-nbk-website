"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { usePageTransition } from "./PageTransition";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for the locale-aware <Link> that plays the liquid-glass
 * page transition on plain left-clicks, while preserving native behaviour for
 * modified clicks (new tab, etc.) and falling back to <Link> when used outside
 * the transition provider.
 */
export default function TransitionLink({ href, onClick, ...rest }: LinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    if (typeof href === "string") {
      try {
        const url = new URL(href, window.location.href);
        const isSamePage = url.pathname === window.location.pathname;
        const hash = url.hash;

        if (isSamePage && hash) {
          e.preventDefault();
          const targetElement = document.querySelector<HTMLElement>(hash);
          if (targetElement) {
            const lenis = window.__lenis;
            if (lenis) {
              lenis.scrollTo(targetElement);
            } else {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }
          return;
        }
      } catch (err) {
        // Fallback for relative paths or invalid URL formats
      }

      e.preventDefault();
      navigate(href);
    }
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
