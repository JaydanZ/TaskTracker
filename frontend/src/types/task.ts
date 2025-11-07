export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  created_at: string
  completed_at: string
}

export interface CreateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}

export interface TaskStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  todoTasks: number
  inProgressTasks: number
  averageCompletionTime: number
  completedTasksCount: number
  priorityBreakdown: {
    high: number
    medium: number
    low: number
  }
}
