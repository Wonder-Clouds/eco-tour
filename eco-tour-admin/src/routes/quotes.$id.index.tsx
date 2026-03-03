import { createFileRoute } from '@tanstack/react-router'
import { QuoteDetailPage } from '@/features/quotes/components/QuoteDetailPage'
export const Route = createFileRoute('/quotes/$id/')({
  component: QuoteDetail,
})
function QuoteDetail() {
  const { id } = Route.useParams()
  return <QuoteDetailPage quoteId={id} />
}
