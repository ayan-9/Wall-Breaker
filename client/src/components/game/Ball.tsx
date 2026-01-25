import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWallBreaker } from "@/lib/stores/useWallBreaker";
import { useAudio } from "@/lib/stores/useAudio";

const BALL_RADIUS = 0.2;
const PADDLE_Y = -4.5;
const PADDLE_HEIGHT = 0.3;
const PADDLE_WIDTH = 2.5;
const BOUNDARY_X = 8;
const BOUNDARY_TOP = 5;
const BOUNDARY_BOTTOM = -5.5;
const BRICK_WIDTH = 1.8;
const BRICK_HEIGHT = 0.5;

export function Ball() {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3(3, 4, 0));
  
  const { 
    phase, 
    bricks, 
    paddlePosition, 
    destroyBrick, 
    loseLife,
    setBallPosition 
  } = useWallBreaker();
  
  const { playHit, playSuccess } = useAudio();
  
  useFrame((_, delta) => {
    if (!meshRef.current || phase !== "playing") return;
    
    const pos = meshRef.current.position;
    const vel = velocityRef.current;
    
    pos.x += vel.x * delta;
    pos.y += vel.y * delta;
    
    if (pos.x <= -BOUNDARY_X + BALL_RADIUS || pos.x >= BOUNDARY_X - BALL_RADIUS) {
      vel.x *= -1;
      pos.x = Math.max(-BOUNDARY_X + BALL_RADIUS, Math.min(BOUNDARY_X - BALL_RADIUS, pos.x));
      playHit();
    }
    
    if (pos.y >= BOUNDARY_TOP - BALL_RADIUS) {
      vel.y *= -1;
      pos.y = BOUNDARY_TOP - BALL_RADIUS;
      playHit();
    }
    
    if (pos.y <= BOUNDARY_BOTTOM) {
      loseLife();
      pos.set(0, -3, 0);
      vel.set(3, 4, 0);
      return;
    }
    
    if (
      pos.y - BALL_RADIUS <= PADDLE_Y + PADDLE_HEIGHT / 2 &&
      pos.y + BALL_RADIUS >= PADDLE_Y - PADDLE_HEIGHT / 2 &&
      pos.x >= paddlePosition - PADDLE_WIDTH / 2 &&
      pos.x <= paddlePosition + PADDLE_WIDTH / 2 &&
      vel.y < 0
    ) {
      vel.y *= -1;
      const hitPos = (pos.x - paddlePosition) / (PADDLE_WIDTH / 2);
      vel.x = hitPos * 5;
      pos.y = PADDLE_Y + PADDLE_HEIGHT / 2 + BALL_RADIUS;
      playHit();
    }
    
    for (const brick of bricks) {
      if (brick.destroyed) continue;
      
      const brickLeft = brick.x - BRICK_WIDTH / 2;
      const brickRight = brick.x + BRICK_WIDTH / 2;
      const brickTop = brick.y + BRICK_HEIGHT / 2;
      const brickBottom = brick.y - BRICK_HEIGHT / 2;
      
      if (
        pos.x + BALL_RADIUS >= brickLeft &&
        pos.x - BALL_RADIUS <= brickRight &&
        pos.y + BALL_RADIUS >= brickBottom &&
        pos.y - BALL_RADIUS <= brickTop
      ) {
        const overlapLeft = pos.x + BALL_RADIUS - brickLeft;
        const overlapRight = brickRight - (pos.x - BALL_RADIUS);
        const overlapTop = brickTop - (pos.y - BALL_RADIUS);
        const overlapBottom = pos.y + BALL_RADIUS - brickBottom;
        
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);
        
        if (minOverlapX < minOverlapY) {
          vel.x *= -1;
        } else {
          vel.y *= -1;
        }
        
        destroyBrick(brick.id);
        playSuccess();
        break;
      }
    }
    
    setBallPosition([pos.x, pos.y, pos.z]);
  });
  
  return (
    <mesh ref={meshRef} position={[0, -3, 0]}>
      <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
    </mesh>
  );
}
