import { useState, useMemo } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { createPackageColumns } from '../components/columns/packageColumns'
import { PackageSummary } from '@/types/package.type'

interface UsePackageTableOptions {
  onEdit?: (packageId: string) => void
  onDelete?: (packageId: string) => void
}

export const usePackageTable = (data: PackageSummary[], options: UsePackageTableOptions = {}) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => createPackageColumns({ onEdit: options.onEdit, onDelete: options.onDelete }),
    [options.onEdit, options.onDelete]
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  })

  return { table }
}
