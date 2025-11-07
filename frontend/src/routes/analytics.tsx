import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from 'hooks/useAuth'

export const Route = createFileRoute('/analytics')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  }
})

function RouteComponent() {
  const auth = useAuth()
  return <div className="text-white">Hello "/analytics"!</div>
}
