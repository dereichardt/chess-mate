import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import lessonsRoutes from './routes/lessons.routes'
import puzzlesRoutes from './routes/puzzles.routes'
import progressRoutes from './routes/progress.routes'
import { errorMiddleware } from './middleware/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/puzzles', puzzlesRoutes)
app.use('/api/progress', progressRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chess-Mate API is running' })
})

// Error handling
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
