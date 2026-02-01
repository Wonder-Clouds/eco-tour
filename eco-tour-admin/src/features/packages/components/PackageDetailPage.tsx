import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { usePackage } from '../hooks/usePackage'
import { useUpdatePackage } from '../hooks/useUpdatePackage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditPackageModal } from './EditPackageModal'
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Package as PackageIcon,
  List,
  X,
  Image as ImageIcon
} from 'lucide-react'

interface Props {
  packageId: string
}

// Función para formatear el precio
const formatPrice = (price: number | undefined) => {
  if (price === undefined || price === null) return 'S/. 0.00'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price)
}


export const PackageDetailPage = ({ packageId }: Props) => {
  const { data: pkg, isLoading, error } = usePackage(packageId)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const navigate = useNavigate()
  const { deletePackage } = useUpdatePackage(packageId)

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar este paquete? Esta acción no se puede deshacer.')) {
      deletePackage.mutate(undefined, {
        onSuccess: () => {
          navigate({ to: '/packages' })
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p style={{ color: '#00932c' }}>Cargando paquete...</p>
      </div>
    )
  }

  if (error || !pkg) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar el paquete</p>
      </div>
    )
  }

  // Obtener el cover del paquete
  const cover = pkg.media?.find(m => m.is_cover)
  const gallery = pkg.media?.filter(m => !m.is_cover) || []

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/packages"
          className="p-2 rounded-lg transition hover:bg-gray-200"
          style={{ color: '#000000' }}
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#085f24' }}>
            {pkg.title}
          </h1>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#edfff2', color: '#00932c' }}
          >
            {pkg.package_services?.length || 0} servicio{(pkg.package_services?.length || 0) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover */}
          {cover && (
            <div className="rounded-lg shadow-md overflow-hidden">
              <img
                src={cover.file.startsWith('http') ? cover.file : `http://localhost:8000${cover.file}`}
                alt={pkg.title}
                className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition block"
                onClick={() => setSelectedImage(cover.file.startsWith('http') ? cover.file : `http://localhost:8000${cover.file}`)}
              />
            </div>
          )}

          {/* Descripción */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <PackageIcon size={20} />
                Descripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pkg.description ? (
                <div
                  className="text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
              ) : (
                <p className="text-gray-500">Sin descripción</p>
              )}
            </CardContent>
          </Card>

          {/* Servicios incluidos */}
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <List size={20} />
                Servicios Incluidos ({pkg.package_services?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!pkg.package_services || pkg.package_services.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay servicios en este paquete</p>
              ) : (
                <div className="space-y-3">
                  {[...pkg.package_services]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((ps, index) => {
                      const service = ps.service
                      if (!service) return null

                      return (
                        <div
                          key={ps.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
                          >
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <Link
                              to="/services/$id"
                              params={{ id: service.id }}
                              className="font-medium hover:underline"
                              style={{ color: '#085f24' }}
                            >
                              {service.title}
                            </Link>
                            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {service.duration_value} {service.duration_unit === 'days' ? 'día(s)' : service.duration_unit === 'hours' ? 'hora(s)' : service.duration_unit}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign size={14} />
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Galería de imágenes */}
          {gallery.length > 0 && (
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                  <ImageIcon size={20} />
                  Galería ({gallery.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((media) => (
                    <div
                      key={media.id}
                      className="aspect-square bg-cover bg-center rounded-lg cursor-pointer hover:opacity-80 transition"
                      style={{
                        backgroundImage: `url(${media.file.startsWith('http') ? media.file : `http://localhost:8000${media.file}`})`
                      }}
                      onClick={() => setSelectedImage(media.file.startsWith('http') ? media.file : `http://localhost:8000${media.file}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Precio Total */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <DollarSign size={20} />
                Precio Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: '#085f24' }}>
                {formatPrice(pkg.price)}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Suma de todos los servicios
              </p>
            </CardContent>
          </Card>

          {/* Duración Total */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Clock size={20} />
                Duración Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {pkg.total_duration}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                ({pkg.total_duration_hours} horas)
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
                Editar Paquete
              </button>
              <button
                onClick={handleDelete}
                disabled={deletePackage.isPending}
                className="w-full py-3 rounded-lg font-medium transition border disabled:opacity-50"
                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {deletePackage.isPending ? 'Eliminando...' : 'Eliminar Paquete'}
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
      <EditPackageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pkg={pkg}
      />
    </div>
  )
}
