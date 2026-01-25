import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export enum WallPattern {
  Solid = 0,
  Checkerboard = 1,
  Pyramid = 2,
  Arch = 3,
  RandomHoles = 4,
}

export type GamePhase = "menu" | "playing" | "gameOver";

interface Brick {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  destroyed: boolean;
}

interface WallBreakerState {
  phase: GamePhase;
  level: number;
  score: number;
  lives: number;
  pattern: WallPattern;
  rows: number;
  columns: number;
  bricks: Brick[];
  ballPosition: [number, number, number];
  ballVelocity: [number, number, number];
  paddlePosition: number;
  
  startGame: () => void;
  resetGame: () => void;
  nextLevel: () => void;
  destroyBrick: (id: string) => void;
  setBallPosition: (pos: [number, number, number]) => void;
  setBallVelocity: (vel: [number, number, number]) => void;
  setPaddlePosition: (x: number) => void;
  loseLife: () => void;
  generateWall: () => void;
  addScore: (points: number) => void;
}

const INITIAL_ROWS = 4;
const INITIAL_COLUMNS = 8;

function shouldSpawn(pattern: WallPattern, row: number, col: number, rows: number, columns: number): boolean {
  switch (pattern) {
    case WallPattern.Solid:
      return true;
    case WallPattern.Checkerboard:
      return (row + col) % 2 === 0;
    case WallPattern.Pyramid:
      return col >= row && col < (columns - row);
    case WallPattern.Arch:
      return !(row < Math.floor(rows / 2) && col > Math.floor(columns / 3) && col < Math.floor(columns * 2 / 3));
    case WallPattern.RandomHoles:
      return Math.random() > 0.2;
    default:
      return true;
  }
}

function generateBricks(pattern: WallPattern, rows: number, columns: number): Brick[] {
  const bricks: Brick[] = [];
  const brickWidth = 1.8;
  const brickHeight = 0.5;
  const gap = 0.1;
  const startX = -((columns - 1) * (brickWidth + gap)) / 2;
  const startY = 4;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (shouldSpawn(pattern, row, col, rows, columns)) {
        bricks.push({
          id: `brick-${row}-${col}`,
          row,
          col,
          x: startX + col * (brickWidth + gap),
          y: startY - row * (brickHeight + gap),
          destroyed: false,
        });
      }
    }
  }
  return bricks;
}

export const useWallBreaker = create<WallBreakerState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    level: 1,
    score: 0,
    lives: 3,
    pattern: WallPattern.Solid,
    rows: INITIAL_ROWS,
    columns: INITIAL_COLUMNS,
    bricks: [],
    ballPosition: [0, -3, 0],
    ballVelocity: [0, 0, 0],
    paddlePosition: 0,
    
    startGame: () => {
      const state = get();
      const bricks = generateBricks(WallPattern.Solid, INITIAL_ROWS, INITIAL_COLUMNS);
      set({
        phase: "playing",
        level: 1,
        score: 0,
        lives: 3,
        pattern: WallPattern.Solid,
        rows: INITIAL_ROWS,
        columns: INITIAL_COLUMNS,
        bricks,
        ballPosition: [0, -3, 0],
        ballVelocity: [3, 4, 0],
        paddlePosition: 0,
      });
    },
    
    resetGame: () => {
      set({
        phase: "menu",
        level: 1,
        score: 0,
        lives: 3,
        pattern: WallPattern.Solid,
        rows: INITIAL_ROWS,
        columns: INITIAL_COLUMNS,
        bricks: [],
        ballPosition: [0, -3, 0],
        ballVelocity: [0, 0, 0],
        paddlePosition: 0,
      });
    },
    
    nextLevel: () => {
      const state = get();
      const newPattern = (state.pattern + 1) % 5 as WallPattern;
      const newRows = state.rows + 2;
      const newColumns = state.columns + 2;
      const bricks = generateBricks(newPattern, newRows, newColumns);
      
      set({
        phase: "playing",
        level: state.level + 1,
        pattern: newPattern,
        rows: newRows,
        columns: newColumns,
        bricks,
        ballPosition: [0, -3, 0],
        ballVelocity: [3 + state.level * 0.5, 4 + state.level * 0.5, 0],
        paddlePosition: 0,
      });
    },
    
    destroyBrick: (id: string) => {
      const state = get();
      const newBricks = state.bricks.map(b => 
        b.id === id ? { ...b, destroyed: true } : b
      );
      const activeBricks = newBricks.filter(b => !b.destroyed);
      
      set({ bricks: newBricks, score: state.score + 10 });
      
      if (activeBricks.length === 0) {
        const newPattern = (state.pattern + 1) % 5 as WallPattern;
        const newRows = state.rows + 2;
        const newColumns = state.columns + 2;
        
        set({
          level: state.level + 1,
          pattern: newPattern,
          rows: newRows,
          columns: newColumns,
          ballPosition: [0, -3, 0],
          ballVelocity: [3 + state.level * 0.5, 4 + state.level * 0.5, 0],
          paddlePosition: 0,
        });
        
        get().generateWall();
      }
    },
    
    setBallPosition: (pos) => set({ ballPosition: pos }),
    setBallVelocity: (vel) => set({ ballVelocity: vel }),
    setPaddlePosition: (x) => set({ paddlePosition: x }),
    
    loseLife: () => {
      const state = get();
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        set({ phase: "gameOver", lives: 0 });
      } else {
        set({
          lives: newLives,
          ballPosition: [0, -3, 0],
          ballVelocity: [3, 4, 0],
          paddlePosition: 0,
        });
      }
    },
    
    generateWall: () => {
      const state = get();
      const bricks = generateBricks(state.pattern, state.rows, state.columns);
      set({ bricks });
    },
    
    addScore: (points) => set(state => ({ score: state.score + points })),
  }))
);
