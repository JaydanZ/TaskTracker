import { supabase } from './supabase'
import { Task, CreateTaskInput, UpdateTaskInput, TaskStats } from '../types'

export const createTask = async (
  user_Id: string,
  taskData: CreateTaskInput
): Promise<Task> => {
  const createdDate = new Date().toISOString()
  let completedDate

  if (taskData.status === 'done') {
    completedDate = new Date().toISOString()
  }
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        user_id: user_Id,
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        created_at: createdDate,
        completed_at: completedDate
      }
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const getTasksByUserId = async (user_Id: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user_Id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export const getTaskById = async (
  taskId: string,
  user_Id: string
): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', user_Id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data
}

export const updateTask = async (
  taskId: string,
  user_Id: string,
  updates: UpdateTaskInput
): Promise<Task> => {
  if (updates.status === 'done' && !updates.completed_at) {
    updates.completed_at = new Date().toISOString()
  }

  if (updates.status && updates.status !== 'done') {
    updates.completed_at = null
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', user_Id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const deleteTask = async (
  taskId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export const getTaskStats = async (userId: string): Promise<TaskStats> => {
  // Get all tasks for the user
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  const allTasks = tasks || []

  // Calculate stats
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter((t) => t.status === 'done').length
  const pendingTasks = allTasks.filter((t) => t.status !== 'done').length
  const todoTasks = allTasks.filter((t) => t.status === 'todo').length
  const inProgressTasks = allTasks.filter(
    (t) => t.status === 'in-progress'
  ).length

  const completedTasksWithTime = allTasks.filter(
    (t) => t.status === 'done' && t.completed_at
  )

  let averageCompletionTime = 0
  if (completedTasksWithTime.length > 0) {
    const totalTime = completedTasksWithTime.reduce((sum, task) => {
      const createdDate = new Date(task.created_at)
      const completedDate = new Date(task.completed_at!)
      const diffInMs = completedDate.getTime() - createdDate.getTime()
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
      return sum + diffInDays
    }, 0)
    averageCompletionTime = totalTime / completedTasksWithTime.length
  }

  // Priority breakdown
  const priorityBreakdown = {
    high: allTasks.filter((t) => t.priority === 'high').length,
    medium: allTasks.filter((t) => t.priority === 'medium').length,
    low: allTasks.filter((t) => t.priority === 'low').length
  }

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    todoTasks,
    inProgressTasks,
    averageCompletionTime,
    completedTasksCount: completedTasksWithTime.length,
    priorityBreakdown
  }
}
