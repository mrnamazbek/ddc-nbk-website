"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useA11y } from "../theme/AccessibilityProvider";
import { usePathname } from "next/navigation";
import { getScroll } from "@/lib/scrollStore";

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
  uniform float uScrollFade;

  // Route-specific dynamic configuration uniforms
  uniform float uSpacing;
  uniform float uBaseDotSize;
  uniform float uMaxDotSize;
  uniform float uRepulsionRadius;
  uniform float uRepulsionStrength;
  uniform vec3  uColorRest;
  uniform vec3  uColorActive;
  uniform int   uShapeType;

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
    float factor = clamp((uRepulsionRadius - distToMouse) / uRepulsionRadius, 0.0, 1.0);
    float falloff = smoothstep(0.0, 1.0, factor);

    if (distToMouse < uRepulsionRadius && distToMouse > 0.001) {
      vec2 dir = normalize(toMouse);
      pixelPos -= dir * falloff * uRepulsionStrength;
    }

    // Recalculate distance using deformed coordinates for size and color mapping
    vec2 deformedToMouse = pixelPos - mousePixel;
    float deformedDist = length(deformedToMouse);
    float deformedFactor = clamp((uRepulsionRadius - deformedDist) / uRepulsionRadius, 0.0, 1.0);
    float deformedFalloff = smoothstep(0.0, 1.0, deformedFactor);

    // 4. Dot size modulation
    float halo = smoothstep(0.0, 0.5, deformedFactor) * smoothstep(1.0, 0.5, deformedFactor) * 4.0;
    float dotSize = uBaseDotSize * (1.0 - deformedFalloff * 0.9) + halo * uMaxDotSize * 0.45;

    // 5. Generate grid centers in the deformed coordinate space
    vec2 gridCenter = (floor(pixelPos / uSpacing) + 0.5) * uSpacing;
    vec2 distVec = pixelPos - gridCenter;
    float distToCenter = length(distVec);

    float antialias = 0.85;
    float dotMask = 0.0;

    // Render the shape based on uShapeType (0: Circle, 1: Diamond, 2: Triangle)
    if (uShapeType == 0) {
      dotMask = smoothstep(dotSize * 0.5 + antialias, dotSize * 0.5 - antialias, distToCenter);
    } else if (uShapeType == 1) {
      float radius = dotSize * 1.3;
      float d = abs(distVec.x) + abs(distVec.y);
      dotMask = smoothstep(radius + antialias, radius - antialias, d);
    } else {
      float side = dotSize * 1.8;
      float k = sqrt(3.0);
      vec2 p = distVec;
      p.x = abs(p.x) - side * 0.5;
      p.y = p.y + side / (2.0 * k);
      if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) * 0.5;
      p.x -= clamp(p.x, -side, 0.0);
      float d = -length(p) * sign(p.y);
      dotMask = smoothstep(antialias, -antialias, d);
    }

    // Background color mapping
    vec3 bgColor = mix(vec3(5.0 / 255.0, 10.0 / 255.0, 8.0 / 255.0), vec3(245.0 / 255.0, 245.0 / 255.0, 240.0 / 255.0), uThemeLight);

    // Soft ambient glow behind the grid following the cursor
    float glow = exp(-distToMouse * 0.012) * 0.15 * uScrollFade;
    vec3 glowColor = mix(vec3(16.0 / 255.0, 185.0 / 255.0, 129.0 / 255.0), vec3(232.0 / 255.0, 200.0 / 255.0, 122.0 / 255.0), 0.5); // Emerald-Gold
    bgColor = mix(bgColor, bgColor + glowColor, glow);

    // Dynamic Dot colors
    vec3 baseDotColor = uColorRest;
    vec3 activeDotColor = uColorActive;

    // Interpolate dot color
    float colorMix = clamp(deformedFalloff * 0.2 + halo * 1.6, 0.0, 1.0);
    vec3 dotColor = mix(baseDotColor, activeDotColor, colorMix);

    // Add subtle bloom/glow for active circles
    if (uShapeType == 0 && deformedFactor > 0.02) {
      float bloom = smoothstep(dotSize * 2.8 + antialias, dotSize * 2.8 - antialias, distToCenter);
      bgColor = mix(bgColor, bgColor + dotColor * 0.35, bloom * 0.12 * deformedFactor * uScrollFade);
    }

    // Final composition
    vec3 finalColor = mix(bgColor, dotColor, dotMask * uScrollFade);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/* --------------------------------------------------------------------------
   Shader Config Presets mapping per Pathname
   -------------------------------------------------------------------------- */

interface ShaderPresetConfig {
  shapeType: number; // 0: circle, 1: diamond, 2: triangle
  spacing: number;
  baseDotSize: number;
  maxDotSize: number;
  repulsionRadius: number;
  repulsionStrength: number;
  colorRest: [number, number, number];
  colorActive: [number, number, number];
}

function getPresetForPathname(pathname: string, isLight: boolean): ShaderPresetConfig {
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/"); // remove locale prefix (e.g., /ru/about -> /about)

  if (cleanPath === "/" || cleanPath === "") {
    return {
      // Home hero: the earlier flowing green/gold cursor field.
      shapeType: 0,
      spacing: 28.0,
      baseDotSize: 1.2,
      maxDotSize: 6.0,
      repulsionRadius: 180.0,
      repulsionStrength: 38.0,
      colorRest: isLight ? [93/255, 107/255, 99/255] : [22/255, 58/255, 40/255],
      colorActive: [232/255, 200/255, 122/255], // Gold
    };
  }

  if (cleanPath.startsWith("/about")) {
    return {
      shapeType: 2, // triangle
      spacing: 32.0,
      baseDotSize: 2.0,
      maxDotSize: 4.5,
      repulsionRadius: 160.0,
      repulsionStrength: 25.0,
      colorRest: isLight ? [120/255, 120/255, 120/255] : [130/255, 130/255, 130/255],
      colorActive: isLight ? [0, 0, 0] : [1, 1, 1], // Black/White
    };
  }

  if (cleanPath.startsWith("/services")) {
    return {
      shapeType: 1, // diamond
      spacing: 30.0,
      baseDotSize: 1.5,
      maxDotSize: 3.2,
      repulsionRadius: 140.0,
      repulsionStrength: 20.0,
      colorRest: isLight ? [139/255, 92/255, 26/255] : [189/255, 149/255, 91/255], // Bronze
      colorActive: [232/255, 200/255, 122/255], // Gold
    };
  }

  if (cleanPath.startsWith("/mission")) {
    return {
      shapeType: 0, // circle
      spacing: 20.0,
      baseDotSize: 1.0,
      maxDotSize: 3.5,
      repulsionRadius: 180.0,
      repulsionStrength: 40.0,
      colorRest: isLight ? [15/255, 76/255, 35/255] : [34/255, 197/255, 94/255], // Forest green
      colorActive: [232/255, 200/255, 122/255], // Gold-light
    };
  }

  if (cleanPath.startsWith("/careers")) {
    return {
      shapeType: 1, // diamond
      spacing: 35.0,
      baseDotSize: 1.6,
      maxDotSize: 5.0,
      repulsionRadius: 150.0,
      repulsionStrength: 30.0,
      colorRest: isLight ? [10/255, 120/255, 90/255] : [6/255, 95/255, 70/255], // Emerald
      colorActive: [52/255, 211/255, 153/255], // Mint
    };
  }

  if (cleanPath.startsWith("/security")) {
    return {
      shapeType: 1, // diamond (shield)
      spacing: 25.0,
      baseDotSize: 1.0,
      maxDotSize: 5.5,
      repulsionRadius: 195.0,
      repulsionStrength: 45.0,
      colorRest: isLight ? [10/255, 46/255, 30/255] : [10/255, 61/255, 43/255], // Deep forest
      colorActive: [232/255, 200/255, 122/255], // Gold-light
    };
  }

  if (cleanPath.startsWith("/contact")) {
    return {
      shapeType: 0, // circle
      spacing: 24.0,
      baseDotSize: 1.4,
      maxDotSize: 4.5,
      repulsionRadius: 150.0,
      repulsionStrength: 32.0,
      colorRest: isLight ? [139/255, 111/255, 38/255] : [201/255, 168/255, 76/255], // Gold
      colorActive: [82/255, 183/255, 136/255], // Forest-light
    };
  }

  // Digital, Analytics, Ecommerce, FAQ, News, etc.
  return {
    shapeType: 2, // triangle
    spacing: 28.0,
    baseDotSize: 1.2,
    maxDotSize: 5.0,
    repulsionRadius: 170.0,
    repulsionStrength: 35.0,
    colorRest: isLight ? [93/255, 107/255, 99/255] : [22/255, 58/255, 40/255], // Forest
    colorActive: [232/255, 200/255, 122/255], // Gold-light
  };
}

/* --------------------------------------------------------------------------
   Three.js Mesh Rendering Component
   -------------------------------------------------------------------------- */

function ShaderMesh({ isLight }: { isLight: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const pathname = usePathname();
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const smoothPointer = useRef({ x: 0.5, y: 0.5 });
  const velocity = useRef({ x: 0, y: 0 });

  const config = useMemo(() => getPresetForPathname(pathname, isLight), [pathname, isLight]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uThemeLight: { value: isLight ? 1.0 : 0.0 },
      uScroll: { value: 0 },
      uScrollFade: { value: 1.0 },
      uSpacing: { value: 28.0 },
      uBaseDotSize: { value: 1.2 },
      uMaxDotSize: { value: 6.0 },
      uRepulsionRadius: { value: 180.0 },
      uRepulsionStrength: { value: 38.0 },
      uColorRest: { value: new THREE.Color(22/255, 58/255, 40/255) },
      uColorActive: { value: new THREE.Color(232/255, 200/255, 122/255) },
      uShapeType: { value: 0 },
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

    const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
    const isHome = cleanPath === "/" || cleanPath === "";
    const scrollFade = isHome
      ? 1.0 - THREE.MathUtils.smoothstep(scroll, 0.02, 0.22)
      : 1.0;
    m.uniforms.uScrollFade.value = scrollFade;

    // Apply config uniforms dynamically
    m.uniforms.uSpacing.value = config.spacing;
    m.uniforms.uBaseDotSize.value = config.baseDotSize;
    m.uniforms.uMaxDotSize.value = config.maxDotSize;
    m.uniforms.uRepulsionRadius.value = config.repulsionRadius;
    m.uniforms.uRepulsionStrength.value = config.repulsionStrength;
    m.uniforms.uColorRest.value.setRGB(config.colorRest[0], config.colorRest[1], config.colorRest[2]);
    m.uniforms.uColorActive.value.setRGB(config.colorActive[0], config.colorActive[1], config.colorActive[2]);
    m.uniforms.uShapeType.value = config.shapeType;

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
      className="fixed inset-0 w-full h-screen -z-50 block pointer-events-none bg-background"
      style={{ zIndex: -50 }}
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
