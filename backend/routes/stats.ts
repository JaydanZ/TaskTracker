import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from './auth'
import { getTaskStats } from '../database/tasks'

const router = Router()

router.use(authMiddleware)

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getTaskStats(req.userId!)
    res.json(stats)
  } catch (error) {
    console.error('Get task stats error:', error)
    res.status(500).json({ error: 'Failed to fetch task statistics' })
  }
})

export default router
