import { useWallBreaker } from "@/lib/stores/useWallBreaker";
import { Brick, getBrickColor } from "./Brick";

export function BrickWall() {
  const { bricks } = useWallBreaker();
  
  return (
    <group>
      {bricks
        .filter(brick => !brick.destroyed)
        .map(brick => (
          <Brick
            key={brick.id}
            id={brick.id}
            position={[brick.x, brick.y, 0]}
            color={getBrickColor(brick.row)}
          />
        ))}
    </group>
  );
}
