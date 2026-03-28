import { createColumnHelper } from '@tanstack/react-table'
import { SummaryPerson, Country } from '../../api/personsApi'
import { ActionsCell } from '../cells/ActionsCell'
import { AvatarCell } from '../cells/AvatarCell'
import { NationalityCell } from '../cells/NationalityCell'

const columnHelper = createColumnHelper<SummaryPerson>()

interface ColumnOptions {
  onEdit?: (personId: string) => void
  onDelete?: (personId: string) => void
  countries?: Country[]
}

export const createPersonColumns = (options?: ColumnOptions) => [
  columnHelper.accessor('first_name', {
    header: 'Nombre',
    cell: ({ row }) => <AvatarCell person={row.original} />,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue()}</span>
    ),
  }),
  columnHelper.accessor('phone_number', {
    header: 'Teléfono',
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue()}</span>
    ),
  }),
  columnHelper.accessor('nationality', {
    header: 'Nacionalidad',
    cell: ({ getValue }) => (
      <NationalityCell code={getValue()} countries={options?.countries} />
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <ActionsCell
        person={row.original}
        onEdit={options?.onEdit}
        onDelete={options?.onDelete}
      />
    ),
  }),
]
