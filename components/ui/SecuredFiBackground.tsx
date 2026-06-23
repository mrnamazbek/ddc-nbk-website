"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useA11y } from "../theme/AccessibilityProvider";
import { getScroll } from "@/lib/scrollStore";

/* --------------------------------------------------------------------------
   GLSL Shaders for particle morphing wave/sphere
   -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPr;         // Morph progress: 0.0 (wave) -> 1.0 (sphere) -> 2.0 (dissolve)
  uniform float uSize;       // Particle size scaling
  uniform float uAmplitude;  // Noise height amplitude on wave
  uniform float uSpeed;      // Noise speed

  attribute vec3 aSpherePos;
  attribute float aRandom;

  varying vec3 vPos;
  varying float vMorph;
  varying float vNoise;

  // Description : Array and textureless GLSL 2D simplex noise function.
  //      Author : Ian McEwan, Ashima Arts.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+10.0)*x); }

  float snoise2d(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float t = uTime * uSpeed;

    // 1. Stage 0: Plain Wave
    vec3 pos0 = position;
    // Apply scrolling wave noise on Y axis
    float n = snoise2d(pos0.xz * 0.08 + t * 0.4) * uAmplitude;
    pos0.y += n;

    // 2. Stage 1: Sphere Positions
    vec3 pos1 = aSpherePos;
    // Add swirl noise to the sphere to make it look alive
    float swirl = uTime * 0.25;
    pos1.x += sin(pos1.y * 1.5 + swirl) * 0.2 * aRandom;
    pos1.z += cos(pos1.x * 1.5 + swirl) * 0.2 * aRandom;

    // 3. Stage 2: Dissolved Grid
    vec3 pos2 = position * 3.5;
    pos2.y += snoise2d(pos2.xz * 0.04 - t * 0.3) * uAmplitude * 2.5;

    // 4. Morph interpolation based on uPr
    float pr0 = clamp(uPr, 0.0, 1.0);
    float pr1 = clamp(uPr - 1.0, 0.0, 1.0);

    vec3 pos = mix(pos0, pos1, pr0);
    pos = mix(pos, pos2, pr1);

    // Project coordinates
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size depends on camera distance
    gl_PointSize = (uSize / length(mvPosition.xyz));

    vPos = pos;
    vMorph = uPr;
    vNoise = n;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vPos;
  varying float vMorph;
  varying float vNoise;

  uniform vec3 uColor1;       // Primary dot color (Teal / Forest)
  uniform vec3 uColor2;       // Secondary dot color (Gold Accent)
  uniform float uAlpha;       // Base opacity multiplier
  uniform float uThemeLight;  // Adaptive theme state

  void main() {
    // Make particles perfectly circular
    float dist = distance(gl_PointCoord, vec2(0.5)) * 2.0;
    if (dist > 1.0) discard;

    // Soft antialiasing for particle edge
    float alphaMask = smoothstep(1.0, 0.78, dist);

    // Morph color mapping
    // At uPr = 0 (wave), dots are mostly emerald green
    // At uPr = 1 (sphere), dots blend with active gold based on height
    float colorFactor = clamp(vPos.y * 0.2 + 0.5, 0.0, 1.0);
    if (vMorph > 1.0) {
      colorFactor = clamp(length(vPos.xz) * 0.05, 0.0, 1.0);
    }
    
    // Mix theme specific base colors
    vec3 baseColor = mix(uColor1, uColor2, colorFactor * 0.45);
    
    // In light theme, make dots darker for readability
    if (uThemeLight > 0.5) {
      baseColor = mix(baseColor * 0.5, vec3(0.2, 0.2, 0.2), 0.1);
    }

    float finalAlpha = uAlpha * alphaMask;
    
    // Soften slightly for light theme
    if (uThemeLight > 0.5) {
      finalAlpha *= 0.75;
    }

    gl_FragColor = vec4(baseColor, finalAlpha);
  }
`;

/* --------------------------------------------------------------------------
   Three.js Particle Generator & Mesh Component
   -------------------------------------------------------------------------- */

interface ShaderParticlesProps {
  isLight: boolean;
}

function ShaderParticles({ isLight }: ShaderParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { size, camera } = useThree();

  const particleCount = 22500; // 150 x 150 grid
  const gridSize = 150;

  const [positions, spherePositions, randoms] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spherePos = new Float32Array(particleCount * 3);
    const rands = new Float32Array(particleCount);

    const radius = 3.8; // Radius of 3D sphere

    for (let i = 0; i < particleCount; i++) {
      // 1. Grid positions (xz plane)
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      const x = (col / (gridSize - 1)) * 36 - 18;
      const y = -1.2; // Offset below center
      const z = (row / (gridSize - 1)) * 36 - 18;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // 2. Fibonacci sphere positions (beautiful uniform distribution)
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      spherePos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      spherePos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      spherePos[i * 3 + 2] = Math.cos(phi) * radius;

      // 3. Random parameter for turbulence offsets
      rands[i] = Math.random();
    }

    return [pos, spherePos, rands] as const;
  }, [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPr: { value: 0 },
      uSize: { value: 16.0 },
      uAmplitude: { value: 1.6 },
      uSpeed: { value: 1.5 },
      uColor1: { value: new THREE.Color("#23573A") }, // Emerald Teals
      uColor2: { value: new THREE.Color("#E8C87A") }, // Gold highlights
      uAlpha: { value: 0.85 },
      uThemeLight: { value: isLight ? 1.0 : 0.0 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    const p = pointsRef.current;
    if (!m || !p) return;

    // Get smooth scroll value
    const scroll = getScroll().smooth; // Typically ranges from 0.0 (top) to ~2.0+ (bottom)

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uThemeLight.value = isLight ? 1.0 : 0.0;
    
    // Map scroll values to morph progress:
    // Scroll 0.0 -> uPr 0.0 (dome/wave at bottom)
    // Scroll 1.0 -> uPr 1.0 (perfect sphere in center)
    // Scroll 2.0+ -> uPr 2.0 (spread/dissolve layout)
    m.uniforms.uPr.value = scroll * 1.0;

    // Handle rotation of the particle system (slow orbit)
    p.rotation.y = state.clock.elapsedTime * 0.04;
    p.rotation.x = sin(state.clock.elapsedTime * 0.02) * 0.05;

    // Dynamic camera movements matching the target site's camera drifts
    const targetZ = 9.0 - scroll * 1.5;
    state.camera.position.z += (targetZ - state.camera.position.z) * Math.min(1.0, dt * 4.0);

    const targetY = -0.5 + scroll * 0.5;
    state.camera.position.y += (targetY - state.camera.position.y) * Math.min(1.0, dt * 4.0);

    state.camera.lookAt(0, 0, 0);
  });

  const sin = Math.sin;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpherePos" args={[spherePositions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={true}
        depthWrite={false}
        transparent={true}
      />
    </points>
  );
}

/* --------------------------------------------------------------------------
   Main Background Wrapper
   -------------------------------------------------------------------------- */

export default function SecuredFiBackground() {
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
    // Fallback static background for accessibility
    return <div className="fixed inset-0 -z-10 bg-background" />;
  }

  // Dark forest/teal background base matching the project guidelines
  const bgStyle = isLight 
    ? "bg-[#F5F5F0]" 
    : "bg-[#091A11]";

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-screen -z-10 block pointer-events-none transition-colors duration-500 ${bgStyle}`}
    >
      {visible && (
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 9.0], fov: 55 }}
          style={{ width: "100%", height: "100%" }}
          frameloop={visible ? "always" : "never"}
        >
          <ambientLight intensity={0.4} />
          <ShaderParticles isLight={isLight} />
        </Canvas>
      )}
    </div>
  );
}
