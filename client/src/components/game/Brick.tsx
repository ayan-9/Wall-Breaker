import { useRef, useMemo } from "react";
import * as THREE from "three";

interface BrickProps {
  position: [number, number, number];
  color: string;
  id: string;
}

export function Brick({ position, color, id }: BrickProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position} userData={{ type: "brick", id }}>
      <boxGeometry args={[1.8, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function getBrickColor(row: number): string {
  const colors = ["#ff4444", "#ff8844", "#ffff44", "#44ff44", "#44ffff", "#4444ff", "#ff44ff"];
  return colors[row % colors.length];
}
