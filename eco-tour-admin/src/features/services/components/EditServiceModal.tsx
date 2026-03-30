import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, Upload, Check, Tag as TagIcon, Edit2 } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useUpdateService } from '../hooks/useUpdateService'
import { useTags, useTagMutations } from '../hooks/useTags'
import { Service, DurationUnit, TypeService, PriceRule, PricingTier, Tag, CalculationType } from '@/types/service.type'
import { Itinerary } from '@/types/itinerary.type'
import { Data } from '@/types/data.type'

interface EditServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service
}

type TabType = 'basic' | 'itinerary' | 'data' | 'media' | 'pricing' | 'tags'

export const EditServiceModal = ({ isOpen, onClose, service }: EditServiceModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic')

  // Estados para datos básicos
  const [title, setTitle] = useState(service.title)
  const [summary, setSummary] = useState(service.summary)
  const [includes, setIncludes] = useState(service.includes)
  const [excludes, setExcludes] = useState(service.excludes)
  const [type, setType] = useState<TypeService>(service.type)
  const [referencePrice, setReferencePrice] = useState(service.reference_price)
  const [departureTime, setDepartureTime] = useState(service.departure_time || '')
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

  // Estados para price rules
  const [newPriceRuleConcept, setNewPriceRuleConcept] = useState('')
  const [newPriceRuleAmount, setNewPriceRuleAmount] = useState('')
  const [newPriceRuleCalcType, setNewPriceRuleCalcType] = useState<CalculationType>('multiply')
  const [editingPriceRule, setEditingPriceRule] = useState<PriceRule | null>(null)

  // Estados para pricing tiers
  const [newTierMinPeople, setNewTierMinPeople] = useState('')
  const [newTierMaxPeople, setNewTierMaxPeople] = useState('')
  const [newTierPrice, setNewTierPrice] = useState('')
  const [editingPricingTier, setEditingPricingTier] = useState<PricingTier | null>(null)

  // Estados para tags
  const [newTagName, setNewTagName] = useState('')
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    service.tags?.map(t => t.id) || []
  )

  const mutations = useUpdateService(service.id)
  const { data: allTags = [] } = useTags()
  const tagMutations = useTagMutations()

  // Resetear estados cuando cambia el servicio
  useEffect(() => {
    setTitle(service.title)
    setSummary(service.summary)
    setIncludes(service.includes)
    setExcludes(service.excludes)
    setType(service.type)
    setReferencePrice(service.reference_price)
    setDepartureTime(service.departure_time || '')
    setDurationValue(service.duration_value)
    setDurationUnit(service.duration_unit)
    setSelectedTagIds(service.tags?.map(t => t.id) || [])
  }, [service])

  const handleSaveBasic = () => {
    mutations.updateBasic.mutate(
      {
        title,
        summary,
        includes,
        excludes,
        type,
        reference_price: referencePrice,
        departure_time: departureTime || undefined,
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

  // ==================== PRICE RULE HANDLERS ====================

  const handleAddPriceRule = () => {
    if (!newPriceRuleConcept.trim() || !newPriceRuleAmount) return
    mutations.addPriceRule.mutate(
      {
        concept: newPriceRuleConcept,
        amount: Number(newPriceRuleAmount),
        calculation_type: newPriceRuleCalcType,
      },
      {
        onSuccess: () => {
          setNewPriceRuleConcept('')
          setNewPriceRuleAmount('')
          setNewPriceRuleCalcType('multiply')
        },
      }
    )
  }

  const handleUpdatePriceRule = () => {
    if (!editingPriceRule) return
    mutations.updatePriceRule.mutate(
      {
        id: editingPriceRule.id,
        data: {
          concept: editingPriceRule.concept,
          amount: Number(editingPriceRule.amount),
          calculation_type: editingPriceRule.calculation_type,
        },
      },
      { onSuccess: () => setEditingPriceRule(null) }
    )
  }

  const handleDeletePriceRule = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta regla de precio?')) {
      mutations.deletePriceRule.mutate(id)
    }
  }

  // ==================== PRICING TIER HANDLERS ====================

  const handleAddPricingTier = () => {
    mutations.addPricingTier.reset()

    if (!newTierMinPeople || !newTierMaxPeople || !newTierPrice) return

    mutations.addPricingTier.mutate(
      {
        min_people: Number(newTierMinPeople),
        max_people: Number(newTierMaxPeople),
        total_price: Number(newTierPrice),
      },
      {
        onSuccess: () => {
          setNewTierMinPeople('')
          setNewTierMaxPeople('')
          setNewTierPrice('')
        },
      }
    )
  }

  const handleUpdatePricingTier = () => {
    if (!editingPricingTier) return
    mutations.updatePricingTier.mutate(
      {
        id: editingPricingTier.id,
        data: {
          min_people: editingPricingTier.min_people,
          max_people: editingPricingTier.max_people,
          total_price: Number(editingPricingTier.total_price),
        },
      },
      { onSuccess: () => setEditingPricingTier(null) }
    )
  }

  const handleDeletePricingTier = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este nivel de precio?')) {
      mutations.deletePricingTier.mutate(id)
    }
  }

  // ==================== TAG HANDLERS ====================

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    tagMutations.createTag.mutate(newTagName, {
      onSuccess: () => setNewTagName(''),
    })
  }

  const handleUpdateTag = () => {
    if (!editingTag) return
    tagMutations.updateTag.mutate(
      { id: editingTag.id, name: editingTag.name },
      { onSuccess: () => setEditingTag(null) }
    )
  }

  const handleDeleteTag = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta etiqueta? Se eliminará de todos los servicios.')) {
      tagMutations.deleteTag.mutate(id)
    }
  }

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId))
    } else {
      setSelectedTagIds([...selectedTagIds, tagId])
    }
  }

  const handleSaveTags = () => {
    mutations.addTags.mutate(selectedTagIds)
  }

  if (!isOpen) return null

  // Verificar que estamos en el cliente
  if (typeof document === 'undefined') return null


  const tabs: { key: TabType; label: string }[] = [
    { key: 'basic', label: 'Información' },
    { key: 'itinerary', label: 'Itinerario' },
    { key: 'data', label: 'Info. Adicional' },
    { key: 'media', label: 'Multimedia' },
    { key: 'pricing', label: 'Precios' },
    { key: 'tags', label: 'Etiquetas' },
  ]

  const coverImage = service.media?.find((m) => m.is_cover)
  const galleryImages = service.media?.filter((m) => !m.is_cover) || []

  const pricingError =
    mutations.addPricingTier.error?.response?.data?.non_field_errors?.[0]

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
                className={`py-3 px-4 font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key
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
                    Precio de Referencia
                  </label>
                  <input
                    type="number"
                    value={referencePrice}
                    onChange={(e) => setReferencePrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={0}
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Salida
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          {/* Tab: Precios (PriceRules y PricingTiers) */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              {/* Mensaje según tipo de servicio */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#edfff2' }}>
                <p className="text-sm" style={{ color: '#085f24' }}>
                  {service.type === 'group' && '📋 Servicio Grupal: Solo puede tener una regla de precio con tipo "multiplicar".'}
                  {service.type === 'private' && '📋 Servicio Privado: Puede tener varias reglas de precio con tipos "multiplicar" o "dividir".'}
                  {service.type === 'arbitrary' && '📋 Servicio Arbitrario: Solo usa niveles de precio (rangos de personas).'}
                </p>
              </div>

              {/* Price Rules - Solo para group y private */}
              {(service.type === 'group' || service.type === 'private') && (
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
                    Reglas de Precio
                  </h4>

                  {/* Lista de price rules existentes */}
                  <div className="space-y-3 mb-4">
                    {service.price_rules?.map((rule) => (
                      <div key={rule.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {editingPriceRule?.id === rule.id ? (
                          <>
                            <input
                              type="text"
                              value={editingPriceRule.concept}
                              onChange={(e) => setEditingPriceRule({ ...editingPriceRule, concept: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="number"
                              value={editingPriceRule.amount}
                              onChange={(e) => setEditingPriceRule({ ...editingPriceRule, amount: e.target.value })}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <select
                              value={editingPriceRule.calculation_type}
                              onChange={(e) => setEditingPriceRule({ ...editingPriceRule, calculation_type: e.target.value as CalculationType })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="multiply">Multiplicar</option>
                              {service.type === 'private' && <option value="divide">Dividir</option>}
                            </select>
                            <button
                              onClick={handleUpdatePriceRule}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingPriceRule(null)}
                              className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{rule.concept}</span>
                            <span className="text-gray-600">$ {rule.amount}</span>
                            <span className="px-2 py-1 text-xs rounded-full" style={{
                              backgroundColor: rule.calculation_type === 'multiply' ? '#edfff2' : '#fef2f2',
                              color: rule.calculation_type === 'multiply' ? '#00932c' : '#dc2626'
                            }}>
                              {rule.calculation_type === 'multiply' ? 'Multiplicar' : 'Dividir'}
                            </span>
                            <button
                              onClick={() => setEditingPriceRule(rule)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePriceRule(rule.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    {(!service.price_rules || service.price_rules.length === 0) && (
                      <p className="text-gray-500 text-sm italic">No hay reglas de precio configuradas.</p>
                    )}
                  </div>

                  {/* Agregar nueva price rule */}
                  {(service.type === 'private' || (service.type === 'group' && (!service.price_rules || service.price_rules.length === 0))) && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="text-sm font-medium mb-3">Agregar Nueva Regla</h5>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newPriceRuleConcept}
                          onChange={(e) => setNewPriceRuleConcept(e.target.value)}
                          placeholder="Concepto (ej: Transporte)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          value={newPriceRuleAmount}
                          onChange={(e) => setNewPriceRuleAmount(e.target.value)}
                          placeholder="Monto"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min={0}
                          step="0.01"
                        />
                        <select
                          value={newPriceRuleCalcType}
                          onChange={(e) => setNewPriceRuleCalcType(e.target.value as CalculationType)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="multiply">Multiplicar</option>
                          {service.type === 'private' && <option value="divide">Dividir</option>}
                        </select>
                        <button
                          onClick={handleAddPriceRule}
                          disabled={mutations.addPriceRule.isPending}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Plus size={18} />
                          {mutations.addPriceRule.isPending ? 'Agregando...' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Tiers - Solo para arbitrary */}
              {service.type === 'arbitrary' && (
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
                    Niveles de Precio (por rango de personas)
                  </h4>

                  {/* Lista de pricing tiers existentes */}
                  <div className="space-y-3 mb-4">
                    {service.pricing_tiers?.map((tier) => (
                      <div key={tier.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {editingPricingTier?.id === tier.id ? (
                          <>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingPricingTier.min_people}
                                onChange={(e) => setEditingPricingTier({ ...editingPricingTier, min_people: Number(e.target.value) })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                min={1}
                              />
                              <span className="text-gray-500">a</span>
                              <input
                                type="number"
                                value={editingPricingTier.max_people}
                                onChange={(e) => setEditingPricingTier({ ...editingPricingTier, max_people: Number(e.target.value) })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                min={1}
                              />
                              <span className="text-gray-500">personas</span>
                            </div>
                            <input
                              type="number"
                              value={editingPricingTier.total_price}
                              onChange={(e) => setEditingPricingTier({ ...editingPricingTier, total_price: e.target.value })}
                              className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              min={0}
                              step="0.01"
                            />
                            <button
                              onClick={handleUpdatePricingTier}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingPricingTier(null)}
                              className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1">
                              <span className="font-medium">{tier.min_people} - {tier.max_people}</span>
                              <span className="text-gray-500 ml-2">personas</span>
                            </span>
                            <span className="font-bold" style={{ color: '#085f24' }}>$ {tier.total_price}</span>
                            <button
                              onClick={() => setEditingPricingTier(tier)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePricingTier(tier.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                    {(!service.pricing_tiers || service.pricing_tiers.length === 0) && (
                      <p className="text-gray-500 text-sm italic">No hay niveles de precio configurados.</p>
                    )}
                  </div>

                  {/* Agregar nuevo pricing tier */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium mb-3">Agregar Nuevo Nivel</h5>
                    <div className="flex gap-3 items-center">
                      <input
                        type="number"
                        value={newTierMinPeople}
                        onChange={(e) => setNewTierMinPeople(e.target.value)}
                        placeholder="Mín"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min={1}
                      />
                      <span className="text-gray-500">a</span>
                      <input
                        type="number"
                        value={newTierMaxPeople}
                        onChange={(e) => setNewTierMaxPeople(e.target.value)}
                        placeholder="Máx"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min={1}
                      />
                      <span className="text-gray-500">personas →</span>
                      <input
                        type="number"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value)}
                        placeholder="Precio total"
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min={0}
                        step="0.01"
                      />
                      <button
                        onClick={handleAddPricingTier}
                        disabled={mutations.addPricingTier.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Plus size={18} />
                        {mutations.addPricingTier.isPending ? 'Agregando...' : 'Agregar'}
                      </button>
                    </div>
                    {pricingError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {pricingError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Etiquetas */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              {/* Etiquetas del servicio */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
                  <TagIcon size={18} />
                  Etiquetas del Servicio
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Selecciona las etiquetas que aplican a este servicio y guarda los cambios.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleToggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${selectedTagIds.includes(tag.id)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {tag.name}
                      {selectedTagIds.includes(tag.id) && <Check size={14} className="inline ml-1" />}
                    </button>
                  ))}
                  {allTags.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No hay etiquetas disponibles. Crea una nueva abajo.</p>
                  )}
                </div>

                <button
                  onClick={handleSaveTags}
                  disabled={mutations.addTags.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {mutations.addTags.isPending ? 'Guardando...' : 'Guardar Etiquetas del Servicio'}
                </button>
              </div>

              {/* Gestionar etiquetas globales */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4" style={{ color: '#085f24' }}>
                  Gestionar Etiquetas (Global)
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Estas etiquetas están disponibles para todos los servicios.
                </p>

                {/* Lista de etiquetas con edición */}
                <div className="space-y-2 mb-4">
                  {allTags.map((tag) => (
                    <div key={tag.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {editingTag?.id === tag.id ? (
                        <>
                          <input
                            type="text"
                            value={editingTag.name}
                            onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={handleUpdateTag}
                            disabled={tagMutations.updateTag.isPending}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingTag(null)}
                            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{tag.name}</span>
                          <button
                            onClick={() => setEditingTag(tag)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={tagMutations.deleteTag.isPending}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Crear nueva etiqueta */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Nombre de la nueva etiqueta"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleCreateTag}
                    disabled={tagMutations.createTag.isPending || !newTagName.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    {tagMutations.createTag.isPending ? 'Creando...' : 'Crear Etiqueta'}
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
