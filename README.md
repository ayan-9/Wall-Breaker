# Wall Breaker System

A brick-breaking game built with React, Three.js, and Matter.js. Break the walls and defeat the bricks!

## Tech Stack

- **Frontend:** React, Vite, React Three Fiber, Three.js, Pixi.js, Matter.js
- **Backend:** Express, Node.js
- **Database:** PostgreSQL (optional, uses in-memory storage by default)
- **Styling:** Tailwind CSS

## Prerequisites

- Node.js 18+
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Wall-Breaker-System.git
cd Wall-Breaker-System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

### 4. (Optional) Set up environment variables

Copy `.env.example` to `.env` and configure if needed:

```bash
cp .env.example .env
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | Run TypeScript type check |
| `npm run db:push` | Push database schema (requires PostgreSQL) |

## Project Structure

```
Wall-Breaker-System/
├── client/          # React frontend
│   ├── public/      # Static assets
│   └── src/         # Source code
├── server/          # Express backend
├── shared/          # Shared types and schema
├── script/          # Build scripts
└── migrations/      # Database migrations
```

## License

MIT
