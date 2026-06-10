"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ──────────────────────────────────────────────────────────────────────────
   DDC 3D logo medallion + gold particle field.
   Forest-green enamel coin, reeded gold rim, gold inner ring, and the DDC
   emblem (vertical bars + diamond nodes, from ddc-logo.svg) embossed on both
   faces. Slow Y-axis rotation, subtle bob, mouse tilt. Strict forest+gold
   palette, near-black background. Lazy-loaded, adaptive, reduced-motion aware.
   ────────────────────────────────────────────────────────────────────────── */

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#E8C87A";
const FOREST = "#163A28";
const FOREST_DEEP = "#0E2419";

// SVG (200×200, centre 100,100) → world units. Emblem fits inside the green face.
const S = 0.0165;
const wx = (sx: number) => (sx - 100) * S;
const wy = (sy: number) => -(sy - 100) * S;

// Vertical bars taken from the logo: [svg centreX, svg half-height, svg width].
const BARS: [number, number, number][] = [
  [18, 30, 6], [182, 30, 6],
  [40, 48, 6], [160, 48, 6],
  [62, 64, 7], [138, 64, 7],
  [84, 78, 9], [116, 78, 9],
];
// Diamond nodes on the 2nd and 3rd rings.
const DIAMONDS: [number, number][] = [
  [40, 100], [160, 100], [62, 100], [138, 100],
];

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

function diamondShape(half: number) {
  const s = new THREE.Shape();
  s.moveTo(0, half);
  s.lineTo(half, 0);
  s.lineTo(0, -half);
  s.lineTo(-half, 0);
  s.closePath();
  return s;
}

/** Reeded coin body: cylinder whose side vertices ripple radially into ridges. */
function useReededCoin(radius: number, height: number, ridges: number, depth: number) {
  return useMemo(() => {
    const geo = new THREE.CylinderGeometry(radius, radius, height, ridges, 1, false);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = Math.hypot(v.x, v.z);
      // Only the outer side ring (not the flat caps at the centre).
      if (r > radius * 0.98) {
        const a = Math.atan2(v.z, v.x);
        const k = 1 + depth * (0.5 + 0.5 * Math.cos(a * ridges));
        v.x *= k;
        v.z *= k;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
    }
    geo.computeVertexNormals();
    geo.rotateX(Math.PI / 2); // lay the coin flat, facing the camera (+Z)
    return geo;
  }, [radius, height, ridges, depth]);
}

function Emblem() {
  const geos = useMemo(() => {
    const out: THREE.ExtrudeGeometry[] = [];
    const opts = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.012, bevelSegments: 2 };
    for (const [cx, hh, w] of BARS) {
      const g = new THREE.ExtrudeGeometry(roundedRectShape(w * S, hh * 2 * S, (w * S) / 2), opts);
      g.translate(wx(cx), 0, 0);
      out.push(g);
    }
    for (const [cx, cy] of DIAMONDS) {
      const g = new THREE.ExtrudeGeometry(diamondShape(7 * S), opts);
      g.translate(wx(cx), wy(cy), 0);
      out.push(g);
    }
    // Centre square
    const sq = new THREE.ExtrudeGeometry(roundedRectShape(15 * S, 15 * S, 2 * S), opts);
    out.push(sq);
    return out;
  }, []);

  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshPhysicalMaterial
            color={GOLD}
            metalness={1}
            roughness={0.26}
            iridescence={0.55}
            iridescenceIOR={1.32}
            clearcoat={0.4}
            clearcoatRoughness={0.25}
            emissive={GOLD}
            emissiveIntensity={0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

function Medallion({ pointer, reduced }: { pointer: React.RefObject<{ x: number; y: number }>; reduced: boolean }) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  const coinGeo = useReededCoin(2, 0.28, 170, 0.02);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    if (spin.current && !reduced) spin.current.rotation.y += d * 0.32;
    if (tilt.current) {
      const p = pointer.current ?? { x: 0, y: 0 };
      const ty = reduced ? 0.32 : p.x * 0.35;
      const tx = reduced ? -0.12 : -p.y * 0.28;
      tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, ty, 0.06);
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, tx, 0.06);
      tilt.current.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={tilt} rotation={[ -0.12, reduced ? 0.32 : 0, 0 ]}>
      <group ref={spin}>
        {/* Reeded gold body */}
        <mesh geometry={coinGeo}>
          <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.3} clearcoat={0.3} envMapIntensity={1.1} />
        </mesh>
        {/* Raised green enamel face (protrudes slightly past the gold on both sides) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.82, 1.82, 0.3, 128]} />
          <meshPhysicalMaterial color={FOREST} metalness={0.2} roughness={0.34} clearcoat={0.7} clearcoatRoughness={0.2} envMapIntensity={0.7} />
        </mesh>
        {/* Gold inner border rings on both faces */}
        <mesh position={[0, 0, 0.151]}>
          <torusGeometry args={[1.72, 0.03, 16, 120]} />
          <meshPhysicalMaterial color={GOLD_BRIGHT} metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.151]}>
          <torusGeometry args={[1.72, 0.03, 16, 120]} />
          <meshPhysicalMaterial color={GOLD_BRIGHT} metalness={1} roughness={0.25} />
        </mesh>
        {/* Embossed emblem on the front and back faces */}
        <group position={[0, 0, 0.15]}>
          <Emblem />
        </group>
        <group position={[0, 0, -0.15]} rotation={[0, Math.PI, 0]}>
          <Emblem />
        </group>
      </group>
    </group>
  );
}

/** Lightformer studio environment (no external HDR fetch) for warm gold reflections. */
function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={2.6} color={GOLD_BRIGHT} position={[0, 3, 4]} scale={[8, 4, 1]} />
      <Lightformer intensity={1.4} color="#ffffff" position={[-4, 1, 3]} scale={[4, 6, 1]} />
      <Lightformer intensity={1.2} color={FOREST} position={[4, -2, 2]} scale={[6, 6, 1]} />
      <Lightformer intensity={1.0} color={GOLD} position={[0, -4, 1]} scale={[10, 3, 1]} />
    </Environment>
  );
}

function Scene({ pointer, reduced, mobile }: { pointer: React.RefObject<{ x: number; y: number }>; reduced: boolean; mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color={GOLD_BRIGHT} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color={FOREST} />
      <Suspense fallback={null}>
        <Studio />
        <Medallion pointer={pointer} reduced={reduced} />
      </Suspense>
      {/* Gold dust field */}
      <Sparkles
        count={mobile ? 350 : 900}
        scale={[11, 8, 6]}
        size={mobile ? 2 : 3.2}
        speed={reduced ? 0 : 0.35}
        opacity={0.7}
        color={GOLD_BRIGHT}
      />
      {!reduced && !mobile && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.55} intensity={0.7} mipmapBlur radius={0.7} />
        </EffectComposer>
      )}
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function Hero3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      setMobile(window.innerWidth < 768);
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Pause the render loop when the hero scrolls out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };

  return (
    <div ref={wrapRef} onPointerMove={onMove} className="absolute inset-0 h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, mobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 8], fov: 30 }}
      >
        <Scene pointer={pointer} reduced={reduced} mobile={mobile} />
      </Canvas>
    </div>
  );
}
