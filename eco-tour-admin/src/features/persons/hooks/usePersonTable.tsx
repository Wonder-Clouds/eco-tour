import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { Country, SummaryPerson } from '../api/personsApi'
import { createPersonColumns } from '../components/columns/personColumns'

interface UsePersonTableOptions {
  onView?: (personId: string) => void
  onEdit?: (personId: string) => void
  onDelete?: (personId: string) => void
  countries?: Country[]
}

export const usePersonTable = (data: SummaryPerson[], options?: UsePersonTableOptions) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => createPersonColumns({
      onEdit: options?.onEdit,
      onDelete: options?.onDelete,
      countries: options?.countries,
    }),
    [options?.onEdit, options?.onDelete, options?.countries]
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
