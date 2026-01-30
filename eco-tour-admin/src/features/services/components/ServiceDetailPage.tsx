import { Link } from '@tanstack/react-router'
import { useService } from '../hooks/useService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Calendar,
  Info
} from 'lucide-react'

interface Props {
  serviceId: string
}

// Función para formatear el tipo de servicio
const formatType = (type: string) => {
  const types: Record<string, string> = {
    group: 'General',
    arbitrary: 'Arbitrario',
    private: 'Privado',
  }
  return types[type] || type
}

// Función para obtener los estilos del tipo
const getTypeStyles = (type: string) => {
  const styles: Record<string, { borderColor: string; color: string; bgColor: string }> = {
    private: { borderColor: '#dc2626', color: '#dc2626', bgColor: '#fef2f2' },
    group: { borderColor: '#00bf35', color: '#00932c', bgColor: '#edfff2' },
    arbitrary: { borderColor: '#f59e0b', color: '#d97706', bgColor: '#fffbeb' },
  }
  return styles[type] || { borderColor: '#6b7280', color: '#374151', bgColor: '#f3f4f6' }
}

// Función para formatear la duración
const formatDuration = (value: number, unit: string) => {
  const units: Record<string, { singular: string; plural: string }> = {
    hours: { singular: 'hora', plural: 'horas' },
    days: { singular: 'día', plural: 'días' },
    weeks: { singular: 'semana', plural: 'semanas' },
    months: { singular: 'mes', plural: 'meses' },
  }
  const unitLabel = units[unit] || { singular: unit, plural: unit }
  return `${value} ${value === 1 ? unitLabel.singular : unitLabel.plural}`
}

// Función para formatear el precio
const formatPrice = (price: string) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(parseFloat(price))
}

export const ServiceDetailPage = ({ serviceId }: Props) => {
  const { data: service, isLoading, error } = useService(serviceId)

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p style={{ color: '#00932c' }}>Cargando servicio...</p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar el servicio</p>
      </div>
    )
  }

  const typeStyles = getTypeStyles(service.type)
  const coverImage = service.media?.find(m => m.is_cover)?.file
  const galleryImages = service.media?.filter(m => !m.is_cover) || []

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/services"
          className="p-2 rounded-lg transition hover:bg-gray-200"
          style={{ color: '#000000' }}
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#085f24' }}>
            {service.title}
          </h1>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium border"
            style={{
              borderColor: typeStyles.borderColor,
              color: typeStyles.color,
              backgroundColor: typeStyles.bgColor,
            }}
          >
            {formatType(service.type)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Image */}
          {coverImage && (
            <Card className="border-0 shadow-md overflow-hidden">
              <img
                src={coverImage}
                alt={service.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Resumen */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Info size={20} />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{service.summary}</p>
            </CardContent>
          </Card>

          {/* Incluye / No incluye */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  ✓ Incluye
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{service.includes}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  ✗ No Incluye
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{service.excludes}</p>
              </CardContent>
            </Card>
          </div>

          {/* Itinerario */}
          {service.itinerary && service.itinerary.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <Calendar size={20} />
                  Itinerario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.itinerary.map((item) => (
                  <div key={item.id} className="border-l-4 pl-4 py-2" style={{ borderColor: '#00bf35' }}>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <div
                      className="text-gray-600 mt-2"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Datos adicionales */}
          {service.data && service.data.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <FileText size={20} />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service.data.map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-semibold">{item.title}</h4>
                    <div
                      className="text-gray-600 mt-1"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Galería */}
          {galleryImages.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <ImageIcon size={20} />
                  Galería
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((media) => (
                    <div key={media.id} className="relative group">
                      <img
                        src={media.file}
                        alt={media.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {media.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition">
                          {media.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Precio */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <DollarSign size={20} />
                Precio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: '#085f24' }}>
                {formatPrice(service.price)}
              </p>
              <p className="text-gray-500 text-sm mt-1">por persona</p>
            </CardContent>
          </Card>

          {/* Duración */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Clock size={20} />
                Duración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {formatDuration(service.duration_value, service.duration_unit)}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                ({service.duration_in_hours} horas)
              </p>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 space-y-3">
              <button
                className="w-full py-3 rounded-lg font-medium transition"
                style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00932c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bf35'}
              >
                Editar Servicio
              </button>
              <button
                className="w-full py-3 rounded-lg font-medium transition border"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Eliminar Servicio
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
