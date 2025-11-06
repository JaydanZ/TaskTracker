export interface User {
  id: string
  user_id: string
  password: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  status: string
  priority: string
  created_at: string
  completed_at: string
}
