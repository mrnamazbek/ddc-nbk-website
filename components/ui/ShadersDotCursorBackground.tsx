"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useA11y } from "../theme/AccessibilityProvider";
import { getScroll } from "@/lib/scrollStore";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
   GLSL Shaders for the shaders.com dot cursor background effect
   -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // Fullscreen quad
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uThemeLight;
  uniform float uScroll;

  // Shader configuration parameters
  const float spacing = 28.0;          // Grid spacing in pixels
  const float baseDotSize = 1.2;       // Idle dot size in pixels
  const float maxDotSize = 6.0;        // Maximum dot size at the halo edge
  const float repulsionRadius = 180.0; // Distance of influence in pixels
  const float repulsionStrength = 38.0; // Maximum push distance in pixels

  void main() {
    vec2 pixelPos = gl_FragCoord.xy;
    vec2 mousePixel = uMouse * uResolution;

    // 1. Subtle, slow background idle animation (breathing effect)
    pixelPos.x += sin(pixelPos.y * 0.015 + uTime * 0.5) * 3.5;
    pixelPos.y += cos(pixelPos.x * 0.015 + uTime * 0.4) * 3.5;

    // 2. Compute vector to mouse in screen space
    vec2 toMouse = pixelPos - mousePixel;
    float distToMouse = length(toMouse);

    // 3. Apply physics-based cursor grid repulsion
    float factor = clamp((repulsionRadius - distToMouse) / repulsionRadius, 0.0, 1.0);
    float falloff = smoothstep(0.0, 1.0, factor);

    if (distToMouse < repulsionRadius && distToMouse > 0.001) {
      vec2 dir = normalize(toMouse);
      // Shift coordinates towards mouse, pushing grid points away visually
      pixelPos -= dir * falloff * repulsionStrength;
    }

    // Recalculate distance using deformed coordinates for size and color mapping
    vec2 deformedToMouse = pixelPos - mousePixel;
    float deformedDist = length(deformedToMouse);
    float deformedFactor = clamp((repulsionRadius - deformedDist) / repulsionRadius, 0.0, 1.0);
    float deformedFalloff = smoothstep(0.0, 1.0, deformedFactor);

    // 4. Dot size modulation: empty well in the middle, gold halo on the border
    float halo = smoothstep(0.0, 0.5, deformedFactor) * smoothstep(1.0, 0.5, deformedFactor) * 4.0;
    float dotSize = baseDotSize * (1.0 - deformedFalloff * 0.9) + halo * maxDotSize * 0.45;

    // 5. Generate grid centers in the deformed coordinate space
    vec2 gridCenter = (floor(pixelPos / spacing) + 0.5) * spacing;
    vec2 distVec = pixelPos - gridCenter;
    float distToCenter = length(distVec);

    // Render the smooth circle
    float antialias = 0.85;
    float dotMask = smoothstep(dotSize * 0.5 + antialias, dotSize * 0.5 - antialias, distToCenter);

    // Fade out completely as scroll increases (gone by 0.25 scroll)
    float scrollFade = 1.0 - smoothstep(0.0, 0.25, uScroll);
    dotMask *= scrollFade;

    // 6. Premium Theme Color Palette (Adapted to DDC Brand)
    // Dark theme: deep forest onyx (#050a08)
    // Light theme: soft off-white/beige (#f5f5f0)
    vec3 bgColor = mix(vec3(5.0 / 255.0, 10.0 / 255.0, 8.0 / 255.0), vec3(245.0 / 255.0, 245.0 / 255.0, 240.0 / 255.0), uThemeLight);

    // Soft ambient glow behind the grid following the cursor
    float glow = exp(-distToMouse * 0.012) * 0.15 * scrollFade;
    vec3 glowColor = mix(vec3(16.0 / 255.0, 185.0 / 255.0, 129.0 / 255.0), vec3(232.0 / 255.0, 200.0 / 255.0, 122.0 / 255.0), 0.5); // Emerald-Gold
    bgColor = mix(bgColor, bgColor + glowColor, glow);

    // Idle dots: deep forest green (#163a28) or gray-green (#5d6b63)
    vec3 baseDotColor = mix(vec3(22.0 / 255.0, 58.0 / 255.0, 40.0 / 255.0), vec3(93.0 / 255.0, 107.0 / 255.0, 99.0 / 255.0), uThemeLight);
    
    // Active dots: bright gold/wheat (#e8c87a)
    vec3 activeDotColor = vec3(232.0 / 255.0, 200.0 / 255.0, 122.0 / 255.0);

    // Interpolate dot color
    float colorMix = clamp(deformedFalloff * 0.2 + halo * 1.6, 0.0, 1.0);
    vec3 dotColor = mix(baseDotColor, activeDotColor, colorMix);

    // Final composition
    vec3 finalColor = mix(bgColor, dotColor, dotMask);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/* --------------------------------------------------------------------------
   Three.js Mesh Rendering Component
   -------------------------------------------------------------------------- */

function ShaderMesh({ isLight }: { isLight: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const smoothPointer = useRef({ x: 0.5, y: 0.5 });
  const velocity = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uThemeLight: { value: isLight ? 1.0 : 0.0 },
      uScroll: { value: 0 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1.0 - e.clientY / window.innerHeight; // Invert to WebGL bottom-left origin
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;

    const scroll = getScroll().smooth;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uResolution.value.set(size.width, size.height);
    m.uniforms.uScroll.value = scroll;
    m.uniforms.uThemeLight.value = isLight ? 1.0 : 0.0;

    // CPU-based Spring physics integration for organic inertia & bounce (overshoot)
    const delta = Math.min(0.03, dt); // Cap dt to prevent spring explosions during tab switching
    const stiffness = 160.0;
    const damping = 15.0;

    const ax = (pointer.current.x - smoothPointer.current.x) * stiffness - velocity.current.x * damping;
    const ay = (pointer.current.y - smoothPointer.current.y) * stiffness - velocity.current.y * damping;

    velocity.current.x += ax * delta;
    velocity.current.y += ay * delta;

    smoothPointer.current.x += velocity.current.x * delta;
    smoothPointer.current.y += velocity.current.y * delta;

    m.uniforms.uMouse.value.set(smoothPointer.current.x, smoothPointer.current.y);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* --------------------------------------------------------------------------
   Wrapper Component
   -------------------------------------------------------------------------- */

export default function ShadersDotCursorBackground() {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [a11yEnabled, prefersReducedMotion]);

  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none bg-background"
    >
      {visible && (
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 1], fov: 60 }}
          style={{ width: "100%", height: "100%" }}
          frameloop={visible ? "always" : "never"}
        >
          <ShaderMesh isLight={isLight} />
        </Canvas>
      )}
    </div>
  );
}
