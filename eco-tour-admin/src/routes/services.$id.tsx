import { createFileRoute } from '@tanstack/react-router'
import { ServiceDetailPage } from '@/features/services/components/ServiceDetailPage'

export const Route = createFileRoute('/services/$id')({
  component: ServiceDetail,
})

function ServiceDetail() {
  const { id } = Route.useParams()
  return <ServiceDetailPage serviceId={id} />
}
