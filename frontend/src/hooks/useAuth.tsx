import { createContext, useContext, ReactNode } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient
} from '@tanstack/react-query'
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser
} from 'utils/authAPI'
import { User, UserCredentials } from 'types/auth'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: UserCredentials) => Promise<void>
  signup: (credentials: UserCredentials) => Promise<void>
  logout: () => Promise<void>
  error: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = sessionStorage.getItem('authToken')
      if (!token) return null
      try {
        return await getCurrentUser()
      } catch (error) {
        sessionStorage.removeItem('authToken')
        return null
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      sessionStorage.setItem('authToken', data.token)
      queryClient.setQueryData(['currentUser'], data.user)
    }
  })

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      sessionStorage.setItem('authToken', data.token)
      queryClient.setQueryData(['currentUser'], data.user)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem('authToken')
      queryClient.setQueryData(['currentUser'], null)
      queryClient.clear()
    }
  })

  const login = async (credentials: UserCredentials) => {
    await loginMutation.mutateAsync(credentials)
  }

  const signup = async (credentials: UserCredentials) => {
    await signupMutation.mutateAsync(credentials)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
