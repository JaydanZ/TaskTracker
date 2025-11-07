import { Router, Response } from 'express'
import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask
} from '../database/tasks'
import { authMiddleware, AuthRequest } from './auth'
import { CreateTaskInput, UpdateTaskInput } from '../types'

const router = Router()

router.use(authMiddleware)

router.post('/tasks', async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority }: CreateTaskInput = req.body

    if (!title || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    const task = await createTask(req.userId!, {
      title: title.trim(),
      description: description?.trim(),
      status,
      priority
    })

    res.status(201).json(task)
  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

router.get('/tasks', async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await getTasksByUserId(req.userId!)
    res.json(tasks)
  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

router.get('/tasks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const task = await getTaskById(id, req.userId!)

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)
  } catch (error) {
    console.error('Get task error:', error)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
})

router.put('/tasks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const updates: UpdateTaskInput = req.body

    const existingTask = await getTaskById(id, req.userId!)
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const task = await updateTask(id, req.userId!, updates)
    res.json(task)
  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

router.delete('/tasks/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // Check if task exists and belongs to user
    const existingTask = await getTaskById(id, req.userId!)
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    await deleteTask(id, req.userId!)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
