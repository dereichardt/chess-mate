# Production deployment checklist

Use this checklist to deploy Chess-Mate so users can sign up, have data stored in the database, and future changes don’t break existing users.

---

## 1. Secrets and environment

- [ ] **JWT:** In production, require a real `JWT_SECRET`. Do not use the default fallback (`your-secret-key`). Fail app startup if `NODE_ENV=production` and `JWT_SECRET` is missing or still the default.
- [ ] **Database:** Set `DATABASE_URL` to your production PostgreSQL instance (e.g. managed Postgres). Keep it server-side only; never expose it to the frontend.
- [ ] **CORS:** Set `FRONTEND_URL` to the exact production frontend origin (e.g. `https://app.chess-mate.com`) so CORS and credentials work.
- [ ] **Narration (optional):** If using ElevenLabs in production, set `ELEVENLABS_API_KEY` (and optional `ELEVENLABS_VOICE_ID` / `ELEVENLABS_MODEL_ID`) and document in `backend/env.example` or README.
- [ ] **Convention:** Consider renaming `backend/env.example` to `backend/.env.example` and update README so the “copy from .env.example” step is correct.

---

## 2. Frontend API URL in production

- [ ] **Same-origin:** If you serve the frontend and API from the same host (e.g. Express serves `frontend/dist` and `/api/*`), keep `baseURL: '/api'` in `frontend/src/services/api.ts` — no change.
- [ ] **Different origin:** If frontend and backend are on different hosts, set `baseURL` from env (e.g. `import.meta.env.VITE_API_URL || '/api'`) and set `VITE_API_URL` to the production API base (e.g. `https://api.chess-mate.com`) in the production build. Ensure backend `FRONTEND_URL` matches the frontend’s actual origin.

---

## 3. Database and migrations

- [ ] **First deploy:** Run migrations on the production DB with `npx prisma migrate deploy` (from `backend`). Do **not** use `prisma migrate dev` in production.
- [ ] **Seed:** Run the seed once so `Lesson` rows exist (e.g. `npx prisma db seed` or equivalent in your deploy script). Progress relies on these lesson IDs; missing rows can cause progress APIs to fail or behave oddly.
- [ ] **Future schema changes:** Prefer **additive** migrations (new columns with defaults, new tables) so existing data and older app versions keep working. Avoid dropping or renaming columns in a single release; use a multi-step plan if you must (e.g. add new column → backfill → switch app → remove old column in a later release).

---

## 4. Security hardening

- [ ] **Password validation:** Add validation on register (e.g. minimum length 8, optional complexity). Return 400 with a clear message before hashing.
- [ ] **Rate limiting:** Add rate limiting (e.g. `express-rate-limit`) on `/api/auth/login` and `/api/auth/register` to reduce brute-force and abuse. Extend to other sensitive or expensive routes as needed.
- [ ] **Helmet (optional):** Use `helmet()` on the Express app for safe headers, especially if serving the frontend from the same process.
- [ ] **Error messages:** Keep auth errors generic (e.g. “Invalid credentials”) so you don’t reveal whether an email exists.

---

## 5. Not breaking users as you add features

- [ ] **Backend compatibility:** When changing APIs (e.g. progress payload, new lessons, premium), keep existing fields and behavior working for at least one release or a clear deprecation period. Avoid removing or renaming response fields the current frontend depends on.
- [ ] **Schema:** Prefer new columns/tables over changing the meaning of existing ones. For premium/subscription, add new models and keep existing `User` / `LessonProgress` semantics so current users don’t lose progress.
- [ ] **Frontend:** When adding paywalled lessons, the app should still load for free users and only restrict access to premium routes/lessons (e.g. 402 or upgrade CTA). Don’t change existing lesson IDs for the six basics; add new IDs for new content.
- [ ] **Migrations:** Test each migration on a copy of production-like data (or a staging DB) before deploying. Run `prisma migrate deploy` in CI/CD for production.
- [ ] **Health check (optional):** Add a health endpoint that verifies DB connectivity (e.g. `/api/health` performs a single Prisma query) so you can detect DB issues in production.

---

## 6. Deployment steps

- [ ] **Backend:** From `backend`, run `npm run build`, then start with `node dist/server.js` (or your process manager). Set `NODE_ENV=production`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and optional `ELEVENLABS_*`.
- [ ] **Frontend:** From `frontend`, run `npm run build`. Serve `frontend/dist` (same origin as API or via your static host). If using a separate API origin, set `VITE_API_URL` when building.
- [ ] **Database:** Ensure production DB has been migrated and seeded (lessons exist).
- [ ] **Smoke test:** Sign up → log in → complete part of a lesson → confirm progress is saved and loads after refresh.

---

## Quick reference: production env vars

| Variable           | Required | Description                                      |
|--------------------|----------|--------------------------------------------------|
| `NODE_ENV`         | Yes      | `production`                                     |
| `PORT`             | No       | Server port (default 5001)                       |
| `DATABASE_URL`     | Yes      | PostgreSQL connection string                     |
| `JWT_SECRET`       | Yes      | Strong secret; no default in production          |
| `JWT_EXPIRES_IN`   | No       | Token expiry (default `7d`)                      |
| `FRONTEND_URL`     | Yes      | Production frontend origin for CORS              |
| `ELEVENLABS_*`     | If used  | For lesson narration                             |

Frontend (build-time, if API on different origin):

| Variable        | Description                    |
|-----------------|--------------------------------|
| `VITE_API_URL`  | Full base URL of production API |
