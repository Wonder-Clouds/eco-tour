import { useState } from 'react'
import { useQuotes } from '../hooks/useQuotes'
import { useDeleteQuote } from '../hooks/useQuoteMutations'
import { createVersion } from '../api/quotesApi'
import { QuotesTable } from './QuotesTable'
import { QuoteFiltersComponent } from './QuoteFilters'
import { QuoteFilters } from '@/types/quote.type'
import { Plus, FileText, Loader2 } from 'lucide-react'

export const QuotesListPage = () => {
  const [filters, setFilters] = useState<QuoteFilters>({})
  const { data: quotes = [], isLoading, error, refetch } = useQuotes(filters)
  const deleteQuoteMutation = useDeleteQuote()
  const [duplicating, setDuplicating] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.')) {
      try {
        await deleteQuoteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Error al eliminar cotización:', error)
        alert('Error al eliminar la cotización')
      }
    }
  }

  const handleEdit = (id: string) => {
    window.location.href = `/quotes/${id}/edit`
  }

  const handleDuplicate = async (id: string) => {
    if (!confirm('¿Deseas crear una copia de esta cotización? Se creará una nueva versión con todos los datos.')) {
      return
    }

    setDuplicating(id)
    try {
      // Usar el endpoint create-version del backend
      const newQuote = await createVersion(id, {})
      await refetch()

      // Redirigir a la nueva versión creada
      if (newQuote?.id) {
        window.location.href = `/quotes/${newQuote.id}`
      }
    } catch (error) {
      console.error('Error al duplicar cotización:', error)
      alert('Error al duplicar la cotización')
    } finally {
      setDuplicating(null)
    }
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar cotizaciones</p>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#085f24' }}>
            Cotizaciones
          </h1>
          <p className="text-gray-600">
            Gestiona las cotizaciones de tus clientes
          </p>
        </div>
        <a
          href="/quotes/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
          style={{
            backgroundColor: '#00bf35',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00932c'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#00bf35'
          }}
        >
          <Plus size={20} />
          Nueva Cotización
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#edfff2' }}>
              <FileText size={20} style={{ color: '#00932c' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold" style={{ color: '#085f24' }}>
                {isLoading ? '-' : quotes.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <FileText size={20} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Borradores</p>
              <p className="text-xl font-bold text-gray-700">
                {isLoading ? '-' : quotes.filter((q) => q.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <FileText size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">
                {isLoading ? '-' : quotes.filter((q) => q.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#edfff2' }}>
              <FileText size={20} style={{ color: '#00932c' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aprobadas</p>
              <p className="text-xl font-bold" style={{ color: '#00932c' }}>
                {isLoading ? '-' : quotes.filter((q) => q.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <QuoteFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Tabla */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
          <span style={{ color: '#00932c' }}>Cargando cotizaciones...</span>
        </div>
      ) : (
        <QuotesTable
          quotes={quotes}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          duplicatingId={duplicating}
        />
      )}
    </div>
  )
}

