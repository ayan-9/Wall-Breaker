import { useWallBreaker } from "@/lib/stores/useWallBreaker";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { BrickWall } from "./BrickWall";
import { Walls } from "./Walls";

export function GameScene() {
  const { phase } = useWallBreaker();
  
  if (phase !== "playing") return null;
  
  return (
    <group>
      <Walls />
      <BrickWall />
      <Paddle />
      <Ball />
    </group>
  );
}
