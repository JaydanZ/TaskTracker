export interface User {
  userid: string
}

export interface UserCredentials {
  userid: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
