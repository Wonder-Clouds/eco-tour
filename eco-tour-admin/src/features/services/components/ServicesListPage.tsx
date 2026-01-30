import { useState } from 'react';
import { ServicesTable } from '../components/ServicesTable';
import { useServices } from '../hooks/useServices';
import { useService } from '../hooks/useService';
import { Plus } from 'lucide-react';
import { CreateServiceModal } from './CreateServiceModal';
import { EditServiceModal } from './EditServiceModal';
import { deleteService } from '../api/servicesApi';
import { useQueryClient } from '@tanstack/react-query';

export const ServicesListPage = () => {
  const { data, isLoading, error } = useServices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p style={{ color: '#00932c' }}>Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar servicios</p>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <ServicesTable
          data={data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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