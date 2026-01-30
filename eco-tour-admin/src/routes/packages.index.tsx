import { createFileRoute } from '@tanstack/react-router'
import { PackagesListPage } from '@/features/packages/components/PackagesListPage'

export const Route = createFileRoute('/packages/')({
  component: PackagesListPage,
})

