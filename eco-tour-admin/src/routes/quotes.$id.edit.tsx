import { createFileRoute } from '@tanstack/react-router'
import { QuoteEditPage } from '@/features/quotes/components/QuoteEditPage'

export const Route = createFileRoute('/quotes/$id/edit')({
  component: QuoteEdit,
})

function QuoteEdit() {
  const { id } = Route.useParams()
  return <QuoteEditPage quoteId={id} />
}
