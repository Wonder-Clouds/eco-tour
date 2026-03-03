import { createFileRoute } from '@tanstack/react-router'
import { CreateGroupPage } from '@/features/groups/components/CreateGroupPage'
export const Route = createFileRoute('/groups/new')({
  component: CreateGroup,
})
function CreateGroup() {
  return <CreateGroupPage />
}
