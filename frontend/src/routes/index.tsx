import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from 'hooks/useAuth'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const auth = useAuth()

  return (
    <>
      {auth.isAuthenticated ? (
        <Navigate to="/tasks" />
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}
