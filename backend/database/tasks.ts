import { supabase } from './supabase'
import { Task, CreateTaskInput, UpdateTaskInput } from '../types'

export const createTask = async (
  user_Id: string,
  taskData: CreateTaskInput
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        user_id: user_Id,
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium'
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
