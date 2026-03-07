/**
 * Validates that all expected lesson IDs (including 7–12) exist in the Lesson table.
 * If any are missing, progress for those lessons cannot be saved (FK constraint).
 * Run from backend directory: npx tsx scripts/validate-lesson-ids.ts
 * Fix: npm run db:seed
 */
import 'dotenv/config'
import prisma from '../src/utils/db'

const EXPECTED_LESSON_IDS = [
  'how-pieces-move',
  'board-setup',
  'basic-tactics',
  'check-and-checkmate',
  'opening-principles',
  'endgame-basics',
  'checks-captures-attacks',
  'piece-values-exchanges',
  'seeing-opponent-threats',
  'defending-under-attack',
  'simple-checkmate-patterns',
  'thinking-routine',
  'skewers-discovered',
]

async function main() {
  const found = await prisma.lesson.findMany({
    where: { id: { in: EXPECTED_LESSON_IDS } },
    select: { id: true },
  })
  const foundIds = new Set(found.map((r) => r.id))
  const missing = EXPECTED_LESSON_IDS.filter((id) => !foundIds.has(id))

  if (missing.length > 0) {
    console.error('Missing lessons in database (progress for these will not be saved):')
    missing.forEach((id) => console.error('  -', id))
    console.error('\nRun from backend directory: npm run db:seed')
    process.exit(1)
  }

  console.log('All', EXPECTED_LESSON_IDS.length, 'lessons present in database.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
