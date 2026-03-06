import express from 'express'
import { getLessons, getLessonById, getLessonNarration } from '../controllers/lessons.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', getLessons)
router.get('/:id', getLessonById)
router.get('/:id/narration', getLessonNarration)

export default router
