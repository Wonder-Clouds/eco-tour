import { createFileRoute } from '@tanstack/react-router'
import { QuotePublicPage } from '@/features/quotes/components/QuotePublicPage'
export const Route = createFileRoute('/quotes/public/$id')({
  component: QuotePublic,
})
function QuotePublic() {
  const { id } = Route.useParams()
  return <QuotePublicPage quoteId={id} />
}
