import { useState, useEffect } from 'react'
import { QuoteFullDetail, ServiceDetail } from '@/types/quote.type'
import {
  Users,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  Star,
  Check,
  X,
  Clock,
  Plane,
} from 'lucide-react'
import { apiBaseURL } from '@/config/axios'


interface Props {
  quoteId: string
}

const MEDIA_BASE = apiBaseURL.replace('/api', '')

const formatPrice = (price?: string | number) => {
  if (price === undefined || price === null) return 'US$ 0'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return `US$ ${numPrice.toFixed(0)}`
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatShortDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
  })
}

const formatTime = (timeString?: string) => {
  if (!timeString) return ''
  // Handle both HH:MM:SS and HH:MM formats
  const parts = timeString.split(':')
  if (parts.length < 2) return timeString
  const hours = parts[0]
  const minutes = parts[1]
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    group: 'Grupal',
    private: 'Privado',
    arbitrary: 'Arbitrario',
  }
  return types[type] || type
}

const getTypeColor = (type: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    group: { bg: '#edfff2', text: '#00932c' },
    private: { bg: '#fef2f2', text: '#dc2626' },
    arbitrary: { bg: '#fef3c7', text: '#d97706' },
  }
  return colors[type] || { bg: '#f3f4f6', text: '#374151' }
}

const renderHtml = (html?: string) => {
  if (!html) return null
  const decodedHtml = html.replace(/&nbsp;/g, ' ')
  return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
}

export const QuotePublicPage = ({ quoteId }: Props) => {
  const [quote, setQuote] = useState<QuoteFullDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const apiUrl = apiBaseURL || 'http://localhost:8000/api'
        const response = await fetch(`${apiUrl}/quote/public/${quoteId}/`)
        if (!response.ok) {
          setError('Esta cotización no está disponible o ha expirado.')
          return
        }
        const data = await response.json()
        setQuote(data)
      } catch {
        setError('Esta cotización no está disponible o ha expirado.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuote()
  }, [quoteId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{ color: '#00932c' }} />
          <p className="text-lg text-gray-600">Cargando tu itinerario...</p>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <AlertCircle size={64} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cotización no disponible</h1>
        <p className="text-gray-500">{error || 'Esta cotización no existe o no es pública.'}</p>
      </div>
    )
  }

  const totalPrice = parseFloat(quote.total_price || '0')
  const totalPersons = quote.group_info?.total_people || quote.persons_detail?.length || 0
  const pricePerPerson = totalPersons > 0 ? totalPrice / totalPersons : 0
  const servicesDetail = quote.services_detail || []

  const allDates = quote.persons_detail?.flatMap(p => p.services?.map(s => s.departure_date) || []) || []
  const sortedDates = [...new Set(allDates.filter(Boolean))].sort()
  const tripDays = sortedDates.length || 1

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          .print-avoid-break { page-break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40 print:static">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/ecotour-logo.svg" alt="Eco Tour Cusco" className="h-8 md:h-10" />
            <div className="hidden sm:block border-l pl-3 ml-2">
              <span className="font-semibold text-gray-900">Itinerario digital</span>
              <span className="ml-2 text-gray-500 text-sm">{quote.group_info?.name || `ITDI-${quote.version}`}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold" style={{ color: '#00932c' }}>{formatPrice(totalPrice)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Title Section */}
        <div className="mb-8 print-avoid-break">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Paquete de {tripDays} días</h1>
          <p className="text-gray-500 flex items-center gap-2">
            <MapPin size={16} />
            Lima • Cusco • Perú
          </p>
        </div>

        {/* Group Info Row - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 pb-6 border-b print-avoid-break">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Líder de grupo</p>
            <p className="font-semibold text-gray-900 mt-1 text-sm md:text-base">{quote.contact_info}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Nro. de viajeros</p>
            <p className="font-semibold text-gray-900 mt-1 text-sm md:text-base">{totalPersons} adultos</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fechas de viaje</p>
            <p className="font-semibold text-gray-900 mt-1 text-sm md:text-base">
              {sortedDates.length > 0
                ? `${formatShortDate(sortedDates[0])} a ${formatShortDate(sortedDates[sortedDates.length - 1])}`
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Duración de viaje</p>
            <p className="font-semibold text-gray-900 mt-1 text-sm md:text-base">{tripDays} días</p>
          </div>
        </div>

        {/* Mobile Price Summary - Full version */}
        <div className="lg:hidden mb-8">
          <PriceSummary
            totalPrice={totalPrice}
            totalPersons={totalPersons}
            pricePerPerson={pricePerPerson}
            servicesDetail={servicesDetail}
            personsDetail={quote.persons_detail}
            validUntil={quote.valid_until}
          />
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Services Detail */}
          <div className="flex-1 space-y-12">
            {servicesDetail.map((service) => (
              <ServiceSection key={service.id} service={service} />
            ))}

            {servicesDetail.length === 0 && quote.persons_detail && (
              <BasicServicesSection persons={quote.persons_detail} />
            )}
          </div>

          {/* Right Column - Price Summary (Sticky) - Only on desktop */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 print:static">
              <PriceSummary
                totalPrice={totalPrice}
                totalPersons={totalPersons}
                pricePerPerson={pricePerPerson}
                servicesDetail={servicesDetail}
                personsDetail={quote.persons_detail}
                validUntil={quote.valid_until}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16 print:bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Eco Tour Cusco. Todos los derechos reservados.</p>
          <p className="mt-1">Cotización válida hasta: {formatDate(quote.valid_until)}</p>
        </div>
      </footer>
    </div>
  )
}

// Service Section Component
const ServiceSection = ({ service }: { service: ServiceDetail }) => {
  const typeColor = getTypeColor(service.type)
  const coverPhoto = service.photos?.find(p => p.is_cover) || service.photos?.[0]
  const otherPhotos = service.photos?.filter(p => !p.is_cover).slice(0, 3) || []

  return (
    <div className="border-b pb-10 print-avoid-break">
      {/* Photos Grid - Responsive */}
      {(coverPhoto || otherPhotos.length > 0) && (
        <div className="mb-6 rounded-xl overflow-hidden">
          {/* Mobile: Single image */}
          <div className="md:hidden print:hidden">
            {coverPhoto && (
              <img
                src={`${MEDIA_BASE}${coverPhoto.file}`}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
            )}
          </div>
          {/* Desktop & Print: Grid */}
          <div className="hidden md:grid print:grid grid-cols-4 gap-2">
            {coverPhoto && (
              <div className="col-span-2 row-span-2">
                <img
                  src={`${MEDIA_BASE}${coverPhoto.file}`}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg print:h-48"
                />
              </div>
            )}
            {otherPhotos.map((photo, idx) => (
              <div key={photo.id}>
                <img
                  src={`${MEDIA_BASE}${photo.file}`}
                  alt={`${service.title} ${idx + 1}`}
                  className="w-full h-31 object-cover rounded-lg print:h-24"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Title */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
        >
          {getTypeLabel(service.type)}
        </span>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Clock size={14} />
          {service.duration_value} {service.duration_unit === 'days' ? 'días' : service.duration_unit === 'hours' ? 'horas' : service.duration_unit}
        </span>
        {service.departure_time && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Plane size={14} />
            Sale: {formatTime(service.departure_time)}
          </span>
        )}
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>

      {/* Persons in this service - FULL LIST with dates/times */}
      {service.persons_in_service && service.persons_in_service.length > 0 && (
        <div className="mt-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users size={16} style={{ color: '#00932c' }} />
            Viajeros en este servicio ({service.persons_in_service.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.persons_in_service.map((person, idx) => (
              <div
                key={person.service_quote_person_id || idx}
                className="p-3 bg-gray-50 rounded-lg border print-avoid-break"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                    style={{ backgroundColor: '#00932c' }}
                  >
                    {person.person_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{person.person_name}</p>
                    <p className="text-xs font-semibold" style={{ color: '#00932c' }}>
                      {formatPrice(person.individual_cost)}
                    </p>
                  </div>
                </div>

                {/* Dates and Times */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Departure */}
                  <div className="bg-white rounded p-2 border">
                    <p className="text-gray-500 font-medium mb-1">Salida</p>
                    <p className="text-gray-900">
                      <Calendar size={10} className="inline mr-1" />
                      {person.departure_date ? formatShortDate(person.departure_date) : '-'}
                    </p>
                    {person.departure_time && (
                      <p className="text-gray-700">
                        <Clock size={10} className="inline mr-1" />
                        {formatTime(person.departure_time)}
                      </p>
                    )}
                  </div>

                  {/* Arrival */}
                  <div className="bg-white rounded p-2 border">
                    <p className="text-gray-500 font-medium mb-1">Llegada</p>
                    <p className="text-gray-900">
                      <Calendar size={10} className="inline mr-1" />
                      {person.arrive_date ? formatShortDate(person.arrive_date) : '-'}
                    </p>
                    {person.arrive_time && (
                      <p className="text-gray-700">
                        <Clock size={10} className="inline mr-1" />
                        {formatTime(person.arrive_time)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {person.notes && (
                  <p className="mt-2 text-xs text-gray-500 italic bg-yellow-50 p-2 rounded">
                    📝 {person.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {service.summary && (
        <div className="mb-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Star size={18} style={{ color: '#00932c' }} />
            Resumen
          </h3>
          <div className="text-gray-700 leading-relaxed text-sm md:text-base">
            {renderHtml(service.summary)}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {service.itineraries && service.itineraries.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} style={{ color: '#00932c' }} />
            Itinerario detallado
          </h3>
          <div className="space-y-6">
            {service.itineraries.map((item, idx) => (
              <div key={item.id} className="flex gap-4 print-avoid-break">
                <div className="shrink-0">
                  <span
                    className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                  >
                    Día {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {renderHtml(item.description)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Includes / Excludes - Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
        {service.includes && (
          <div className="bg-green-50 rounded-lg p-4 print-avoid-break">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              Incluye
            </h4>
            <div className="text-gray-600 text-sm">
              {renderHtml(service.includes)}
            </div>
          </div>
        )}
        {service.excludes && (
          <div className="bg-red-50 rounded-lg p-4 print-avoid-break">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <X size={16} className="text-red-500" />
              No incluye
            </h4>
            <div className="text-gray-600 text-sm">
              {renderHtml(service.excludes)}
            </div>
          </div>
        )}
      </div>

      {/* Price for this service */}
      <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-gray-500 text-sm">
          Precio por persona: <strong style={{ color: '#00932c' }}>{formatPrice(service.reference_price)}</strong>
        </span>
        <div className="text-right">
          <span className="text-sm text-gray-500">Total del servicio: </span>
          <span className="text-xl font-bold" style={{ color: '#00932c' }}>
            {formatPrice(service.total_cost_for_service)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Basic Services Section (fallback when no services_detail)
const BasicServicesSection = ({ persons }: { persons: QuoteFullDetail['persons_detail'] }) => {
  const servicesMap = new Map<string, { name: string; type: string; persons: string[]; totalCost: number }>()

  persons?.forEach(person => {
    person.services?.forEach(service => {
      const existing = servicesMap.get(service.service_id)
      if (existing) {
        existing.persons.push(person.full_name)
        existing.totalCost += service.individual_cost || 0
      } else {
        servicesMap.set(service.service_id, {
          name: service.service_name,
          type: service.service_type,
          persons: [person.full_name],
          totalCost: service.individual_cost || 0,
        })
      }
    })
  })

  return (
    <div className="space-y-8">
      {Array.from(servicesMap.entries()).map(([id, service]) => {
        const typeColor = getTypeColor(service.type)
        return (
          <div key={id} className="border-b pb-8 print-avoid-break">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                {getTypeLabel(service.type)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Users size={16} />
              <span>{service.persons.length} viajeros: {service.persons.join(', ')}</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold" style={{ color: '#00932c' }}>
                {formatPrice(service.totalCost)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Price Summary Component
interface PriceSummaryProps {
  totalPrice: number
  totalPersons: number
  pricePerPerson: number
  servicesDetail: ServiceDetail[]
  personsDetail?: QuoteFullDetail['persons_detail']
  validUntil?: string
}

const PriceSummary = ({
  totalPrice,
  totalPersons,
  pricePerPerson,
  servicesDetail,
  personsDetail,
  validUntil
}: PriceSummaryProps) => {
  const costsByType = { group: 0, private: 0, arbitrary: 0 }
  servicesDetail.forEach(s => {
    if (s.type in costsByType) {
      costsByType[s.type as keyof typeof costsByType] += s.total_cost_for_service || 0
    }
  })

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm print:shadow-none print:border-2">
      {/* Price per adult */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Precio por adulto</p>
        <p className="text-3xl font-bold mt-1" style={{ color: '#00932c' }}>
          {formatPrice(pricePerPerson)}
        </p>
      </div>

      {/* Price Total */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Precio Total</p>
        <p className="text-3xl font-bold mt-1" style={{ color: '#00932c' }}>
          {formatPrice(totalPrice)}
        </p>
        <p className="text-sm text-gray-500 mt-1">{totalPersons} personas</p>
      </div>

      {/* By Type */}
      {(costsByType.group > 0 || costsByType.private > 0 || costsByType.arbitrary > 0) && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Por tipo de servicio</p>
          <div className="space-y-2">
            {costsByType.group > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#00932c' }}>Grupal</span>
                <span className="font-semibold">{formatPrice(costsByType.group)}</span>
              </div>
            )}
            {costsByType.private > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Privado</span>
                <span className="font-semibold">{formatPrice(costsByType.private)}</span>
              </div>
            )}
            {costsByType.arbitrary > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-600">Arbitrario</span>
                <span className="font-semibold">{formatPrice(costsByType.arbitrary)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* By Person */}
      {personsDetail && personsDetail.length > 0 && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Por persona</p>
          <div className="space-y-2 max-h-48 overflow-y-auto print:max-h-none">
            {personsDetail.map((person) => (
              <div key={person.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate max-w-36 print:max-w-none">{person.full_name}</span>
                <span className="font-semibold">{formatPrice(person.total_cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Valid Until */}
      {validUntil && (
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-800">
            <Calendar size={14} className="inline mr-1" />
            Válido hasta: <strong>{formatDate(validUntil)}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
