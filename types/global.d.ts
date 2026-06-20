import type Lenis from "lenis";

// Globals attached to `window` at runtime by the app.
declare global {
  interface Window {
    /** Lenis smooth-scroll instance, exposed for programmatic scroll control. */
    __lenis?: Lenis;
    /** The accessibility trigger button that opened the a11y dialog (for focus restore). */
    __activeA11yTrigger?: HTMLElement | null;
  }
}

export {};
