// src/features/services/components/cells/ActionsCell.tsx
import { Link } from '@tanstack/react-router';
import { Service } from '@/types/service.type';

interface Props {
  service: Service;
}

export const ActionsCell = ({ service }: Props) => {
  return (
    <div className="flex gap-2">
      <Link
        to="/services/$id"
        params={{ id: service.id }}
        className="text-blue-600 hover:underline"
      >
        Ver
      </Link>
      <Link
        to="/services/$id/edit"
        params={{ id: service.id }}
        className="text-green-600 hover:underline"
      >
        Editar
      </Link>
    </div>
  );
};