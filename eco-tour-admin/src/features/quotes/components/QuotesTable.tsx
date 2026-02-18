import { QuoteSummary, QuoteStatus } from '@/types/quote.type'
import {
  Eye,
  Copy,
  Trash2,
  Users,
  Package,
  Calendar,
  DollarSign,
} from 'lucide-react'

interface Props {
  quotes: QuoteSummary[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

const getStatusStyles = (status: QuoteStatus) => {
  const styles: Record<QuoteStatus, { bg: string; text: string; border: string; label: string }> = {
    draft: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db', label: 'Borrador' },
    pending: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d', label: 'Pendiente' },
    approved: { bg: '#edfff2', text: '#00932c', border: '#00bf35', label: 'Aprobado' },
    rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Rechazado' },
  }
  return styles[status] || styles.draft
}

const formatPrice = (price: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(price))
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const QuotesTable = ({ quotes, onDelete, onDuplicate }: Props) => {
  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Package size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg">No se encontraron cotizaciones</p>
        <p className="text-gray-400 text-sm mt-2">
          Crea tu primera cotización para empezar
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200" style={{ backgroundColor: '#f9fafb' }}>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Personas
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Servicios
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Válido hasta
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Creado
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((quote) => {
              const statusStyles = getStatusStyles(quote.status)
              return (
                <tr
                  key={quote.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {quote.contact_info}
                      </span>
                      {!quote.is_active && (
                        <span className="text-xs text-gray-400 mt-1">
                          (Inactiva)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                    >
                      v{quote.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-gray-600">{quote.total_persons}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package size={14} className="text-gray-400" />
                      <span className="text-gray-600">{quote.total_services}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={14} style={{ color: '#00932c' }} />
                      <span className="font-semibold" style={{ color: '#085f24' }}>
                        {formatPrice(quote.total_price)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: statusStyles.bg,
                        color: statusStyles.text,
                        borderColor: statusStyles.border,
                      }}
                    >
                      {statusStyles.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {quote.valid_until ? (
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600 text-sm">
                          {formatDate(quote.valid_until)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-600 text-sm">
                      {formatDate(quote.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`/quotes/${quote.id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Ver detalle"
                      >
                        <Eye size={18} style={{ color: '#00932c' }} />
                      </a>
                      <button
                        onClick={() => onDuplicate(quote.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Duplicar (nueva versión)"
                      >
                        <Copy size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => onDelete(quote.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

