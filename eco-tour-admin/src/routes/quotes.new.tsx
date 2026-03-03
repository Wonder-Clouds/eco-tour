import { createFileRoute } from '@tanstack/react-router'
import { QuoteCreatePage } from '@/features/quotes/components/QuoteCreatePage'

export const Route = createFileRoute('/quotes/new')({
  component: QuoteCreatePage,
})
