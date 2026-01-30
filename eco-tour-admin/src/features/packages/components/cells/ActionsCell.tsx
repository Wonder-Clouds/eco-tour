import { Link } from '@tanstack/react-router'
import { PackageSummary } from '@/types/package.type'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface Props {
  pkg: PackageSummary
  onEdit?: (packageId: string) => void
  onDelete?: (packageId: string) => void
}

export const ActionsCell = ({ pkg, onEdit, onDelete }: Props) => {
  return (
    <div className="flex gap-2">
      <Link
        to="/packages/$id"
        params={{ id: pkg.id }}
        className="p-2 rounded-lg transition hover:bg-gray-100"
        style={{ color: '#00932c' }}
        title="Ver"
      >
        <Eye size={18} />
      </Link>
      <button
        onClick={() => onEdit?.(pkg.id)}
        className="p-2 rounded-lg transition hover:bg-gray-100"
        style={{ color: '#eab308' }}
        title="Editar"
      >
        <Pencil size={18} />
      </button>
      <button
        className="p-2 rounded-lg transition hover:bg-red-50"
        style={{ color: '#dc2626' }}
        title="Eliminar"
        onClick={() => onDelete?.(pkg.id)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}
