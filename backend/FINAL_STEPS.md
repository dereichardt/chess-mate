# Final Setup Steps - Almost There! 🎉

Prisma client is generated! Now let's finish the setup.

## Step 1: Run Database Migrations

This creates all the tables in your Supabase database:

```bash
cd /Users/davidreichardt/chess-mate/backend
npm run prisma:migrate
```

When prompted for a migration name, you can:
- Press Enter (uses default name)
- Or type: `init`

**Expected output:**
```
✔ Your database is now in sync with your Prisma schema.
```

This creates these tables in your database:
- User
- Lesson
- LessonProgress
- Puzzle
- PuzzleAttempt
- Game

## Step 2: (Optional) View Your Database

You can open Prisma Studio to see your database in a web interface:

```bash
cd /Users/davidreichardt/chess-mate/backend
npm run prisma:studio
```

This opens at http://localhost:5555 - you can view and edit your database tables there.

## Step 3: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/davidreichardt/chess-mate/backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

**Keep this terminal open!**

## Step 4: Start the Frontend Server

Open a **new terminal window** and run:

```bash
cd /Users/davidreichardt/chess-mate/frontend
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 5: Open the Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 6: Test It Out!

1. **Register a new account** - Click "Sign Up" or go to http://localhost:3000/register
2. **Login** - Try logging in with your new account
3. **Explore** - Check out the Lessons, Practice, and Puzzles pages

## 🎉 You're Done!

Your Chess-Mate application is now running!

## Troubleshooting

### Backend won't start
- Make sure your `.env` file has the correct `DATABASE_URL`
- Check that migrations ran successfully
- Verify Node.js is running: `node --version`

### Frontend won't start
- Make sure backend is running first
- Check for port conflicts (try changing port in `vite.config.ts`)

### Database connection errors
- Verify your Supabase connection string in `.env`
- Make sure `?sslmode=require` is at the end
- Check that your Supabase project is active

### Can't register/login
- Check browser console for errors (F12)
- Verify backend is running on port 5000
- Check backend terminal for error messages

## Next Steps (Optional)

1. **Add chess board UI** - Integrate `react-chessboard` library
2. **Add lesson content** - Create actual chess lessons in the database
3. **Implement game logic** - Use `chess.js` for move validation
4. **Add puzzle solving** - Implement puzzle validation logic

---

**Happy coding! ♟️**
