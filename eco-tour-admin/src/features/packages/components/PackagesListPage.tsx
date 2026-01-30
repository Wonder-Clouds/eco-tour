import { useState } from 'react'
import { PackagesTable } from './PackagesTable'
import { usePackages } from '../hooks/usePackages'
import { usePackage } from '../hooks/usePackage'
import { Plus } from 'lucide-react'
import { CreatePackageModal } from './CreatePackageModal'
import { EditPackageModal } from './EditPackageModal'
import { PackageFiltersComponent } from './PackageFilters'
import { deletePackage, PackageFilters } from '../api/packagesApi'
import { useQueryClient } from '@tanstack/react-query'

export const PackagesListPage = () => {
  const [filters, setFilters] = useState<PackageFilters>({})
  const { data, isLoading, error } = usePackages(filters)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: editingPackage } = usePackage(editingPackageId || '', {
    enabled: !!editingPackageId,
  })

  const handleEdit = (packageId: string) => {
    setEditingPackageId(packageId)
  }

  const handleDelete = async (packageId: string) => {
    if (confirm('¿Estás seguro de eliminar este paquete? Esta acción no se puede deshacer.')) {
      try {
        await deletePackage(packageId)
        queryClient.invalidateQueries({ queryKey: ['packages'] })
      } catch (error) {
        console.error('Error al eliminar paquete:', error)
        alert('Error al eliminar el paquete')
      }
    }
  }

  const handleCloseEditModal = () => {
    setEditingPackageId(null)
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar paquetes</p>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#085f24' }}
          >
            Paquetes
          </h1>
          <p className="text-gray-600">
            Gestiona los paquetes de servicios
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
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
          Crear Paquete
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Filtros */}
        <PackageFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Tabla */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ color: '#00932c' }}>Cargando paquetes...</p>
          </div>
        ) : (
          <PackagesTable
            data={data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingPackage && (
        <EditPackageModal
          isOpen={!!editingPackageId}
          onClose={handleCloseEditModal}
          pkg={editingPackage}
        />
      )}
    </div>
  )
}
