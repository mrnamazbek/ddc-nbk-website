"use client";

import { useMemo, useRef, type ComponentRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { ACTS, band, lerp, range, smoothstep } from "@/lib/sceneMath";

/* ===================== ACT 4 · THE VAULT / SHIELD ===================== */

function Vault() {
  const group = useRef<THREE.Group>(null);
  const ringTop = useRef<THREE.Mesh>(null);
  const ringBot = useRef<THREE.Mesh>(null);
  const transmissionRef = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(null);

  useFrame((three) => {
    if (!group.current || !ringTop.current || !ringBot.current) return;
    const p = getScroll().smooth;
    const presence = band(p, ACTS.vault[0] - 0.02, ACTS.vault[1] + 0.02, 0.05);
    group.current.visible = presence > 0.001;
    group.current.scale.setScalar(lerp(0.4, 1, smoothstep(range(p, ACTS.vault[0] - 0.02, ACTS.vault[0] + 0.06))));
    if (transmissionRef.current) transmissionRef.current.opacity = presence;

    // Seal animation: two lock halves rotate together through the act.
    const seal = smoothstep(range(p, ACTS.vault[0] + 0.02, ACTS.vault[0] + 0.1));
    ringTop.current.rotation.z = lerp(-0.8, 0, seal);
    ringBot.current.rotation.z = lerp(0.8, 0, seal);
    group.current.rotation.y = three.clock.getElapsedTime() * 0.25;
  });

  return (
    <group ref={group} visible={false}>
      {/* Crystalline core */}
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          ref={transmissionRef}
          transmission={0.96}
          thickness={1.2}
          roughness={0.08}
          ior={1.6}
          chromaticAberration={0.06}
          color="#E8C87A"
          attenuationColor="#C9A84C"
          attenuationDistance={2}
          transparent
        />
      </mesh>
      {/* Two interlocking lock rings that close the vault */}
      <mesh ref={ringTop}>
        <torusGeometry args={[1.9, 0.07, 12, 80, Math.PI]} />
        <meshPhysicalMaterial color="#C9A84C" metalness={1} roughness={0.18} emissive="#8B7035" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={ringBot} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[1.9, 0.07, 12, 80, Math.PI]} />
        <meshPhysicalMaterial color="#C9A84C" metalness={1} roughness={0.18} emissive="#8B7035" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ===================== ACT 5 · DIGITAL DATA FLOW ===================== */

function DataFlow() {
  const STREAMS = 26;
  const PER = 14;
  const inst = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Each stream is a sine-weaving path through Z; particles ride along it.
  const streams = useMemo(
    () =>
      Array.from({ length: STREAMS }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 7,
        amp: 0.6 + Math.random() * 1.4,
        freq: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
      })),
    []
  );

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#E8C87A",
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  useFrame((three) => {
    if (!inst.current) return;
    const p = getScroll().smooth;
    const presence = band(p, ACTS.digital[0] - 0.02, ACTS.digital[1] + 0.03, 0.05);
    mat.opacity = presence;
    inst.current.visible = presence > 0.001;
    const t = three.clock.getElapsedTime();

    let idx = 0;
    for (const s of streams) {
      for (let j = 0; j < PER; j++) {
        const along = ((j / PER + t * s.speed) % 1); // 0..1 down the stream toward camera
        const z = lerp(-14, 8, along);
        const x = s.x + Math.sin(z * s.freq + s.phase + t) * s.amp;
        const y = s.y + Math.cos(z * s.freq * 0.7 + s.phase) * s.amp * 0.5;
        dummy.position.set(x, y, z);
        const head = 0.04 + (1 - Math.abs(along - 0.5) * 2) * 0.08;
        dummy.scale.setScalar(head);
        dummy.updateMatrix();
        inst.current.setMatrixAt(idx++, dummy.matrix);
      }
    }
    inst.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={inst} args={[undefined, undefined, STREAMS * PER]} material={mat} visible={false}>
      <sphereGeometry args={[1, 8, 8]} />
    </instancedMesh>
  );
}

export default function MorphObjects() {
  // The coin (Act 3) is now the AI PNG billboard (CoinBillboard); this keeps the
  // procedural vault (Act 4) where there is no asset. DataFlow is disabled to remove distracting yellow circles.
  return (
    <>
      <Vault />
      {/* <DataFlow /> */}
    </>
  );
}
