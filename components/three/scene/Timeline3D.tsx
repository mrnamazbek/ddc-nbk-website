"use client";

import { useMemo, useRef, type ComponentRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { band, lerp, range, smoothstep } from "@/lib/sceneMath";

export default function Timeline3D() {
  const group = useRef<THREE.Group>(null);
  const transmissionRef = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(null);

  // 6 historical nodes
  const nodes = useMemo(() => [
    { x: -5, y: 1.5, z: -2, year: 1996 },
    { x: -3, y: -0.5, z: -1, year: 2003 },
    { x: -1, y: 1.0, z: 0, year: 2015 },
    { x: 1, y: -0.8, z: 1, year: 2017 },
    { x: 3, y: 1.2, z: 2, year: 2020 },
    { x: 5, y: -0.2, z: 3, year: 2025 },
  ], []);

  // Procedural curve connecting the nodes
  const curvePoints = useMemo(() => {
    const pts = nodes.map(n => new THREE.Vector3(n.x, n.y, n.z));
    const curve = new THREE.CatmullRomCurve3(pts);
    return curve.getPoints(100);
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  const lineMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: "#E8C87A",
      transparent: true,
      opacity: 0,
      linewidth: 2, // Ignored by WebGL in most platforms, but a good semantic choice
    });
  }, []);

  const lineObject = useMemo(() => {
    return new THREE.Line(lineGeometry, lineMat);
  }, [lineGeometry, lineMat]);

  useFrame((three) => {
    if (!group.current) return;

    const p = getScroll().smooth;
    // Section active in range 0.90 to 0.93. Fade in slightly early, out slightly late.
    const presence = band(p, 0.88, 0.94, 0.03);
    group.current.visible = presence > 0.001;

    if (transmissionRef.current) {
      transmissionRef.current.opacity = presence;
    }
    lineMat.opacity = presence * 0.45;

    // Slowly rotate/float the whole scene over time
    const t = three.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    group.current.rotation.x = Math.cos(t * 0.1) * 0.05;

    // Animate individual nodes: pulse or grow when their specific portion is active
    // Subdivide the 0.90 to 0.93 scroll progress into 6 stages
    const localProg = range(p, 0.90, 0.93); // maps to 0..1
    const activeNodeIndex = Math.min(nodes.length - 1, Math.floor(localProg * nodes.length));

    // Update children meshes (spheres)
    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.startsWith("node-")) {
        const nodeIdx = parseInt(child.name.split("-")[1], 10);
        
        // Calculate target scale: active node gets larger
        const isActive = nodeIdx === activeNodeIndex && presence > 0.1;
        const targetScale = isActive ? 1.4 : 1.0;
        
        // Pulse animation
        const pulse = 1 + (isActive ? Math.sin(t * 5.0) * 0.08 : Math.sin(t * 1.5 + nodeIdx) * 0.04);
        const finalScale = lerp(child.scale.x, targetScale * pulse, 0.15);
        child.scale.setScalar(finalScale);

        // Slowly spin nodes
        child.rotation.y = t * 0.2 + nodeIdx;
      }
    });
  });

  return (
    <group ref={group} visible={false}>
      {/* Curved timeline track */}
      <primitive object={lineObject} />

      {/* Historical nodes */}
      {nodes.map((node, idx) => (
        <mesh
          key={idx}
          name={`node-${idx}`}
          position={[node.x, node.y, node.z]}
        >
          <icosahedronGeometry args={[0.36, 1]} />
          <MeshTransmissionMaterial
            ref={idx === 0 ? transmissionRef : undefined}
            transmission={0.95}
            thickness={0.8}
            roughness={0.06}
            ior={1.55}
            chromaticAberration={0.05}
            color={idx % 2 === 0 ? "#E8C87A" : "#52B788"}
            attenuationColor={idx % 2 === 0 ? "#C9A84C" : "#1A3D2B"}
            attenuationDistance={1.5}
            transparent
          />
          {/* Subtle outer wireframe sphere for high-tech gold accent */}
          <mesh>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshBasicMaterial
              color="#E8C87A"
              wireframe
              transparent
              opacity={0.15}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}
