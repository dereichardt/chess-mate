/**
 * Lesson data: re-exported from shared so frontend and backend use the same content.
 */

export type {
  PostChallengeVisuals,
  SharedLessonStep as LessonStep,
  SharedLesson as Lesson,
} from '../../../shared/lessons'

export { allLessons as lessons } from '../../../shared/lessons'
