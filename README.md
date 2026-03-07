# Chess-Mate ♟️

A modern web application to help anyone learn and improve at chess. Built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- 📚 **Interactive Lessons** - Learn chess fundamentals and advanced strategies
- 🎮 **Practice Mode** - Play against the computer at various difficulty levels
- 🧩 **Tactical Puzzles** - Solve chess puzzles to improve your tactical skills
- 📊 **Progress Tracking** - Monitor your learning journey and improvement
- 🔐 **User Authentication** - Secure login and registration system

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **chess.js** - Chess game logic

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **Prisma** - Modern ORM for database
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **npm** or **pnpm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
  - Or use a cloud service like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)

## Setup Instructions

### 1. Clone or Navigate to Project

```bash
cd chess-mate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/chess_mate?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed lesson rows (required for progress tracking on all lessons, including 7–12)
npm run db:seed

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Run Development Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE chess_mate;
   ```
3. Update `DATABASE_URL` in `backend/.env`:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/chess_mate?schema=public"
   ```

### Option 2: Cloud Database (Recommended for Beginners)

1. Sign up for [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `backend/.env`

## Project Structure

```
chess-mate/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
└── README.md
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run db:seed` - Seed lesson rows (required for progress to be saved for all lessons)
- `npm run db:validate-lessons` - Check that all lesson IDs exist in the database
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID

### Puzzles
- `GET /api/puzzles` - Get puzzles (optional ?difficulty= query)
- `GET /api/puzzles/:id` - Get puzzle by ID

### Progress
- `GET /api/progress` - Get user progress (protected)
- `POST /api/progress/lesson/:lessonId` - Update lesson progress (protected)

## Environment Variables

### Backend (.env)

```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/chess_mate?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Next Steps

1. **Add Chess Board Component** - Integrate a chess board UI library
2. **Implement Game Logic** - Use chess.js for game state management
3. **Add Lesson Content** - Create actual lesson content in the database
4. **Implement Puzzles** - Add puzzle solving functionality
5. **Add Progress Charts** - Visualize user progress over time

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env` is correct
- Verify database exists: `psql -l` (should list `chess_mate`)

### Port Already in Use
- Change `PORT` in backend `.env` or frontend `vite.config.ts`
- Kill process using port: `lsof -ti:5001 | xargs kill` (macOS/Linux)

### Prisma Issues
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` to apply migrations

### Progress lost on refresh (lessons 7–12)
If your progress for lessons 7–12 disappears when you refresh, the **Lesson** table is likely missing those rows. Progress is stored per lesson and requires a matching row in the database.

1. From the **backend** directory run: `npm run db:seed`
2. To confirm all lessons exist: `npm run db:validate-lessons`

After seeding, sign in again and your progress for those lessons will persist.

## Contributing

This is a starter project. Feel free to extend it with:
- Chess engine integration
- Multiplayer functionality
- Advanced analytics
- Mobile responsiveness improvements
- And more!

## License

MIT

---

Happy coding! ♟️
