'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay WebGL canvas mount by 300ms to let page client transitions finish smoothly
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/10 animate-pulse rounded-2xl">
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
      />
    </Suspense>
  )
}

