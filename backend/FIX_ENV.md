# Fixing Prisma DATABASE_URL Error

## The Problem

Prisma is seeing the literal text `DATABASE_URL` instead of reading your actual connection string from the `.env` file.

## Common Causes

1. **Incorrect format in .env file**
2. **Extra quotes or spaces**
3. **Wrong variable name**

## How to Fix

### Step 1: Check Your .env File

Open `chess-mate/backend/.env` and make sure the `DATABASE_URL` line looks exactly like this:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

### Step 2: Common Mistakes to Avoid

❌ **WRONG** - No quotes:
```env
DATABASE_URL=postgresql://postgres:password@host:5432/db
```

❌ **WRONG** - Extra spaces:
```env
DATABASE_URL = "postgresql://..."
```

❌ **WRONG** - Wrong variable name:
```env
DB_URL="postgresql://..."
```

❌ **WRONG** - Nested quotes:
```env
DATABASE_URL=""postgresql://...""
```

✅ **CORRECT** - Proper format:
```env
DATABASE_URL="postgresql://postgres:password@host:5432/postgres?sslmode=require"
```

### Step 3: Example for Supabase

Your Supabase connection string should look like:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

In your `.env` file, it should be:

```env
DATABASE_URL="postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Important:**
- Use double quotes `"` around the entire connection string
- Replace `YOUR-PASSWORD` with your actual password
- Add `?sslmode=require` at the end
- No spaces around the `=` sign

### Step 4: Verify the Format

Your complete `.env` file should look like:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres.xxxxx:your_password_here@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require"

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### Step 5: Test Again

After fixing the `.env` file:

```bash
cd /Users/davidreichardt/chess-mate/backend
npm run prisma:generate
```

## Still Not Working?

1. **Check for hidden characters**: Make sure there are no special characters or line breaks in the DATABASE_URL
2. **Verify file location**: Make sure `.env` is in `chess-mate/backend/` directory
3. **Check file encoding**: Save the file as UTF-8 (most text editors do this by default)
4. **Restart terminal**: Close and reopen your terminal after editing `.env`

## Quick Test

You can test if Prisma can read the variable:

```bash
cd /Users/davidreichardt/chess-mate/backend
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? 'Found!' : 'Not found')"
```

If it says "Found!", the variable is being read correctly.
