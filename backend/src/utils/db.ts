import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Remove sslmode from URL so pg uses our ssl config (avoids self-signed cert errors with Supabase)
const connectionString = rawUrl
  .replace(/[?&]sslmode=require/g, "")
  .replace(/\?&/, "?")
  .replace(/\?$/, "") || rawUrl;

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

export default prisma;
