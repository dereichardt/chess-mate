/**
 * Shared types for lesson content. Used by frontend, backend, and narration.
 */

/** Visuals to show on the board after the challenge move is played. */
export interface PostChallengeVisuals {
  fen: string
  movedFrom?: string
  highlightSquares?: string[]
  captureSquares?: string[]
  fillSquares?: string[]
  arrows?: [string, string, string?][]
}

/** One step in a multi-move challenge: user move, optionally followed by a fixed opponent response. */
export type ChallengeSequenceStep =
  | { from: string; to: string }
  | { from: string; to: string; response: { from: string; to: string } }

export interface SharedLessonStep {
  title: string
  text: string
  /** When set, TTS uses this instead of text. Display always uses text. */
  narrationText?: string
  fen: string
  highlightSquares?: string[]
  captureSquares?: string[]
  fillSquares?: string[]
  arrows?: [string, string, string?][]
  /**
   * One-move challenge: required move (or any of the moves if array).
   * Use for single-move "find the move" steps. Ignored when challengeSequence is set.
   */
  challenge?: { from: string; to: string } | { from: string; to: string }[]
  /**
   * Multi-move challenge: sequence of user moves with optional opponent responses between them.
   * When set, the step is complete only after the full sequence is played correctly.
   */
  challengeSequence?: ChallengeSequenceStep[]
  postChallenge?: PostChallengeVisuals
  interactive?: boolean
}

export interface SharedLesson {
  id: string
  number: number
  title: string
  description: string
  duration: string
  steps: SharedLessonStep[]
}
