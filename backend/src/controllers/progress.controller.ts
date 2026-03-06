import { Response } from 'express'
import prisma from '../utils/db'
import { AuthRequest } from '../middleware/auth.middleware'

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.lessonProgress.findMany({
      where: { userId: req.userId },
      include: { lesson: true },
    })
    res.json(progress)
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ message: 'Failed to fetch progress' })
  }
}

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params
    const { completed, progress } = req.body

    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: req.userId!,
          lessonId,
        },
      },
      update: {
        completed: completed ?? undefined,
        progress: progress ?? undefined,
      },
      create: {
        userId: req.userId!,
        lessonId,
        completed: completed ?? false,
        progress: progress ?? 0,
      },
    })

    res.json(lessonProgress)
  } catch (error) {
    console.error('Update progress error:', error)
    res.status(500).json({ message: 'Failed to update progress' })
  }
}
