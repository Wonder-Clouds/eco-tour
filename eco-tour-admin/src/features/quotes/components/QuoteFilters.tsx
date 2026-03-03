import { QuoteFilters, QuoteStatus } from '@/types/quote.type'
import { Input } from '@/components/ui/input'
import { Search, X, Filter } from 'lucide-react'

interface Props {
  filters: QuoteFilters
  onFiltersChange: (filters: QuoteFilters) => void
}

const statusOptions: { value: QuoteStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'draft', label: 'Borrador' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
]

export const QuoteFiltersComponent = ({ filters, onFiltersChange }: Props) => {
  const hasActiveFilters = filters.search || filters.status || filters.is_active !== undefined

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} style={{ color: '#00932c' }} />
        <span className="font-medium" style={{ color: '#085f24' }}>
          Filtros
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-gray-100 transition"
            style={{ color: '#dc2626' }}
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Buscar por contacto..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Estado */}
        <select
          value={filters.status || ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as QuoteStatus | undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Fecha desde */}
        <div>
          <Input
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => onFiltersChange({ ...filters, date_from: e.target.value })}
            placeholder="Desde"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <Input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => onFiltersChange({ ...filters, date_to: e.target.value })}
            placeholder="Hasta"
          />
        </div>
      </div>

      {/* Filtro de activas */}
      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.is_active === true}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                is_active: e.target.checked ? true : undefined,
              })
            }
            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">Solo cotizaciones activas</span>
        </label>
      </div>
    </div>
  )
}

