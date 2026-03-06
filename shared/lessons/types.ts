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
  challenge?: { from: string; to: string } | { from: string; to: string }[]
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
