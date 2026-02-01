import { useState, useEffect } from 'react'
import { PersonFilters } from '../api/personsApi'
import { useCountries } from '../hooks/useCountries'
import { Search, X } from 'lucide-react'

interface Props {
  filters: PersonFilters
  onFiltersChange: (filters: PersonFilters) => void
}

export const PersonFiltersComponent = ({ filters, onFiltersChange }: Props) => {
  const { data: countries } = useCountries()
  const [search, setSearch] = useState(filters.q || '')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        q: search || undefined,
        nationality: filters.nationality,
      })
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [search, filters.nationality])

  const handleNationalityChange = (nationality: string) => {
    onFiltersChange({
      q: search || undefined,
      nationality: nationality || undefined,
    })
  }

  const clearFilters = () => {
    setSearch('')
    onFiltersChange({})
  }

  const hasFilters = search || filters.nationality

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Búsqueda */}
      <div className="flex-1 min-w-[300px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, apellido, email, teléfono..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Nacionalidad */}
      <div className="min-w-[200px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nacionalidad
        </label>
        <select
          value={filters.nationality || ''}
          onChange={(e) => handleNationalityChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500 focus:border-transparent"
        >
          <option value="">Todas</option>
          {countries?.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      {/* Limpiar filtros */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          <X size={16} />
          Limpiar
        </button>
      )}
    </div>
  )
}
