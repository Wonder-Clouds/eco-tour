import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { ActionsCell } from '../cells/ActionsCell'
import { PackageSummary } from '@/types/package.type'
import { Package as PackageIcon } from 'lucide-react'

const columnHelper = createColumnHelper<PackageSummary>()

// Componente para mostrar icono del paquete
const PackageIconCell = () => {
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: '#edfff2' }}
    >
      <PackageIcon size={20} style={{ color: '#00932c' }} />
    </div>
  )
}

// Función para formatear el precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price)
}

// Función para limpiar HTML y obtener texto plano
const stripHtml = (html: string) => {
  if (!html) return ''
  // Crear un elemento temporal para extraer el texto
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

interface PackageColumnsOptions {
  onEdit?: (packageId: string) => void
  onDelete?: (packageId: string) => void
}

export const createPackageColumns = (options: PackageColumnsOptions = {}): ColumnDef<PackageSummary, any>[] => [
  columnHelper.display({
    id: 'icon',
    header: '',
    cell: () => <PackageIconCell />,
  }),
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => (
      <span className="font-medium" style={{ color: '#000000' }}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Descripción',
    cell: (info) => (
      <span className="text-gray-600 text-sm line-clamp-2 max-w-xs">
        {stripHtml(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('services_count', {
    header: 'Servicios',
    cell: (info) => (
      <span
        className="px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#edfff2', color: '#00932c' }}
      >
        {info.getValue()} servicio{info.getValue() !== 1 ? 's' : ''}
      </span>
    ),
  }),
  columnHelper.accessor('total_duration', {
    header: 'Duración',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Precio',
    cell: (info) => (
      <span className="font-bold" style={{ color: '#000000' }}>
        {formatPrice(info.getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: (info) => (
      <ActionsCell
        pkg={info.row.original}
        onEdit={options.onEdit}
        onDelete={options.onDelete}
      />
    ),
  }),
]
