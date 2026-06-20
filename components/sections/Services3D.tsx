"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import Icon, { IconName } from "@/components/ui/Icon";

import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
  uniform float uCleanFactor;
  
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
    float timeScale = uTime * 0.18;
    pos.x += sin(pos.y * 0.4 + timeScale) * 0.35;
    pos.z += cos(pos.x * 0.4 + timeScale) * 0.35;
    pos.y += sin(pos.z * 0.2 + timeScale) * 0.25;
    
    // Вращение частиц вокруг центра от скролла
    // Скорость вращения замедляется в финале (Climax)
    float speedMult = 1.0 - uCleanFactor * 0.75;
    float angle = uScroll * 1.6 * speedMult;
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
      pos += normalize(pos - uMouse3d) * force * 1.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Размер точек
    gl_PointSize = (11.0 * (1.0 + hash(position.xy) * 1.2)) / -mvPosition.z;
    
    // Прозрачность
    // В Act 3 (Climax) уменьшаем плотность/прозрачность частиц, делая фон чище
    float cleanAlpha = 1.0 - uCleanFactor * 0.75;
    vAlpha = smoothstep(-15.0, -1.0, mvPosition.z) * (1.0 - smoothstep(-2.2, 0.0, mvPosition.z)) * 0.45 * cleanAlpha;
    
    // Градиент цвета золотисто-зеленый
    float colorMix = hash(position.zx);
    vec3 green = vec3(0.09, 0.44, 0.28); // #177048
    vec3 gold = vec3(0.92, 0.78, 0.40);  // #ECC766
    vColor = mix(green, gold, colorMix);
  }
`;

const fragmentShaderParticles = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alphaEdge = smoothstep(0.5, 0.3, dist);
    gl_FragColor = vec4(vColor, alphaEdge * vAlpha);
  }
`;

// External helper function to keep component rendering pure (React 19 rule)
function generateServicesParticles(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 4.5 + Math.random() * 6.5;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function ParticleCloud({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const mouse3d = useRef(new THREE.Vector3(0, 0, -1000));
  const smoothMouse3d = useRef(new THREE.Vector3(0, 0, -1000));

  const count = 3500;
  const positions = useMemo(() => generateServicesParticles(count), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse3d: { value: new THREE.Vector3(0, 0, -1000) },
      uDistortionRadius: { value: 2.8 },
      uCleanFactor: { value: 0 },
    }),
    []
  );

  useFrame((state, dt) => {
    const m = matRef.current;
    if (!m) return;
    const scroll = scrollRef.current;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uScroll.value = scroll;

    // В финале (Climax) делаем фон чище
    const cleanTarget = scroll >= 0.8 ? (scroll - 0.8) / 0.2 : 0;
    m.uniforms.uCleanFactor.value += (cleanTarget - m.uniforms.uCleanFactor.value) * Math.min(1, dt * 4);

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
   Центральный 3D-объект: Золотая Монета DDC
   ────────────────────────────────────────────────────────────────────────── */

function CentralGoldCoin({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const coinRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const reededGeometry = useMemo(() => {
    const geometries = [];
    const baseGeo = new THREE.BoxGeometry(0.015, 0.05, 0.2);
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const clone = baseGeo.clone();
      clone.translate(Math.cos(angle) * 1.505, Math.sin(angle) * 1.505, 0);
      clone.rotateZ(angle);
      geometries.push(clone);
    }
    const merged = mergeGeometries(geometries);
    baseGeo.dispose();
    geometries.forEach(g => g.dispose());
    return merged;
  }, []);

  const reededMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({ color: "#9E7D2D", metalness: 0.9, roughness: 0.3 });
  }, []);

  useFrame((state, dt) => {
    if (!coinRef.current || !matRef.current) return;
    const scroll = scrollRef.current;

    // Замедление вращения в финале
    const climaxFactor = scroll >= 0.8 ? (scroll - 0.8) / 0.2 : 0;
    const speedMult = 1.0 - climaxFactor * 0.75;
    coinRef.current.rotation.y = state.clock.elapsedTime * 0.45 * speedMult;
    coinRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12 * speedMult;

    // Масштабирование монеты по фазам:
    // Act 1 (Intro): 1.5 -> Act 2 (Showcase): 1.25 -> Act 3 (Climax): 2.4 (Крупный план)
    let targetScale = 1.25;
    if (scroll < 0.2) {
      targetScale = THREE.MathUtils.lerp(1.5, 1.25, scroll / 0.2);
    } else if (scroll >= 0.8) {
      targetScale = THREE.MathUtils.lerp(1.25, 2.4, (scroll - 0.8) / 0.2);
    }
    
    coinRef.current.scale.setScalar(
      THREE.MathUtils.damp(coinRef.current.scale.x, targetScale, 4, dt)
    );

    // В финале монета слегка сдвигается вперед для акцента
    const targetZ = scroll >= 0.8 ? THREE.MathUtils.lerp(0.0, 1.0, (scroll - 0.8) / 0.2) : 0;
    coinRef.current.position.z += (targetZ - coinRef.current.position.z) * Math.min(1, dt * 5);
  });

  return (
    <group ref={coinRef} position={[0, 0, 0]}>
      {/* Главный диск монеты */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.18, 64]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#C9A84C"
          roughness={0.12}
          metalness={0.98}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1.0}
        />
      </mesh>
      
      {/* Внутренний обод */}
      <mesh position={[0, 0.091, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.02, 64]} />
        <meshPhysicalMaterial
          color="#E8C87A"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>
      <mesh position={[0, -0.091, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.02, 64]} />
        <meshPhysicalMaterial
          color="#E8C87A"
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* Ребристость на ребре монеты */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh geometry={reededGeometry} material={reededMaterial} />
      </group>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3D Текст на заднем плане (Intro typography)
   ────────────────────────────────────────────────────────────────────────── */

function BackgroundIntroText({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!textRef.current) return;
    const scroll = scrollRef.current;
    
    // В фазе 1 (0.0 -> 0.2) текст сдвигается вверх и затухает
    const opacity = scroll < 0.2 ? 1.0 - scroll / 0.2 : 0;
    const targetY = scroll < 0.2 ? (scroll / 0.2) * 3.5 : 3.5;
    
    textRef.current.position.y += (targetY - textRef.current.position.y) * Math.min(1, dt * 6);
    
    // Применяем opacity к материалам текстовых сеток
    textRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={textRef} position={[0, 0, -4.5]}>
      <Text
        fontSize={0.68}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
        lineHeight={1.1}
      >
        DDC SERVICES
      </Text>
      <Text
        position={[0, -0.45, 0]}
        fontSize={0.22}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        STATE PLATFORMS
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3D Карточка карусели с параболическим скроллом в стиле Active Theory
   ────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  item: ServiceItem;
  index: number;
  total: number;
  scrollRef: React.RefObject<number>;
  onSelect: (index: number) => void;
}

function CarouselCard({ item, index, total, scrollRef, onSelect }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Точка фокуса карточки на шкале скролла
  const focusPoint = 0.2 + 0.6 * (index / (total - 1));

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    const scroll = scrollRef.current;

    const offset = scroll - focusPoint;

    // Новая круговая траектория на цилиндре
    const angleStep = 0.85; // Шаг угла между карточками в радианах
    const theta = -offset * angleStep;

    const R = 3.6; // Радиус цилиндра
    const Z_offset = 1.6 - R; // Смещение по оси Z, чтобы в фокусе z было 1.6

    const targetX = R * Math.sin(theta);
    const targetY = -0.1; // Небольшое смещение по высоте
    const targetZ = R * Math.cos(theta) + Z_offset;

    const rx = 0.08; // Легкий наклон назад
    const ry = -theta; // Направление лицом к камере

    // Инерционное сглаживание движения
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * Math.min(1, dt * 8);
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * Math.min(1, dt * 8);
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * Math.min(1, dt * 8);
    meshRef.current.rotation.x += (rx - meshRef.current.rotation.x) * Math.min(1, dt * 8);
    meshRef.current.rotation.y += (ry - meshRef.current.rotation.y) * Math.min(1, dt * 8);

    // Мягкое парение активной карточки
    const activeFactor = Math.max(0, 1.0 - Math.abs(offset) * 4.0); // 1.0 когда строго в фокусе
    if (activeFactor > 0.05) {
      const hoverBounce = Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.03 * activeFactor;
      meshRef.current.position.y += hoverBounce;
    }

    // Вычисление прозрачности карточки
    // Карточка видна только в окрестности своего фокуса
    const fadeRange = 0.22;
    const opacity = Math.max(0, 1.0 - Math.abs(offset) / fadeRange);
    // Применяем плавное появление/исчезновение всей карусели
    let carouselOpacity = 1.0;
    if (scroll < 0.2) {
      carouselOpacity = Math.max(0, (scroll - 0.05) / 0.15); // появление от 0.05 до 0.2
    } else if (scroll > 0.8) {
      carouselOpacity = Math.max(0, 1.0 - (scroll - 0.8) / 0.12); // исчезновение от 0.8 до 0.92
    }
    const finalOpacity = opacity * carouselOpacity;

    // Применяем прозрачность к материалам карточки
    meshRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = finalOpacity * (hovered ? 1.0 : 0.78);
      }
    });
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
      {/* Стеклянное тело карточки */}
      <mesh>
        <planeGeometry args={[2.5, 1.5]} />
        <meshPhysicalMaterial
          color={hovered ? "#1B4F36" : "#0D2218"}
          transmission={0.65}
          roughness={0.2}
          metalness={0.15}
          ior={1.4}
          thickness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Тонкая рамка */}
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[1.21, 1.22, 4]} />
        <meshBasicMaterial color={hovered ? "#E8C87A" : "#C9A84C"} opacity={0.25} transparent />
      </mesh>

      {/* Заголовок */}
      <Text
        position={[0, 0.15, 0.02]}
        fontSize={0.13}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.1}
      >
        {item.title}
      </Text>

      {/* Подзаголовок */}
      <Text
        position={[0, -0.22, 0.02]}
        fontSize={0.085}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.1}
        fillOpacity={0.8}
      >
        {item.subtitle.toUpperCase()}
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Холст WebGL сцены
   ────────────────────────────────────────────────────────────────────────── */

interface SceneProps {
  items: ServiceItem[];
  scrollRef: React.RefObject<number>;
  onSelectCard: (index: number) => void;
}

function WebGLScene({ items, scrollRef, onSelectCard }: SceneProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state, dt) => {
    const scroll = scrollRef.current;
    const climaxFactor = scroll >= 0.8 ? (scroll - 0.8) / 0.2 : 0;
    
    // Плавное притухание изумрудного заполняющего света
    if (dirLightRef.current) {
      const targetIntensity = THREE.MathUtils.lerp(1.2, 0.05, climaxFactor);
      dirLightRef.current.intensity = THREE.MathUtils.damp(
        dirLightRef.current.intensity,
        targetIntensity,
        4,
        dt
      );
    }
    
    // Золотой прожектор разгорается в полную силу и сужается
    if (spotlightRef.current) {
      const targetIntensity = THREE.MathUtils.lerp(0.8, 6.5, climaxFactor);
      const targetAngle = THREE.MathUtils.lerp(Math.PI / 6, Math.PI / 10, climaxFactor);
      spotlightRef.current.intensity = THREE.MathUtils.damp(
        spotlightRef.current.intensity,
        targetIntensity,
        4,
        dt
      );
      spotlightRef.current.angle = THREE.MathUtils.damp(
        spotlightRef.current.angle,
        targetAngle,
        4,
        dt
      );
    }

    // Движение камеры: пролет и наезд (зум) сквозь сцену
    // Intro -> Showcase: камера сдвигается с высоты Y = 0.35 на Y = 0.0
    // Showcase -> Climax: камера наезжает по Z с 6.2 до 3.9
    let targetCameraY = 0.0;
    if (scroll < 0.2) {
      targetCameraY = THREE.MathUtils.lerp(0.35, 0.0, scroll / 0.2);
    }
    const targetCameraZ = THREE.MathUtils.lerp(6.2, 3.9, climaxFactor);

    // Применяем инерционный сдвиг камеры
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCameraZ, 3.5, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCameraY, 3.5, dt);

    // Мягкое дыхание камеры, замедляющееся в финале
    const speedMult = THREE.MathUtils.lerp(1.0, 0.15, climaxFactor);
    const breatheX = Math.sin(state.clock.elapsedTime * 0.8) * 0.08 * speedMult;
    const breatheY = Math.cos(state.clock.elapsedTime * 0.8) * 0.08 * speedMult;
    
    state.camera.position.x = breatheX;
    state.camera.position.y += (breatheY - state.camera.position.y) * Math.min(1, dt * 5); // сглаживаем наложение дыхания на Y
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      
      {/* Заполняющий свет (тускнеет в финале) */}
      <directionalLight
        ref={dirLightRef}
        position={[4, 5, 3]}
        intensity={1.2}
        color="#52B788"
      />
      
      {/* Сфокусированный золотой прожектор (разгорается в финале) */}
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 7.5]}
        intensity={0.8}
        distance={15}
        angle={Math.PI / 6}
        penumbra={0.6}
        color="#E8C87A"
      />

      <BackgroundIntroText scrollRef={scrollRef} />
      <ParticleCloud scrollRef={scrollRef} />
      <CentralGoldCoin scrollRef={scrollRef} />
      
      <group>
        {items.map((item, idx) => (
          <CarouselCard
            key={item.id}
            item={item}
            index={idx}
            total={items.length}
            scrollRef={scrollRef}
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

  const scrollProgressRef = useRef(0);
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isClimax, setIsClimax] = useState(false);
  const [isIntro, setIsIntro] = useState(true);

  const activeIndexRef = useRef(0);
  const isClimaxRef = useRef(false);
  const isIntroRef = useRef(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // IntersectionObserver to pause rendering when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.005 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Скролл-событие с плавной интерполяцией
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
      if (Math.abs(diff) > 0.00005) {
        scrollCurrentRef.current += diff * 0.07;
        scrollProgressRef.current = scrollCurrentRef.current;

        const p = scrollProgressRef.current;
        const nextIntro = p < 0.2;
        const nextClimax = p >= 0.8;
        let nextIdx = 0;
        if (!nextIntro) {
          if (nextClimax) nextIdx = 5;
          else nextIdx = Math.min(5, Math.max(0, Math.round(((p - 0.2) / 0.6) * 5)));
        }

        if (nextIntro !== isIntroRef.current) {
          isIntroRef.current = nextIntro;
          setIsIntro(nextIntro);
        }
        if (nextClimax !== isClimaxRef.current) {
          isClimaxRef.current = nextClimax;
          setIsClimax(nextClimax);
        }
        if (nextIdx !== activeIndexRef.current) {
          activeIndexRef.current = nextIdx;
          setActiveIndex(nextIdx);
        }
      }
      requestAnimationFrame(updateScroll);
    };
    updateScroll();

    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeService = services[activeIndex] || services[0];

  const handleSelectCard = (index: number) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    
    // Расчет скролла для центрирования карточки
    const targetScroll = 0.2 + 0.6 * (index / 5);
    window.scrollTo({
      top: targetScroll * max,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-[500vh] bg-transparent font-sans">
      
      {/* 3D WebGL Холст */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-auto bg-[#040c08]">
        {visible && (
          <Canvas
            camera={{ position: [0, 0, 6.2], fov: 48 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            frameloop={visible ? "always" : "never"}
          >
            <WebGLScene
              items={services}
              scrollRef={scrollProgressRef}
              onSelectCard={handleSelectCard}
            />
          </Canvas>
        )}
      </div>

      {/* HTML Интерфейс */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-24 min-h-screen pointer-events-none">
        
        {/* Заголовок страницы (Скрывается плавно в Climax) */}
        <motion.div
          animate={{ opacity: isClimax ? 0.05 : 1, y: isClimax ? -20 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-8 fixed top-24 left-6 sm:left-12 lg:left-16 pointer-events-auto"
        >
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
        </motion.div>

        {/* Боковая карточка с деталями активной услуги (только в фазе Showcase) */}
        <div className="fixed right-6 sm:right-12 lg:right-16 bottom-20 w-full max-w-[28rem] sm:max-w-[32rem] pointer-events-auto">
          <AnimatePresence mode="wait">
            {!isClimax && !isIntro && (
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-white/5 bg-charcoal/80 p-6 sm:p-8 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-gold/20 transition-colors duration-500"
              >
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

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-5">
                  {activeService.description}
                </p>

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

                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                    {t("techStackLabel")}
                  </span>
                  <code className="text-[10px] text-gold-light font-mono bg-charcoal/50 px-2.5 py-1 rounded border border-white/5">
                    {activeService.techStack}
                  </code>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Финальный эмоциональный CTA в конце скролла (Climax) */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {isClimax && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="max-w-xl text-center px-6 pointer-events-auto"
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-mono font-semibold mb-4 block">
                  НАДЕЖНОЕ ЯДРО ФИНАНСОВ
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6 leading-tight">
                  Строим технологии <br />
                  <span className="text-gradient-gold font-medium">государственного уровня</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-8 max-w-md mx-auto">
                  DDC выступает технологическим драйвером Национального Банка Республики Казахстан, обеспечивая устойчивость и развитие цифровой экосистемы.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="px-5 py-3 rounded-full text-xs font-semibold bg-gold text-black hover:bg-gold-light transition-colors cursor-pointer"
                  >
                    Вернуться к началу
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Подсказка для скролла */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 text-[10px] tracking-[0.2em] font-mono text-zinc-400">
          <span>{isClimax ? "FINALE" : isIntro ? "SCROLL TO START" : "SCROLL TO EXPLORE"}</span>
          <div className="w-1 h-3 rounded-full bg-gold/55 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
