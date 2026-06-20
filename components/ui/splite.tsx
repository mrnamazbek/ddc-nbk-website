'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

type SplineLayer = { type: string; updateTexture: (url: string) => Promise<void> }
type SplineObj = { material?: { layers?: SplineLayer[] }; children?: SplineObj[] }
type SplineApp = { findObjectByName: (name: string) => SplineObj | undefined }

interface SplineSceneProps {
  scene: string
  className?: string
  logoImg?: string
  logoTarget?: string
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

export function SplineScene({ scene, className, logoImg, logoTarget }: SplineSceneProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

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

  const handleLoad = async (splineApp: unknown) => {
    const app = splineApp as SplineApp;
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
  };

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
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
      />
    </Suspense>
  )
}

