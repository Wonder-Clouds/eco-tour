import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, GripVertical, Search } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useCreatePackage } from '../hooks/useCreatePackage'
import { useServices } from '@/features/services/hooks/useServices'
import { CreatePackageServiceInput } from '@/types/package.type'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  isOpen: boolean
  onClose: () => void
}

// Componente de item sorteable
interface SortableItemProps {
  id: string
  order: number
  serviceName: string
  onRemove: () => void
}

const SortableItem = ({ id, order, serviceName, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${isDragging ? 'shadow-lg' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
        title="Arrastrar para reordenar"
      >
        <GripVertical size={18} className="text-gray-400" />
      </button>
      <span className="text-sm font-medium text-gray-500 w-6">
        {order}
      </span>
      <span className="flex-1 text-sm">
        {serviceName}
      </span>
      <button
        onClick={onRemove}
        className="p-1 text-red-400 hover:text-red-600"
        title="Eliminar"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export const CreatePackageModal = ({ isOpen, onClose }: Props) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [referencePrice, setReferencePrice] = useState('')
  const [selectedServices, setSelectedServices] = useState<CreatePackageServiceInput[]>([])
  const [serviceSearchTerm, setServiceSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const createPackage = useCreatePackage()
  const { data: services, isLoading: loadingServices } = useServices()

  // Filtrar servicios disponibles basado en búsqueda
  const filteredServices = useMemo(() => {
    if (!services) return []

    const availableServices = services.filter(
      s => !selectedServices.some(ss => ss.service_id === s.id)
    )

    if (!serviceSearchTerm.trim()) return availableServices

    return availableServices.filter(s =>
      s.title.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    )
  }, [services, selectedServices, serviceSearchTerm])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSelectedServices((items) => {
        const oldIndex = items.findIndex((item) => item.service_id === active.id)
        const newIndex = items.findIndex((item) => item.service_id === over.id)

        const reordered = arrayMove(items, oldIndex, newIndex)
        // Actualizar los números de orden
        return reordered.map((item, index) => ({ ...item, order: index + 1 }))
      })
    }
  }

  const handleAddService = (serviceId: string) => {
    // Verificar que no esté ya agregado
    if (selectedServices.some(s => s.service_id === serviceId)) {
      return
    }

    setSelectedServices([
      ...selectedServices,
      { service_id: serviceId, order: selectedServices.length + 1 }
    ])
    setServiceSearchTerm('')
    setIsDropdownOpen(false)
  }

  const handleRemoveService = (serviceId: string) => {
    const filtered = selectedServices.filter(s => s.service_id !== serviceId)
    // Reordenar
    setSelectedServices(filtered.map((s, index) => ({ ...s, order: index + 1 })))
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('El título es requerido')
      return
    }

    createPackage.mutate(
      {
        title,
        description,
        reference_price: referencePrice ? Number(referencePrice) : undefined,
        services: selectedServices,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setReferencePrice('')
          setSelectedServices([])
          setServiceSearchTerm('')
          onClose()
        },
        onError: (error) => {
          console.error('Error al crear paquete:', error)
          alert('Error al crear el paquete')
        },
      }
    )
  }

  const getServiceName = (serviceId: string) => {
    return services?.find(s => s.id === serviceId)?.title || serviceId
  }

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: '#085f24' }}>
            Crear Nuevo Paquete
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nombre del paquete"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Descripción del paquete"
              className="bg-white rounded-lg"
              style={{ minHeight: '120px' }}
            />
          </div>

          {/* Precio de Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Referencia
            </label>
            <input
              type="number"
              value={referencePrice}
              onChange={(e) => setReferencePrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
              min={0}
              step="0.01"
            />
          </div>

          {/* Agregar Servicios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agregar Servicios
            </label>
            {/* Campo de búsqueda con dropdown */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                value={serviceSearchTerm}
                onChange={(e) => {
                  setServiceSearchTerm(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Buscar servicio por nombre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loadingServices}
              />

              {/* Lista desplegable de servicios */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto bottom-full mb-1">
                  {loadingServices ? (
                    <div className="p-3 text-center text-gray-500">Cargando...</div>
                  ) : filteredServices.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">
                      {serviceSearchTerm ? 'No se encontraron servicios' : 'No hay servicios disponibles'}
                    </div>
                  ) : (
                    filteredServices.slice(0, 5).map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleAddService(service.id)}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{service.title}</p>
                          <p className="text-sm text-gray-500">{service.duration}</p>
                        </div>
                        <Plus size={18} style={{ color: '#00bf35' }} />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Cerrar dropdown al hacer clic fuera */}
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

            {serviceSearchTerm && (
              <p className="text-xs text-gray-500 mt-1">
                {filteredServices.length} servicio(s) encontrado(s)
              </p>
            )}
          </div>

          {/* Lista de Servicios Seleccionados con Drag and Drop */}
          {selectedServices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios en el Paquete ({selectedServices.length})
                <span className="text-xs text-gray-400 ml-2">Arrastra para reordenar</span>
              </label>
              <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedServices.map(s => s.service_id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedServices.map((service) => (
                      <SortableItem
                        key={service.service_id}
                        id={service.service_id}
                        order={service.order}
                        serviceName={getServiceName(service.service_id)}
                        onRemove={() => handleRemoveService(service.service_id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={createPackage.isPending || !title.trim()}
            className="px-4 py-2 text-white rounded-lg transition disabled:opacity-50"
            style={{ backgroundColor: '#00bf35' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00932c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bf35'}
          >
            {createPackage.isPending ? 'Creando...' : 'Crear Paquete'}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
