import { Link } from '@tanstack/react-router'
import { SummaryPerson } from '../../api/personsApi'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface Props {
  person: SummaryPerson
  onEdit?: (personId: string) => void
  onDelete?: (personId: string) => void
}

export const ActionsCell = ({ person, onEdit, onDelete }: Props) => {
  return (
    <div className="flex gap-2">
      <Link
        to="/persons/$id"
        params={{ id: person.id }}
        className="p-2 rounded-lg transition hover:bg-gray-100"
        style={{ color: '#00932c' }}
        title="Ver"
      >
        <Eye size={18} />
      </Link>
      <button
        onClick={() => onEdit?.(person.id)}
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
        onClick={() => onDelete?.(person.id)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}
