import { createFileRoute } from '@tanstack/react-router'
import { PersonDetailPage } from '@/features/persons/components/PersonDetailPage'

export const Route = createFileRoute('/persons/$id')({
  component: PersonDetail,
})

function PersonDetail() {
  const { id } = Route.useParams()
  return <PersonDetailPage personId={id} />
}
