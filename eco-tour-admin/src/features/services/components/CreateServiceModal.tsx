import { useState } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useCreateService } from '../hooks/useCreateService'
import { DurationUnit, TypeService } from '@/types/service.type'

interface DataItem {
  title: string
  description: string
}

interface CreateServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateServiceModal = ({ isOpen, onClose }: CreateServiceModalProps) => {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [includes, setIncludes] = useState('')
  const [excludes, setExcludes] = useState('')
  const [type, setType] = useState<TypeService>('private')
  const [referencePrice, setReferencePrice] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [durationValue, setDurationValue] = useState(1)
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('days')
  const [data, setData] = useState<DataItem[]>([{ title: '', description: '' }])
  const [itinerary, setItinerary] = useState<DataItem[]>([{ title: '', description: '' }])
  const [media, setMedia] = useState<File[]>([])
  const [cover, setCover] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string[]>([])

  const { mutate: createServiceMutation, isPending } = useCreateService()

  const handleAddDataItem = () => {
    setData([...data, { title: '', description: '' }])
  }

  const handleRemoveDataItem = (index: number) => {
    setData(data.filter((_, i) => i !== index))
  }

  const handleDataChange = (index: number, field: 'title' | 'description', value: string) => {
    const newData = [...data]
    newData[index][field] = value
    setData(newData)
  }

  const handleAddItineraryItem = () => {
    setItinerary([...itinerary, { title: '', description: '' }])
  }

  const handleRemoveItineraryItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    const newItinerary = [...itinerary]
    newItinerary[index][field] = value
    setItinerary(newItinerary)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCover(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMedia([...media, ...files])
    const previews = files.map((file) => URL.createObjectURL(file))
    setMediaPreview([...mediaPreview, ...previews])
  }

  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index))
    setMediaPreview(mediaPreview.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setTitle('')
    setSummary('')
    setIncludes('')
    setExcludes('')
    setType('private')
    setReferencePrice('')
    setDepartureTime('')
    setDurationValue(1)
    setDurationUnit('days')
    setData([{ title: '', description: '' }])
    setItinerary([{ title: '', description: '' }])
    setMedia([])
    setCover(null)
    setCoverPreview(null)
    setMediaPreview([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createServiceMutation(
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
        data: data.filter((d) => d.title.trim() !== ''),
        itinerary: itinerary.filter((i) => i.title.trim() !== ''),
        media,
        cover,
      },
      {
        onSuccess: () => {
          onClose()
          resetForm()
        },
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold" style={{ color: '#085f24' }}>
            Crear Nuevo Servicio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
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
                Precio de Referencia *
              </label>
              <input
                type="number"
                value={referencePrice}
                onChange={(e) => setReferencePrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
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
                  Duración *
                </label>
                <input
                  type="number"
                  value={durationValue}
                  onChange={(e) => setDurationValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad *
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

          {/* Resumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen *
            </label>
            <ReactQuill
              theme="snow"
              value={summary}
              onChange={setSummary}
              className="bg-white rounded-lg"
            />
          </div>

          {/* Incluye */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incluye *
            </label>
            <ReactQuill
              theme="snow"
              value={includes}
              onChange={setIncludes}
              className="bg-white rounded-lg"
            />
          </div>

          {/* No Incluye */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No Incluye *
            </label>
            <ReactQuill
              theme="snow"
              value={excludes}
              onChange={setExcludes}
              className="bg-white rounded-lg"
            />
          </div>

          {/* Imagen de Portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de Portada
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {coverPreview ? (
                <div className="relative inline-block">
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCover(null)
                      setCoverPreview(null)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer py-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <Upload size={32} className="text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Subir imagen de portada
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Galería de Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galería de Imágenes
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-4">
                {mediaPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Media ${index}`}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center cursor-pointer h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus size={24} className="text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Itinerario */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Itinerario
              </label>
              <button
                type="button"
                onClick={handleAddItineraryItem}
                className="flex items-center gap-1 text-sm hover:opacity-80"
                style={{ color: '#00932c' }}
              >
                <Plus size={16} /> Agregar día
              </button>
            </div>
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Día {index + 1}
                    </span>
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleItineraryChange(index, 'title', e.target.value)
                    }
                    placeholder="Título del día"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ReactQuill
                    theme="snow"
                    value={item.description}
                    onChange={(value) =>
                      handleItineraryChange(index, 'description', value)
                    }
                    className="bg-white rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Información Adicional
              </label>
              <button
                type="button"
                onClick={handleAddDataItem}
                className="flex items-center gap-1 text-sm hover:opacity-80"
                style={{ color: '#00932c' }}
              >
                <Plus size={16} /> Agregar información
              </button>
            </div>
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Información {index + 1}
                    </span>
                    {data.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDataItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleDataChange(index, 'title', e.target.value)
                    }
                    placeholder="Título"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ReactQuill
                    theme="snow"
                    value={item.description}
                    onChange={(value) =>
                      handleDataChange(index, 'description', value)
                    }
                    className="bg-white rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#00bf35' }}
              onMouseEnter={(e) => {
                if (!isPending) e.currentTarget.style.backgroundColor = '#00932c'
              }}
              onMouseLeave={(e) => {
                if (!isPending) e.currentTarget.style.backgroundColor = '#00bf35'
              }}
            >
              {isPending ? 'Creando...' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
