import { Request, Response } from 'express'
import prisma from '../utils/db'

export const getPuzzles = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query
    const where = difficulty ? { difficulty } : {}
    
    const puzzles = await prisma.puzzle.findMany({
      where,
      take: 20,
    })
    
    res.json(puzzles)
  } catch (error) {
    console.error('Get puzzles error:', error)
    res.status(500).json({ message: 'Failed to fetch puzzles' })
  }
}

export const getPuzzleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const puzzle = await prisma.puzzle.findUnique({
      where: { id },
    })

    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' })
    }

    res.json(puzzle)
  } catch (error) {
    console.error('Get puzzle error:', error)
    res.status(500).json({ message: 'Failed to fetch puzzle' })
  }
}
