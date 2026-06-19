"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface MissionStep {
  id: number;
  name: string;
  title: string;
  description: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   GLSL Шейдер для интерактивных частиц (звездное облако)
   ────────────────────────────────────────────────────────────────────────── */

const vertexShaderParticles = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uMouse3d;
  uniform float uDistortionRadius;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  float hash(vec2 p) {
    p = fract(p * vec2(95.43, 381.19));
    p += dot(p, p + 23.41);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 pos = position;
    
    // Плавное парение
    float timeScale = uTime * 0.2;
    pos.y += sin(pos.x * 0.4 + timeScale) * 0.35;
    pos.x += cos(pos.z * 0.4 + timeScale) * 0.35;
    pos.z += sin(pos.y * 0.3 + timeScale) * 0.25;
    
    // Вращение по скроллу
    float angle = uScroll * 1.8;
    float c = cos(angle);
    float s = sin(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = nx;
    pos.z = nz;

    // Отталкивание мыши
    float distToMouse = distance(pos, uMouse3d);
    if (distToMouse < uDistortionRadius) {
      float force = (1.0 - distToMouse / uDistortionRadius);
      force = smoothstep(0.0, 1.0, force);
      pos += normalize(pos - uMouse3d) * force * 1.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = (14.0 * (1.0 + hash(position.xy) * 1.2)) / -mvPosition.z;
    
    vAlpha = smoothstep(-15.0, -1.0, mvPosition.z) * (1.0 - smoothstep(-2.0, 0.0, mvPosition.z)) * 0.4;
    
    // Цвет частиц: золотистый и лесной зеленый
    float mixFactor = hash(position.yx);
    vec3 green = vec3(0.08, 0.42, 0.27); // #156B45
    vec3 gold = vec3(0.95, 0.82, 0.45);  // #F2D173
    vColor = mix(green, gold, mixFactor);
  }
`;

const fragmentShaderParticles = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alphaEdge = smoothstep(0.5, 0.32, dist);
    gl_FragColor = vec4(vColor, alphaEdge * vAlpha);
  }
`;

function ParticleCloud({ scroll }: { scroll: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const mouse3d = useRef(new THREE.Vector3(0, 0, -1000));
  const smoothMouse3d = useRef(new THREE.Vector3(0, 0, -1000));

  const count = 3000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5.0 + Math.random() * 7.0;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse3d: { value: new THREE.Vector3(0, 0, -1000) },
      uDistortionRadius: { value: 3.0 },
    }),
    []
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScroll.value = scroll;

    const pointer = state.pointer;
    if (pointer.x !== 0 || pointer.y !== 0) {
      const vec = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera);
      const dir = vec.clone().sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const intersection = camera.position.clone().add(dir.multiplyScalar(dist));
      mouse3d.current.copy(intersection);
    }
    smoothMouse3d.current.lerp(mouse3d.current, Math.min(1, dt * 5));
    m.uniforms.uMouse3d.value.copy(smoothMouse3d.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShaderParticles}
        fragmentShader={fragmentShaderParticles}
        uniforms={uniforms}
        depthWrite={false}
        transparent={true}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Процедурный преломляющий Шанырак из золотого стекла
   ────────────────────────────────────────────────────────────────────────── */

function CentralRefractiveShanyrak() {
  const shanyrakRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shanyrakRef.current) {
      // Медленное вращение
      shanyrakRef.current.rotation.y = state.clock.elapsedTime * 0.35;
      shanyrakRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
      shanyrakRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  // Физический преломляющий материал (жидкое стекло золотого цвета)
  const glassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#E8C87A",
      metalness: 0.1,
      roughness: 0.12,
      transmission: 0.85,
      ior: 1.55,
      thickness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  return (
    <group ref={shanyrakRef} position={[0, 0, 0]}>
      {/* Внешнее кольцо */}
      <mesh material={glassMat}>
        <torusGeometry args={[1.5, 0.12, 16, 64]} />
      </mesh>

      {/* Дуги крестовины ( Шанырак состоит из перекрещивающихся изогнутых дуг ) */}
      
      {/* Дуга 1 */}
      <mesh material={glassMat} rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      
      {/* Дуга 2 */}
      <mesh material={glassMat} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      
      {/* Дуга 3 */}
      <mesh material={glassMat} rotation={[0, Math.PI, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      
      {/* Дуга 4 */}
      <mesh material={glassMat} rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>

      {/* Мелкие поперечные рейки (кульдреуши) */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh material={glassMat} position={[0.7, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6]} />
            </mesh>
            <mesh material={glassMat} position={[-0.7, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3D Карточка карусели
   ────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  item: MissionStep;
  index: number;
  total: number;
  scroll: number;
  onSelect: (index: number) => void;
}

function CarouselCard({ item, index, total, scroll, onSelect }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const radius = 4.8;

  useFrame((state, dt) => {
    if (!meshRef.current) return;

    // Угол положения на карусели
    const theta = (index / total) * Math.PI * 2 + scroll * Math.PI * 2;
    
    const targetX = Math.sin(theta) * radius;
    const targetZ = Math.cos(theta) * radius - 1.2;
    const targetY = -Math.sin(theta * 2.0) * 0.25 - 0.1;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * Math.min(1, dt * 10);
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * Math.min(1, dt * 10);
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * Math.min(1, dt * 10);

    meshRef.current.lookAt(0, 0, 4);

    const bounce = Math.sin(state.clock.elapsedTime * 1.3 + index) * 0.04;
    meshRef.current.position.y += bounce;
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Панель карточки */}
      <mesh>
        <planeGeometry args={[2.3, 1.4]} />
        <meshPhysicalMaterial
          color={hovered ? "#224A37" : "#0D2117"}
          transmission={0.7}
          opacity={0.88}
          transparent={true}
          roughness={0.25}
          metalness={0.15}
          ior={1.45}
          thickness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Тонкий золотой ободок */}
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[1.13, 1.14, 4]} />
        <meshBasicMaterial color={hovered ? "#E8C87A" : "#C9A84C"} opacity={0.3} transparent />
      </mesh>

      {/* Текст шага */}
      <Text
        position={[0, 0.18, 0.02]}
        fontSize={0.13}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.0}
      >
        {item.name}
      </Text>

      {/* Краткий заголовок */}
      <Text
        position={[0, -0.15, 0.02]}
        fontSize={0.08}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.0}
        fillOpacity={0.85}
      >
        {item.title.toUpperCase()}
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Холст WebGL сцены
   ────────────────────────────────────────────────────────────────────────── */

interface SceneProps {
  items: MissionStep[];
  scroll: number;
  onSelectCard: (index: number) => void;
}

function WebGLScene({ items, scroll, onSelectCard }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 6, 4]} intensity={1.6} color="#E8C87A" />
      <directionalLight position={[-6, -3, 3]} intensity={0.7} color="#52B788" />
      
      <ParticleCloud scroll={scroll} />
      <CentralRefractiveShanyrak />
      
      <group>
        {items.map((item, idx) => (
          <CarouselCard
            key={item.id}
            item={item}
            index={idx}
            total={items.length}
            scroll={scroll}
            onSelect={onSelectCard}
          />
        ))}
      </group>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Главный экспортируемый компонент Mission3D
   ────────────────────────────────────────────────────────────────────────── */

export default function Mission3D() {
  const t = useTranslations("Mission");

  const steps: MissionStep[] = useMemo(() => [
    {
      id: 0,
      name: t("step1Name"),
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      id: 1,
      name: t("step2Name"),
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      id: 2,
      name: t("step3Name"),
      title: t("step3Title"),
      description: t("step3Desc"),
    },
    {
      id: 3,
      name: t("step4Name"),
      title: t("step4Title"),
      description: t("step4Desc"),
    },
  ], [t]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      scrollTargetRef.current = window.scrollY / max;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let active = true;
    const updateScroll = () => {
      if (!active) return;
      const diff = scrollTargetRef.current - scrollCurrentRef.current;
      if (Math.abs(diff) > 0.0001) {
        scrollCurrentRef.current += diff * 0.075;
        setScrollProgress(scrollCurrentRef.current);
      }
      requestAnimationFrame(updateScroll);
    };
    updateScroll();

    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeIndex = useMemo(() => {
    const modProgress = ((scrollProgress % 1.0) + 1.0) % 1.0;
    const rawIdx = Math.round(modProgress * 4);
    return (4 - rawIdx) % 4;
  }, [scrollProgress]);

  const activeStep = steps[activeIndex] || steps[0];

  const handleSelectCard = (index: number) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    
    const targetScroll = (4 - index) % 4 / 4;
    window.scrollTo({
      top: targetScroll * max,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full min-h-[350vh] bg-[#040C08] font-sans">
      
      {/* 3D WebGL Canvas */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-auto bg-[#040c08]">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <WebGLScene
            items={steps}
            scroll={scrollProgress}
            onSelectCard={handleSelectCard}
          />
        </Canvas>
      </div>

      {/* HTML Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-24 min-h-screen pointer-events-none">
        
        {/* Заголовок */}
        <div className="max-w-2xl mb-8 fixed top-24 left-6 sm:left-12 lg:left-16 pointer-events-auto">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-4 leading-tight">
            {t("titleLine1")}{" "}
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>{" "}
            {t("titleLine2")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-md">
            {t("subtitle")}
          </p>
        </div>

        {/* Информационная панель шага */}
        <div className="fixed right-6 sm:right-12 lg:right-16 bottom-20 w-full max-w-[28rem] sm:max-w-[32rem] pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel border-white/5 bg-charcoal/80 p-6 sm:p-8 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-gold/20 transition-colors duration-500"
            >
              {/* Шаг */}
              <div className="flex items-center gap-3.5 mb-4">
                <span className="text-xs text-gold font-mono border border-gold/30 px-2 py-0.5 rounded-full">
                  STEP 0{activeStep.id + 1}
                </span>
                <span className="text-xs text-zinc-400 font-light uppercase tracking-widest">
                  {activeStep.name}
                </span>
              </div>

              {/* Заголовок */}
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-4 leading-snug">
                {activeStep.title}
              </h2>

              {/* Описание */}
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {activeStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Подсказка */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 text-[10px] tracking-[0.2em] font-mono text-zinc-400">
          <span>SCROLL TO DISCOVER</span>
          <div className="w-1 h-3 rounded-full bg-gold/50 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
