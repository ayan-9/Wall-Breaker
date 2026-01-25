import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWallBreaker } from "@/lib/stores/useWallBreaker";

const PADDLE_SPEED = 15;
const PADDLE_WIDTH = 2.5;
const BOUNDARY = 8;

export function Paddle() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setPaddlePosition, phase } = useWallBreaker();
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysPressed.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysPressed.current.right = false;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  useFrame((_, delta) => {
    if (!meshRef.current || phase !== "playing") return;
    
    let moveDirection = 0;
    if (keysPressed.current.left) moveDirection -= 1;
    if (keysPressed.current.right) moveDirection += 1;
    
    const newX = meshRef.current.position.x + moveDirection * PADDLE_SPEED * delta;
    const clampedX = Math.max(-BOUNDARY + PADDLE_WIDTH / 2, Math.min(BOUNDARY - PADDLE_WIDTH / 2, newX));
    
    meshRef.current.position.x = clampedX;
    setPaddlePosition(clampedX);
  });
  
  return (
    <mesh ref={meshRef} position={[0, -4.5, 0]} userData={{ type: "paddle" }}>
      <boxGeometry args={[PADDLE_WIDTH, 0.3, 0.5]} />
      <meshStandardMaterial color="#4488ff" />
    </mesh>
  );
}
