"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background/40 backdrop-blur-md rounded-card border border-glass-border text-muted font-mono text-xs min-h-[300px]">
      Loading 3D Showcase...
    </div>
  ),
});

type SplineObj = { color: string | number };
type SplineApp = { findObjectByName: (name: string) => SplineObj | null };

interface SplineShowcaseProps {
  activeTab: string;
}

/**
 * SplineShowcase component rendering the custom Spline scene (ictKMBv7DsgwCCwp)
 * and dynamically updating its colors at runtime to match the active tab's color.
 * Optimizations implemented:
 * 1. Intersection Observer deferral (only mounts the 3D canvas when scrolled near the fold).
 * 2. Next.js dynamic import (client-side execution only, ssr: false).
 */
export default function SplineShowcase({ activeTab }: SplineShowcaseProps) {
  const splineAppRef = useRef<SplineApp | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to lazy-load the heavy Spline scene
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "250px", // Starts loading 250px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Remove Spline branding watermark dynamically from DOM (and Shadow DOM if present)
  useEffect(() => {
    if (!isVisible) return;

    const removeWatermark = () => {
      const links = document.querySelectorAll('a[href*="spline.design"]');
      links.forEach((link) => {
        link.remove();
      });

      const viewers = document.querySelectorAll("spline-viewer");
      viewers.forEach((viewer) => {
        if (viewer.shadowRoot) {
          const logo = viewer.shadowRoot.querySelector("#logo");
          if (logo) logo.remove();
        }
      });
    };

    // Run cleanups at intervals to catch late-loading elements
    const interval = setInterval(removeWatermark, 200);
    const timeout = setTimeout(() => clearInterval(interval), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible]);

  function handleLoad(splineApp: unknown) {
    splineAppRef.current = splineApp as SplineApp;
    updateColors();
  }

  const updateColors = () => {
    const splineApp = splineAppRef.current;
    if (!splineApp) return;

    // Find meshes in the Spline scene by name
    const helix = splineApp.findObjectByName("Helix");
    const base = splineApp.findObjectByName("Base");
    const rect = splineApp.findObjectByName("Rectangle");

    // Corporate branding color mapping
    const goldColor = "#E8C87A";
    const greenColor = "#52B788";

    // Set colors based on the active tab (t1 is gold, t2 and t3 are green)
    const targetColor = activeTab === "t1" ? goldColor : greenColor;

    if (helix) {
      helix.color = targetColor;
    }
    if (base) {
      base.color = activeTab === "t1" ? "#1A3D2B" : "#0A1A11";
    }
    if (rect) {
      rect.color = "#0E2419";
    }
  };

  // Re-run color update whenever activeTab or visibility status changes
  useEffect(() => {
    if (isVisible) {
      updateColors();
    }
  }, [activeTab, isVisible]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] relative rounded-card overflow-hidden bg-background/20 backdrop-blur-md border border-glass-border shadow-card"
    >
      {isVisible ? (
        <Spline
          scene="https://prod.spline.design/ictKMBv7DsgwCCwp/scene.splinecode"
          onLoad={handleLoad}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-background/40 backdrop-blur-md rounded-card border border-glass-border text-muted font-mono text-xs min-h-[300px]">
          Loading 3D Showcase...
        </div>
      )}
    </div>
  );
}
