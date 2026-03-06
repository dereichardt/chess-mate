/**
 * Lesson helpers for premium gating. Premium lessons (Advanced Beginner curriculum) require Pro.
 */

export function isPremiumLesson(lesson: { number: number }): boolean {
  return lesson.number >= 13
}
