'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

interface SplineSceneProps {
  scene: string
  className?: string
  logoImg?: string
  logoTarget?: string
}

export function SplineScene({ scene, className, logoImg, logoTarget }: SplineSceneProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

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
        let parent = link.parentElement;
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
          let parent = link.parentElement;
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

  const handleLoad = async (splineApp: any) => {
    if (logoImg && logoTarget) {
      try {
        const obj = splineApp.findObjectByName(logoTarget);
        if (obj) {
          const applyTexture = async (targetObj: any) => {
            if (targetObj.material && targetObj.material.layers) {
              const textureLayer = targetObj.material.layers.find((l: any) => l.type === 'texture');
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

