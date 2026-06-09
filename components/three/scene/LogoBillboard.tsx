"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { getScroll } from "@/lib/scrollStore";
import { band, lerp, range, smoothstep } from "@/lib/sceneMath";

// Вспомогательная функция для создания скругленных полос (капсул любой траектории)
function createStrokeShape(points: THREE.Vector2[], width: number): THREE.Shape {
  const shape = new THREE.Shape();
  const halfW = width / 2;
  const n = points.length - 1;

  // Вычисляем нормали для каждой вершины
  const normals: THREE.Vector2[] = [];
  for (let i = 0; i <= n; i++) {
    let d = new THREE.Vector2();
    if (i === 0) {
      d.subVectors(points[1], points[0]).normalize();
    } else if (i === n) {
      d.subVectors(points[n], points[n - 1]).normalize();
    } else {
      const d1 = new THREE.Vector2().subVectors(points[i], points[i - 1]).normalize();
      const d2 = new THREE.Vector2().subVectors(points[i + 1], points[i]).normalize();
      d.addVectors(d1, d2).normalize();
    }
    normals.push(new THREE.Vector2(-d.y, d.x));
  }

  // Строим левую сторону пути
  const startNormal = normals[0];
  const firstLeft = new THREE.Vector2().addScaledVector(startNormal, halfW).add(points[0]);
  shape.moveTo(firstLeft.x, firstLeft.y);

  for (let i = 1; i <= n; i++) {
    const pt = new THREE.Vector2().addScaledVector(normals[i], halfW).add(points[i]);
    shape.lineTo(pt.x, pt.y);
  }

  // Полукруглое закругление на конце Pn
  const endNormal = normals[n];
  const startAngle = Math.atan2(endNormal.y, endNormal.x);
  const endAngle = startAngle - Math.PI;
  shape.absarc(points[n].x, points[n].y, halfW, startAngle, endAngle, true);

  // Строим правую сторону пути (назад к началу)
  for (let i = n - 1; i >= 0; i--) {
    const pt = new THREE.Vector2().addScaledVector(normals[i], -halfW).add(points[i]);
    shape.lineTo(pt.x, pt.y);
  }

  // Полукруглое закругление на старте P0
  const startAngle0 = Math.atan2(-startNormal.y, -startNormal.x);
  const endAngle0 = startAngle0 - Math.PI;
  shape.absarc(points[0].x, points[0].y, halfW, startAngle0, endAngle0, true);

  shape.closePath();
  return shape;
}

// Вспомогательная функция для создания ромбовидного узла схемы
function createDiamondShape(r: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, r);
  shape.lineTo(r, 0);
  shape.lineTo(0, -r);
  shape.lineTo(-r, 0);
  shape.closePath();
  return shape;
}

/**
 * 3D DDC Logo component.
 * Fully models the company's circular green shield and white microchip diagram using 3D shapes and ExtrudeGeometry.
 * Responds to the scroll progression and features responsive sizing, physical materials, and high-fidelity emissive glow.
 */
export default function LogoBillboard() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  const { diskGeo, schemaGeos, diskMat, schemaMat } = useMemo(() => {
    // 1. Создаем геометрию круглого зеленого щита
    const diskShape = new THREE.Shape();
    diskShape.absarc(0, 0, 2.1, 0, Math.PI * 2, false);
    
    const diskGeo = new THREE.ExtrudeGeometry(diskShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 4,
      curveSegments: 64
    });

    // Настройки выдавливания для элементов схемы (дорожки, узлы)
    const schemaExtrudeSettings = {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelSegments: 3,
      curveSegments: 16
    };

    const geos: THREE.ExtrudeGeometry[] = [];
    const W = 0.13; // Ширина дорожек
    const R_node = 0.095; // Полудиагональ ромбовидных узлов

    // 2. Центральный квадрат (белая рамка)
    const boxShape = new THREE.Shape();
    boxShape.moveTo(-0.45, -0.45);
    boxShape.lineTo(0.45, -0.45);
    boxShape.lineTo(0.45, 0.45);
    boxShape.lineTo(-0.45, 0.45);
    boxShape.closePath();

    const holePath = new THREE.Path();
    holePath.moveTo(-0.22, -0.22);
    holePath.lineTo(0.22, -0.22);
    holePath.lineTo(0.22, 0.22);
    holePath.lineTo(-0.22, 0.22);
    holePath.closePath();
    boxShape.holes.push(holePath);

    geos.push(new THREE.ExtrudeGeometry(boxShape, schemaExtrudeSettings));

    // Вспомогательные функции для быстрого добавления элементов
    const addStroke = (pts: THREE.Vector2[]) => {
      geos.push(new THREE.ExtrudeGeometry(createStrokeShape(pts, W), schemaExtrudeSettings));
    };

    const addDiamond = (x: number, y: number) => {
      const geo = new THREE.ExtrudeGeometry(createDiamondShape(R_node), schemaExtrudeSettings);
      geo.translate(x, y, 0);
      geos.push(geo);
    };

    // 3. Описание всех 8 дорожек схемы (слева направо)

    const X4 = -0.22;
    const X5 = 0.22;

    // Верхние центральные полосы (№4 и №5)
    addStroke([new THREE.Vector2(X4, 0.45), new THREE.Vector2(X4, 1.33)]);
    addStroke([new THREE.Vector2(X5, 0.45), new THREE.Vector2(X5, 1.33)]);
    addDiamond(X4, 0.89);
    addDiamond(X5, 0.89);

    // Нижние центральные полосы (№4 и №5)
    addStroke([new THREE.Vector2(X4, -1.33), new THREE.Vector2(X4, -0.45)]);
    addStroke([new THREE.Vector2(X5, -1.33), new THREE.Vector2(X5, -0.45)]);
    addDiamond(X4, -0.89);
    addDiamond(X5, -0.89);

    // Полоса №3 и №6 (с изгибом к центральному процессору)
    const X3 = -0.62;
    const Xinner = -0.47;

    // Левая изогнутая полоса (№3)
    addStroke([
      new THREE.Vector2(X3, 1.12),
      new THREE.Vector2(X3, 0.65),
      new THREE.Vector2(Xinner, 0.45),
      new THREE.Vector2(Xinner, -0.45),
      new THREE.Vector2(X3, -0.65),
      new THREE.Vector2(X3, -1.12)
    ]);
    addDiamond(X3, 0.88);
    addDiamond(X3, -0.88);

    // Правая изогнутая полоса (№6, симметрично №3)
    addStroke([
      new THREE.Vector2(-X3, 1.12),
      new THREE.Vector2(-X3, 0.65),
      new THREE.Vector2(-Xinner, 0.45),
      new THREE.Vector2(-Xinner, -0.45),
      new THREE.Vector2(-X3, -0.65),
      new THREE.Vector2(-X3, -1.12)
    ]);
    addDiamond(-X3, 0.88);
    addDiamond(-X3, -0.88);

    // Полоса №2 и №7
    const X2 = -0.95;
    addStroke([new THREE.Vector2(X2, -0.95), new THREE.Vector2(X2, 0.95)]);
    addDiamond(X2, 0.5);
    addDiamond(X2, -0.5);

    addStroke([new THREE.Vector2(-X2, -0.95), new THREE.Vector2(-X2, 0.95)]);
    addDiamond(-X2, 0.5);
    addDiamond(-X2, -0.5);

    // Полоса №1 и №8 (крайние короткие)
    const X1 = -1.25;
    addStroke([new THREE.Vector2(X1, -0.79), new THREE.Vector2(X1, 0.79)]);
    addDiamond(X1, 0.0);

    addStroke([new THREE.Vector2(-X1, -0.79), new THREE.Vector2(-X1, 0.79)]);
    addDiamond(-X1, 0.0);

    // 4. Создаем премиальные физические материалы
    // Зеленый глянцевый щит
    const diskMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0F241A"), // DDC Forest Green
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    // Белая светящаяся схема
    const schemaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0, // Управляется скроллом
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    return { diskGeo, schemaGeos: geos, diskMat, schemaMat };
  }, []);

  useFrame((three) => {
    if (!group.current || !spin.current) return;
    const p = getScroll().smooth;
    const t = three.clock.getElapsedTime();

    // Прогресс скролла для активации фазы CTA (логотип)
    const presence = band(p, 0.92, 1.05, 0.04);
    group.current.visible = presence > 0.002;

    // Плавно меняем прозрачность и свечение при появлении
    diskMat.opacity = presence;
    schemaMat.opacity = presence;
    schemaMat.emissiveIntensity = presence * 2.5;

    const scaleProgress = smoothstep(range(p, 0.92, 0.97));
    // Легкий эффект дыхания логотипа
    const breathe = 1 + Math.sin(t * 1.2) * 0.015;
    
    // Плавное масштабирование при въезде в CTA-секцию
    group.current.scale.setScalar(lerp(0.5, 2.2, scaleProgress) * breathe);

    // Мягкое 3D покачивание для демонстрации объема и отражений света на фасках
    spin.current.rotation.y = Math.sin(t * 0.45) * 0.12;
    spin.current.rotation.x = Math.cos(t * 0.35) * 0.06;
  });

  return (
    <Billboard ref={group}>
      <group ref={spin}>
        {/* Зеленый физический диск-щит сзади */}
        <mesh geometry={diskGeo} material={diskMat} position={[0, 0, -0.04]} />

        {/* Объемные светящиеся дорожки схемы спереди */}
        {schemaGeos.map((geo, idx) => (
          <mesh key={idx} geometry={geo} material={schemaMat} position={[0, 0, 0.01]} />
        ))}
      </group>
    </Billboard>
  );
}
