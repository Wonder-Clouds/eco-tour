import { createFileRoute } from '@tanstack/react-router'
import { PackageDetailPage } from '@/features/packages/components/PackageDetailPage'

export const Route = createFileRoute('/packages/$id')({
  component: PackageDetail,
})

function PackageDetail() {
  const { id } = Route.useParams()
  return <PackageDetailPage packageId={id} />
}
