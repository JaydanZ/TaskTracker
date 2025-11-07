import { Task, CreateTaskInput, UpdateTaskInput } from 'types/task'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer${token}` : ''
  }
}

export const taskAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${BACKEND_URL}/tasks`, {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }

    return response.json()
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch task')
    }

    return response.json()
  },

  createTask: async (taskData: CreateTaskInput): Promise<Task> => {
    const response = await fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create task')
    }

    return response.json()
  },

  updateTask: async (id: string, updates: UpdateTaskInput): Promise<Task> => {
    const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update task')
    }

    return response.json()
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete task')
    }
  }
}
