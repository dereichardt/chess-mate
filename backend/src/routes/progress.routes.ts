import express from 'express'
import { getProgress, updateProgress } from '../controllers/progress.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', authMiddleware, getProgress)
router.post('/lesson/:lessonId', authMiddleware, updateProgress)

export default router
