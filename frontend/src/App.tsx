import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from 'routeTree.gen'
import { AuthProvider, useAuth } from 'hooks/useAuth'
import { AuthContextType } from './hooks/useAuth'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface RouterContext {
    auth: AuthContextType
  }
}

const router = createRouter({
  routeTree,
  context: { auth: undefined! as AuthContextType }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function InnerApp() {
  const auth = useAuth()

  return <RouterProvider router={router} context={{ auth }} />
}

export default App
