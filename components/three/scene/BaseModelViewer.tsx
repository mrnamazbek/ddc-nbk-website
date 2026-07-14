"use client";

import React, { Component, Suspense, useRef, useMemo, useEffect, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useScenePalette } from "@/components/theme/useScenePalette";
import type { ScenePalette } from "@/components/theme/useScenePalette";
import { SceneLoader, SceneFallback } from "@/components/ui/SceneLoader";

// useGLTF пробрасывает ошибку загрузки (404/обрыв сети/битый файл) как
// render-ошибку, которую Suspense не ловит — без boundary падает вся страница.
class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("BaseModelViewer: model failed to load:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Set localized Draco decoder path to avoid fetching from external Google CDN
useGLTF.setDecoderPath("/draco/");

function Model({ url, isLight, palette, onReady }: { url: string; isLight: boolean; palette: ScenePalette; onReady?: () => void }) {
  const { scene: cachedScene } = useGLTF(url, true);
  // drei кэширует GLTF-сцену глобально: <primitive> с общим объектом мутирует
  // его position/материалы, и при смене локали/SPA-переходе старый и новый
  // инстансы страницы коротко сосуществуют и дерутся за один объект — модель
  // «съезжала» и подхватывала чужую раскраску. Клон на каждый маунт (геометрии
  // остаются общими по ссылке) изолирует инстансы. Тот же паттерн использовал
  // AltynAdam до своего удаления.
  const scene = useMemo(() => cachedScene.clone(true), [cachedScene]);
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const reduce = useReducedMotion();

  // Компонент рендерится только после того, как Suspense разрезолвил GLTF —
  // этот эффект и есть момент «модель полностью готова».
  useEffect(() => {
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reference to uniforms to dynamically toggle light/dark shader styles without recompiling
  const uniformsRef = useRef({
    uIsLight: { value: isLight ? 1.0 : 0.0 },
    uDarkBase: { value: new THREE.Color(palette.modelDarkBase) },
    uDarkAccent: { value: new THREE.Color(palette.modelDarkAccent) },
    uLightBase: { value: new THREE.Color(palette.modelLightBase) },
    uLightAccent: { value: new THREE.Color(palette.modelLightAccent) },
  });

  const rotationY = useRef(0.3);

  // Smooth auto-rotation and gentle bobbing (disabled if reduced motion is preferred)
  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Use delta-time accumulation for sub-pixel rotation smoothness
      if (!reduce) {
        const safeDelta = Math.min(delta, 0.1);
        // Auto-rotation tuned 8% slower for calmer reading beside mission copy.
        rotationY.current += safeDelta * 0.684;
        // Smoothly interpolate current rotation to the target rotation to eliminate frame jitter
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationY.current, 0.12);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.3, 0.12);
      }
      groupRef.current.position.y = reduce ? 0 : Math.sin(t * 0.5) * 0.04; // Reduced bobbing to prevent vertical clipping
    }
  });

  // Calculate geometric center of the loaded model
  const { center, scaleVal } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const centerVec = new THREE.Vector3();
    box.getCenter(centerVec);

    // Scale against the limiting axis, not width alone. Locale changes can
    // alter the neighboring text height, so a wide-but-short canvas must not
    // over-scale the model and clip vertically.
    const minSide = Math.min(size.width, size.height);
    const isMobile = minSide < 420;
    const isTablet = minSide >= 420 && minSide < 680;
    const scaleVal = isMobile ? 1.85 : isTablet ? 1.52 : 1.72;

    return { center: centerVec, scaleVal };
  }, [scene, size.height, size.width]);

  // Create physical material once to prevent WebGL recompiling shaders on every component render/resize
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#FFFFFF",
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 0.72,
      clearcoatRoughness: 0.16,
      envMapIntensity: 3.1,
    });

    mat.onBeforeCompile = (shader) => {
      // Pass the uIsLight uniform object to the shader
      shader.uniforms.uIsLight = uniformsRef.current.uIsLight;
      shader.uniforms.uDarkBase = uniformsRef.current.uDarkBase;
      shader.uniforms.uDarkAccent = uniformsRef.current.uDarkAccent;
      shader.uniforms.uLightBase = uniformsRef.current.uLightBase;
      shader.uniforms.uLightAccent = uniformsRef.current.uLightAccent;

      // Внедряем vLocalZ во vertex shader
      shader.vertexShader = `
        varying float vLocalZ;
        ${shader.vertexShader}
      `.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        vLocalZ = position.z;
        `
      );

      // Внедряем vLocalZ и uIsLight во fragment shader
      shader.fragmentShader = `
        uniform float uIsLight;
        uniform vec3 uDarkBase;
        uniform vec3 uDarkAccent;
        uniform vec3 uLightBase;
        uniform vec3 uLightAccent;
        varying float vLocalZ;
        ${shader.fragmentShader}
      `;

      // Перекрашиваем пиксели на основе высоты рельефа и активной темы (избегая пересветов в Light теме)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `
        #include <color_fragment>
        float absZ = abs(vLocalZ);

        vec3 greenPaint = mix(uDarkBase, uLightBase, uIsLight);
        vec3 ornamentPaint = mix(uDarkAccent, uLightAccent, uIsLight);

        // Порог 0.088 - 0.096 для идеального разделения основания и рельефа
        float mixFactor = smoothstep(0.088, 0.096, absZ);

        diffuseColor.rgb = mix(greenPaint, ornamentPaint, mixFactor);
        `
      );

      // Модифицируем roughness и metalness с учетом uIsLight (уменьшаем блеск в светлой теме для читаемости)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `
        #include <roughnessmap_fragment>
        float darkRoughness = mix(0.32, 0.18, mixFactor);
        float lightRoughness = mix(0.35, 0.25, mixFactor);
        roughnessFactor = mix(darkRoughness, lightRoughness, uIsLight);
        `
      ).replace(
        "#include <metalnessmap_fragment>",
        `
        #include <metalnessmap_fragment>
        float darkMetalness = mix(0.12, 0.58, mixFactor);
        float lightMetalness = mix(0.05, 0.15, mixFactor);
        metalnessFactor = mix(darkMetalness, lightMetalness, uIsLight);
        `
      );
    };

    return mat;
  }, []);

  // Traverse the scene and assign materials only once when the scene or material changes
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material = material;
      }
    });
  }, [scene, material]);

  // Keep one material alive while its uniforms follow the active semantic palette.
  useEffect(() => {
    uniformsRef.current.uIsLight.value = isLight ? 1.0 : 0.0;
    uniformsRef.current.uDarkBase.value.set(palette.modelDarkBase);
    uniformsRef.current.uDarkAccent.value.set(palette.modelDarkAccent);
    uniformsRef.current.uLightBase.value.set(palette.modelLightBase);
    uniformsRef.current.uLightAccent.value.set(palette.modelLightAccent);
  }, [isLight, palette]);

  // Clean up materials from GPU memory on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <group ref={groupRef} scale={scaleVal}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export default function BaseModelViewer() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const palette = useScenePalette();
  const t = useTranslations("Common");
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [everVisible, setEverVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Тяжёлая сцена рендерится только пока вьюер на экране: иначе она крутится
  // непрерывно всё время, что открыта страница. everVisible дополнительно
  // откладывает сам маунт Canvas (а с ним и загрузку GLB ~9.5MB) до
  // приближения секции к вьюпорту — раньше модель качалась сразу при
  // открытии роута, хотя стоит несколькими экранами ниже.
  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEverVisible(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="relative h-full min-h-[inherit] w-full cursor-grab select-none overflow-visible rounded-[var(--radius-card)] active:cursor-grabbing [&_canvas]:!block [&_canvas]:!h-full [&_canvas]:!w-full">
      <SceneErrorBoundary fallback={<SceneFallback label={t("sceneUnavailable")} />}>
      {/* Лоадер уходит только после полной готовности модели (onReady из
          Model срабатывает, когда Suspense разрезолвил GLTF). Контейнер
          держит размер родителя — layout shift исключён. */}
      {!ready && <SceneLoader label={t("loading")} />}
      {everVisible && (
      <div
        className="h-full w-full transition-opacity duration-700 ease-out"
        style={{ opacity: ready ? 1 : 0 }}
      >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 8.0], fov: 35 }}
        dpr={[1, 2]} // Limit DPR to 2 for performance optimization on Retina screens
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        frameloop={visible ? "always" : "never"}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          stencil: false, // Save memory and bandwidth by disabling stencil buffer
          depth: true,
        }}
        style={{ display: "block", height: "100%", width: "100%" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.24;
          const canvasEl = gl.domElement;
          canvasEl.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("BaseModelViewer: WebGL context lost — awaiting restore.");
          });
          canvasEl.addEventListener("webglcontextrestored", () => {
            console.warn("BaseModelViewer: WebGL context restored.");
          });
        }}
      >
        <ambientLight intensity={isLight ? 0.65 : 0.72} />
        <directionalLight position={[5, 8, 5]} intensity={isLight ? 1.15 : 2.35} color={isLight ? palette.keyLight : palette.modelDarkAccent} />
        <directionalLight position={[-5, -4, 2]} intensity={isLight ? 0.5 : 1.15} color={isLight ? palette.fillLight : palette.particlePrimary} />

        <Suspense fallback={null}>
          <Model url="/base.glb" isLight={isLight} palette={palette} onReady={() => setReady(true)} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={true} // Premium smooth drag interactions
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
          <Environment frames={1} resolution={128}>
            <Lightformer intensity={3.7} color={isLight ? palette.keyLight : palette.modelDarkAccent} position={[0, 4, -6]} scale={[10, 6, 1]} />
            <Lightformer intensity={1.65} color={isLight ? palette.fillLight : palette.particlePrimary} position={[-6, 0, 2]} scale={[6, 6, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
      </div>
      )}
      </SceneErrorBoundary>
    </div>
  );
}
