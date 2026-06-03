"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { ACTS, band, lerp, range, smoothstep, easeOutExpo } from "@/lib/sceneMath";

const R = 2.2; // outer radius of the crown
const DOME = 0.9; // how far the lattice bulges toward the viewer
const RAY_COUNT = 16;

/** One bowed bar of the dome lattice (тор-көз), as a tube curve. */
function makeLatticeCurve(offset: number, axis: "x" | "z") {
  const half = Math.sqrt(Math.max(0, R * R - offset * offset)) * 0.98;
  const bow = DOME * (1 - (offset / R) ** 2);
  const a = axis === "x"
    ? new THREE.Vector3(-half, 0, offset)
    : new THREE.Vector3(offset, 0, -half);
  const b = axis === "x"
    ? new THREE.Vector3(half, 0, offset)
    : new THREE.Vector3(offset, 0, half);
  const ctrl = axis === "x"
    ? new THREE.Vector3(0, bow, offset)
    : new THREE.Vector3(offset, bow, 0);
  return new THREE.QuadraticBezierCurve3(a, ctrl, b);
}

export default function Shanyrak() {
  const root = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const spokes = useRef<THREE.Group>(null);

  // Build geometry + the single shared gold material once.
  const { lattice, rays, gold } = useMemo(() => {
    const lattice: THREE.TubeGeometry[] = [];
    const steps = [-1.5, -0.75, 0, 0.75, 1.5].map((s) => (s / 1.5) * (R * 0.72));
    for (const off of steps) {
      lattice.push(new THREE.TubeGeometry(makeLatticeCurve(off, "x"), 40, 0.05, 8, false));
      lattice.push(new THREE.TubeGeometry(makeLatticeCurve(off, "z"), 40, 0.05, 8, false));
    }
    const rays = Array.from({ length: RAY_COUNT }, (_, i) => (i / RAY_COUNT) * Math.PI * 2);

    // Liquid-gold iridescent skin (three r184 iridescence — no custom GLSL).
    const gold = new THREE.MeshPhysicalMaterial({
      color: "#C9A84C",
      metalness: 1,
      roughness: 0.17,
      emissive: new THREE.Color("#8B7035"),
      emissiveIntensity: 0.18,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 560],
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.4,
    });
    return { lattice, rays, gold };
  }, []);

  useFrame((three, dt) => {
    const p = getScroll().smooth;
    const t = three.clock.getElapsedTime();
    if (!root.current || !crown.current || !spokes.current) return;

    // ---- Presence: visible in Formation→Expansion, gone while it "becomes"
    // the coin/vault/data, then reborn for Steppe (as a sun) and Return. ----
    const intro = band(p, -0.02, 0.3, 0.06);
    const outro = band(p, ACTS.steppe[0], 1.02, 0.05);
    const presence = Math.max(intro, outro);

    gold.opacity = presence;
    gold.transparent = presence < 0.999;
    // Glow swells + pulses on Return (Act 7).
    const pulse = 0.5 + Math.sin(t * 1.6) * 0.12;
    gold.emissiveIntensity = lerp(0.18, pulse, smoothstep(range(p, 0.9, 1)));
    root.current.visible = presence > 0.001;

    // ---- ACT 1 · Formation: assemble from a point, spin up ----
    // Loader handles the particle-assembly reveal, so the crown is already
    // substantial at rest and only finishes settling as Act 1 plays.
    const assemble = easeOutExpo(range(p, 0, ACTS.formation[1]));
    let scale = lerp(0.78, 1, assemble);
    let yPos = 0;

    // ---- ACT 6/7 · re-entry (rising sun → full glory) ----
    if (p > 0.7) {
      const returnGrow = smoothstep(range(p, ACTS.return[0], 1));
      scale = lerp(0.7, 1.3, returnGrow);
      yPos = lerp(-1.6, 0, returnGrow);
    }
    root.current.scale.setScalar(scale);
    root.current.position.y = yPos;

    // Continuous sacred rotation + subtle cursor-follow tilt.
    crown.current.rotation.z = t * 0.12;
    crown.current.rotation.x = -0.35 + Math.sin(t * 0.3) * 0.04;
    crown.current.rotation.y = THREE.MathUtils.damp(
      crown.current.rotation.y,
      three.pointer.x * 0.25,
      3,
      dt
    );

    // ---- ACT 2 · Expansion: sun-ray spokes detach + push outward ----
    const expand = smoothstep(range(p, ACTS.expansion[0], ACTS.expansion[1]));
    spokes.current.scale.setScalar(lerp(1, 1.9, expand));
    spokes.current.children.forEach((c, i) => {
      const node = c.children[1] as THREE.Mesh | undefined; // the glowing node
      if (node) node.scale.setScalar(lerp(0.6, 1.6, expand) * (0.85 + Math.sin(t * 2 + i) * 0.15));
    });
  });

  return (
    <group ref={root} dispose={null}>
      <group ref={crown}>
        {/* Outer ring */}
        <mesh geometry={ringGeo(R, 0.1)} material={gold} />
        {/* Inner ring */}
        <mesh geometry={ringGeo(R * 0.62, 0.06)} material={gold} />
        {/* Dome lattice (тор-көз) */}
        {lattice.map((geo, i) => (
          <mesh key={i} geometry={geo} material={gold} />
        ))}

        {/* Radial sun-ray spokes, pushed outward during Act 2 */}
        <group ref={spokes}>
          {rays.map((a, i) => (
            <group key={i} rotation={[0, 0, a]}>
              <mesh position={[R + 0.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={gold}>
                <coneGeometry args={[0.07, 0.7, 6]} />
              </mesh>
              <mesh position={[R + 0.85, 0, 0]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial
                  color="#E8C87A"
                  emissive="#E8C87A"
                  emissiveIntensity={1.4}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// Cache torus geometries for the two rings (module-scope is fine: immutable).
const _ringCache = new Map<string, THREE.TorusGeometry>();
function ringGeo(radius: number, tube: number) {
  const key = `${radius}-${tube}`;
  let g = _ringCache.get(key);
  if (!g) {
    g = new THREE.TorusGeometry(radius, tube, 16, 96);
    _ringCache.set(key, g);
  }
  return g;
}
