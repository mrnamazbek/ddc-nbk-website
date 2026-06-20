"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useTranslations } from "next-intl";

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
  uniform float uCleanFactor;
  
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
    float timeScale = uTime * 0.16;
    pos.y += sin(pos.x * 0.4 + timeScale) * 0.3;
    pos.x += cos(pos.z * 0.4 + timeScale) * 0.3;
    pos.z += sin(pos.y * 0.2 + timeScale) * 0.2;
    
    // Вращение по скроллу (замедляется в Climax)
    float speedMult = 1.0 - uCleanFactor * 0.8;
    float angle = uScroll * 1.7 * speedMult;
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
    
    gl_PointSize = (12.0 * (1.0 + hash(position.xy) * 1.2)) / -mvPosition.z;
    
    float cleanAlpha = 1.0 - uCleanFactor * 0.8;
    vAlpha = smoothstep(-15.0, -1.0, mvPosition.z) * (1.0 - smoothstep(-2.0, 0.0, mvPosition.z)) * 0.4 * cleanAlpha;
    
    // Цвет частиц: золотистый и лесной зеленый
    float mixFactor = hash(position.yx);
    vec3 green = vec3(0.07, 0.40, 0.25); // #12663F
    vec3 gold = vec3(0.94, 0.80, 0.42);  // #ECC26B
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

// External helper function to keep component rendering pure (React 19 rule)
function generateMissionParticles(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 5.0 + Math.random() * 7.0;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function ParticleCloud({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const mouse3d = useRef(new THREE.Vector3(0, 0, -1000));
  const smoothMouse3d = useRef(new THREE.Vector3(0, 0, -1000));

  const count = 3000;
  const positions = useMemo(() => generateMissionParticles(count), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse3d: { value: new THREE.Vector3(0, 0, -1000) },
      uDistortionRadius: { value: 3.0 },
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
   Процедурный преломляющий Шанырак из золотого стекла
   ────────────────────────────────────────────────────────────────────────── */

function CentralRefractiveShanyrak({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const shanyrakRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (shanyrakRef.current) {
      const scroll = scrollRef.current;
      const climaxFactor = scroll >= 0.8 ? (scroll - 0.8) / 0.2 : 0;
      const speedMult = 1.0 - climaxFactor * 0.75;
      
      // Вращение
      shanyrakRef.current.rotation.y = state.clock.elapsedTime * 0.35 * speedMult;
      shanyrakRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12 * speedMult;
      shanyrakRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.08 * speedMult;

      // Масштабирование по фазам:
      // Act 1 (Intro): 1.0 -> Act 2 (Showcase): 0.85 -> Act 3 (Climax): 1.8 (Крупный план)
      let targetScale = 0.85;
      if (scroll < 0.2) {
        targetScale = THREE.MathUtils.lerp(1.0, 0.85, scroll / 0.2);
      } else if (scroll >= 0.8) {
        targetScale = THREE.MathUtils.lerp(0.85, 1.8, (scroll - 0.8) / 0.2);
      }

      shanyrakRef.current.scale.setScalar(
        THREE.MathUtils.damp(shanyrakRef.current.scale.x, targetScale, 4, dt)
      );

      // В финале Шанырак выдвигается вперед
      const targetZ = scroll >= 0.8 ? THREE.MathUtils.lerp(0.0, 0.8, (scroll - 0.8) / 0.2) : 0;
      shanyrakRef.current.position.z += (targetZ - shanyrakRef.current.position.z) * Math.min(1, dt * 5);
    }
  });

  // Преломляющий материал золотого стекла
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

      {/* Дуги крестовины */}
      <mesh material={glassMat}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      <mesh material={glassMat} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      <mesh material={glassMat} rotation={[0, Math.PI, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>
      <mesh material={glassMat} rotation={[0, -Math.PI / 2, 0]}>
        <torusGeometry args={[1.48, 0.05, 8, 32, Math.PI * 0.6]} />
      </mesh>

      {/* Кульдреуши (поперечные рейки) */}
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
   3D Текст на заднем плане (Intro typography)
   ────────────────────────────────────────────────────────────────────────── */

function BackgroundIntroText({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!textRef.current) return;
    const scroll = scrollRef.current;
    const opacity = scroll < 0.2 ? 1.0 - scroll / 0.2 : 0;
    const targetY = scroll < 0.2 ? (scroll / 0.2) * 3.5 : 3.5;
    textRef.current.position.y += (targetY - textRef.current.position.y) * Math.min(1, dt * 6);
    
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
        DDC MISSION
      </Text>
      <Text
        position={[0, -0.45, 0]}
        fontSize={0.22}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        STABILITY & INNOVATION
      </Text>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3D Карточка карусели с параболическим скроллом
   ────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  item: MissionStep;
  index: number;
  total: number;
  scrollRef: React.RefObject<number>;
  onSelect: (index: number) => void;
  cardGeometry: THREE.PlaneGeometry;
  ringGeometry: THREE.RingGeometry;
}

function CarouselCard({ item, index, total, scrollRef, onSelect, cardGeometry, ringGeometry }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const focusPoint = 0.2 + 0.6 * (index / (total - 1));

  // Memoize materials to prevent recreation and shader compilation on hover/scroll
  const cardMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0D2117"),
      roughness: 0.5,
      metalness: 0.1,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  const borderMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#C9A84C"),
      transparent: true,
      depthWrite: false,
    });
  }, []);

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

    // Обновляем цвета материалов при наведении
    cardMaterial.color.setStyle(hovered ? "#224A37" : "#0D2117");
    borderMaterial.color.setStyle(hovered ? "#E8C87A" : "#C9A84C");

    // Применяем прозрачность к материалам карточки через traverse (чтобы затронуть и текст)
    meshRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.transparent = true;
        if (child.material === cardMaterial) {
          child.material.opacity = finalOpacity * (hovered ? 1.0 : 0.78);
        } else if (child.material === borderMaterial) {
          child.material.opacity = finalOpacity * 0.2;
        } else {
          // Текст или другие вложенные меши
          child.material.opacity = finalOpacity;
        }
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
      <mesh geometry={cardGeometry} material={cardMaterial} />

      <mesh geometry={ringGeometry} material={borderMaterial} position={[0, 0, 0.005]} />

      <Text
        position={[0, 0.15, 0.02]}
        fontSize={0.12}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.0}
      >
        {item.name}
      </Text>

      <Text
        position={[0, -0.18, 0.02]}
        fontSize={0.085}
        color="#C9A84C"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.0}
        fillOpacity={0.8}
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
  scrollRef: React.RefObject<number>;
  onSelectCard: (index: number) => void;
}

function WebGLScene({ items, scrollRef, onSelectCard }: SceneProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const spotlightRef = useRef<THREE.SpotLight>(null);

  // Shared geometries to prevent garbage collection overhead
  const cardGeometry = useMemo(() => new THREE.PlaneGeometry(2.3, 1.4), []);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(1.11, 1.12, 4), []);

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
      const targetIntensity = THREE.MathUtils.lerp(0.7, 6.5, climaxFactor);
      const targetAngle = THREE.MathUtils.lerp(Math.PI / 7, Math.PI / 10, climaxFactor);
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
    // Showcase -> Climax: камера наезжает по Z с 5.8 до 3.7
    let targetCameraY = 0.0;
    if (scroll < 0.2) {
      targetCameraY = THREE.MathUtils.lerp(0.35, 0.0, scroll / 0.2);
    }
    const targetCameraZ = THREE.MathUtils.lerp(5.8, 3.7, climaxFactor);

    // Применяем инерционный сдвиг камеры
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCameraZ, 3.5, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCameraY, 3.5, dt);

    // Мягкое дыхание камеры, замедляющееся в финале
    const speedMult = THREE.MathUtils.lerp(1.0, 0.15, climaxFactor);
    const breatheX = Math.sin(state.clock.elapsedTime * 0.7) * 0.06 * speedMult;
    const breatheY = Math.cos(state.clock.elapsedTime * 0.7) * 0.06 * speedMult;
    
    state.camera.position.x = breatheX;
    state.camera.position.y += (breatheY - state.camera.position.y) * Math.min(1, dt * 5); // сглаживаем наложение дыхания на Y
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      
      <directionalLight
        ref={dirLightRef}
        position={[-3, 5, 2]}
        intensity={1.2}
        color="#52B788"
      />
      
      {/* Сфокусированный золотой прожектор (разгорается в финале) */}
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 7.0]}
        intensity={0.7}
        distance={14}
        angle={Math.PI / 7}
        penumbra={0.7}
        color="#E8C87A"
      />

      <BackgroundIntroText scrollRef={scrollRef} />
      <ParticleCloud scrollRef={scrollRef} />
      <CentralRefractiveShanyrak scrollRef={scrollRef} />
      
      <group>
        {items.map((item, idx) => (
          <CarouselCard
            key={item.id}
            item={item}
            index={idx}
            total={items.length}
            scrollRef={scrollRef}
            onSelect={onSelectCard}
            cardGeometry={cardGeometry}
            ringGeometry={ringGeometry}
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
          if (nextClimax) nextIdx = 3;
          else nextIdx = Math.min(3, Math.max(0, Math.round(((p - 0.2) / 0.6) * 3)));
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

  const activeStep = steps[activeIndex] || steps[0];

  const handleSelectCard = (index: number) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    
    const targetScroll = 0.2 + 0.6 * (index / 3);
    window.scrollTo({
      top: targetScroll * max,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-[400vh] bg-transparent font-sans">
      
      {/* 3D WebGL Canvas */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-auto bg-[#040c08]">
        {visible && (
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 48 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            frameloop={visible ? "always" : "never"}
          >
            <WebGLScene
              items={steps}
              scrollRef={scrollProgressRef}
              onSelectCard={handleSelectCard}
            />
          </Canvas>
        )}
      </div>

      {/* HTML Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-24 min-h-screen pointer-events-none">
        
        {/* Заголовок (плавно исчезает в Climax) */}
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
            <span className="text-gradient-gold font-medium">{t("titleAccent")}</span>{" "}
            {t("titleLine2")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-md">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Боковая карточка шага миссии */}
        <div className="fixed right-6 sm:right-12 lg:right-16 bottom-20 w-full max-w-[28rem] sm:max-w-[32rem] pointer-events-auto">
          <AnimatePresence mode="wait">
            {!isClimax && !isIntro && (
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-white/5 bg-charcoal/80 p-6 sm:p-8 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-gold/20 transition-colors duration-500"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <span className="text-xs text-gold font-mono border border-gold/30 px-2 py-0.5 rounded-full">
                    STEP 0{activeStep.id + 1}
                  </span>
                  <span className="text-xs text-zinc-400 font-light uppercase tracking-widest">
                    {activeStep.name}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-4 leading-snug">
                  {activeStep.title}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {activeStep.description}
                </p>
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
                  НАША МИССИЯ
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-normal tracking-tight text-white mb-6 leading-tight">
                  Стабильность государства <br />
                  <span className="text-gradient-gold font-medium">через инновации</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-8 max-w-md mx-auto">
                  DDC стремится объединить лучшие мировые практики кибербезопасности, разработки и комплаенса для создания устойчивого финансового фундамента Республики Казахстан.
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

        {/* Подсказка */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 text-[10px] tracking-[0.2em] font-mono text-zinc-400">
          <span>{isClimax ? "FINALE" : isIntro ? "SCROLL TO START" : "SCROLL TO DISCOVER"}</span>
          <div className="w-1 h-3 rounded-full bg-gold/55 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
