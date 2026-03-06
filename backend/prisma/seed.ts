/**
 * Seed Lesson rows with ids matching frontend slugs so progress API can reference them.
 * Run with: npx prisma db seed (from backend directory)
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const connectionString = rawUrl
  .replace(/[?&]sslmode=require/g, "")
  .replace(/\?&/, "?")
  .replace(/\?$/, "") || rawUrl;

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

const LESSONS = [
  { id: "how-pieces-move", title: "How the Pieces Move", description: "Learn the movement rules for every chess piece.", difficulty: "beginner", order: 1 },
  { id: "board-setup", title: "Board Setup & Notation", description: "Learn to set up the board and read chess notation.", difficulty: "beginner", order: 2 },
  { id: "basic-tactics", title: "Basic Tactics: Forks & Pins", description: "Essential tactical ideas.", difficulty: "beginner", order: 3 },
  { id: "check-and-checkmate", title: "Check, Checkmate & Stalemate", description: "How games end.", difficulty: "beginner", order: 4 },
  { id: "opening-principles", title: "Opening Principles", description: "Fight for the center, develop pieces, keep the king safe.", difficulty: "beginner", order: 5 },
  { id: "endgame-basics", title: "Endgame Basics", description: "King and pawn endings and basic checkmates.", difficulty: "beginner", order: 6 },
  { id: "checks-captures-attacks", title: "Checks, Captures, Attacks", description: "A simple method to find good moves every turn: look for checks, then captures, then attacks.", difficulty: "beginner", order: 7 },
  { id: "piece-values-exchanges", title: "Piece Values & Simple Exchanges", description: "Learn piece values and when a trade helps you or hurts you.", difficulty: "beginner", order: 8 },
  { id: "seeing-opponent-threats", title: "Seeing Your Opponent's Threats", description: "Before you move, ask: what did they just play, and what are they threatening?", difficulty: "beginner", order: 9 },
  { id: "defending-under-attack", title: "Defending a Piece Under Attack", description: "When your piece is attacked, you have four options: move it, defend it, block, or counter-attack.", difficulty: "beginner", order: 10 },
  { id: "simple-checkmate-patterns", title: "Simple Checkmate Patterns", description: "Recognise common checkmate patterns: queen boxing the king and checkmate in one.", difficulty: "beginner", order: 11 },
  { id: "thinking-routine", title: "A Simple Thinking Routine", description: "Tie it together: look at their move and threats, then use CCA, then look once more before you play.", difficulty: "beginner", order: 12 },
  { id: "skewers-discovered", title: "Skewers & Discovered Attacks", description: "Extend your tactics beyond forks and pins: the skewer and the discovered attack.", difficulty: "beginner", order: 13 },
];

async function main() {
  for (const lesson of LESSONS) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: { title: lesson.title, description: lesson.description, difficulty: lesson.difficulty, order: lesson.order, content: "" },
      create: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content: "",
        difficulty: lesson.difficulty,
        order: lesson.order,
      },
    });
  }
  console.log("Seeded", LESSONS.length, "lessons.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
