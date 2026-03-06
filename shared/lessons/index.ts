/**
 * Central export for all lessons and narration lookup.
 * Backend uses getNarrationStep for TTS; frontend can use allLessons as the single source of truth.
 */

import type { SharedLesson } from './types'
import lessonHowPiecesMove from './lesson-how-pieces-move'
import lessonBoardSetup from './lesson-board-setup'
import lessonBasicTactics from './lesson-basic-tactics'
import lessonCheckAndCheckmate from './lesson-check-and-checkmate'
import lessonOpeningPrinciples from './lesson-opening-principles'
import lessonEndgameBasics from './lesson-endgame-basics'
import lessonChecksCapturesAttacks from './lesson-checks-captures-attacks'
import lessonPieceValuesExchanges from './lesson-piece-values-exchanges'
import lessonSeeingOpponentThreats from './lesson-seeing-opponent-threats'
import lessonDefendingUnderAttack from './lesson-defending-under-attack'
import lessonSimpleCheckmatePatterns from './lesson-simple-checkmate-patterns'
import lessonThinkingRoutine from './lesson-thinking-routine'
import lessonSkewersDiscovered from './lesson-skewers-discovered'

export * from './types'
export { STARTING_FEN } from './constants'
export { lessonHowPiecesMove } from './lesson-how-pieces-move'

export const allLessons: SharedLesson[] = [
  lessonHowPiecesMove,
  lessonBoardSetup,
  lessonBasicTactics,
  lessonCheckAndCheckmate,
  lessonOpeningPrinciples,
  lessonEndgameBasics,
  lessonChecksCapturesAttacks,
  lessonPieceValuesExchanges,
  lessonSeeingOpponentThreats,
  lessonDefendingUnderAttack,
  lessonSimpleCheckmatePatterns,
  lessonThinkingRoutine,
  lessonSkewersDiscovered,
]

const lessonsById = new Map<string, SharedLesson>(
  allLessons.map((l) => [l.id, l])
)

/**
 * Returns the step title and text (or narrationText) for TTS. Used by the backend narration endpoint.
 */
export function getNarrationStep(
  lessonId: string,
  stepIndex: number
): { title: string; text: string } | null {
  const lesson = lessonsById.get(lessonId)
  if (
    !lesson ||
    !Number.isInteger(stepIndex) ||
    stepIndex < 0 ||
    stepIndex >= lesson.steps.length
  ) {
    return null
  }
  const step = lesson.steps[stepIndex]
  return {
    title: step.title,
    text: step.narrationText ?? step.text,
  }
}
