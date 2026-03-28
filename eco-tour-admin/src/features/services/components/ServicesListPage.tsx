import { useState } from 'react';
import { ServicesTable } from '../components/ServicesTable';
import { useServices } from '../hooks/useServices';
import { useService } from '../hooks/useService';
import { Plus, Tag } from 'lucide-react';
import { CreateServiceModal } from './CreateServiceModal';
import { EditServiceModal } from './EditServiceModal';
import { TagsManagerModal } from './TagsManagerModal';
import { ServiceFiltersComponent } from './ServiceFilters';
import { deleteService, ServiceFilters } from '../api/servicesApi';
import { useQueryClient } from '@tanstack/react-query';

export const ServicesListPage = () => {
  const [filters, setFilters] = useState<ServiceFilters>({});
  const { data, isLoading, error } = useServices(filters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Cargar el servicio completo cuando se quiere editar
  const { data: editingService } = useService(editingServiceId || '', {
    enabled: !!editingServiceId,
  });

  const handleEdit = (serviceId: string) => {
    setEditingServiceId(serviceId);
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      try {
        await deleteService(serviceId);
        queryClient.invalidateQueries({ queryKey: ['services'] });
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        alert('Error al eliminar el servicio');
      }
    }
  };

  const handleCloseEditModal = () => {
    setEditingServiceId(null);
  };

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar servicios</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#085f24' }}
          >
            Servicios
          </h1>
          <p className="text-gray-600">
            Gestiona los servicios disponibles
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsTagsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium border"
            style={{
              borderColor: '#00bf35',
              color: '#00932c',
              backgroundColor: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#edfff2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            <Tag size={20} />
            Etiquetas
          </button>
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
            Crear Servicio
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtros */}
        <ServiceFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Tabla */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p style={{ color: '#00932c' }}>Cargando servicios...</p>
          </div>
        ) : (
          <ServicesTable
            data={data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TagsManagerModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
      />

      {editingService && (
        <EditServiceModal
          isOpen={!!editingServiceId}
          onClose={handleCloseEditModal}
          service={editingService}
        />
      )}
    </div>
  );
};