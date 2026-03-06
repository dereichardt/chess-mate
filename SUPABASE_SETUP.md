# Setting Up Supabase Database for Chess-Mate

## Step 1: Get Your Supabase Connection String

1. **Go to your Supabase project**: https://app.supabase.com/
2. **Click on your project**
3. **Go to Settings** (gear icon in the left sidebar)
4. **Click on "Database"** in the settings menu
5. **Scroll down to "Connection string"**
6. **Select "URI"** tab
7. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Step 2: Update Your .env File

1. **Open** `chess-mate/backend/.env` in a text editor
2. **Find the line** that says:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chess_mate?schema=public"
   ```
3. **Replace it** with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
   ```

   **Important**: 
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - Add `?sslmode=require` at the end (Supabase requires SSL)
   - The password is already included in the connection string from Supabase

## Step 3: Example

If your Supabase connection string is:
```
postgresql://postgres:MySecurePassword123@db.abcdefgh.supabase.co:5432/postgres
```

Your `.env` file should have:
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.abcdefgh.supabase.co:5432/postgres?sslmode=require"
```

## Security Notes

✅ **DO:**
- Store the connection string in `.env` file (already in `.gitignore`)
- Keep your `.env` file private - never commit it to git
- Use environment variables in production

❌ **DON'T:**
- Commit `.env` to version control
- Share your connection string publicly
- Hardcode passwords in your code

## Finding Your Password

If you forgot your Supabase database password:

1. Go to Supabase Dashboard
2. Settings → Database
3. Look for "Database password" section
4. You can reset it if needed (click "Reset database password")

## Testing the Connection

After updating `.env`, test the connection:

```bash
cd chess-mate/backend
npm run prisma:generate
npm run prisma:migrate
```

If you see errors, check:
- Password is correct (no extra spaces)
- Connection string includes `?sslmode=require`
- Your Supabase project is active

## Quick Checklist

- [ ] Got connection string from Supabase
- [ ] Updated `DATABASE_URL` in `backend/.env`
- [ ] Added `?sslmode=require` to the connection string
- [ ] Verified `.env` is in `.gitignore` (it should be)
- [ ] Ran `npm run prisma:migrate` successfully

---

**Your password is stored securely in `backend/.env` which is already excluded from git!**
