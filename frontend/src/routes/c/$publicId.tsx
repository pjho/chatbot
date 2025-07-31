import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/c/$publicId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/c/$publicId"!</div>
}
