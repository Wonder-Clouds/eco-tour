import { ServicesTable } from '../components/ServicesTable';
import { Link } from '@tanstack/react-router';
import { useServices } from '../hooks/useServices';
import { Plus } from 'lucide-react';

export const ServicesListPage = () => {
  const { data, isLoading, error } = useServices();

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
        <Link
          to='.'
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
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ServicesTable data={data || []} />
      </div>
    </div>
  );
};