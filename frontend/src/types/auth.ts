export interface User {
  id: string
  user_id: string
}

export interface UserCredentials {
  user_id: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
