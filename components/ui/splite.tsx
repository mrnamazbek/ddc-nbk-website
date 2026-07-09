'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

type Vec3 = { x: number; y: number; z: number }
type SplineLayer = { type: string; updateTexture: (url: string) => Promise<void> }
type SplineObj = {
  material?: { layers?: SplineLayer[] };
  children?: SplineObj[];
  rotation?: Vec3;
}
type SplineApp = {
  findObjectByName: (name: string) => SplineObj | undefined;
  load: (scene: string) => Promise<void>;
  requestRender?: () => void;
  dispose?: () => void;
}

interface SplineSceneProps {
  scene: string
  className?: string
  logoImg?: string
  logoTarget?: string
  /**
   * When true, the scene's robot smoothly rotates to "look at" the pointer.
   * The rotation is driven mathematically via the Spline runtime API (the
   * exported scene has no built-in look-at behaviour), damped toward the
   * cursor each frame. Disabled automatically under prefers-reduced-motion.
   */
  trackCursor?: boolean
  /**
   * Ordered candidate object names to rotate for the look-at effect. The first
   * one found in the scene wins. Defaults to head → neck → body.
   */
  trackTargets?: string[]
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

export function SplineScene({ scene, className, logoImg, logoTarget, trackCursor, trackTargets }: SplineSceneProps) {
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

  // Cursor look-at: drive the robot's rotation mathematically toward the
  // pointer. The exported Spline scene has no built-in look-at, so we rotate a
  // target object (head → neck → body) around Y (yaw) and X (pitch) and damp
  // it smoothly each frame. Fully opt-in and reduced-motion aware.
  useEffect(() => {
    if (!trackCursor || !appReady) return;
    const app = appRef.current;
    if (!app) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Pick the first target object that actually exists in the scene.
    const names = trackTargets ?? ["Head", "Neck", "Body"];
    let target: SplineObj | undefined;
    for (const name of names) {
      const obj = app.findObjectByName(name);
      if (obj?.rotation) {
        target = obj;
        break;
      }
    }
    if (!target?.rotation) return;

    // Neutral pose captured on mount; all motion is an offset from this.
    const base: Vec3 = {
      x: target.rotation.x,
      y: target.rotation.y,
      z: target.rotation.z,
    };

    // Tunables (radians). Quiet, premium range — easy to adjust if needed.
    const MAX_YAW = 0.5; // left/right, ~28°
    const MAX_PITCH = 0.32; // up/down, ~18°
    const EASE = 0.09; // damping toward the target each frame
    const EPS = 0.0002; // skip micro-writes so Spline can idle when settled

    let targetX = 0; // normalized pointer offset [-1, 1]
    let targetY = 0;
    let curX = 0; // damped current values
    let curY = 0;
    let lastRotX = base.x;
    let lastRotY = base.y;
    let rafId = 0;
    let active = true;

    const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 0 || h <= 0) return; // avoid NaN/Infinity feeding the model
      // Offset from viewport center, normalized to [-1, 1].
      targetX = clamp((e.clientX / w) * 2 - 1);
      targetY = clamp((e.clientY / h) * 2 - 1);
    };

    const loop = () => {
      if (!active) return;
      curX += (targetX - curX) * EASE;
      curY += (targetY - curY) * EASE;

      const rotY = base.y + curX * MAX_YAW;
      const rotX = base.x - curY * MAX_PITCH; // cursor below center → look down

      if (Math.abs(rotY - lastRotY) > EPS || Math.abs(rotX - lastRotX) > EPS) {
        try {
          if (target?.rotation) {
            target.rotation.y = rotY;
            target.rotation.x = rotX;
            app.requestRender?.();
          }
        } catch {
          // App may be disposing during unmount; stop touching it.
          active = false;
          return;
        }
        lastRotY = rotY;
        lastRotX = rotX;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      // Restore neutral pose if the app is still alive.
      try {
        if (target?.rotation) {
          target.rotation.x = base.x;
          target.rotation.y = base.y;
          app.requestRender?.();
        }
      } catch {
        /* app already disposed — nothing to restore */
      }
    };
  }, [trackCursor, appReady, trackTargets]);

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
