import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PersonsTable } from './PersonsTable'
import { PersonFiltersComponent } from './PersonFilters'
import { CreatePersonModal } from './CreatePersonModal'
import { EditPersonModal } from './EditPersonModal'
import { usePersonsSummary } from '../hooks/usePersonsSummary'
import { usePerson } from '../hooks/usePerson'
import { deletePerson, PersonFilters } from '../api/personsApi'
import { useQueryClient } from '@tanstack/react-query'

export const PersonsListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<PersonFilters>({})
  const { data, isLoading, error } = usePersonsSummary(filters)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null)

  const { data: editingPerson } = usePerson(editingPersonId || '', {
    enabled: !!editingPersonId,
  })

  const handleView = (personId: string) => {
    navigate({ to: '/persons/$id', params: { id: personId } })
  }

  const handleEdit = (personId: string) => {
    setEditingPersonId(personId)
  }

  const handleDelete = async (personId: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await deletePerson(personId)
        queryClient.invalidateQueries({ queryKey: ['persons'] })
        queryClient.invalidateQueries({ queryKey: ['persons-summary'] })
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
        alert('Error al eliminar el cliente')
      }
    }
  }

  const handleCloseEditModal = () => {
    setEditingPersonId(null)
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar clientes</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Clientes
          </h1>
          <p className="text-gray-600">Gestiona los clientes registrados</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
          style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00932c' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00bf35' }}
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="space-y-6">
        <PersonFiltersComponent filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ color: '#00932c' }}>Cargando clientes...</p>
          </div>
        ) : (
          <PersonsTable
            data={data || []}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <CreatePersonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingPerson && (
        <EditPersonModal
          isOpen={!!editingPersonId}
          onClose={handleCloseEditModal}
          person={editingPerson}
        />
      )}
    </div>
  )
}