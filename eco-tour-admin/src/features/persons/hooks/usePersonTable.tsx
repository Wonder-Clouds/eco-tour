import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import { Country, SummaryPerson } from '../api/personsApi'
import { getCountryLabel } from './useCountries'

interface UsePersonTableOptions {
  onView?: (personId: string) => void
  onEdit?: (personId: string) => void
  onDelete?: (personId: string) => void
  countries?: Country[]
}

export const usePersonTable = (data: SummaryPerson[], options?: UsePersonTableOptions) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<SummaryPerson>[]>(
    () => [
      {
        accessorKey: 'first_name',
        header: 'Nombre',
        cell: ({ row }) => {
          const initials = `${row.original.first_name.charAt(0)}${row.original.last_name.charAt(0)}`.toUpperCase()
          return (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: '#00bf35' }}
              >
                {initials}
              </div>
              <span className="font-medium text-black">
                {row.original.first_name} {row.original.last_name}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'phone_number',
        header: 'Teléfono',
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'nationality',
        header: 'Nacionalidad',
        cell: ({ getValue }) => {
          const code = getValue() as string
          return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {getCountryLabel(options?.countries, code)}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => options?.onView?.(row.original.id)}
              className="p-2 rounded-lg transition hover:bg-gray-100"
              title="Ver detalle"
            >
              <Eye size={16} style={{ color: '#00932c' }} />
            </button>
            <button
              onClick={() => options?.onEdit?.(row.original.id)}
              className="p-2 rounded-lg transition hover:bg-gray-100"
              title="Editar"
            >
              <Edit2 size={16} style={{ color: '#f59e0b' }} />
            </button>
            <button
              onClick={() => options?.onDelete?.(row.original.id)}
              className="p-2 rounded-lg transition hover:bg-gray-100"
              title="Eliminar"
            >
              <Trash2 size={16} style={{ color: '#dc2626' }} />
            </button>
          </div>
        ),
      },
    ],
    [options]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return { table }
}
