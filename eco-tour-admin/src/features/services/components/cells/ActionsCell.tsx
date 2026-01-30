import { Link } from '@tanstack/react-router';
import { SummaryService } from '@/types/service.type';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  service: SummaryService;
}

export const ActionsCell = ({ service }: Props) => {
  return (
    <div className="flex gap-2">
      <Link
        to="/services/$id"
        params={{ id: service.id }}
        className="p-2 rounded-lg transition hover:bg-gray-100"
        style={{ color: '#00932c' }}
        title="Ver"
      >
        <Eye size={18} />
      </Link>
      <Link
        to="."
        className="p-2 rounded-lg transition hover:bg-gray-100"
        style={{ color: '#eab308' }}
        title="Editar"
      >
        <Pencil size={18} />
      </Link>
      <button
        className="p-2 rounded-lg transition hover:bg-red-50"
        style={{ color: '#dc2626' }}
        title="Eliminar"
        onClick={() => console.log('Eliminar', service.id)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};