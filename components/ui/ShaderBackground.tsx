"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useBgSystem } from "../theme/BgSystemProvider";
import { useA11y } from "../theme/AccessibilityProvider";

/* ──────────────────────────────────────────────────────────────────────────
   GLSL Шейдеры для фоновой плоскости (Ambient Aurora Glow)
   ────────────────────────────────────────────────────────────────────────── */

const vertexShaderBg = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // Fullscreen quad
  }
`;

const fragmentShaderBg = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uLight;
  uniform vec3  uForest;
  uniform vec3  uForestLight;
  uniform vec3  uGold;
  uniform vec3  uGoldLight;
  uniform vec3  uBgColor;
  uniform float uScroll;

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

    // Медленно текущее поле шума, искажающееся при скролле и времени
    float t = uTime * 0.04 + uScroll * 0.15;
    float warp = fbm(p * 1.3 - vec2(t * 0.5, t * 0.3));
    float flow = fbm(p * 1.8 + vec2(t, t * 0.6) + warp * 0.4);

    // Свечение курсора мыши
    float md = length((uv - uMouse) * aspect);
    float mouseGlow = smoothstep(0.45, 0.0, md);

    // Мягкая переливающаяся аврора
    vec3 auroraCol = mix(uForest, uGold, flow);
    auroraCol = mix(auroraCol, uGoldLight, mouseGlow * 0.25);
    float aurora = flow * 0.14 + mouseGlow * 0.18;

    // Базовый фоновый цвет (для светлой темы подстраивается под светлый фон)
    vec3 bg = mix(uBgColor, vec3(0.965, 0.965, 0.945), uLight);
    vec3 finalCol = bg + auroraCol * aurora;
    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

/* ──────────────────────────────────────────────────────────────────────────
   GLSL Шейдеры для 3D-частиц (Morphing Particle Grid)
   ────────────────────────────────────────────────────────────────────────── */

const vertexShaderPoints = /* glsl */ `
  attribute vec3 aGridPos;
  attribute vec3 aSpherePos;
  attribute float aRandom;

  uniform float uTime;
  uniform float uScroll;
  uniform float uDotSize;
  uniform vec3 uMouse3d;
  uniform float uDistortionRadius;
  uniform float uMouseStrength;

  varying float vAlpha;
  varying float vIntensity;

  // Волны на плоскости
  float getWave(vec3 p) {
    float w1 = sin(p.x * 0.38 + uTime * 1.2) * cos(p.z * 0.38 + uTime * 0.9);
    float w2 = cos(p.x * 0.22 - uTime * 0.6) * sin(p.z * 0.28 + uTime * 0.5);
    return (w1 + w2) * 0.65;
  }

  void main() {
    // 1. Базовая плоскость
    vec3 grid = aGridPos;
    grid.y += getWave(grid);
    
    // Эффект бесконечного пролета по оси Z
    grid.z = mod(grid.z - uTime * 0.18 - uScroll * 2.0 + 18.0, 36.0) - 18.0;

    // 2. Сфера Фибоначчи со swirl-деформацией от времени
    vec3 sphere = aSpherePos;
    float swirl = uTime * 0.5;
    sphere.x += sin(sphere.y * 2.5 + swirl) * 0.08 * aRandom;
    sphere.z += cos(sphere.x * 2.5 + swirl) * 0.08 * aRandom;
    sphere *= 3.4; // Масштаб сферы

    // 3. Расчет морфинга по снусоиде от скролла
    float PI = 3.141592653589793;
    float morphFactor = abs(sin(uScroll * PI * 2.0));
    morphFactor = smoothstep(0.0, 1.0, morphFactor); // Плавность перехода

    vec3 pos = mix(grid, sphere, morphFactor);

    // 4. Отталкивание мыши в 3D
    float distToMouse = distance(pos, uMouse3d);
    float intensity = 0.0;
    if (distToMouse < uDistortionRadius) {
      float force = (1.0 - distToMouse / uDistortionRadius);
      force = smoothstep(0.0, 1.0, force);
      pos += normalize(pos - uMouse3d) * force * uMouseStrength;
      intensity = force;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Размер точек с учетом перспективного сжатия
    gl_PointSize = uDotSize * (10.0 / -mvPosition.z);

    // Прозрачность частиц
    vAlpha = smoothstep(-25.0, -1.0, mvPosition.z) * (1.0 - smoothstep(-1.2, 0.0, mvPosition.z));
    vIntensity = intensity;
  }
`;

const fragmentShaderPoints = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying float vIntensity;

  uniform vec3 uForestLight;
  uniform vec3 uGold;
  uniform vec3 uGoldLight;
  uniform float uLight;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    float alphaEdge = smoothstep(0.5, 0.38, dist);

    // Обычный цвет точек: золотисто-зеленый
    vec3 baseColor = mix(uForestLight, uGold, 0.35);
    if (uLight > 0.5) {
      baseColor = mix(uForestLight * 0.4, uForestLight, 0.1);
    }
    
    // Активный цвет точек при наведении мыши
    vec3 activeColor = mix(uGold, uGoldLight, vIntensity);
    vec3 finalColor = mix(baseColor, activeColor, vIntensity * 0.85);

    float finalAlpha = alphaEdge * vAlpha * mix(0.3, 0.9, vIntensity);
    if (uLight > 0.5) {
      finalAlpha *= 0.65; // Делаем мягче для светлой темы
    }

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

/* ──────────────────────────────────────────────────────────────────────────
   Вспомогательные функции
   ────────────────────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): THREE.Vector3 {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/* ──────────────────────────────────────────────────────────────────────────
   Компоненты сцены
   ────────────────────────────────────────────────────────────────────────── */

function ShaderPlane({ isLight, scroll }: { isLight: boolean; scroll: number }) {
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
      uBgColor: { value: new THREE.Vector3(10 / 255, 10 / 255, 10 / 255) },
      uScroll: { value: 0 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    uniforms.uLight.value = isLight ? 1 : 0;
  }, [isLight, uniforms]);

  useEffect(() => {
    // Настраиваем оттенок фона под выбранную тему (Forest Green или Teal)
    const color = bgSystem === "bg-forest"
      ? new THREE.Vector3(8 / 255, 16 / 255, 12 / 255) // ультра-темный лесной зеленый
      : new THREE.Vector3(4 / 255, 12 / 255, 16 / 255); // ультра-темный тил
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
    m.uniforms.uScroll.value = scroll;
    smooth.current.x += (pointer.current.x - smooth.current.x) * Math.min(1, dt * 5);
    smooth.current.y += (pointer.current.y - smooth.current.y) * Math.min(1, dt * 5);
    m.uniforms.uMouse.value.set(smooth.current.x, smooth.current.y);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShaderBg}
        fragmentShader={fragmentShaderBg}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function MorphingParticles({ isLight, scroll }: { isLight: boolean; scroll: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  
  const mouse3d = useRef(new THREE.Vector3(0, 0, -1000));
  const smoothMouse3d = useRef(new THREE.Vector3(0, 0, -1000));

  const count = 15000;
  
  const [gridPositions, spherePositions, randoms] = useMemo(() => {
    const grid = new Float32Array(count * 3);
    const sphere = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    
    const gridSize = Math.sqrt(count);
    
    for (let i = 0; i < count; i++) {
      // 1. Плоская XZ-сетка
      const x = ((i % gridSize) / gridSize) * 36 - 18;
      const y = -1.8; // Опускаем чуть ниже центра камеры
      const z = (Math.floor(i / gridSize) / gridSize) * 36 - 18;
      
      grid[i * 3] = x;
      grid[i * 3 + 1] = y;
      grid[i * 3 + 2] = z;
      
      // 2. Сфера Фибоначчи
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      sphere[i * 3] = Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = Math.cos(phi);
      
      rands[i] = Math.random();
    }
    
    return [grid, sphere, rands];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDotSize: { value: 14.5 },
      uMouse3d: { value: new THREE.Vector3(0, 0, -1000) },
      uMouseStrength: { value: 0.9 },
      uForestLight: { value: hexToRgb("#52B788") },
      uGold: { value: hexToRgb("#C9A84C") },
      uGoldLight: { value: hexToRgb("#E8C87A") },
      uLight: { value: isLight ? 1 : 0 },
      uDistortionRadius: { value: 3.2 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    uniforms.uLight.value = isLight ? 1 : 0;
  }, [isLight, uniforms]);

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScroll.value = scroll;

    // Рассчитываем 3D положение курсора мыши на плоскости проецирования
    const pointer = state.pointer;
    if (pointer.x !== 0 || pointer.y !== 0) {
      const vec = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera);
      const dir = vec.clone().sub(camera.position).normalize();
      
      // Находим пересечение луча мыши с глубиной сцены
      const dist = -camera.position.z / dir.z;
      const intersection = camera.position.clone().add(dir.multiplyScalar(dist));
      mouse3d.current.copy(intersection);
    }

    // Сглаживание координат мыши
    smoothMouse3d.current.lerp(mouse3d.current, Math.min(1, dt * 6));
    m.uniforms.uMouse3d.value.copy(smoothMouse3d.current);

    // Динамическая анимация камеры по скроллу
    const PI = 3.141592653589793;
    const targetZ = 8.5 - Math.sin(scroll * PI * 2.0) * 2.8;
    state.camera.position.z += (targetZ - state.camera.position.z) * Math.min(1, dt * 3.5);
    
    const targetY = -0.5 - Math.cos(scroll * PI * 2.0) * 1.5;
    state.camera.position.y += (targetY - state.camera.position.y) * Math.min(1, dt * 3.5);

    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[gridPositions, 3]} />
        <bufferAttribute attach="attributes-aGridPos" args={[gridPositions, 3]} />
        <bufferAttribute attach="attributes-aSpherePos" args={[spherePositions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShaderPoints}
        fragmentShader={fragmentShaderPoints}
        uniforms={uniforms}
        depthTest={true}
        depthWrite={false}
        transparent={true}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Главный экспортируемый компонент фона
   ────────────────────────────────────────────────────────────────────────── */

export default function ShaderBackground({ isLight }: { isLight: boolean }) {
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();
  const [scroll, setScroll] = useState(0);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);

  // Подписка на событие скролла
  useEffect(() => {
    if (a11yEnabled || prefersReducedMotion) return;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      scrollTargetRef.current = window.scrollY / maxScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Сглаживание скролла через отдельный requestAnimationFrame цикл
    let active = true;
    const updateScroll = () => {
      if (!active) return;
      
      const diff = scrollTargetRef.current - scrollCurrentRef.current;
      if (Math.abs(diff) > 0.0001) {
        scrollCurrentRef.current += diff * 0.08;
        setScroll(scrollCurrentRef.current);
      }
      
      requestAnimationFrame(updateScroll);
    };
    updateScroll();

    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [a11yEnabled, prefersReducedMotion]);

  if (a11yEnabled || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-screen -z-10 block pointer-events-none bg-background">
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <ShaderPlane isLight={isLight} scroll={scroll} />
        <MorphingParticles isLight={isLight} scroll={scroll} />
      </Canvas>
    </div>
  );
}
