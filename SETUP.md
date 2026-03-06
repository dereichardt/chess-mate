# Chess-Mate Setup Guide

Follow these steps to get your Chess-Mate application up and running.

## Prerequisites Check

First, verify you have the required tools installed:

```bash
# Check Node.js (should be v20 or higher)
node --version

# Check npm
npm --version

# Check PostgreSQL (optional - you can use cloud database)
psql --version
```

If Node.js is not installed:
- **macOS**: Install via [Homebrew](https://brew.sh/): `brew install node`
- **Or download**: [Node.js Official Site](https://nodejs.org/)

## Step 1: Install Dependencies

### Backend Dependencies

```bash
cd chess-mate/backend
npm install
```

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 2: Database Setup

You have two options for the database:

### Option A: Cloud Database (Recommended - Easiest)

1. **Sign up for a free database:**
   - [Supabase](https://supabase.com/) - Free tier available
   - [Neon](https://neon.tech/) - Free tier available
   - [Railway](https://railway.app/) - Free tier available

2. **Get your connection string** (looks like):
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

3. **Update backend/.env:**
   ```bash
   cd backend
   # Copy the example file
   cp env.example .env
   # Then edit .env and paste your DATABASE_URL
   ```

### Option B: Local PostgreSQL

1. **Install PostgreSQL:**
   - macOS: `brew install postgresql@14`
   - Or download from [PostgreSQL.org](https://www.postgresql.org/download/)

2. **Create database:**
   ```bash
   # Start PostgreSQL service
   brew services start postgresql@14  # macOS
   
   # Create database
   createdb chess_mate
   
   # Or using psql:
   psql postgres
   CREATE DATABASE chess_mate;
   \q
   ```

3. **Update backend/.env:**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` and set:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/chess_mate?schema=public"
   ```

## Step 3: Configure Environment Variables

Edit `backend/.env` file:

```env
PORT=5000
NODE_ENV=development

# Replace with your actual database URL
DATABASE_URL="postgresql://user:password@localhost:5432/chess_mate?schema=public"

# Generate a secure random string for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a random string in production!

## Step 4: Initialize Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates all tables)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

## Step 5: Start Development Servers

You need **two terminal windows**:

### Terminal 1 - Backend Server

```bash
cd chess-mate/backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

### Terminal 2 - Frontend Server

```bash
cd chess-mate/frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 6: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Or use Homebrew: `brew install node`

### Database Connection Error
- Verify your `DATABASE_URL` in `backend/.env` is correct
- Make sure PostgreSQL is running (if using local)
- Check that the database exists
- For cloud databases, ensure SSL is enabled if required

### Port Already in Use
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Or kill the process: `lsof -ti:5000 | xargs kill` (macOS/Linux)

### Prisma Errors
- Make sure you ran `npm run prisma:generate` first
- Then run `npm run prisma:migrate`
- If issues persist, delete `node_modules` and `package-lock.json`, then `npm install` again

### CORS Errors
- Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default is `http://localhost:3000`

## Next Steps After Setup

1. **Test Registration/Login:**
   - Go to http://localhost:3000/register
   - Create an account
   - Try logging in

2. **Add Sample Data:**
   - You can add lessons and puzzles via Prisma Studio
   - Or create seed scripts

3. **Start Building Features:**
   - Integrate chess board UI
   - Add lesson content
   - Implement puzzle solving

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start dev server
npm run build            # Build for production
npm run prisma:studio    # Open database GUI

# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

---

Need help? Check the main README.md for more details!
