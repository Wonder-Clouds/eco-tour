import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useService } from '../hooks/useService'
import { useUpdateService } from '../hooks/useUpdateService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditServiceModal } from './EditServiceModal'
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Calendar,
  Info,
  X
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const navigate = useNavigate()
  const { deleteService } = useUpdateService(serviceId)

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
      deleteService.mutate(undefined, {
        onSuccess: () => {
          navigate({ to: '/services' })
        },
      })
    }
  }

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
            <div
              className="w-full h-64 rounded-lg shadow-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(coverImage)}
            >
              <img
                src={coverImage}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Resumen */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Info size={20} />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div
                className="text-gray-700 prose prose-sm max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: service.summary }}
              />
            </CardContent>
          </Card>

          {/* Incluye / No incluye */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  ✓ Incluye
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <div
                  className="text-gray-700 prose prose-sm max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: service.includes }}
                />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  ✗ No Incluye
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <div
                  className="text-gray-700 prose prose-sm max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: service.excludes }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Itinerario */}
          {service.itinerary && service.itinerary.length > 0 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <Calendar size={20} />
                  Itinerario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-hidden">
                {service.itinerary.map((item) => (
                  <div key={item.id} className="border-l-4 pl-4 py-2 overflow-hidden" style={{ borderColor: '#00bf35' }}>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <div
                      className="text-gray-600 mt-2 prose prose-sm max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Datos adicionales */}
          {service.data && service.data.length > 0 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <FileText size={20} />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-hidden">
                {service.data.map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0 overflow-hidden">
                    <h4 className="font-semibold">{item.title}</h4>
                    <div
                      className="text-gray-600 mt-1 prose prose-sm max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Galería */}
          {galleryImages.length > 0 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <ImageIcon size={20} />
                  Galería
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((media) => (
                    <div
                      key={media.id}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImage(media.file)}
                    >
                      <div className="w-full h-32 overflow-hidden rounded-lg">
                        <img
                          src={media.file}
                          alt={media.title}
                          className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
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
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-3 rounded-lg font-medium transition"
                style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00932c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bf35'}
              >
                Editar Servicio
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteService.isPending}
                className="w-full py-3 rounded-lg font-medium transition border disabled:opacity-50"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {deleteService.isPending ? 'Eliminando...' : 'Eliminar Servicio'}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para ver imagen en grande */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal de edición */}
      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        service={service}
      />
    </div>
  )
}
