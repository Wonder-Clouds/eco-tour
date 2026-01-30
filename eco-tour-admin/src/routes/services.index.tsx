import { createFileRoute } from '@tanstack/react-router'
import { ServicesListPage } from '@/features/services/components/ServicesListPage'

export const Route = createFileRoute('/services/')({
  component: ServicesListPage,
})
