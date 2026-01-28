// src/features/services/pages/ServicesListPage.tsx
// import { useServices } from '../hooks/useServices';
import { ServicesTable } from '../components/ServicesTable';
import { Link } from '@tanstack/react-router';
import { useServices } from '../hooks/useServices';

export const ServicesListPage = () => {
  const { data, isLoading, error } = useServices();

  // if (isLoading) return <div>Cargando servicios...</div>;
  // if (error) return <div>Error al cargar servicios</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <Link
          to='.'
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear Servicio
        </Link>
      </div>

      <ServicesTable data={data || []} />
    </div>
  );
};