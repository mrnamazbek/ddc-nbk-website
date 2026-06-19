"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, useHelper } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import Icon, { IconName } from "@/components/ui/Icon";
import { useA11y } from "@/components/theme/AccessibilityProvider";

interface ServiceItem {
  id: number;
  icon: IconName;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  techStack: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   GLSL Шейдер для интерактивного облака золотых и зеленых частиц
   ────────────────────────────────────────────────────────────────────────── */

const vertexShaderParticles = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uMouse3d;
  uniform float uDistortionRadius;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 pos = position;
    
    // Мягкое волнообразное движение от времени
    float timeScale = uTime * 0.25;
    pos.x += sin(pos.y * 0.5 + timeScale) * 0.4;
    pos.z += cos(pos.x * 0.5 + timeScale) * 0.4;
    pos.y += sin(pos.z * 0.3 + timeScale) * 0.3;
    
    // Вращение частиц вокруг центра от скролла
    float angle = uScroll * 1.5;
    float c = cos(angle);
    float s = sin(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = nx;
    pos.z = nz;

    // Отталкивание мыши в 3D
    float distToMouse = distance(pos, uMouse3d);
    if (distToMouse < uDistortionRadius) {
      float force = (1.0 - distToMouse / uDistortionRadius);
      force = smoothstep(0.0, 1.0, force);
      pos += normalize(pos - uMouse3d) * force * 1.2;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Перспективный размер точек
    gl_PointSize = (12.0 * (1.0 + hash(position.xy) * 1.5)) / -mvPosition.z;
    
    // Прозрачность в зависимости от расстояния к камере
    vAlpha = smoothstep(-15.0, -1.0, mvPosition.z) * (1.0 - smoothstep(-2.5, 0.0, mvPosition.z)) * 0.45;
    
    // Градиент цвета между глубоким лесным зеленым и ярким золотом
    float colorMix = hash(position.zx);
    vec3 green = vec3(0.10, 0.47, 0.31); // #1A7D4F
    vec3 gold = vec3(0.91, 0.76, 0.38);  // #E8C87A
    vColor = mix(green, gold, colorMix);
  }
`;

const fragmentShaderParticles = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Мягкие сглаженные края
    float alphaEdge = smoothstep(0.5, 0.3, dist);
    gl_FragColor = vec4(vColor, alphaEdge * vAlpha);
  }
`;

function ParticleCloud({ scroll }: { scroll: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const mouse3d = useRef(new THREE.Vector3(0, 0, -1000));
  const smoothMouse3d = useRef(new THREE.Vector3(0, 0, -1000));

  const count = 4000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Сфера радиусом 8-12
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 4.5 + Math.random() * 6.5;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // слегка приплюснуто
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse3d: { value: new THREE.Vector3(0, 0, -1000) },
      uDistortionRadius: { value: 2.8 },
    }),
    []
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScroll.value = scroll;

    // Расчет 3D пересечения мыши
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
   Центральный 3D-объект: Золотая Монета DDC с высокой детализацией
   ────────────────────────────────────────────────────────────────────────── */

function CentralGoldCoin() {
  const coinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinRef.current) {
      // Медленное величественное вращение
      coinRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      coinRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <group ref={coinRef} position={[0, 0, 0]}>
      {/* Главный диск монеты */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.18, 64]} />
        <meshPhysicalMaterial
          color="#C9A84C"
          roughness={0.15}
          metalness={0.95}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1.0}
        />
      </mesh>
      
      {/* Внутренний обод */}
      <mesh position={[0, 0.091, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.02, 64]} />
        <meshPhysicalMaterial
          color="#E8C87A"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0, -0.091, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.02, 64]} />
        <meshPhysicalMaterial
          color="#E8C87A"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Штрихи/ребристость на ребре монеты */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.505, Math.sin(angle) * 1.505, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.015, 0.05, 0.2]} />
              <meshPhysicalMaterial color="#9E7D2D" metalness={0.9} roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3D Карточка карусели
   ────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  item: ServiceItem;
  index: number;
  total: number;
  scroll: number;
  onSelect: (index: number) => void;
}

function CarouselCard({ item, index, total, scroll, onSelect }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Позиционирование на круговом цилиндре
  const radius = 5.2;

  useFrame((state, dt) => {
    if (!meshRef.current) return;

    // Угол расположения с учетом прокрутки
    const theta = (index / total) * Math.PI * 2 + scroll * Math.PI * 2;
    
    // Координаты на цилиндре
    const targetX = Math.sin(theta) * radius;
    const targetZ = Math.cos(theta) * radius - 1.2;
    const targetY = -Math.sin(theta * 2.0) * 0.3 - 0.2; // легкая S-образная волна по высоте

    // Интерполяция положения для плавности
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * Math.min(1, dt * 10);
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * Math.min(1, dt * 10);
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * Math.min(1, dt * 10);

    // Ориентация на камеру
    meshRef.current.lookAt(0, 0, 4);

    // Расчет прозрачности: карточки сзади угасают
    const depth = meshRef.current.position.z; // от -radius до +radius
    const normalizedDepth = (depth - (-radius)) / (radius * 2); // 0..1 (0 - сзади, 1 - спереди)
    
    // Карточка активна, если она спереди (z > 2.5)
    const isFront = depth > 2.0;

    // Мягкое качание парящей карточки
    const bounce = Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.05;
    meshRef.current.position.y += bounce;
  });

  // Обрезка длинного заголовка для 3D
  const shortTitle = item.title.length > 26 ? item.title.slice(0, 24) + "..." : item.title;

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
      {/* Стеклянная подложка карточки */}
      <mesh>
        <planeGeometry args={[2.5, 1.6]} />
        <meshPhysicalMaterial
          color={hovered ? "#1C4E36" : "#0E241A"}
          transmission={0.65}
          opacity={0.9}
          transparent={true}
          roughness={0.2}
          metalness={0.1}
          ior={1.4}
          thickness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Золотая рамка */}
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[1.25, 1.26, 4]} /> {/* имитация тонкой рамки */}
        <meshBasicMaterial color={hovered ? "#E8C87A" : "#C9A84C"} opacity={0.35} transparent />
      </mesh>

      {/* Текст заголовка в 3D */}
      <Text
        position={[0, 0.15, 0.02]}
        fontSize={0.14}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        {shortTitle}
      </Text>

      {/* Дополнительный текст (Subtitle) */}
      <Text
        position={[0, -0.22, 0.02]}
        fontSize={0.09}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        fillOpacity={0.8}
      >
        {item.subtitle.toUpperCase()}
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Главная сцена WebGL
   ────────────────────────────────────────────────────────────────────────── */

interface SceneProps {
  items: ServiceItem[];
  scroll: number;
  onSelectCard: (index: number) => void;
}

function WebGLScene({ items, scroll, onSelectCard }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#E8C87A" />
      <directionalLight position={[-5, -2, 2]} intensity={0.8} color="#52B788" />
      
      <ParticleCloud scroll={scroll} />
      <CentralGoldCoin />
      
      <group position={[0, 0, 0]}>
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
   Главный экспортируемый компонент Services3D
   ────────────────────────────────────────────────────────────────────────── */

export default function Services3D() {
  const t = useTranslations("ServicesPage");
  const { enabled: a11yEnabled, prefersReducedMotion } = useA11y();

  const services: ServiceItem[] = useMemo(() => [
    {
      id: 0,
      icon: "coins",
      title: t("s1.title"),
      subtitle: t("s1.subtitle"),
      description: t("s1.description"),
      features: [t("s1.f1"), t("s1.f2"), t("s1.f3")],
      techStack: "Hyperledger Fabric, Solidity, Go, HSM Modules",
    },
    {
      id: 1,
      icon: "zap",
      title: t("s2.title"),
      subtitle: t("s2.subtitle"),
      description: t("s2.description"),
      features: [t("s2.f1"), t("s2.f2"), t("s2.f3")],
      techStack: "Java, Spring Boot, Kafka, PostgreSQL, ISO 20022",
    },
    {
      id: 2,
      icon: "bank",
      title: t("s3.title"),
      subtitle: t("s3.subtitle"),
      description: t("s3.description"),
      features: [t("s3.f1"), t("s3.f2"), t("s3.f3")],
      techStack: "C++, Python, Oracle DB, IBM WebSphere MQ",
    },
    {
      id: 3,
      icon: "shield-check",
      title: t("s4.title"),
      subtitle: t("s4.subtitle"),
      description: t("s4.description"),
      features: [t("s4.f1"), t("s4.f2"), t("s4.f3")],
      techStack: "Fortinet, HSM, Linux, Hardware Crypto Units",
    },
    {
      id: 4,
      icon: "share",
      title: t("s5.title"),
      subtitle: t("s5.subtitle"),
      description: t("s5.description"),
      features: [t("s5.f1"), t("s5.f2"), t("s5.f3")],
      techStack: "Node.js, Express, OAuth2, GraphQL, Kong API Gateway",
    },
    {
      id: 5,
      icon: "chart",
      title: t("s6.title"),
      subtitle: t("s6.subtitle"),
      description: t("s6.description"),
      features: [t("s6.f1"), t("s6.f2"), t("s6.f3")],
      techStack: "Hadoop, Spark, ClickHouse, Python (PyTorch), Tableau",
    },
  ], [t]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);

  // Скролл-событие
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
        scrollCurrentRef.current += diff * 0.075; // плавность лерпа
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

  // Вычисление активного индекса карточки, находящейся прямо перед камерой
  // Угол theta = (i/6)*2pi + scroll*2pi. Карточка перед камерой при theta = k*2pi.
  // i/6 + scroll = k => i = 6k - 6*scroll. То есть i = (6 - round(scroll * 6)) % 6
  const activeIndex = useMemo(() => {
    const modProgress = ((scrollProgress % 1.0) + 1.0) % 1.0;
    const rawIdx = Math.round(modProgress * 6);
    return (6 - rawIdx) % 6;
  }, [scrollProgress]);

  const activeService = services[activeIndex] || services[0];

  // Клик по карточке прокручивает страницу на нужный шаг скролла
  const handleSelectCard = (index: number) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    
    // Расчет целевой позиции скролла
    const targetScroll = (6 - index) % 6 / 6;
    window.scrollTo({
      top: targetScroll * max,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full min-h-[450vh] bg-[#040C08] font-sans">
      
      {/* 3D WebGL Холст во весь экран (зафиксирован на заднем плане) */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-auto bg-[#040c08]">
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <WebGLScene
            items={services}
            scroll={scrollProgress}
            onSelectCard={handleSelectCard}
          />
        </Canvas>
      </div>

      {/* HTML Интерфейс поверх 3D (Текст и описания) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-24 min-h-screen pointer-events-none">
        
        {/* Заголовок страницы (всегда на экране) */}
        <div className="max-w-2xl mb-8 fixed top-24 left-6 sm:left-12 lg:left-16 pointer-events-auto">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3 block">
            {t("overline")}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-4 leading-tight">
            {t("titleLine1")}{" "}
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-md">
            {t("subtitle")}
          </p>
        </div>

        {/* Боковая карточка с детальным описанием выбранной услуги */}
        <div className="fixed right-6 sm:right-12 lg:right-16 bottom-20 w-full max-w-[28rem] sm:max-w-[32rem] pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel border-white/5 bg-charcoal/80 p-6 sm:p-8 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-gold/20 transition-colors duration-500"
            >
              {/* Хэдер с иконкой */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest-light/20 flex items-center justify-center text-gold">
                  <Icon name={activeService.icon} size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gold-light font-medium tracking-widest uppercase block mb-0.5">
                    {activeService.subtitle}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    {activeService.title}
                  </h2>
                </div>
              </div>

              {/* Описание */}
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-5">
                {activeService.description}
              </p>

              {/* Возможности */}
              <div className="mb-5">
                <h3 className="text-[10px] font-semibold text-white tracking-wider uppercase mb-3">
                  {t("keyFeaturesLabel")}
                </h3>
                <ul className="space-y-2.5">
                  {activeService.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light leading-relaxed">
                      <Icon name="check-circle" size={14} className="text-forest-light shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Техстек */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                  {t("techStackLabel")}
                </span>
                <code className="text-[10px] text-gold-light font-mono bg-charcoal/50 px-2.5 py-1 rounded border border-white/5">
                  {activeService.techStack}
                </code>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Подсказка для скролла */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 text-[10px] tracking-[0.2em] font-mono text-zinc-400">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-1 h-3 rounded-full bg-gold/50 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
