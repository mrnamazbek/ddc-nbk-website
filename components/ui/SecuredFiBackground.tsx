"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useA11y } from "../theme/AccessibilityProvider";
import { getScroll } from "@/lib/scrollStore";

/* --------------------------------------------------------------------------
   GLSL Shaders for particle morphing wave/sphere/dissolve
   -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPr;         // Morph progress S: 0.0 -> 1.0
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

    // 1. Phase 1 (S = 0.0 - 0.25): Dome peeking from bottom
    // We shape it into a bottom dome using a cosine falloff envelope from center
    vec3 pos0 = position;
    float distFromCenter = length(pos0.xz);
    pos0.y = -2.8 + cos(clamp(distFromCenter / 18.0, 0.0, 1.0) * 3.14159 * 0.5) * 2.8;
    
    // Add vertical wave noise (bottom -> up flow direction achieved by moving Z offset in noise)
    float waveNoise = snoise2d(vec2(pos0.x * 0.1, pos0.z * 0.06 - t * 0.5)) * uAmplitude;
    pos0.y += waveNoise;

    // 2. Phase 2 (S = 0.45 - 0.75): Full Centered 3D Sphere
    vec3 pos1 = aSpherePos;
    // Add orbital swirling noise
    float swirl = uTime * 0.22;
    pos1.x += sin(pos1.y * 1.8 + swirl) * 0.15 * aRandom;
    pos1.z += cos(pos1.x * 1.8 + swirl) * 0.15 * aRandom;

    // 3. Phase 3 (S = 0.75 - 1.0): Diagonal Yield Curve wave
    // Particles expand and ripple diagonally left-to-right
    vec3 pos2 = position * 3.2;
    float diagonal = (pos2.x + pos2.z) * 0.08;
    pos2.y += sin(diagonal * 3.14159 * 1.5 - t * 1.8) * uAmplitude * 1.8;

    // 4. Easing mix between morph targets
    float pr0 = smoothstep(0.25, 0.45, uPr);      // Wave to Sphere
    float pr1 = smoothstep(0.75, 1.00, uPr);      // Sphere to Yield-Curve

    vec3 pos = mix(pos0, pos1, pr0);
    pos = mix(pos, pos2, pr1);

    // Project coordinates
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size depends on camera distance
    gl_PointSize = (uSize / length(mvPosition.xyz));

    vPos = pos;
    vMorph = uPr;
    vNoise = waveNoise;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vPos;
  varying float vMorph;
  varying float vNoise;

  uniform vec3 uColor1;       // Primary Forest Green (#2D6A4F)
  uniform vec3 uColor2;       // Active Gold Accent (#E8C87A)
  uniform float uAlpha;       // Base opacity multiplier
  uniform float uThemeLight;  // Adaptive theme state

  void main() {
    // Perfect circular points
    float dist = distance(gl_PointCoord, vec2(0.5)) * 2.0;
    if (dist > 1.0) discard;

    float alphaMask = smoothstep(1.0, 0.76, dist);

    // Mix color based on particle height and scroll morph state
    float colorFactor = clamp(vPos.y * 0.15 + 0.5, 0.0, 1.0);
    
    // During sphere morph, highlight active zones in gold
    if (vMorph > 0.25 && vMorph < 0.75) {
      colorFactor = smoothstep(-1.5, 2.5, vPos.y);
    } else if (vMorph >= 0.75) {
      // In diagonal wave, blend color along the diagonal axis
      colorFactor = clamp((vPos.x + vPos.y) * 0.08 + 0.5, 0.0, 1.0);
    }

    vec3 finalColor = mix(uColor1, uColor2, colorFactor);

    // If light theme, darken dots to preserve high contrast (WCAG AA)
    if (uThemeLight > 0.5) {
      finalColor = mix(finalColor * 0.45, vec3(0.15, 0.18, 0.16), 0.15);
    }

    float finalAlpha = uAlpha * alphaMask;
    
    if (uThemeLight > 0.5) {
      finalAlpha *= 0.7;
    }

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

/* --------------------------------------------------------------------------
   Three.js Particle Generator & Mesh Component
   -------------------------------------------------------------------------- */

interface ShaderParticlesProps {
  isLight: boolean;
  scrollProgress: number;
}

function ShaderParticles({ isLight, scrollProgress }: ShaderParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { size } = useThree();

  const particleCount = 22500; // 150 x 150 grid
  const gridSize = 150;

  const [positions, spherePositions, randoms] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spherePos = new Float32Array(particleCount * 3);
    const rands = new Float32Array(particleCount);

    const radius = 3.6; // Core radius of the 3D sphere

    for (let i = 0; i < particleCount; i++) {
      // 1. Grid positions (xz plane)
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      const x = (col / (gridSize - 1)) * 36 - 18;
      const y = 0.0;
      const z = (row / (gridSize - 1)) * 36 - 18;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // 2. Fibonacci sphere positions
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
      uSize: { value: 16.5 },
      uAmplitude: { value: 1.5 },
      uSpeed: { value: 1.5 },
      uColor1: { value: new THREE.Color("#2D6A4F") }, // Forest Green (#2D6A4F)
      uColor2: { value: new THREE.Color("#E8C87A") }, // Gold Accent (#E8C87A)
      uAlpha: { value: 0.85 },
      uThemeLight: { value: isLight ? 1.0 : 0.0 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const uPrSmooth = useRef(0);

  useFrame((state, dt) => {
    const m = matRef.current;
    const p = pointsRef.current;
    if (!m || !p) return;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uThemeLight.value = isLight ? 1.0 : 0.0;
    
    // Smooth morph progress uPr (lerp / MathUtils.damp)
    const targetPr = scrollProgress; // Morph target maps directly to S: 0.0 -> 1.0
    uPrSmooth.current = THREE.MathUtils.damp(uPrSmooth.current, targetPr, 6.5, dt);
    m.uniforms.uPr.value = uPrSmooth.current;

    // Slow rotation of particles
    p.rotation.y = state.clock.elapsedTime * 0.035;
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.04;

    // Camera movements from specification
    // S=0 -> Z=9.0, Y=-0.5
    // S=0.5 -> Z=7.8, Y=0.0
    // S=1.0 -> Z=10.5, Y=0.5
    let targetZ = 9.0;
    let targetY = -0.5;

    if (scrollProgress < 0.5) {
      const factor = scrollProgress / 0.5;
      targetZ = THREE.MathUtils.lerp(9.0, 7.8, factor);
      targetY = THREE.MathUtils.lerp(-0.5, 0.0, factor);
    } else {
      const factor = (scrollProgress - 0.5) / 0.5;
      targetZ = THREE.MathUtils.lerp(7.8, 10.5, factor);
      targetY = THREE.MathUtils.lerp(0.0, 0.5, factor);
    }

    state.camera.position.z += (targetZ - state.camera.position.z) * Math.min(1.0, dt * 4.0);
    state.camera.position.y += (targetY - state.camera.position.y) * Math.min(1.0, dt * 4.0);
    state.camera.lookAt(0, 0, 0);
  });

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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;
    
    // Bind scroll progression to React state
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0.0), 1.0));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Intersection observer for visibility
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [a11yEnabled, prefersReducedMotion]);

  if (a11yEnabled || prefersReducedMotion) {
    return <div className="fixed inset-0 -z-10 bg-background" />;
  }

  // Smooth color transitions in DDC palette:
  // Bright Forest Green (#0E2419) -> Deep/Near-Black (#040C08)
  const forestHex = 0x0e2419;
  const blackHex = 0x040c08;
  
  const cForest = new THREE.Color(forestHex);
  const cBlack = new THREE.Color(blackHex);
  
  // Interpolate background color based on scroll
  const currentBgColor = cForest.clone().lerp(cBlack, Math.min(scrollProgress * 1.25, 1.0));
  const bgString = isLight ? "#F5F5F0" : `#${currentBgColor.getHexString()}`;

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: bgString }}
      className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none transition-colors duration-200"
    >
      {visible && (
        <Canvas
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 9.0], fov: 55 }}
          style={{ width: "100%", height: "100%" }}
          frameloop={visible ? "always" : "never"}
        >
          <ambientLight intensity={0.45} />
          <ShaderParticles isLight={isLight} scrollProgress={scrollProgress} />
        </Canvas>
      )}
    </div>
  );
}
