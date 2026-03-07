# Chess-Mate — Agent Reference Guide

> This document is intended for AI coding agents. Read it before making any changes to this codebase to understand the application's architecture, conventions, and patterns.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Layout](#repository-layout)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Routing & Layouts](#routing--layouts)
6. [State Management](#state-management)
7. [Component Inventory](#component-inventory)
8. [Data Layer](#data-layer)
9. [Design System & Styling](#design-system--styling)
10. [Chess Board System](#chess-board-system)
11. [Lesson System](#lesson-system)
12. [Authentication Flow](#authentication-flow)
13. [Key Conventions](#key-conventions)
14. [Known Limitations & Future Work](#known-limitations--future-work)

---

## Project Overview

Chess-Mate is an interactive chess learning platform. Users can:
- Work through step-by-step interactive chess lessons
- Track lesson progress
- Solve puzzles (in progress)
- Study openings (placeholder)
- Maintain a user profile and rating

**Tech Stack at a glance:**

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite 7 |
| Routing | React Router DOM 6 |
| State | Zustand 4, TanStack Query 5 |
| Styling | Tailwind CSS 3 with custom design tokens |
| HTTP Client | Axios 1 with JWT interceptor |
| Chess Logic | `chess.js` + `react-chessboard` |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL via Prisma ORM 7 |
| Auth | JWT + bcryptjs |

---

## Repository Layout

```
chess-mate/
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable UI + chess components
│   │   │   ├── chess/          # Chess-specific components (ChessBoard, GameControls, Piece)
│   │   │   ├── layout/         # Layout shells (AppLayout, HomeLayout, LessonLayout, Header, Sidebar)
│   │   │   └── ui/             # Generic UI primitives (Button, Card, PageHeader, AppLogo, FeatureIcons)
│   │   ├── pages/              # Route-level page components
│   │   ├── services/           # Axios API service functions
│   │   ├── store/              # Zustand stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # Shared TypeScript types
│   │   ├── data/               # Static content data (lessons)
│   │   ├── App.tsx             # Router + layout definitions
│   │   └── main.tsx            # Entry point
│   ├── public/pieces/          # cburnett SVG chess piece assets
│   ├── vite.config.ts          # Dev server (port 3000), API proxy to :5001
│   ├── tailwind.config.js      # Custom design tokens
│   └── tsconfig.json           # Path alias: @/* → ./src/*
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/             # Express route definitions
│   │   ├── controllers/        # Route handler logic
│   │   ├── middleware/         # Auth + error middleware
│   │   ├── utils/              # Shared utilities
│   │   ├── types/              # Backend TypeScript types
│   │   └── server.ts           # Entry point (port 5001)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (6 models)
│   │   └── migrations/         # Prisma migration history
│   └── tsconfig.json
│
├── README.md
├── BACKLOG.md                  # Planned lessons, features, bugs
├── SETUP.md
├── QUICKSTART.md
├── NEXT_STEPS.md
└── AGENTS.md                   # ← this file
```

---

## Frontend Architecture

### Entry & Bootstrap

- **`main.tsx`** — Mounts the React app, wraps with `QueryClientProvider` (TanStack Query)
- **`App.tsx`** — Defines all routes and layout nesting; the single source of truth for routing

### Path Aliases

TypeScript and Vite are configured with `@/*` mapping to `./src/*`. Always use this alias for internal imports:

```ts
import { ChessBoard } from '@/components/chess/ChessBoard'
import { useAuthStore } from '@/store/authStore'
```

### Dev Server

- Frontend runs on **port 3000**
- All `/api/*` requests are proxied to **`http://localhost:5001`** via Vite's dev proxy — no CORS issues in development

---

## Backend Architecture

### Server

- Entry: `backend/src/server.ts`
- Port: **5001** (override with `PORT` env var)
- ES Modules (`"type": "module"` in `package.json`)

### API Routes

| Prefix | Purpose |
|--------|---------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Login, returns JWT |
| `GET /api/auth/me` | Get current user (protected) |
| `GET /api/lessons` | List lessons |
| `GET /api/lessons/:id` | Single lesson |
| `GET /api/puzzles` | List puzzles |
| `POST /api/progress` | Save lesson progress |
| `GET /api/health` | Health check |

### Database Models (Prisma)

```
User             — id, email (unique), username (unique), password, rating (default 1200)
Lesson           — id, title, description, content, difficulty, order
LessonProgress   — userId, lessonId, completed, progress (0–100)  [unique: userId+lessonId]
Puzzle           — id, fen, solution (UCI moves), difficulty, description
PuzzleAttempt    — userId, puzzleId, solved, attempts, timeSpent  [unique: userId+puzzleId]
Game             — id, userId, fen, moves[], status, result
```

Prisma client is generated to `src/generated/prisma` (non-standard path — always import from there).

---

## Routing & Layouts

Three distinct layout shells are defined in `App.tsx`:

| Layout | Used By | What It Renders |
|--------|---------|-----------------|
| `HomeLayout` | `/` | Full-width, no sidebar |
| `AppLayout` | `/learn`, `/openings`, `/puzzles`, `/profile` | Header + left Sidebar |
| `LessonLayout` | `/learn/:lessonId` | Header only (no sidebar — board needs space) |

**Route tree:**

```
/                     → Home.tsx          (HomeLayout)
/login                → Login.tsx         (HomeLayout)
/register             → Register.tsx      (HomeLayout)
/learn                → LearnBasics.tsx   (AppLayout)
/learn/:lessonId      → LessonDetail.tsx  (LessonLayout)
/openings             → Openings.tsx      (AppLayout)
/puzzles              → Puzzles.tsx       (AppLayout)
/profile              → Profile.tsx       (AppLayout)
```

When adding new pages, choose the appropriate existing layout. Only create a new layout if none of the three fit.

---

## State Management

### Zustand Stores (`src/store/`)

**`authStore.ts`**
- Holds: `user`, `token`, `isAuthenticated`, `isLoading`, `error`
- Actions: `login()`, `register()`, `logout()`, `getMe()`
- Token is stored in `localStorage` and auto-attached by the Axios interceptor

**`progressStore.ts`**
- Holds: per-lesson progress records `{ lessonId → { started, completed, lastStep } }`
- Persisted to `localStorage` via Zustand's `persist` middleware
- Backend sync is not yet fully implemented — localStorage is the source of truth

### TanStack Query

Used for server-state fetching (lessons list, puzzle data). Prefer `useQuery` / `useMutation` from `@tanstack/react-query` for any new API-connected data.

---

## Component Inventory

### Chess Components (`src/components/chess/`)

#### `ChessBoard.tsx` — **core component, most complex**

Props (key ones):
| Prop | Type | Purpose |
|------|------|---------|
| `position` | `string` (FEN) | Board position to render |
| `highlightSquares` | `string[]` | Green dot indicators (legal moves) |
| `captureSquares` | `string[]` | Softer green dots (capture squares) |
| `fillSquares` | `string[]` | Yellow-tinted squares (educational emphasis) |
| `arrows` | `Arrow[]` | Directional arrows on the board |
| `interactive` | `boolean` | Enable drag-and-drop |
| `challenge` | `Challenge` | Defines a move the user must play |
| `onChallengeComplete` | `() => void` | Callback when user plays the correct move |

- Uses `react-chessboard` under the hood with custom piece rendering
- Pieces use the **cburnett SVG set** from `public/pieces/`
- Renders L-shaped arrows for knight move visualizations
- When `interactive=false`, the board is display-only

#### `GameControls.tsx`
Navigation/control buttons for game or lesson steps.

#### `Piece.tsx`
Renders a single piece image from the cburnett set.

### Layout Components (`src/components/layout/`)

- **`Header.tsx`** — Top navigation bar, shows auth state, logo
- **`Sidebar.tsx`** — Left nav with links to main sections, highlights active route
- **`AppLayout.tsx`** — Wraps pages with Header + Sidebar
- **`HomeLayout.tsx`** — Minimal wrapper for public/home pages
- **`LessonLayout.tsx`** — Header-only wrapper for lesson detail view

### UI Primitives (`src/components/ui/`)

- **`Button.tsx`** — Reusable button; supports variants (primary, secondary, ghost) and sizes
- **`Card.tsx`** — Card container with consistent padding/radius/shadow
- **`PageHeader.tsx`** — Page title + optional subtitle, used at top of inner pages
- **`AppLogo.tsx`** — Chess-Mate brand logo SVG
- **`FeatureIcons.tsx`** — Icon components used on the home page feature section

### Pages (`src/pages/`)

| File | Route | Status |
|------|-------|--------|
| `Home.tsx` | `/` | Complete — hero, feature cards, stats |
| `LearnBasics.tsx` | `/learn` | Complete — lesson cards with progress indicators |
| `LessonDetail.tsx` | `/learn/:lessonId` | Complete — step navigator + interactive board |
| `Login.tsx` | `/login` | Complete |
| `Register.tsx` | `/register` | Complete |
| `Puzzles.tsx` | `/puzzles` | Incomplete — UI scaffold only |
| `Openings.tsx` | `/openings` | Placeholder |
| `Profile.tsx` | `/profile` | Placeholder |

---

## Data Layer

### Static Lesson Data (`shared/lessons/`)

Lessons are **static TypeScript data** in `shared/lessons/`, re-exported by the frontend; not fetched from the backend. This is the primary content source for the learning system.

**`Lesson` interface:**
```ts
interface Lesson {
  id: string
  number: number
  title: string
  description: string
  duration: string           // e.g. "10 min"
  steps: LessonStep[]
}
```

**`LessonStep` interface:**
```ts
interface LessonStep {
  title: string
  text: string               // Supports **bold** markdown-style formatting
  fen: string                // Board position (FEN string)
  highlightSquares?: string[] // Green move-hint dots
  captureSquares?: string[]  // Softer green dots for captures
  fillSquares?: string[]     // Yellow-tinted squares for emphasis
  arrows?: Arrow[]           // Visual arrows for attack/pin/move indicators
  challenge?: Challenge      // Interactive move the user must play
  interactive?: boolean      // Whether drag-and-drop is enabled
}
```

**Current lessons:**
1. "How the Pieces Move" — 6 steps (complete)
2. "Board Setup & Notation" — 4 steps (complete)
3. "Basic Tactics: Forks & Pins" — 5 steps (complete)
4. "Check, Checkmate & Stalemate" — Coming soon
5. "Opening Principles" — Coming soon
6. "Endgame Basics" — Coming soon

When adding or editing lesson content, work in **`shared/lessons/`** (the frontend re-exports from there via `src/data/lessons.ts`). Do not create backend API calls for lesson content until the static data is migrated.

For a full guide on authoring lesson content (FEN syntax, highlight types, arrows, challenges, writing conventions), see **`LESSON_AUTHORING.md`** in the project root. **New or edited lessons must pass `npm run validate:lessons` (from repo root) and the checklist in LESSON_AUTHORING.md before merge.**

### API Services (`src/services/`)

- **`api.ts`** — Axios instance; automatically attaches `Authorization: Bearer <token>` from `localStorage`
- **`authService.ts`** — `login()`, `register()`, `getMe()` calls
- **`chessService.ts`** — Chess/puzzle related API calls

---

## Design System & Styling

### Tailwind Configuration (`tailwind.config.js`)

All custom tokens are defined here. Use these instead of arbitrary values:

**Colors:**
```
primary-50 → primary-900    (navy blue scale, e.g. primary-900 = #0a1929)
accent                       (orange: #e86c0b — CTAs, highlights)
surface-*                    (white and subtle grays for backgrounds)
success / error / warning    (semantic colors)
```

**Typography classes** (defined as custom utilities):
```
text-display   text-h1   text-h2   text-h3
text-body-lg   text-body   text-body-sm   text-caption
```

**Spacing tokens:**
```
spacing-section   spacing-card   spacing-tight
```

**Border radius:**
```
rounded-card   rounded-button   rounded-input   rounded-pill
```

**Shadow:**
```
shadow-card   shadow-elevated   shadow-header   shadow-hero-cta
```

### CSS Variables

CSS custom properties are defined in `src/index.css` alongside Tailwind directives. Design tokens that need runtime access (e.g. for canvas or SVG) are available as CSS variables.

### Design Philosophy

The full design philosophy is documented in **`frontend/DESIGN.md`** — read it before making any UI changes. Key principles:

- **Professional, not playful** — trustworthy and learning-focused, not gamey
- **Cohesion** — one visual language: same spacing scale, type scale, colors, and component behavior everywhere
- **Restraint** — color is used to indicate state (success, error, active) and key actions, not decoration
- Puzzles and openings are the core learning value; UI keeps attention on the board

### Styling Conventions

- Use **utility-first Tailwind classes** — avoid writing custom CSS unless a utility doesn't exist
- Use the custom design tokens above instead of arbitrary values (no `text-[#e86c0b]`, use `text-accent`)
- Follow the existing component patterns for spacing and typography
- Mobile-first responsive design — start with base styles, add `md:` and `lg:` breakpoints as needed

---

## Chess Board System

### Piece Assets

Pieces use the **cburnett SVG set** stored in `public/pieces/`. File naming convention:

```
/pieces/{color}{piece}.svg
# Examples:
/pieces/wK.svg   # white king
/pieces/bQ.svg   # black queen
/pieces/wP.svg   # white pawn
```

Colors: `w` (white), `b` (black)
Pieces: `K` (king), `Q` (queen), `R` (rook), `B` (bishop), `N` (knight), `P` (pawn)

### Board Highlight System

Four types of square highlighting exist on `ChessBoard`:

| Prop | Visual Effect | Typical Use |
|------|--------------|-------------|
| `highlightSquares` | Green dot (center) | Legal move destinations |
| `captureSquares` | Softer green dot | Capture move destinations |
| `fillSquares` | Yellow tint (full square) | Educational emphasis |
| `arrows` | Colored directional arrows | Attack lines, pins, knight moves |

### Lesson Challenges

A `challenge` on a `LessonStep` defines a required move the user must play:

```ts
interface Challenge {
  from: string   // Source square (e.g. "e2")
  to: string     // Target square (e.g. "e4")
}
```

When `interactive: true` and a `challenge` is set, the board validates drag-and-drop moves. Correct move triggers `onChallengeComplete()`.

---

## Lesson System

### Flow

1. User visits `/learn` → sees `LearnBasics.tsx` with lesson cards from `src/data/lessons.ts`
2. Clicks a lesson → navigates to `/learn/:lessonId`
3. `LessonDetail.tsx` loads the lesson by `id`, renders the `ChessBoard` + step text
4. User navigates steps with Prev/Next buttons
5. On challenge steps, user must drag the correct piece
6. Progress is saved to `progressStore` (Zustand → localStorage)

### Progress Tracking

`progressStore` records per-lesson:
```ts
{
  [lessonId]: {
    started: boolean
    completed: boolean
    lastStep: number    // 0-indexed step the user was on
  }
}
```

This is displayed as progress indicators on lesson cards in `LearnBasics.tsx`.

---

## Authentication Flow

1. User submits login form → `authService.login()` → POST `/api/auth/login`
2. Backend validates, returns `{ user, token }`
3. `authStore` saves `user` + `token`; token stored in `localStorage`
4. Axios interceptor (`api.ts`) reads token from `localStorage` and attaches it to every subsequent request
5. Protected backend routes use `authMiddleware` to verify the JWT

**Important:** The `authStore` currently initializes from `localStorage` on page load. Always use `useAuthStore()` to read auth state; never read `localStorage` directly in components.

---

## Key Conventions

### TypeScript

- Strict mode is enabled — no `any` unless absolutely necessary
- All new files should be `.tsx` (components) or `.ts` (non-JSX)
- Define interfaces for all component props in the same file as the component, or in `src/types/` if shared across multiple files

### Component Patterns

- Functional components only — no class components
- Custom hooks live in `src/hooks/` and follow the `use` prefix convention
- Colocate helper functions inside the component file unless they're reused elsewhere
- Export components as named exports (not default) unless it's a page component

### Imports Order (follow existing pattern)

1. React and framework imports
2. Third-party libraries
3. `@/` aliased internal imports (components, stores, services, types)
4. Relative imports (same directory)

### Adding New Lessons

Edit lesson files in **`shared/lessons/`** and export from `shared/lessons/index.ts`. Before merge:
- Run **`npm run validate:lessons`** from the repo root and fix any errors.
- Follow the checklist in **`LESSON_AUTHORING.md`** (setup vs narrative, challenge vs concept, play-through).
- Ensure: unique `id`, sequential `number`, valid FEN for every step (verify at lichess.org/analysis), consistent highlight/arrow props.

### Adding New Pages

1. Create the page component in `src/pages/`
2. Add the route in `App.tsx` under the appropriate layout
3. Add a navigation link in `Sidebar.tsx` if it's an inner page

### Adding New API Endpoints

1. Define the route in `backend/src/routes/`
2. Implement the controller in `backend/src/controllers/`
3. Add the service call in `frontend/src/services/`
4. Use TanStack Query (`useQuery`/`useMutation`) in the component, not raw `useEffect` + `useState`

---

## Known Limitations & Future Work

| Area | Status | Notes |
|------|--------|-------|
| Lesson data | Static only | `shared/lessons/` — backend `/api/lessons` exists but is unused |
| Puzzles | UI scaffold only | Route and backend exist; UI not yet built |
| Openings | Placeholder page | Not started |
| Profile | Placeholder page | Backend `User` model ready |
| Backend progress sync | Not integrated | Frontend uses localStorage only via `progressStore` |
| Tests | None | No unit or integration tests exist yet |
| Error boundaries | None | React error boundaries not yet implemented |

When working in any of these areas, do not assume the backend integration is complete — verify whether the feature is connected to the API or still using static/local data.

**Planned lessons and future features** are listed in [BACKLOG.md](BACKLOG.md). Consult it when adding lessons or planning new work.

---

*Last updated: February 2026*
