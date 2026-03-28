import { createFileRoute } from '@tanstack/react-router'
import { GroupsListPage } from '@/features/groups/components/GroupsListPage'
export const Route = createFileRoute('/groups/')({
  component: GroupsList,
})
function GroupsList() {
  return <GroupsListPage />
}
