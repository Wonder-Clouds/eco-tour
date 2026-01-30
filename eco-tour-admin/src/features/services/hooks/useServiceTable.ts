// src/features/services/hooks/useServiceTable.ts
import { useState, useMemo } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type FilterFn,
} from '@tanstack/react-table'
import { createServiceColumns } from '../components/columns/serviceColumns'
import { SummaryService } from '@/types/service.type'

// Función de filtro fuzzy
const fuzzyFilter: FilterFn<SummaryService> = (row, columnId, value) => {
  const itemValue = row.getValue(columnId)

  if (itemValue == null) return false

  const searchValue = String(value).toLowerCase()
  const cellValue = String(itemValue).toLowerCase()

  return cellValue.includes(searchValue)
}

interface UseServiceTableOptions {
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
}

export const useServiceTable = (data: SummaryService[], options: UseServiceTableOptions = {}) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => createServiceColumns({ onEdit: options.onEdit, onDelete: options.onDelete }),
    [options.onEdit, options.onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  })

  return {
    table,
    globalFilter,
    setGlobalFilter,
  }
}
