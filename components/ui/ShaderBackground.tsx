"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────────────────────
   GLSL "dot shader" background (shaders.com style, brand-adapted).
   A fine dot field whose dots pulse/brighten with a flowing FBM-noise field,
   plus a soft drifting forest→gold aurora and a glow that follows the cursor.
   Strictly forest-green + gold on near-black (off-white in light theme).
   ────────────────────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // fullscreen clip-space quad
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;       // 0..1
  uniform float uLight;       // 1.0 in light theme
  uniform vec3  uForest;      // #1A3D2B
  uniform vec3  uForestLight; // #52B788
  uniform vec3  uGold;        // #C9A84C
  uniform vec3  uGoldLight;   // #E8C87A
  uniform vec3  uBgColor;     // A/B test bg color

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 4; i++) { v += amp * noise(p); p *= 2.0; amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = uv * aspect;

    // Slowly flowing noise field (domain-warped for an organic, liquid feel).
    float t = uTime * 0.05;
    float warp = fbm(p * 1.6 - vec2(t * 0.6, t * 0.4));
    float flow = fbm(p * 2.4 + vec2(t, t * 0.7) + warp * 0.6);

    // Cursor glow.
    float md = length((uv - uMouse) * aspect);
    float mouseGlow = smoothstep(0.34, 0.0, md);

    // Dot grid in screen space (~16px spacing).
    vec2 gp = uv * uResolution / 16.0;
    float dist = length(fract(gp) - 0.5);

    // Dot intensity driven by flow + cursor; dots grow & brighten where active.
    float intensity = clamp(flow * 0.75 + mouseGlow * 0.9, 0.0, 1.4);
    float radius = 0.10 + intensity * 0.34;
    float dot = smoothstep(radius, radius - 0.09, dist);

    // Colour ramp: forest at rest → gold where the field/cursor is hot.
    vec3 col = mix(uForest, uForestLight, smoothstep(0.15, 0.6, flow));
    col = mix(col, uGold, smoothstep(0.55, 1.05, intensity));
    col = mix(col, uGoldLight, mouseGlow * 0.7);

    float dotAlpha = dot * (0.22 + intensity * 0.78);

    // Soft drifting aurora halo (independent of the dots).
    vec3 auroraCol = mix(uForest, uGold, flow);
    float aurora = flow * 0.05 + mouseGlow * 0.10;

    vec3 bg = mix(uBgColor, vec3(0.961, 0.961, 0.941), uLight);
    vec3 finalCol = bg + auroraCol * aurora + col * dotAlpha;
    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

function hexToRgb(hex: string): THREE.Vector3 {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

import { useBgSystem } from "../theme/BgSystemProvider";

function ShaderPlane({ isLight }: { isLight: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const smooth = useRef({ x: 0.5, y: 0.5 });
  const { bgSystem } = useBgSystem();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uLight: { value: isLight ? 1 : 0 },
      uForest: { value: hexToRgb("#1A3D2B") },
      uForestLight: { value: hexToRgb("#52B788") },
      uGold: { value: hexToRgb("#C9A84C") },
      uGoldLight: { value: hexToRgb("#E8C87A") },
      uBgColor: { value: new THREE.Vector3(16 / 255, 83 / 255, 76 / 255) },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    uniforms.uLight.value = isLight ? 1 : 0;
  }, [isLight, uniforms]);

  useEffect(() => {
    const color = bgSystem === "bg-forest"
      ? new THREE.Vector3(16 / 255, 83 / 255, 76 / 255)
      : new THREE.Vector3(1 / 255, 59 / 255, 63 / 255);
    uniforms.uBgColor.value.copy(color);
  }, [bgSystem, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uResolution.value.set(size.width, size.height);
    smooth.current.x += (pointer.current.x - smooth.current.x) * Math.min(1, dt * 4);
    smooth.current.y += (pointer.current.y - smooth.current.y) * Math.min(1, dt * 4);
    m.uniforms.uMouse.value.set(smooth.current.x, smooth.current.y);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

export default function ShaderBackground({ isLight }: { isLight: boolean }) {
  return (
    <div className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none">
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane isLight={isLight} />
      </Canvas>
    </div>
  );
}
