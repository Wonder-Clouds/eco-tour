import { ServicesListPage } from '@/features/services/components/ServicesListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <ServicesListPage />
    </div>
  )
}
