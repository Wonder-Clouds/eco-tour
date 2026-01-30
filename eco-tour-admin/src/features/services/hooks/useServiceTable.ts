// src/features/services/hooks/useServiceTable.ts
import { useState } from 'react'
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
import { serviceColumns } from '../components/columns/serviceColumns'
import { SummaryService } from '@/types/service.type'

// Función de filtro fuzzy
const fuzzyFilter: FilterFn<SummaryService> = (row, columnId, value) => {
  const itemValue = row.getValue(columnId)

  if (itemValue == null) return false

  const searchValue = String(value).toLowerCase()
  const cellValue = String(itemValue).toLowerCase()

  return cellValue.includes(searchValue)
}

export const useServiceTable = (data: SummaryService[]) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns: serviceColumns,
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
      fuzzy: fuzzyFilter, // 👈 Agrega el filtro fuzzy
    },
    globalFilterFn: fuzzyFilter, // 👈 Usa fuzzy para el filtro global
  })

  return {
    table,
    globalFilter,
    setGlobalFilter,
  }
}
