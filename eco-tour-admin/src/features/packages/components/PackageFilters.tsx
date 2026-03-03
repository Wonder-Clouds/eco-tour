import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { PackageFilters } from '../api/packagesApi'

interface Props {
  filters: PackageFilters
  onFiltersChange: (filters: PackageFilters) => void
}

export const PackageFiltersComponent = ({ filters, onFiltersChange }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<PackageFilters>(filters)

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value || undefined }
    onFiltersChange(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: PackageFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = !!(
    filters.reference_price_min !== undefined ||
    filters.reference_price_max !== undefined ||
    filters.total_duration_hours_min !== undefined ||
    filters.total_duration_hours_max !== undefined
  )

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y botón de filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
            hasActiveFilters 
              ? 'border-green-500 bg-green-50 text-green-700' 
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter size={18} />
          Filtros
          {hasActiveFilters && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Precio de Referencia mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Ref. Mínimo
              </label>
              <input
                type="number"
                value={localFilters.reference_price_min ?? ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  reference_price_min: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Precio de Referencia máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Ref. Máximo
              </label>
              <input
                type="number"
                value={localFilters.reference_price_max ?? ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  reference_price_max: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Sin límite"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Duración mínima (en horas) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración Mín. (horas)
              </label>
              <input
                type="number"
                value={localFilters.total_duration_hours_min ?? ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  total_duration_hours_min: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Duración máxima (en horas) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración Máx. (horas)
              </label>
              <input
                type="number"
                value={localFilters.total_duration_hours_max ?? ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  total_duration_hours_max: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Sin límite"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              <X size={16} />
              Limpiar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-white rounded-lg transition"
              style={{ backgroundColor: '#00bf35' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00932c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bf35'}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
