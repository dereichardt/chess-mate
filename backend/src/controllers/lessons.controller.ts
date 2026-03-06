import { Request, Response } from 'express'
import prisma from '../utils/db'
import lessonHowPiecesMove from '../../../shared/lessons/lesson-how-pieces-move'
import lessonBoardSetup from '../../../shared/lessons/lesson-board-setup'
import lessonBasicTactics from '../../../shared/lessons/lesson-basic-tactics'
import lessonCheckAndCheckmate from '../../../shared/lessons/lesson-check-and-checkmate'
import lessonOpeningPrinciples from '../../../shared/lessons/lesson-opening-principles'
import lessonEndgameBasics from '../../../shared/lessons/lesson-endgame-basics'
import lessonChecksCapturesAttacks from '../../../shared/lessons/lesson-checks-captures-attacks'
import lessonPieceValuesExchanges from '../../../shared/lessons/lesson-piece-values-exchanges'
import lessonSeeingOpponentThreats from '../../../shared/lessons/lesson-seeing-opponent-threats'
import lessonDefendingUnderAttack from '../../../shared/lessons/lesson-defending-under-attack'
import lessonSimpleCheckmatePatterns from '../../../shared/lessons/lesson-simple-checkmate-patterns'
import lessonThinkingRoutine from '../../../shared/lessons/lesson-thinking-routine'
import lessonSkewersDiscovered from '../../../shared/lessons/lesson-skewers-discovered'
import { ElevenLabsError, synthesizeLessonSpeech } from '../utils/elevenLabsClient'

function normalizeLesson(m: unknown): { steps: Array<{ title: string; text: string; narrationText?: string }> } | null {
  const lesson = m && typeof m === 'object' && 'default' in m ? (m as { default: unknown }).default : m
  const obj = lesson && typeof lesson === 'object' && lesson !== null ? lesson as Record<string, unknown> : null
  if (!obj || !Array.isArray(obj.steps)) return null
  return obj as { steps: Array<{ title: string; text: string; narrationText?: string }> }
}

const LESSONS_BY_ID = new Map<string, { steps: Array<{ title: string; text: string; narrationText?: string }> } | null>([
  ['how-pieces-move', normalizeLesson(lessonHowPiecesMove)],
  ['board-setup', normalizeLesson(lessonBoardSetup)],
  ['basic-tactics', normalizeLesson(lessonBasicTactics)],
  ['check-and-checkmate', normalizeLesson(lessonCheckAndCheckmate)],
  ['opening-principles', normalizeLesson(lessonOpeningPrinciples)],
  ['endgame-basics', normalizeLesson(lessonEndgameBasics)],
  ['checks-captures-attacks', normalizeLesson(lessonChecksCapturesAttacks)],
  ['piece-values-exchanges', normalizeLesson(lessonPieceValuesExchanges)],
  ['seeing-opponent-threats', normalizeLesson(lessonSeeingOpponentThreats)],
  ['defending-under-attack', normalizeLesson(lessonDefendingUnderAttack)],
  ['simple-checkmate-patterns', normalizeLesson(lessonSimpleCheckmatePatterns)],
  ['thinking-routine', normalizeLesson(lessonThinkingRoutine)],
  ['skewers-discovered', normalizeLesson(lessonSkewersDiscovered)],
])

function getNarrationStep(
  lessonId: string,
  stepIndex: number
): { title: string; text: string } | null {
  const lesson = LESSONS_BY_ID.get(lessonId) ?? null
  const steps = lesson?.steps
  if (
    !lesson ||
    !Array.isArray(steps) ||
    !Number.isInteger(stepIndex) ||
    stepIndex < 0 ||
    stepIndex >= steps.length
  ) {
    return null
  }
  const step = steps[stepIndex]
  if (!step || typeof step.title !== 'string' || typeof step.text !== 'string') {
    return null
  }
  return {
    title: step.title,
    text: step.narrationText ?? step.text,
  }
}

export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: 'asc' },
    })
    res.json(lessons)
  } catch (error) {
    console.error('Get lessons error:', error)
    res.status(500).json({ message: 'Failed to fetch lessons' })
  }
}

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    })

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    res.json(lesson)
  } catch (error) {
    console.error('Get lesson error:', error)
    res.status(500).json({ message: 'Failed to fetch lesson' })
  }
}

const narrationCache = new Map<string, Buffer>()

export const getLessonNarration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const stepIndexRaw = req.query.stepIndex

    const stepIndex =
      typeof stepIndexRaw === 'string' ? Number.parseInt(stepIndexRaw, 10) : Number.NaN

    if (!Number.isInteger(stepIndex) || stepIndex < 0) {
      return res.status(400).json({ message: 'Invalid stepIndex' })
    }

    const step = getNarrationStep(id, stepIndex)

    if (!step) {
      return res.status(404).json({ message: 'Narration is not available for this step.' })
    }

    const cacheKey = `${id}:${stepIndex}`
    const cached = narrationCache.get(cacheKey)

    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg')
      res.setHeader('Content-Length', cached.byteLength.toString())
      return res.send(cached)
    }

    const textForSpeech = `Step ${stepIndex + 1}. ${step.title}. ${step.text}`

    const audioBuffer = await synthesizeLessonSpeech(textForSpeech)

    narrationCache.set(cacheKey, audioBuffer)

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audioBuffer.byteLength.toString())
    return res.send(audioBuffer)
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      console.error('Lesson narration ElevenLabs error:', error.message)
      return res
        .status(502)
        .json({ message: 'Failed to generate narration audio. Please try again later.' })
    }

    console.error('Lesson narration error:', error)
    return res
      .status(500)
      .json({ message: 'Failed to generate narration audio. Please try again later.' })
  }
}

