import { useWallBreaker, WallPattern } from "@/lib/stores/useWallBreaker";

const patternNames: Record<WallPattern, string> = {
  [WallPattern.Solid]: "Solid",
  [WallPattern.Checkerboard]: "Checkerboard",
  [WallPattern.Pyramid]: "Pyramid",
  [WallPattern.Arch]: "Arch",
  [WallPattern.RandomHoles]: "Random Holes",
};

export function GameUI() {
  const { phase, score, lives, level, pattern, startGame, resetGame, bricks } = useWallBreaker();
  const activeBricks = bricks.filter(b => !b.destroyed).length;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {phase === "playing" && (
        <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-bold text-lg bg-black/50 p-3 rounded-lg pointer-events-auto">
          <div>Level: {level} ({patternNames[pattern]})</div>
          <div>Bricks: {activeBricks}</div>
          <div>Score: {score}</div>
          <div>Lives: {"❤️".repeat(lives)}</div>
        </div>
      )}
      
      {phase === "menu" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="bg-black/80 p-8 rounded-xl text-center text-white max-w-md">
            <h1 className="text-4xl font-bold mb-4">WallBreaker</h1>
            <p className="mb-4 text-gray-300">
              Break all the bricks to advance to the next level!
            </p>
            <p className="mb-2 text-sm text-gray-400">
              Use Arrow Keys or A/D to move the paddle
            </p>
            <p className="mb-6 text-xs text-gray-500">
              Patterns: Solid → Checkerboard → Pyramid → Arch → Random Holes
            </p>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
      {phase === "gameOver" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="bg-black/80 p-8 rounded-xl text-center text-white max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over</h2>
            <p className="mb-2">Final Score: {score}</p>
            <p className="mb-6">Level Reached: {level}</p>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
