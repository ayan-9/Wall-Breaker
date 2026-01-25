import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import "@fontsource/inter";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/game/GameUI";
import { SoundManager } from "./components/game/SoundManager";

function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          <Canvas
            shadows
            camera={{
              position: [0, 0, 12],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#0a0a1a"]} />
            
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[0, 0, 5]} intensity={0.5} />

            <Suspense fallback={null}>
              <GameScene />
            </Suspense>
          </Canvas>
          
          <GameUI />
          <SoundManager />
        </>
      )}
    </div>
  );
}

export default App;
