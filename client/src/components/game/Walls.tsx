export function Walls() {
  return (
    <group>
      <mesh position={[-8.25, 0, 0]}>
        <boxGeometry args={[0.5, 12, 0.5]} />
        <meshStandardMaterial color="#333366" />
      </mesh>
      
      <mesh position={[8.25, 0, 0]}>
        <boxGeometry args={[0.5, 12, 0.5]} />
        <meshStandardMaterial color="#333366" />
      </mesh>
      
      <mesh position={[0, 5.25, 0]}>
        <boxGeometry args={[17, 0.5, 0.5]} />
        <meshStandardMaterial color="#333366" />
      </mesh>
      
      <mesh position={[0, -6, -0.5]}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#111122" />
      </mesh>
    </group>
  );
}
