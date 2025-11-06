import { UserCredentials, AuthResponse } from 'types/auth'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (includeAuth) {
    const token = sessionStorage.getItem('authToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

export const loginUser = async (credentials: UserCredentials) => {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    })
    return response.json()
  } catch (error) {
    console.error(error)
  }
}

export const signupUser = async (credentials: UserCredentials) => {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    })
    return response.json()
  } catch (error) {
    console.error(error)
  }
}

export const logoutUser = async () => {
  try {
    await fetch(`${BACKEND_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(true)
    })
  } catch (error) {
    console.error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/me`, {
      headers: getHeaders(true)
    })
    return response.json()
  } catch (error) {
    console.error(error)
  }
}
