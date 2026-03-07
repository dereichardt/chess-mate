/**
 * Lesson validation script. Run from repo root or frontend with:
 *   npx tsx scripts/validate-lessons.ts   (from repo root, if tsx available)
 *   npm run validate:lessons              (from frontend; script runs tsx ../scripts/validate-lessons.ts)
 *
 * Validates:
 * - FEN loads without throwing (with skipValidation for non-standard positions).
 * - Every challenge move is legal from the step FEN (single-move or sequence).
 * - All square names (highlights, arrows) are on-board [a-h][1-8].
 * - When postChallenge.fen is set, it matches the position after the challenge move(s).
 */

import { Chess } from 'chess.js'
import { allLessons } from '../shared/lessons'
import type { SharedLessonStep } from '../shared/lessons'

const SQUARE_REGEX = /^[a-h][1-8]$/

function isLegalSquare(s: string): boolean {
  return SQUARE_REGEX.test(s)
}

function makeGame(fen: string): Chess {
  const game = new Chess()
  game.load(fen, { skipValidation: true })
  return game
}

interface ValidationError {
  lessonId: string
  lessonNumber: number
  stepIndex: number
  stepTitle: string
  message: string
}

const errors: ValidationError[] = []

function add(
  lessonId: string,
  lessonNumber: number,
  stepIndex: number,
  stepTitle: string,
  message: string
) {
  errors.push({ lessonId, lessonNumber, stepIndex, stepTitle, message })
}

function validateSquares(
  lessonId: string,
  lessonNumber: number,
  stepIndex: number,
  stepTitle: string,
  squares: string[] | undefined,
  label: string
) {
  if (!squares) return
  for (const sq of squares) {
    if (!isLegalSquare(sq)) {
      add(lessonId, lessonNumber, stepIndex, stepTitle, `${label}: invalid square "${sq}" (expected [a-h][1-8])`)
    }
  }
}

function validateStep(
  lessonId: string,
  lessonNumber: number,
  stepIndex: number,
  step: SharedLessonStep
): void {
  const stepTitle = step.title

  // FEN: must load (with skipValidation)
  try {
    makeGame(step.fen)
  } catch (e) {
    add(
      lessonId,
      lessonNumber,
      stepIndex,
      stepTitle,
      `FEN failed to load: ${e instanceof Error ? e.message : String(e)}`
    )
    return
  }

  // Square lists
  validateSquares(
    lessonId,
    lessonNumber,
    stepIndex,
    stepTitle,
    step.highlightSquares,
    'highlightSquares'
  )
  validateSquares(
    lessonId,
    lessonNumber,
    stepIndex,
    stepTitle,
    step.captureSquares,
    'captureSquares'
  )
  validateSquares(
    lessonId,
    lessonNumber,
    stepIndex,
    stepTitle,
    step.fillSquares,
    'fillSquares'
  )

  // Arrows: from and to
  if (step.arrows) {
    for (let i = 0; i < step.arrows.length; i++) {
      const [from, to] = step.arrows[i]
      if (from && !isLegalSquare(from)) {
        add(
          lessonId,
          lessonNumber,
          stepIndex,
          stepTitle,
          `arrows[${i}]: invalid "from" square "${from}"`
        )
      }
      if (to && !isLegalSquare(to)) {
        add(
          lessonId,
          lessonNumber,
          stepIndex,
          stepTitle,
          `arrows[${i}]: invalid "to" square "${to}"`
        )
      }
    }
  }

  // Multi-move challenge sequence: walk the sequence and validate each move is legal
  if (step.challengeSequence && step.challengeSequence.length > 0) {
    const game = makeGame(step.fen)
    for (let i = 0; i < step.challengeSequence.length; i++) {
      const el = step.challengeSequence[i]
      const userFrom = el.from
      const userTo = el.to
      const userMove = game.move({ from: userFrom, to: userTo })
      if (!userMove) {
        add(
          lessonId,
          lessonNumber,
          stepIndex,
          stepTitle,
          `challengeSequence[${i}]: user move ${userFrom}→${userTo} is not legal in this position`
        )
        break
      }
      if ('response' in el && el.response) {
        const resp = el.response
        const responseMove = game.move({ from: resp.from, to: resp.to })
        if (!responseMove) {
          add(
            lessonId,
            lessonNumber,
            stepIndex,
            stepTitle,
            `challengeSequence[${i}]: response ${resp.from}→${resp.to} is not legal after user move`
          )
          break
        }
      }
    }
    // postChallenge.fen must match final position after full sequence
    if (step.postChallenge?.fen && errors.filter((e) => e.stepIndex === stepIndex).length === 0) {
      const finalParts = game.fen().split(' ')
      const expectedParts = step.postChallenge.fen.trim().split(' ')
      if (
        finalParts[0] !== expectedParts[0] ||
        (expectedParts[1] !== undefined && finalParts[1] !== expectedParts[1])
      ) {
        add(
          lessonId,
          lessonNumber,
          stepIndex,
          stepTitle,
          `postChallenge.fen does not match position after challengeSequence (final position)`
        )
      }
    }
  }
  // Single-move challenge: move(s) must be legal from step FEN
  else if (step.challenge) {
    const game = makeGame(step.fen)
    const legalMoves = game.moves({ verbose: true })
    const challenges = Array.isArray(step.challenge) ? step.challenge : [step.challenge]

    for (const ch of challenges) {
      const match = legalMoves.some(
        (m) => m.from === ch.from && m.to === ch.to
      )
      if (!match) {
        add(
          lessonId,
          lessonNumber,
          stepIndex,
          stepTitle,
          `challenge move ${ch.from}→${ch.to} is not legal in this position`
        )
      }
    }

    // postChallenge.fen must match position after applying first challenge move
    // Compare only position + turn (first two FEN fields) to avoid false positives from halfmove/fullmove/castling
    if (step.postChallenge?.fen && challenges.length > 0) {
      const game2 = makeGame(step.fen)
      const first = challenges[0]
      const move = game2.move({ from: first.from, to: first.to })
      if (move) {
        const afterParts = game2.fen().split(' ')
        const expectedParts = step.postChallenge.fen.trim().split(' ')
        if (
          afterParts[0] !== expectedParts[0] ||
          (expectedParts[1] !== undefined && afterParts[1] !== expectedParts[1])
        ) {
          add(
            lessonId,
            lessonNumber,
            stepIndex,
            stepTitle,
            `postChallenge.fen does not match position after challenge move ${first.from}→${first.to}`
          )
        }
      }
    }
  }

  // postChallenge square lists and movedFrom
  if (step.postChallenge) {
    validateSquares(
      lessonId,
      lessonNumber,
      stepIndex,
      stepTitle,
      step.postChallenge.highlightSquares,
      'postChallenge.highlightSquares'
    )
    validateSquares(
      lessonId,
      lessonNumber,
      stepIndex,
      stepTitle,
      step.postChallenge.captureSquares,
      'postChallenge.captureSquares'
    )
    validateSquares(
      lessonId,
      lessonNumber,
      stepIndex,
      stepTitle,
      step.postChallenge.fillSquares,
      'postChallenge.fillSquares'
    )
    if (step.postChallenge.movedFrom && !isLegalSquare(step.postChallenge.movedFrom)) {
      add(
        lessonId,
        lessonNumber,
        stepIndex,
        stepTitle,
        `postChallenge.movedFrom: invalid square "${step.postChallenge.movedFrom}"`
      )
    }
    if (step.postChallenge.arrows) {
      for (let i = 0; i < step.postChallenge.arrows.length; i++) {
        const [from, to] = step.postChallenge.arrows[i]
        if (from && !isLegalSquare(from)) {
          add(
            lessonId,
            lessonNumber,
            stepIndex,
            stepTitle,
            `postChallenge.arrows[${i}]: invalid "from" square "${from}"`
          )
        }
        if (to && !isLegalSquare(to)) {
          add(
            lessonId,
            lessonNumber,
            stepIndex,
            stepTitle,
            `postChallenge.arrows[${i}]: invalid "to" square "${to}"`
          )
        }
      }
    }
  }
}

for (const lesson of allLessons) {
  lesson.steps.forEach((step, i) => {
    validateStep(lesson.id, lesson.number, i, step)
  })
}

if (errors.length > 0) {
  console.error('Lesson validation failed:\n')
  for (const e of errors) {
    console.error(
      `  [${e.lessonId} (#${e.lessonNumber}) step ${e.stepIndex} "${e.stepTitle}"] ${e.message}`
    )
  }
  process.exit(1)
}

console.log('All lessons passed validation.')
