import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, Upload, Check } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useUpdateService } from '../hooks/useUpdateService'
import { Service, DurationUnit, TypeService } from '@/types/service.type'
import { Itinerary } from '@/types/itinerary.type'
import { Data } from '@/types/data.type'

interface EditServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service
}

type TabType = 'basic' | 'itinerary' | 'data' | 'media'

export const EditServiceModal = ({ isOpen, onClose, service }: EditServiceModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic')

  // Estados para datos básicos
  const [title, setTitle] = useState(service.title)
  const [summary, setSummary] = useState(service.summary)
  const [includes, setIncludes] = useState(service.includes)
  const [excludes, setExcludes] = useState(service.excludes)
  const [type, setType] = useState<TypeService>(service.type)
  const [price, setPrice] = useState(service.price)
  const [durationValue, setDurationValue] = useState(service.duration_value)
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(service.duration_unit)

  // Estados para itinerario
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null)
  const [newItineraryTitle, setNewItineraryTitle] = useState('')
  const [newItineraryDesc, setNewItineraryDesc] = useState('')

  // Estados para data
  const [editingData, setEditingData] = useState<Data | null>(null)
  const [newDataTitle, setNewDataTitle] = useState('')
  const [newDataDesc, setNewDataDesc] = useState('')

  // Estados para media
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImageTitle, setNewImageTitle] = useState('')
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null)

  const mutations = useUpdateService(service.id)

  // Resetear estados cuando cambia el servicio
  useEffect(() => {
    setTitle(service.title)
    setSummary(service.summary)
    setIncludes(service.includes)
    setExcludes(service.excludes)
    setType(service.type)
    setPrice(service.price)
    setDurationValue(service.duration_value)
    setDurationUnit(service.duration_unit)
  }, [service])

  const handleSaveBasic = () => {
    mutations.updateBasic.mutate(
      {
        title,
        summary,
        includes,
        excludes,
        type,
        price,
        duration_value: durationValue,
        duration_unit: durationUnit,
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  // ==================== ITINERARY HANDLERS ====================

  const handleAddItinerary = () => {
    if (!newItineraryTitle.trim()) return
    mutations.addItinerary.mutate(
      { title: newItineraryTitle, description: newItineraryDesc },
      {
        onSuccess: () => {
          setNewItineraryTitle('')
          setNewItineraryDesc('')
        },
      }
    )
  }

  const handleUpdateItinerary = () => {
    if (!editingItinerary) return
    mutations.updateItinerary.mutate(
      {
        id: editingItinerary.id,
        data: { title: editingItinerary.title, description: editingItinerary.description },
      },
      { onSuccess: () => setEditingItinerary(null) }
    )
  }

  const handleDeleteItinerary = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este día del itinerario?')) {
      mutations.deleteItinerary.mutate(id)
    }
  }

  // ==================== DATA HANDLERS ====================

  const handleAddData = () => {
    if (!newDataTitle.trim()) return
    mutations.addData.mutate(
      { title: newDataTitle, description: newDataDesc },
      {
        onSuccess: () => {
          setNewDataTitle('')
          setNewDataDesc('')
        },
      }
    )
  }

  const handleUpdateData = () => {
    if (!editingData) return
    mutations.updateData.mutate(
      {
        id: editingData.id,
        data: { title: editingData.title, description: editingData.description },
      },
      { onSuccess: () => setEditingData(null) }
    )
  }

  const handleDeleteData = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta información?')) {
      mutations.deleteData.mutate(id)
    }
  }

  // ==================== MEDIA HANDLERS ====================

  const handleUploadImage = () => {
    if (!newImageFile || !newImageTitle.trim()) return
    mutations.uploadImage.mutate(
      { title: newImageTitle, file: newImageFile },
      {
        onSuccess: () => {
          setNewImageFile(null)
          setNewImageTitle('')
        },
      }
    )
  }

  const handleUploadCover = () => {
    if (!newCoverFile) return
    mutations.uploadCover.mutate(
      { title: 'Cover', file: newCoverFile },
      { onSuccess: () => setNewCoverFile(null) }
    )
  }

  const handleSetCover = (mediaId: string) => {
    mutations.setCover.mutate(mediaId)
  }

  const handleDeleteMedia = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      mutations.deleteMedia.mutate(id)
    }
  }

  if (!isOpen) return null

  // Verificar que estamos en el cliente
  if (typeof document === 'undefined') return null


  const tabs: { key: TabType; label: string }[] = [
    { key: 'basic', label: 'Información' },
    { key: 'itinerary', label: 'Itinerario' },
    { key: 'data', label: 'Info. Adicional' },
    { key: 'media', label: 'Multimedia' },
  ]

  const coverImage = service.media?.find((m) => m.is_cover)
  const galleryImages = service.media?.filter((m) => !m.is_cover) || []

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: '#085f24' }}>
            Editar Servicio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-4 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab: Información Básica */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TypeService)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="private">Privado</option>
                    <option value="group">Grupal</option>
                    <option value="arbitrary">Arbitrario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={0}
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración
                    </label>
                    <input
                      type="number"
                      value={durationValue}
                      onChange={(e) => setDurationValue(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidad
                    </label>
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="hours">Horas</option>
                      <option value="days">Días</option>
                      <option value="weeks">Semanas</option>
                      <option value="months">Meses</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumen
                </label>
                <ReactQuill
                  theme="snow"
                  value={summary}
                  onChange={setSummary}
                  className="bg-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incluye
                </label>
                <ReactQuill
                  theme="snow"
                  value={includes}
                  onChange={setIncludes}
                  className="bg-white rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Incluye
                </label>
                <ReactQuill
                  theme="snow"
                  value={excludes}
                  onChange={setExcludes}
                  className="bg-white rounded-lg"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveBasic}
                  disabled={mutations.updateBasic.isPending}
                  className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#00bf35' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00932c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00bf35'}
                >
                  {mutations.updateBasic.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {/* Tab: Itinerario */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Lista de itinerarios existentes */}
              <div className="space-y-4">
                {service.itinerary?.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    {editingItinerary?.id === item.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingItinerary.title}
                          onChange={(e) =>
                            setEditingItinerary({ ...editingItinerary, title: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Título del día"
                        />
                        <ReactQuill
                          theme="snow"
                          value={editingItinerary.description}
                          onChange={(value) =>
                            setEditingItinerary({ ...editingItinerary, description: value })
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingItinerary(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleUpdateItinerary}
                            disabled={mutations.updateItinerary.isPending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Día {index + 1}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingItinerary(item)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteItinerary(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <div
                          className="text-gray-600 text-sm mt-1 prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agregar nuevo itinerario */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Plus size={18} /> Agregar Nuevo Día
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newItineraryTitle}
                    onChange={(e) => setNewItineraryTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Título del día"
                  />
                  <ReactQuill
                    theme="snow"
                    value={newItineraryDesc}
                    onChange={setNewItineraryDesc}
                    placeholder="Descripción del día"
                  />
                  <button
                    onClick={handleAddItinerary}
                    disabled={mutations.addItinerary.isPending || !newItineraryTitle.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {mutations.addItinerary.isPending ? 'Agregando...' : 'Agregar Día'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Información Adicional */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Lista de data existente */}
              <div className="space-y-4">
                {service.data?.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    {editingData?.id === item.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingData.title}
                          onChange={(e) =>
                            setEditingData({ ...editingData, title: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Título"
                        />
                        <ReactQuill
                          theme="snow"
                          value={editingData.description}
                          onChange={(value) =>
                            setEditingData({ ...editingData, description: value })
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingData(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleUpdateData}
                            disabled={mutations.updateData.isPending}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.title}</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingData(item)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteData(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div
                          className="text-gray-600 text-sm prose prose-sm"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agregar nueva data */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Plus size={18} /> Agregar Nueva Información
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newDataTitle}
                    onChange={(e) => setNewDataTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Título"
                  />
                  <ReactQuill
                    theme="snow"
                    value={newDataDesc}
                    onChange={setNewDataDesc}
                    placeholder="Descripción"
                  />
                  <button
                    onClick={handleAddData}
                    disabled={mutations.addData.isPending || !newDataTitle.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {mutations.addData.isPending ? 'Agregando...' : 'Agregar Información'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Multimedia */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Cover actual */}
              <div>
                <h4 className="font-medium mb-4">Imagen de Portada</h4>
                <div className="flex gap-4 items-start">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage.file}
                        alt="Cover"
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Portada
                      </span>
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      Sin portada
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block">
                      <span className="text-sm text-gray-600">Cambiar portada:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewCoverFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </label>
                    {newCoverFile && (
                      <button
                        onClick={handleUploadCover}
                        disabled={mutations.uploadCover.isPending}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        {mutations.uploadCover.isPending ? 'Subiendo...' : 'Subir Portada'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Galería */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4">Galería de Imágenes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((media) => (
                    <div key={media.id} className="relative group">
                      <img
                        src={media.file}
                        alt={media.title}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSetCover(media.id)}
                          className="p-2 bg-white rounded-full hover:bg-green-100"
                          title="Establecer como portada"
                        >
                          <Check size={16} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(media.id)}
                          className="p-2 bg-white rounded-full hover:bg-red-100"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{media.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subir nueva imagen */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Upload size={18} /> Subir Nueva Imagen
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Título de la imagen"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <button
                    onClick={handleUploadImage}
                    disabled={mutations.uploadImage.isPending || !newImageFile || !newImageTitle.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {mutations.uploadImage.isPending ? 'Subiendo...' : 'Subir Imagen'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
