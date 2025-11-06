import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, findUserById } from '../database/users'
import { hashPassword, comparePassword } from '../utils/passwordUtils'
import { generateToken } from '../utils/jwt'
import { config } from '../config'

export interface AuthRequest extends Request {
  userId?: string
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer', '')

    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' })
  }
}

const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await findUserById(req.userId!)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({
      id: user.id,
      user_id: user.user_id
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body

    // Validation
    if (!user_id || !password) {
      res.status(400).json({ error: 'All fields are required' })
      return
    }

    const user = await findUserById(user_id)
    if (!user) {
      res.status(401).json({ error: 'Invalid Credentials' })
      return
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid Credentials' })
      return
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      user: {
        id: user.id,
        user_id: user.user_id
      },
      token
    })
  } catch (error) {
    console.error('Login error: ', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { user_id, password } = req.body

    // Validation
    if (!user_id || !password) {
      res.status(400).json({ error: 'All fields are required' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    // Check if user exists
    const existingUser = await findUserById(user_id)
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
      return
    }

    // Create user
    const hashedPassword = await hashPassword(password)
    const user = await createUser({
      user_id,
      password: hashedPassword
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      user: {
        id: user.id,
        user_id: user.user_id
      },
      token
    })
  } catch (error) {
    console.error('Signup error: ', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

router.get('/me', authMiddleware, getCurrentUser)

export default router
