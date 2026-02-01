import { createFileRoute } from '@tanstack/react-router'
import { PersonsListPage } from '@/features/persons/components/PersonsListPage'

export const Route = createFileRoute('/persons/')({
  component: PersonsListPage,
})
