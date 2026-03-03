import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/quotes/$id')({
  component: QuoteLayout,
})

function QuoteLayout() {
  return <Outlet />
}
