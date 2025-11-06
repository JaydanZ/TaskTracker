import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editTsk')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editTsk"!</div>
}
