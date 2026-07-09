'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

type SplineLayer = { type: string; updateTexture: (url: string) => Promise<void> }
type SplineObj = {
  material?: { layers?: SplineLayer[] };
  children?: SplineObj[];
}
type SplineApp = {
  findObjectByName: (name: string) => SplineObj | undefined;
  load: (scene: string) => Promise<void>;
  canvas?: HTMLCanvasElement;
  requestRender?: () => void;
  dispose?: () => void;
}

interface SplineSceneProps {
  scene: string
  className?: string
  logoImg?: string
  logoTarget?: string
  /**
   * When true, the robot's built-in look-at follows the pointer across the
   * WHOLE window instead of only while the cursor is over the 3D canvas.
   *
   * The exported scene ships with `mouseEventTarget: "canvas"`, so Spline only
   * tracks the mouse while it is physically over the canvas. Rather than fight
   * that (manual rotation writes get overwritten by Spline every frame), we
   * forward global pointer positions into the canvas so Spline's own — nicely
   * tuned — look-at reacts to the cursor anywhere on screen. Spline normalizes
   * the coordinates against the canvas rect, giving a natural "watching you"
   * feel. Disabled automatically under prefers-reduced-motion.
   */
  trackCursor?: boolean
}

/**
 * @splinetool/runtime logs a benign `console.error("Missing property")` on every
 * animation tick when a scene's timeline references a property that isn't present
 * in the exported .splinecode. The 3D scene still renders correctly — the log just
 * floods the console and trips Next's dev error overlay. We can't edit the binary
 * scene, so we filter out that ONE exact message while a Spline scene is mounted
 * and restore the original console.error once the last instance unmounts. Every
 * other error (including any other Spline error) passes through untouched.
 */
let splineFilterCount = 0
let originalConsoleError: typeof console.error | null = null

function installSplineErrorFilter() {
  if (splineFilterCount++ > 0) return
  originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    const first = args[0]
    const msg = typeof first === 'string' ? first : first instanceof Error ? first.message : ''
    if (msg === 'Missing property') return
    originalConsoleError!.apply(console, args as Parameters<typeof console.error>)
  }
}

function uninstallSplineErrorFilter() {
  if (splineFilterCount > 0) splineFilterCount--
  if (splineFilterCount === 0 && originalConsoleError) {
    console.error = originalConsoleError
    originalConsoleError = null
  }
}

function SplineRuntimeCanvas({
  scene,
  className,
  onLoad,
}: {
  scene: string;
  className?: string;
  onLoad?: (app: SplineApp) => void | Promise<void>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let app: SplineApp | null = null;
    let cancelled = false;

    async function mountSpline() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const { Application } = await import("@splinetool/runtime");
        if (cancelled || !canvasRef.current) return;

        app = new Application(canvasRef.current, { renderOnDemand: true }) as SplineApp;
        await app.load(scene);
        if (!cancelled) {
          await onLoad?.(app);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load Spline scene:", err);
        }
      }
    }

    mountSpline();

    return () => {
      cancelled = true;
      app?.dispose?.();
    };
  }, [onLoad, scene]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

export function SplineScene({ scene, className, logoImg, logoTarget, trackCursor }: SplineSceneProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const appRef = useRef<SplineApp | null>(null);
  const [appReady, setAppReady] = useState(false);

  // Silence the benign per-frame "Missing property" error from the Spline
  // runtime for as long as this scene is mounted.
  useEffect(() => {
    installSplineErrorFilter();
    return () => uninstallSplineErrorFilter();
  }, []);

  useEffect(() => {
    // Delay WebGL canvas mount by 300ms to let page client transitions finish smoothly
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const removeWatermark = () => {
      // Find all links referencing spline.design
      const links = document.querySelectorAll('a[href*="spline.design"]');
      links.forEach((link) => {
        const parent = link.parentElement;
        if (parent && parent.style.position === 'absolute') {
          parent.remove();
        } else {
          link.remove();
        }
      });

      // Find any other elements matching "built with spline" text
      const allLinks = document.querySelectorAll('a');
      allLinks.forEach((link) => {
        const text = link.innerText || '';
        if (text.toLowerCase().includes('built with spline') || link.getAttribute('href')?.includes('spline.design')) {
          const parent = link.parentElement;
          if (parent && parent.style.position === 'absolute') {
            parent.remove();
          } else {
            link.remove();
          }
        }
      });
    };

    // Run cleanups at short intervals to catch late-loading DOM insertions
    const interval = setInterval(removeWatermark, 100);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [shouldLoad]);

  const handleLoad = useCallback(async (splineApp: SplineApp) => {
    const app = splineApp as SplineApp;
    // Expose the loaded app to the cursor-tracking effect below.
    appRef.current = app;
    setAppReady(true);
    if (logoImg && logoTarget) {
      try {
        const obj = app.findObjectByName(logoTarget);
        if (obj) {
          const applyTexture = async (targetObj: SplineObj) => {
            if (targetObj.material && targetObj.material.layers) {
              const textureLayer = targetObj.material.layers.find((l: SplineLayer) => l.type === 'texture');
              if (textureLayer) {
                await textureLayer.updateTexture(logoImg);
              }
            }
          };

          await applyTexture(obj);

          // Iterate children if it is a group
          if (obj.children) {
            for (const child of obj.children) {
              await applyTexture(child);
            }
          }
        }
      } catch (err) {
        console.error("Failed to dynamically update Spline texture:", err);
      }
    }
  }, [logoImg, logoTarget]);

  // Global cursor look-at: forward window pointer moves into the Spline canvas
  // so the scene's own look-at follows the cursor across the whole screen, not
  // just while it hovers the canvas. See the `trackCursor` prop doc for why.
  useEffect(() => {
    if (!trackCursor || !appReady) return;
    const app = appRef.current;
    const canvas = app?.canvas;
    if (!canvas) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const forward = (e: PointerEvent) => {
      // When the cursor is already over the canvas, Spline receives the native
      // event itself — don't double-dispatch. Otherwise, replay the pointer's
      // global position onto the canvas so Spline's look-at reacts to it.
      if (e.target === canvas) return;
      let synthetic: PointerEvent;
      try {
        synthetic = new PointerEvent("pointermove", {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pointerId: e.pointerId || 1,
          pointerType: e.pointerType || "mouse",
          isPrimary: true,
          bubbles: false,
          cancelable: true,
        });
      } catch {
        return; // very old browsers without the PointerEvent constructor
      }
      canvas.dispatchEvent(synthetic);
    };

    window.addEventListener("pointermove", forward, { passive: true });
    return () => window.removeEventListener("pointermove", forward);
  }, [trackCursor, appReady]);

  if (!shouldLoad) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background/10 animate-pulse rounded-card">
        <span className="loader border-gold"></span>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <SplineRuntimeCanvas
        scene={scene}
        className={className}
        onLoad={handleLoad}
      />
    </Suspense>
  )
}
