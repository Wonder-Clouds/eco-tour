import { createFileRoute } from '@tanstack/react-router'
import { GroupDetailPage } from '@/features/groups/components/GroupDetailPage'
export const Route = createFileRoute('/groups/$id')({
  component: GroupDetail,
})
function GroupDetail() {
  const { id } = Route.useParams()
  return <GroupDetailPage groupId={id} />
}
