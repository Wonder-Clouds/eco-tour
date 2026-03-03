import React, { useState, useMemo } from 'react'
import { QuoteSummary, QuoteStatus } from '@/types/quote.type'
import {
  Eye,
  Copy,
  Trash2,
  Users,
  Package,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Loader2,
} from 'lucide-react'

interface Props {
  quotes: QuoteSummary[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  duplicatingId?: string | null
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

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Agrupa las cotizaciones por contact_info y ordena por versión
interface QuoteGroup {
  contactInfo: string
  latestQuote: QuoteSummary
  allVersions: QuoteSummary[]
}

export const QuotesTable = ({ quotes, onDelete, onEdit, onDuplicate, duplicatingId }: Props) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Agrupar cotizaciones por contact_info y obtener la última versión
  const groupedQuotes = useMemo(() => {
    const groups: Record<string, QuoteSummary[]> = {}

    for (const quote of quotes) {
      const key = quote.contact_info
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(quote)
    }

    // Ordenar cada grupo por versión descendente y fecha de creación
    const result: QuoteGroup[] = []
    for (const [contactInfo, groupQuotes] of Object.entries(groups)) {
      // Ordenar por versión descendente, luego por fecha de creación descendente
      const sorted = groupQuotes.sort((a, b) => {
        if (b.version !== a.version) return b.version - a.version
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      result.push({
        contactInfo,
        latestQuote: sorted[0],
        allVersions: sorted,
      })
    }

    // Ordenar grupos por fecha de la última versión
    return result.sort(
      (a, b) =>
        new Date(b.latestQuote.created_at).getTime() - new Date(a.latestQuote.created_at).getTime()
    )
  }, [quotes])

  const toggleGroup = (contactInfo: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(contactInfo)) {
      newExpanded.delete(contactInfo)
    } else {
      newExpanded.add(contactInfo)
    }
    setExpandedGroups(newExpanded)
  }

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
            {groupedQuotes.map((group) => {
              const quote = group.latestQuote
              const statusStyles = getStatusStyles(quote.status)
              const isExpanded = expandedGroups.has(group.contactInfo)
              const hasMultipleVersions = group.allVersions.length > 1

              return (
                <React.Fragment key={`group-${quote.id}`}>
                  {/* Fila principal - Última versión */}
                  <tr
                    className={`hover:bg-gray-50 transition ${
                      hasMultipleVersions ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => hasMultipleVersions && toggleGroup(group.contactInfo)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {hasMultipleVersions && (
                          <span className="text-gray-400">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {quote.contact_info}
                          </span>
                          {hasMultipleVersions && (
                            <span className="text-xs text-gray-400 mt-0.5">
                              {group.allVersions.length} versiones
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                      >
                        v{quote.version}
                        {hasMultipleVersions && (
                          <span className="ml-1 text-xs opacity-70">(última)</span>
                        )}
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
                      <div
                        className="flex items-center justify-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={`/quotes/${quote.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 transition"
                          title="Ver detalle"
                        >
                          <Eye size={18} style={{ color: '#00932c' }} />
                        </a>
                        {quote.status === 'draft' && (
                          <button
                            onClick={() => onEdit(quote.id)}
                            className="p-2 rounded-lg hover:bg-blue-50 transition"
                            title="Editar"
                          >
                            <Edit3 size={18} className="text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() => onDuplicate(quote.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition"
                          title="Duplicar cotización"
                          disabled={duplicatingId === quote.id}
                        >
                          {duplicatingId === quote.id ? (
                            <Loader2 size={18} className="text-gray-400 animate-spin" />
                          ) : (
                            <Copy size={18} className="text-gray-500" />
                          )}
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

                  {/* Filas de versiones anteriores (expandidas) */}
                  {isExpanded &&
                    group.allVersions.slice(1).map((versionQuote) => {
                      const vStatusStyles = getStatusStyles(versionQuote.status)
                      return (
                        <tr
                          key={versionQuote.id}
                          className="bg-gray-50/50 hover:bg-gray-100 transition"
                        >
                          <td className="px-6 py-3 pl-12">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-gray-600 text-sm">
                                Versión anterior
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                              style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                            >
                              v{versionQuote.version}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users size={14} className="text-gray-400" />
                              <span className="text-gray-500 text-sm">
                                {versionQuote.total_persons}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Package size={14} className="text-gray-400" />
                              <span className="text-gray-500 text-sm">
                                {versionQuote.total_services}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-gray-500 text-sm">
                              {formatPrice(versionQuote.total_price)}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium border"
                              style={{
                                backgroundColor: vStatusStyles.bg,
                                color: vStatusStyles.text,
                                borderColor: vStatusStyles.border,
                              }}
                            >
                              {vStatusStyles.label}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            {versionQuote.valid_until ? (
                              <span className="text-gray-500 text-sm">
                                {formatDate(versionQuote.valid_until)}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className="text-gray-500 text-sm">
                              {formatDateTime(versionQuote.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <a
                                href={`/quotes/${versionQuote.id}`}
                                className="p-2 rounded-lg hover:bg-gray-200 transition"
                                title="Ver detalle"
                              >
                                <Eye size={16} className="text-gray-500" />
                              </a>
                              {versionQuote.status === 'draft' && (
                                <button
                                  onClick={() => onEdit(versionQuote.id)}
                                  className="p-2 rounded-lg hover:bg-blue-50 transition"
                                  title="Editar"
                                >
                                  <Edit3 size={16} className="text-blue-500" />
                                </button>
                              )}
                              <button
                                onClick={() => onDuplicate(versionQuote.id)}
                                className="p-2 rounded-lg hover:bg-gray-200 transition"
                                title="Duplicar cotización"
                                disabled={duplicatingId === versionQuote.id}
                              >
                                {duplicatingId === versionQuote.id ? (
                                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                                ) : (
                                  <Copy size={16} className="text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => onDelete(versionQuote.id)}
                                className="p-2 rounded-lg hover:bg-red-50 transition"
                                title="Eliminar"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

