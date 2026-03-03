import { createFileRoute } from '@tanstack/react-router'
import { QuotesListPage } from '@/features/quotes/components/QuotesListPage'

export const Route = createFileRoute('/quotes/')({
  component: QuotesListPage,
})
