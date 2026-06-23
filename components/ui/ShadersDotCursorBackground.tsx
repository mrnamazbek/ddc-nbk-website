"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useA11y } from "../theme/AccessibilityProvider";
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

  // Shader configuration parameters
  const float spacing = 28.0;      // Grid spacing in pixels
  const float baseDotSize = 0.9;   // Idle dot size in pixels
  const float maxDotSize = 7.0;    // Maximum dot size under wave influence
  const float waveFreq = 2.4;      // Sine wave frequency
  const float waveAmp = 0.18;      // Sine wave amplitude
  const float waveAngle = 45.0;    // Angle of rotation of the wave line in degrees
  const float waveSpeed = 3.5;     // Speed of wave propagation
  const float waveThickness = 0.08; // Base width of the wave line
  const float waveSoftness = 0.16;  // Blur/softness of wave boundaries

  void main() {
    vec2 pixelPos = gl_FragCoord.xy;
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // 1. Calculate relative coordinates mapped to aspect ratio
    vec2 aspectMouse = vec2(uMouse.x * aspect, uMouse.y);
    vec2 aspectUv = vec2(uv.x * aspect, uv.y);
    vec2 offset = aspectUv - aspectMouse;

    // 2. Rotate coordinate system according to waveAngle
    float rad = radians(waveAngle);
    float s = sin(rad);
    float c = cos(rad);
    float rotatedX = offset.x * c - offset.y * s;
    float rotatedY = offset.x * s + offset.y * c;

    // 3. Compute sine wave deformation propagating in time
    float wave = sin(rotatedX * waveFreq * 6.28318 - uTime * waveSpeed) * waveAmp;

    // Distance of the current pixel to the deformed sine wave
    float distToWave = abs(rotatedY - wave);

    // Wave intensity/glow value (1.0 on the wave line, 0.0 far away)
    float effect = 1.0 - smoothstep(waveThickness - waveSoftness * 0.5, waveThickness + waveSoftness * 0.5, distToWave);

    // Fade out wave effect with distance from the mouse to keep it localized
    float distToMouse = length(offset);
    float mouseFalloff = smoothstep(0.55, 0.08, distToMouse);
    effect *= mouseFalloff;

    // 4. Compute procedural dot grid pattern
    // Find the center of the nearest grid cell in pixel coordinates
    vec2 gridCenter = (floor(pixelPos / spacing) + 0.5) * spacing;
    vec2 distVec = pixelPos - gridCenter;
    float distToCenter = length(distVec);

    // Scale dot size based on localized wave intensity
    float dotSize = mix(baseDotSize, maxDotSize, effect);

    // Smoothly render the circle
    float antialias = 0.75;
    float dotMask = smoothstep(dotSize * 0.5 + antialias, dotSize * 0.5 - antialias, distToCenter);

    // Fade out background dots completely as scroll increases (gone by 0.25 scroll)
    float scrollFade = 1.0 - smoothstep(0.0, 0.25, uScroll);
    dotMask *= scrollFade;

    // 5. Adaptive theme color palettes
    // Forest-dark theme base: deep teal/forest green (#0B1A12)
    // Light theme base: soft off-white/beige (#F5F5F0)
    vec3 bgColor = mix(vec3(11.0 / 255.0, 26.0 / 255.0, 18.0 / 255.0), vec3(245.0 / 255.0, 245.0 / 255.0, 240.0 / 255.0), uThemeLight);

    // Forest-dark dots: emerald green (#23573A)
    // Light theme dots: cool dark gray (#5D6B63)
    vec3 baseDotColor = mix(vec3(35.0 / 255.0, 87.0 / 255.0, 58.0 / 255.0), vec3(93.0 / 255.0, 107.0 / 255.0, 99.0 / 255.0), uThemeLight);

    // Active glow dots: bright gold/wheat (#E8C87A)
    vec3 activeDotColor = vec3(232.0 / 255.0, 200.0 / 255.0, 122.0 / 255.0);

    // Interpolate dot color between idle and active gold
    vec3 dotColor = mix(baseDotColor, activeDotColor, effect);

    // Composite final color
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

    // Smoothly interpolate cursor position (lerp)
    smoothPointer.current.x += (pointer.current.x - smoothPointer.current.x) * Math.min(1.0, dt * 6.5);
    smoothPointer.current.y += (pointer.current.y - smoothPointer.current.y) * Math.min(1.0, dt * 6.5);
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
