import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../utils/db'
import { generateToken } from '../utils/jwt'
import { AuthRequest } from '../middleware/auth.middleware'

/** Comma-separated emails that get isPro: true for testing (no payment). Leave empty in production. */
function getProTestEmails(): Set<string> {
  const raw = process.env.PRO_TEST_EMAILS ?? ''
  return new Set(raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean))
}

function isProForTesting(email: string): boolean {
  return getProTestEmails().has(email.trim().toLowerCase())
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        rating: true,
        createdAt: true,
      },
    })

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    res.status(201).json({
      user: { ...user, isPro: isProForTesting(user.email) },
      token,
    })
  } catch (error: any) {
    console.error('Register error:', error)
    const isDev = process.env.NODE_ENV !== 'production'
    const message = isDev && error?.message ? error.message : 'Registration failed'
    res.status(500).json({ message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email or username (frontend sends as "email" field)
    const isEmail = typeof email === 'string' && email.includes('@')
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: email.trim() } : { username: String(email).trim() },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        rating: user.rating,
        createdAt: user.createdAt,
        isPro: isProForTesting(user.email),
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        rating: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ ...user, isPro: isProForTesting(user.email) })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
}
