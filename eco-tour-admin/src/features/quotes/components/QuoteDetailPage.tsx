import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuoteFullDetail } from '../hooks/useQuotes'
import { useDeleteQuote, useUpdateQuoteStatus, useCreateVersion, useToggleQuotePublic } from '../hooks/useQuoteMutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuoteStatus } from '@/types/quote.type'
import {
  ArrowLeft,
  Users,
  Package,
  Calendar,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Tag,
  AlertCircle,
  Edit3,
  Share2,
  Link,
  ExternalLink,
  Download,
} from 'lucide-react'

interface Props {
  quoteId: string
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

const formatPrice = (price?: string | number) => {
  if (price === undefined || price === null) return '$0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const formatShortDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
  })
}

const formatTime = (timeString?: string) => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const formatServiceType = (type: string) => {
  const types: Record<string, string> = {
    group: 'Grupal',
    private: 'Privado',
    arbitrary: 'Arbitrario',
  }
  return types[type] || type
}

const getTypeStyles = (type: string) => {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    private: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    group: { bg: '#edfff2', text: '#00932c', border: '#00bf35' },
    arbitrary: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  }
  return styles[type] || { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
}

export const QuoteDetailPage = ({ quoteId }: Props) => {
  const { data: quote, isLoading, error, refetch } = useQuoteFullDetail(quoteId)
  const navigate = useNavigate()
  const deleteQuoteMutation = useDeleteQuote()
  const updateStatusMutation = useUpdateQuoteStatus(quoteId)
  const createVersionMutation = useCreateVersion(quoteId)
  const togglePublicMutation = useToggleQuotePublic()

  const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set())
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [showSchedule, setShowSchedule] = useState(true)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isTogglingPublic, setIsTogglingPublic] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // Derive public state from quote data
  const isCurrentlyPublic = quote?.is_public === true
  // Generate URL - always available if quote is public
  const publicUrl = isCurrentlyPublic ? `${window.location.origin}/quotes/public/${quoteId}` : null

  const togglePerson = (personId: string) => {
    const newExpanded = new Set(expandedPersons)
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId)
    } else {
      newExpanded.add(personId)
    }
    setExpandedPersons(newExpanded)
  }

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
    }
    setExpandedServices(newExpanded)
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.')) {
      try {
        await deleteQuoteMutation.mutateAsync(quoteId)
        navigate({ to: '/quotes' })
      } catch (err) {
        console.error('Error al eliminar:', err)
        alert('Error al eliminar la cotización')
      }
    }
  }

  const handleStatusChange = async (status: QuoteStatus) => {
    try {
      await updateStatusMutation.mutateAsync(status)
    } catch (err) {
      console.error('Error al cambiar estado:', err)
      alert('Error al cambiar el estado')
    }
  }

  // Duplicar cotización - crear nueva versión con los mismos datos
  const handleDuplicate = async () => {
    if (!quote) return

    setIsDuplicating(true)
    try {
      // Crear nueva versión vacía (solo copia la estructura)
      const newQuote = await createVersionMutation.mutateAsync({
        notes: quote.notes || undefined,
        contact_info: quote.contact_info,
        valid_until: quote.valid_until || undefined,
        status: 'draft',
      })

      if (newQuote?.id) {
        // Redirigir a la nueva versión para editarla
        navigate({ to: '/quotes/$id/edit', params: { id: newQuote.id } })
      }
    } catch (err) {
      console.error('Error al duplicar:', err)
      alert('Error al duplicar la cotización')
    } finally {
      setIsDuplicating(false)
    }
  }

  // Compartir cotización - mostrar modal si ya es público, o hacer público
  const handleShare = async () => {
    // Si ya es público según los datos del quote, solo mostrar el modal
    if (quote?.is_public === true) {
      setShowShareModal(true)
      return
    }

    // Si no es público, hacerlo público usando toggle-public
    setIsTogglingPublic(true)
    try {
      const result = await togglePublicMutation.mutateAsync(quoteId)
      console.log('Toggle result:', result)

      // Refrescar datos y esperar resultado
      const { data: updatedQuote } = await refetch()

      // Verificar que se hizo público
      if (updatedQuote?.is_public === true) {
        setShowShareModal(true)
      } else {
        // Si por alguna razón no se actualizó, mostrar igual el modal
        // porque el toggle ya se ejecutó exitosamente
        setShowShareModal(true)
      }
    } catch (err) {
      console.error('Error al compartir:', err)
      alert('Error al generar el enlace público')
    } finally {
      setIsTogglingPublic(false)
    }
  }

  // Hacer privada la cotización
  const handleMakePrivate = async () => {
    setIsTogglingPublic(true)
    try {
      await togglePublicMutation.mutateAsync(quoteId)
      await refetch()
      setShowShareModal(false)
    } catch (err) {
      console.error('Error al hacer privada:', err)
      alert('Error al cambiar el estado')
    } finally {
      setIsTogglingPublic(false)
    }
  }

  // const copyToClipboard = () => {
  //   if (publicUrl) {
  //     navigator.clipboard.writeText(publicUrl)
  //     setLinkCopied(true)
  //     setTimeout(() => setLinkCopied(false), 2000)
  //   }
  // }

  const groupedSchedule = Object.values(
    quote?.itinerary_schedule.reduce((acc: Record<string, any>, item: any) => {
      const key = `${item.service.id}-${item.departure_date}-${item.departure_time}`

      if (!acc[key]) {
        acc[key] = {
          ...item,
          persons: [item.person],
          total_cost: item.cost,
        }
      } else {
        acc[key].persons.push(item.person)
        acc[key].total_cost += item.cost
      }

      return acc
    }, {}) || {}
  )

  // Descargar PDF de la vista pública
  const handleDownloadPdf = () => {
    if (!quote) return

    // Abrir la vista pública en una nueva ventana para imprimir/guardar como PDF
    const publicViewUrl = `${window.location.origin}/quotes/public/${quoteId}`
    const printWindow = window.open(publicViewUrl, '_blank')

    if (printWindow) {
      // Esperar a que cargue y mostrar diálogo de impresión
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 1500) // Dar tiempo para que carguen las imágenes
      }
    } else {
      alert('Por favor, permite las ventanas emergentes para descargar el PDF')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando cotización...</span>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="p-8 flex flex-col items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error al cargar la cotización</p>
        <p className="text-gray-500 mt-2">La cotización no existe o hubo un problema al cargarla.</p>
        <a href="/quotes" className="mt-4 text-green-600 hover:underline">
          Volver al listado
        </a>
      </div>
    )
  }

  const statusStyles = getStatusStyles(quote.status)

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <a
            href="/quotes"
            className="p-2 rounded-lg transition hover:bg-gray-200"
            style={{ color: '#000000' }}
          >
            <ArrowLeft size={24} />
          </a>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>
                {quote.contact_info}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#edfff2', color: '#00932c' }}
              >
                v{quote.version}
              </span>
            </div>
            <div className="flex items-center gap-4">
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
              <span className="text-sm text-gray-500">
                Creado el {formatDate(quote.created_at)}
              </span>
              {quote.valid_until && (
                <span className="text-sm text-gray-500">
                  • Válido hasta {formatDate(quote.valid_until)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Share button - always visible */}
          <Button
            onClick={handleShare}
            disabled={isTogglingPublic}
            variant={isCurrentlyPublic ? "outline" : "default"}
            className="flex items-center gap-2"
            style={isCurrentlyPublic
              ? { borderColor: '#00bf35', color: '#00bf35' }
              : { backgroundColor: '#00bf35' }
            }
          >
            {isTogglingPublic ? <Loader2 className="animate-spin" size={16} /> : <Share2 size={16} />}
            {isCurrentlyPublic ? 'Ver enlace público' : 'Compartir'}
          </Button>

          {/* Download PDF button */}
          <Button
            onClick={handleDownloadPdf}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: '#6b7280', color: '#6b7280' }}
          >
            <Download size={16} />
            Descargar PDF
          </Button>

          {quote.status === 'draft' && (
            <>
              <Button
                onClick={() => navigate({ to: '/quotes/$id/edit', params: { id: quoteId } })}
                variant="outline"
                className="flex items-center gap-2"
                style={{ borderColor: '#2563eb', color: '#2563eb' }}
              >
                <Edit3 size={16} />
                Editar
              </Button>
            </>
          )}
          {quote.status === 'pending' && (
            <>
              <Button
                onClick={() => handleStatusChange('approved')}
                disabled={updateStatusMutation.isPending}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#00bf35' }}
              >
                <CheckCircle size={16} />
                Aprobar
              </Button>
              <Button
                onClick={() => handleStatusChange('rejected')}
                disabled={updateStatusMutation.isPending}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <XCircle size={16} />
                Rechazar
              </Button>
            </>
          )}
          {(quote.status === 'rejected' || quote.status === 'approved') && (
            <Button
              onClick={() => navigate({ to: '/quotes/$id/edit', params: { id: quoteId }, search: { newVersion: 'true' } })}
              variant="outline"
              className="flex items-center gap-2"
              style={{ borderColor: '#2563eb', color: '#2563eb' }}
            >
              <Edit3 size={16} />
              Editar (Nueva Versión)
            </Button>
          )}
          <Button
            onClick={handleDuplicate}
            disabled={isDuplicating || createVersionMutation.isPending}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: '#00bf35', color: '#00932c' }}
          >
            {isDuplicating ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Duplicando...
              </>
            ) : (
              <>
                <Copy size={16} />
                Duplicar
              </>
            )}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteQuoteMutation.isPending}
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna izquierda: Info general y Personas */}
        <div className="xl:col-span-2 space-y-6">
          {/* Info del grupo */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Users size={20} />
                Información del Grupo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Grupo</p>
                  <p className="font-medium text-sm">{quote.group_info?.name || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Personas</p>
                  <p className="font-medium">{quote.group_info?.total_people || quote.cost_summary?.total_persons || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Contacto</p>
                  <p className="font-medium">{quote.contact_info}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="font-bold text-lg" style={{ color: '#00932c' }}>
                    {formatPrice(quote.total_price)}
                  </p>
                </div>
              </div>
              {quote.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-700 font-medium mb-1">Notas:</p>
                  <p className="text-sm text-yellow-800">{quote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalle por Persona */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <User size={20} />
                Detalle por Persona ({quote.persons_detail?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quote.persons_detail?.map((personDetail) => {
                const isExpanded = expandedPersons.has(personDetail.id)
                return (
                  <div
                    key={personDetail.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => togglePerson(personDetail.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User size={18} style={{ color: '#00932c' }} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">
                            {personDetail.full_name}
                            {personDetail.is_generic && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                                Temporal
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {personDetail.services_count} servicio(s) asignado(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold" style={{ color: '#00932c' }}>
                          {formatPrice(personDetail.total_cost)}
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="p-4 space-y-3">
                        {/* Info de la persona */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="truncate">{personDetail.email || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Teléfono</p>
                            <p>{personDetail.phone_number || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pasaporte</p>
                            <p>{personDetail.passport_number || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Nacionalidad</p>
                            <p>{personDetail.nationality || '-'}</p>
                          </div>
                        </div>

                        {/* Servicios de esta persona */}
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2 text-gray-700">Servicios asignados:</p>
                          <div className="space-y-2">
                            {personDetail.services?.map((service) => {
                              const typeStyles = getTypeStyles(service.service_type)
                              return (
                                <div
                                  key={service.service_quote_person_id}
                                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Package size={16} className="text-gray-400" />
                                    <div>
                                      <p className="font-medium text-sm">{service.service_name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span
                                          className="text-xs px-2 py-0.5 rounded-full"
                                          style={{
                                            backgroundColor: typeStyles.bg,
                                            color: typeStyles.text,
                                          }}
                                        >
                                          {formatServiceType(service.service_type)}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                          <Calendar size={12} />
                                          {formatShortDate(service.departure_date)}
                                        </span>
                                        {service.departure_time && (
                                          <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatTime(service.departure_time)}
                                          </span>
                                        )}
                                      </div>
                                      {service.notes && (
                                        <p className="text-xs text-gray-400 mt-1 italic">{service.notes}</p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-semibold" style={{ color: '#00932c' }}>
                                    {formatPrice(service.individual_cost)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Cronograma */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between"
              >
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <Calendar size={20} />
                  Cronograma ({quote.itinerary_schedule?.length || 0} actividades)
                </CardTitle>
                {showSchedule ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </CardHeader>
            {showSchedule && (
              <CardContent>
                {!quote.itinerary_schedule?.length ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay itinerarios programados
                  </p>
                ) : (
                  <div className="space-y-4">
                    {groupedSchedule.map((item) => {
                      const typeStyles = getTypeStyles(item.service.type)
                      return (
                        <div
                          key={item.service_quote_person_id}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="text-center shrink-0 w-20">
                            <p className="text-xs text-gray-500">
                              {formatShortDate(item.departure_date)}
                            </p>
                            {item.departure_time && (
                              <p className="font-bold text-sm" style={{ color: '#00932c' }}>
                                {formatTime(item.departure_time)}
                              </p>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: typeStyles.bg,
                                  color: typeStyles.text,
                                }}
                              >
                                {item.service.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                • {item.service.duration_value} {item.service.duration_unit === 'days' ? 'día(s)' : item.service.duration_unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={14} />
                              <span>
                                {item.persons.map((p: any) => p.full_name).join(', ')}
                              </span>
                              {/* <span className="font-semibold" style={{ color: '#00932c' }}>
                                {formatPrice(item.cost)}
                              </span> */}
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-400 mt-1 italic">{item.notes}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Columna derecha: Resumen de costos y servicios */}
        <div className="space-y-6">
          {/* Resumen de costos */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <DollarSign size={20} />
                Resumen de Costos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Por servicio */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Por Servicio</p>
                <div className="space-y-2">
                  {quote.cost_summary?.by_service?.map((item) => {
                    const typeStyles = getTypeStyles(item.service_type)
                    return (
                      <div
                        key={item.service_id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: typeStyles.text }}
                          />
                          <span className="truncate">{item.service_name}</span>
                          <span className="text-xs text-gray-400 shrink-0">
                            ({item.persons_count} pax)
                          </span>
                        </div>
                        <span className="font-medium shrink-0 ml-2">{formatPrice(item.total)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <hr />

              {/* Por tipo */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Por Tipo de Servicio</p>
                <div className="space-y-2">
                  {quote.cost_summary?.by_service_type?.group && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                        >
                          Grupal
                        </span>
                        <span className="text-xs text-gray-400">
                          ({quote.cost_summary.by_service_type.group.count})
                        </span>
                      </div>
                      <span className="font-medium">{formatPrice(quote.cost_summary.by_service_type.group.total)}</span>
                    </div>
                  )}
                  {quote.cost_summary?.by_service_type?.private && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
                        >
                          Privado
                        </span>
                        <span className="text-xs text-gray-400">
                          ({quote.cost_summary.by_service_type.private.count})
                        </span>
                      </div>
                      <span className="font-medium">{formatPrice(quote.cost_summary.by_service_type.private.total)}</span>
                    </div>
                  )}
                  {quote.cost_summary?.by_service_type?.arbitrary && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#fffbeb', color: '#d97706' }}
                        >
                          Arbitrario
                        </span>
                        <span className="text-xs text-gray-400">
                          ({quote.cost_summary.by_service_type.arbitrary.count})
                        </span>
                      </div>
                      <span className="font-medium">{formatPrice(quote.cost_summary.by_service_type.arbitrary.total)}</span>
                    </div>
                  )}
                </div>
              </div>

              <hr />

              {/* Por persona */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Por Persona</p>
                <div className="space-y-2">
                  {quote.cost_summary?.by_person?.map((item) => (
                    <div
                      key={item.person_id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <User size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{item.person_name}</span>
                        <span className="text-xs text-gray-400 shrink-0">
                          ({item.services_count} srv)
                        </span>
                      </div>
                      <span className="font-medium shrink-0 ml-2">{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              {/* Total */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#edfff2' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: '#085f24' }}>
                    TOTAL
                  </span>
                  <span className="text-2xl font-bold" style={{ color: '#00932c' }}>
                    {formatPrice(quote.cost_summary?.total_price || quote.total_price)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {quote.cost_summary?.total_services || 0} servicio(s) • {quote.cost_summary?.total_persons || 0} persona(s)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Servicios incluidos */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Package size={20} />
                Servicios ({quote.services_detail?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quote.services_detail?.map((serviceDetail) => {
                const isExpanded = expandedServices.has(serviceDetail.id)
                const typeStyles = getTypeStyles(serviceDetail.type)
                return (
                  <div
                    key={serviceDetail.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleService(serviceDetail.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{serviceDetail.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: typeStyles.bg,
                              color: typeStyles.text,
                            }}
                          >
                            {formatServiceType(serviceDetail.type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {serviceDetail.persons_in_service?.length || 0} pax
                          </span>
                          <span className="text-xs font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(serviceDetail.total_cost_for_service)}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isExpanded && (
                      <div className="p-4 space-y-3 text-sm">
                        {/* Tags */}
                        {serviceDetail.tags?.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag size={14} className="text-gray-400" />
                            {serviceDetail.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Hora de salida */}
                        {serviceDetail.departure_time && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} />
                            <span>Hora de salida: {formatTime(serviceDetail.departure_time)}</span>
                          </div>
                        )}

                        {/* Pricing info */}
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Precio de referencia: {formatPrice(serviceDetail.reference_price)}
                          </p>
                          {serviceDetail.pricing_info?.rules && serviceDetail.pricing_info.rules.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">Reglas de precio:</p>
                              {serviceDetail.pricing_info.rules.map((rule) => (
                                <div key={rule.id} className="flex justify-between text-xs">
                                  <span>{rule.concept}</span>
                                  <span>
                                    {formatPrice(rule.amount)} ({rule.calculation_type === 'multiply' ? '×' : '÷'})
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {serviceDetail.pricing_info?.tiers && serviceDetail.pricing_info.tiers.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">Tiers de precio:</p>
                              {serviceDetail.pricing_info.tiers.map((tier) => (
                                <div key={tier.id} className="flex justify-between text-xs">
                                  <span>{tier.min_people}-{tier.max_people} personas</span>
                                  <span>{formatPrice(tier.total_price)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Personas asignadas */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Personas asignadas
                          </p>
                          <div className="space-y-1">
                            {serviceDetail.persons_in_service?.map((ap) => (
                              <div
                                key={ap.service_quote_person_id}
                                className="flex items-center justify-between py-1 px-2 bg-white rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <User size={12} className="text-gray-400" />
                                  <span className="text-xs">{ap.person_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{formatShortDate(ap.departure_date)}</span>
                                  {ap.departure_time && <span>{formatTime(ap.departure_time)}</span>}
                                  <span className="font-medium" style={{ color: '#00932c' }}>
                                    {formatPrice(ap.individual_cost)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Versiones */}
          {quote.all_versions && quote.all_versions.length > 1 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <Copy size={20} />
                  Versiones ({quote.all_versions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quote.all_versions.map((version) => {
                  const versionStatusStyles = getStatusStyles(version.status)
                  const isCurrent = version.id === quote.id
                  return (
                    <a
                      key={version.id}
                      href={isCurrent ? '#' : `/quotes/${version.id}`}
                      className={`flex items-center justify-between p-3 rounded-lg border ${isCurrent ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">v{version.version}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: versionStatusStyles.bg,
                            color: versionStatusStyles.text,
                          }}
                        >
                          {versionStatusStyles.label}
                        </span>
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Actual
                          </span>
                        )}
                      </div>
                      <span className="font-medium" style={{ color: '#00932c' }}>
                        {formatPrice(version.total_price)}
                      </span>
                    </a>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#085f24' }}>
                <Share2 size={20} />
                Compartir Cotización
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <span className="text-gray-500">✕</span>
              </button>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Cotización pública</p>
                <p className="text-xs text-green-600">Tu cliente puede ver este enlace</p>
              </div>
            </div>

            <p className="text-gray-600 mb-3 text-sm">
              Comparte este enlace con tu cliente para que pueda ver el itinerario:
            </p>
            {(() => {
              // Always generate URL when modal is shown (toggle was successful)
              const shareUrl = `${window.location.origin}/quotes/public/${quoteId}`
              return (
                <>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border mb-4">
                    <Link size={16} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
                    />
                  </div>

                  {/* Copied feedback */}
                  {linkCopied && (
                    <div className="mb-4 p-2 bg-green-100 rounded-lg text-center">
                      <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                        <CheckCircle size={16} />
                        ¡Enlace copiado!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        setLinkCopied(true)
                        setTimeout(() => setLinkCopied(false), 2000)
                      }}
                      className="flex-1 h-11"
                      style={{ backgroundColor: '#00bf35' }}
                    >
                      <Copy size={16} className="mr-2" />
                      {linkCopied ? '¡Copiado!' : 'Copiar enlace'}
                    </Button>
                    <Button
                      onClick={() => window.open(shareUrl, '_blank')}
                      variant="outline"
                      className="flex-1 h-11 flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Ver vista pública
                    </Button>
                  </div>
                </>
              )
            })()}

            {/* Make private button */}
            <div className="pt-4 border-t">
              <button
                onClick={handleMakePrivate}
                disabled={isTogglingPublic}
                className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 py-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
              >
                {isTogglingPublic ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Cambiando...
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    Hacer privada esta cotización
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

