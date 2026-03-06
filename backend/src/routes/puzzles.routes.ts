import express from 'express'
import { getPuzzles, getPuzzleById } from '../controllers/puzzles.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', getPuzzles)
router.get('/:id', getPuzzleById)

export default router
