import { useState, useEffect, useMemo } from 'react'
import { useQuoteFullDetail } from '../hooks/useQuotes'
import { useServices } from '@/features/services/hooks/useServices'
import { useCountries } from '@/features/persons/hooks/useCountries'
import { useEditVersion } from '../hooks/useQuoteMutations'
import { updatePerson } from '@/features/persons/api/personsApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SummaryService } from '@/types/service.type'
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Save,
  Loader2,
  X,
  Calendar,
  Users,
  ChevronRight,
  MapPin,
  AlertCircle,
  Check,
} from 'lucide-react'

interface Props {
  quoteId: string
}

// Tipos
interface Participant {
  id: string
  personId?: string
  tempId: string
  name: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  passport_number: string
  birth_date: string
  nationality: string
  isContact: boolean
  isNew: boolean
  isModified: boolean
  originalData?: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    passport_number: string
    birth_date: string
    nationality: string
  }
}

interface ActivityAssignment {
  id: string
  service: SummaryService
  departure_date: string
  departure_time: string
  notes: string
  participants: string[]
  isNew: boolean
  originalParticipants: string[]
}

interface OriginalData {
  notes: string
  validUntil: string
  contactInfo: string
  servicePersonMap: Record<string, string>
}

// Utilidades
const formatPrice = (price?: string | number) => {
  if (price === undefined || price === null) return '$0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numPrice)
}

const formatServiceType = (type: string) => {
  const types: Record<string, string> = { group: 'Grupal', private: 'Privado', arbitrary: 'Arbitrario' }
  return types[type] || type
}

const getTypeStyles = (type: string) => {
  const styles: Record<string, { bg: string; text: string }> = {
    private: { bg: '#fef2f2', text: '#dc2626' },
    group: { bg: '#edfff2', text: '#00932c' },
    arbitrary: { bg: '#fffbeb', text: '#d97706' },
  }
  return styles[type] || { bg: '#f3f4f6', text: '#374151' }
}

export const QuoteEditPage = ({ quoteId }: Props) => {
  const { data: quote, isLoading, error } = useQuoteFullDetail(quoteId)
  const { data: services = [], isLoading: isLoadingServices } = useServices()
  const { data: countries = [] } = useCountries()
  const editVersionMutation = useEditVersion(quoteId)

  // Estado
  const [participants, setParticipants] = useState<Participant[]>([])
  const [activities, setActivities] = useState<ActivityAssignment[]>([])
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<ActivityAssignment | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [originalData, setOriginalData] = useState<OriginalData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Cargar datos cuando se obtiene la cotización
  useEffect(() => {
    if (quote && services.length > 0 && !dataLoaded) {
      console.log('Cargando datos de cotización:', quote)

      // Cargar participantes
      const loadedParticipants: Participant[] = quote.persons_detail.map((person, idx) => ({
        id: person.id,
        personId: person.id,
        tempId: idx === 0 ? 'contact' : `person-${person.id}`,
        name: person.full_name,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email || '',
        phone_number: person.phone_number || '',
        passport_number: person.passport_number || '',
        birth_date: person.birth_date || '',
        nationality: person.nationality || '',
        isContact: !person.is_generic && idx === 0,
        isNew: false,
        isModified: false,
        originalData: {
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email || '',
          phone_number: person.phone_number || '',
          passport_number: person.passport_number || '',
          birth_date: person.birth_date || '',
          nationality: person.nationality || '',
        },
      }))
      setParticipants(loadedParticipants)

      // Crear mapa de service_quote_person_id
      const servicePersonMap: Record<string, string> = {}

      // Agrupar servicios por service_id
      const serviceMap: Record<string, ActivityAssignment> = {}

      for (const person of quote.persons_detail) {
        for (const svc of person.services) {
          const serviceData = services.find((s) => s.id === svc.service_id)
          if (!serviceData) continue

          // Guardar el service_quote_person_id
          const key = `${svc.service_id}:${person.id}`
          servicePersonMap[key] = svc.service_quote_person_id

          if (!serviceMap[svc.service_id]) {
            serviceMap[svc.service_id] = {
              id: `activity-${svc.service_id}`,
              service: serviceData,
              departure_date: svc.departure_date,
              departure_time: svc.departure_time || '',
              notes: svc.notes || '',
              participants: [person.id],
              originalParticipants: [person.id],
              isNew: false,
            }
          } else {
            if (!serviceMap[svc.service_id].participants.includes(person.id)) {
              serviceMap[svc.service_id].participants.push(person.id)
              serviceMap[svc.service_id].originalParticipants.push(person.id)
            }
          }
        }
      }

      const loadedActivities = Object.values(serviceMap)
      setActivities(loadedActivities)
      console.log('Actividades cargadas:', loadedActivities)

      // Cargar otros campos
      setNotes(quote.notes || '')
      setValidUntil(quote.valid_until || '')
      setContactInfo(quote.contact_info || '')

      // Guardar estado original
      setOriginalData({
        notes: quote.notes || '',
        validUntil: quote.valid_until || '',
        contactInfo: quote.contact_info || '',
        servicePersonMap,
      })

      setDataLoaded(true)
    }
  }, [quote, services, dataLoaded])

  // Filtrar servicios disponibles (no agregados)
  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.type.toLowerCase().includes(serviceSearch.toLowerCase())
  )
  const availableServices = filteredServices.filter(
    (s) => !activities.some((a) => a.service.id === s.id)
  )

  // Handlers
  const handleAddParticipant = () => {
    const newNum = participants.length
    const newParticipant: Participant = {
      id: `new-${Date.now()}`,
      tempId: `temp-${newNum}`,
      name: `Pasajero #${newNum}`,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      passport_number: '',
      birth_date: '',
      nationality: '',
      isContact: false,
      isNew: true,
      isModified: false,
    }
    setParticipants([...participants, newParticipant])
  }

  const handleRemoveParticipant = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId)
    if (!participant || participant.isContact) return
    setParticipants(participants.filter((p) => p.id !== participantId))
    setActivities(
      activities.map((a) => ({
        ...a,
        participants: a.participants.filter((pid) => pid !== participantId),
      }))
    )
    // Actualizar selectedActivity si está activa
    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        participants: selectedActivity.participants.filter((pid) => pid !== participantId),
      })
    }
  }

  const handleParticipantChange = (participantId: string, field: keyof Participant, value: string) => {
    setParticipants(
      participants.map((p) => {
        if (p.id !== participantId) return p
        const updated = { ...p, [field]: value, isModified: true }
        if (field === 'first_name' || field === 'last_name') {
          const firstName = field === 'first_name' ? value : p.first_name
          const lastName = field === 'last_name' ? value : p.last_name
          updated.name = `${firstName} ${lastName}`.trim() || p.name
        }
        return updated
      })
    )
  }

  const handleSelectService = (service: SummaryService) => {
    const newActivity: ActivityAssignment = {
      id: `activity-${Date.now()}`,
      service: service,
      departure_date: '',
      departure_time: '',
      notes: '',
      participants: [],
      originalParticipants: [],
      isNew: true,
    }
    const newActivities = [...activities, newActivity]
    setActivities(newActivities)
    setSelectedActivity(newActivity)
  }

  const handleActivityChange = (activityId: string, field: string, value: string) => {
    const updated = activities.map((a) =>
      a.id === activityId ? { ...a, [field]: value } : a
    )
    setActivities(updated)
    if (selectedActivity?.id === activityId) {
      setSelectedActivity({ ...selectedActivity, [field]: value } as ActivityAssignment)
    }
  }

  const handleToggleParticipantInActivity = (activityId: string, participantId: string) => {
    const updated = activities.map((a) => {
      if (a.id !== activityId) return a
      const isIn = a.participants.includes(participantId)
      return {
        ...a,
        participants: isIn
          ? a.participants.filter((pid) => pid !== participantId)
          : [...a.participants, participantId],
      }
    })
    setActivities(updated)
    const updatedActivity = updated.find((a) => a.id === activityId)
    if (selectedActivity?.id === activityId && updatedActivity) {
      setSelectedActivity(updatedActivity)
    }
  }

  const handleRemoveActivity = (activityId: string) => {
    setActivities(activities.filter((a) => a.id !== activityId))
    if (selectedActivity?.id === activityId) setSelectedActivity(null)
  }

  const calculateTotal = () => {
    return activities.reduce((sum, a) => {
      const price = parseFloat(a.service.reference_price || '0')
      return sum + price * a.participants.length
    }, 0)
  }

  // Detectar cambios
  const hasChanges = useMemo(() => {
    if (!originalData) return false

    // Campos básicos
    if (notes !== originalData.notes) return true
    if (validUntil !== originalData.validUntil) return true
    if (contactInfo !== originalData.contactInfo) return true

    // Participantes nuevos con datos
    if (participants.some((p) => p.isNew && p.first_name && p.last_name)) return true

    // Participantes modificados
    if (participants.some((p) => p.isModified && !p.isNew)) return true

    // Actividades nuevas con participantes y fecha
    if (activities.some((a) => a.isNew && a.participants.length > 0 && a.departure_date)) return true

    // Actividades eliminadas (existían originalmente pero ya no)
    for (const [key] of Object.entries(originalData.servicePersonMap)) {
      const [serviceId] = key.split(':')
      if (!activities.find((a) => a.service.id === serviceId)) return true
    }

    // Cambios en participantes de actividades existentes
    for (const activity of activities) {
      if (activity.isNew) continue

      // Participantes agregados
      const added = activity.participants.filter((p) => !activity.originalParticipants.includes(p))
      if (added.length > 0) return true

      // Participantes eliminados
      const removed = activity.originalParticipants.filter((p) => !activity.participants.includes(p))
      if (removed.length > 0) return true
    }

    return false
  }, [activities, participants, notes, validUntil, contactInfo, originalData])

  // Submit
  const handleSubmit = async () => {
    if (!originalData) return

    setIsSaving(true)

    try {
      // 1. Actualizar personas existentes modificadas
      const modifiedExistingPersons = participants.filter(
        (p) => !p.isNew && p.isModified && p.personId
      )

      for (const person of modifiedExistingPersons) {
        const updateData: Record<string, string> = {}
        if (person.first_name !== person.originalData?.first_name) updateData.first_name = person.first_name
        if (person.last_name !== person.originalData?.last_name) updateData.last_name = person.last_name
        if (person.email !== person.originalData?.email) updateData.email = person.email
        if (person.phone_number !== person.originalData?.phone_number) updateData.phone_number = person.phone_number
        if (person.passport_number !== person.originalData?.passport_number) updateData.passport_number = person.passport_number
        if (person.birth_date !== person.originalData?.birth_date) updateData.birth_date = person.birth_date
        if (person.nationality !== person.originalData?.nationality) updateData.nationality = person.nationality

        if (Object.keys(updateData).length > 0) {
          await updatePerson(person.personId!, updateData)
        }
      }

      // 2. Preparar datos para edit-version
      const editData: Record<string, unknown> = {}

      // Campos básicos
      if (notes !== originalData.notes) editData.notes = notes
      if (validUntil !== originalData.validUntil) editData.valid_until = validUntil
      if (contactInfo !== originalData.contactInfo) editData.contact_info = contactInfo

      // IDs a eliminar
      const toRemove: string[] = []

      // Buscar service_quote_person_ids a eliminar
      for (const [key, sqpId] of Object.entries(originalData.servicePersonMap)) {
        const [serviceId, personId] = key.split(':')
        const activity = activities.find((a) => a.service.id === serviceId)

        if (!activity) {
          // Actividad eliminada completamente
          toRemove.push(sqpId)
        } else if (!activity.participants.includes(personId)) {
          // Persona eliminada de esta actividad
          toRemove.push(sqpId)
        }
      }

      if (toRemove.length > 0) {
        editData.remove_service_persons = toRemove
      }

      // Nuevos servicios para personas existentes
      const newServices: Array<{
        service_id: string
        person_id: string
        departure_date: string
        departure_time?: string
        notes?: string
      }> = []

      for (const activity of activities) {
        for (const participantId of activity.participants) {
          const participant = participants.find((p) => p.id === participantId)
          if (!participant || participant.isNew) continue

          // Verificar si es nuevo en esta actividad
          const key = `${activity.service.id}:${participantId}`
          const existsInOriginal = originalData.servicePersonMap[key]

          if (!existsInOriginal && activity.departure_date) {
            newServices.push({
              service_id: activity.service.id,
              person_id: participant.personId!,
              departure_date: activity.departure_date,
              departure_time: activity.departure_time || undefined,
              notes: activity.notes || undefined,
            })
          }
        }
      }

      if (newServices.length > 0) {
        editData.services = newServices
      }

      // Nuevos participantes con sus servicios
      const newParticipantsWithData = participants.filter((p) => p.isNew && p.first_name && p.last_name)
      if (newParticipantsWithData.length > 0) {
        editData.add_persons = newParticipantsWithData.map((p) => ({
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email || undefined,
          phone_number: p.phone_number || undefined,
          passport_number: p.passport_number || undefined,
          birth_date: p.birth_date || undefined,
          nationality: p.nationality || undefined,
          services: activities
            .filter((a) => a.participants.includes(p.id) && a.departure_date)
            .map((a) => ({
              service_id: a.service.id,
              departure_date: a.departure_date,
              departure_time: a.departure_time || undefined,
              notes: a.notes || undefined,
            })),
        }))
      }

      console.log('Datos a enviar:', editData)

      // Solo llamar al API si hay cambios en la cotización
      if (Object.keys(editData).length > 0) {
        await editVersionMutation.mutateAsync(editData as never)
      }

      window.location.href = `/quotes/${quoteId}`
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando cotización...</span>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error al cargar la cotización</p>
        <a href="/quotes" className="mt-4 text-green-600 hover:underline">Volver</a>
      </div>
    )
  }

  // Si no hay servicios cargados aún pero tenemos la cotización, mostrar loading de servicios
  if (isLoadingServices && services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando servicios...</span>
      </div>
    )
  }

  // Si tenemos quote y services pero dataLoaded es false, esperar a que se carguen los datos
  if (!dataLoaded && quote && services.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Preparando datos...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fafafa' }}>
      {/* Header fijo */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href={`/quotes/${quoteId}`} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#085f24' }}>
                Editar Cotización
              </h1>
              <p className="text-sm text-gray-500">
                {quote.contact_info} - Versión {quote.version}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold" style={{ color: '#00932c' }}>
                {formatPrice(calculateTotal())}
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!hasChanges || isSaving}
              style={{ backgroundColor: hasChanges ? '#00bf35' : '#9ca3af' }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex">
        {/* Panel Izquierdo */}
        <div className="w-1/2 border-r bg-white flex flex-col">
          {/* Contacto */}
          <div className="p-4 border-b">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto Principal
              </label>
              <Input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Nombre del contacto"
              />
            </div>
          </div>

          {/* Actividades */}
          <div className="p-6 border-b">
            <h2 className="font-semibold mb-4" style={{ color: '#085f24' }}>
              Actividades ({activities.length})
            </h2>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay actividades</p>
                <p className="text-sm">Busca y agrega actividades abajo</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activities.map((activity) => {
                  const typeStyles = getTypeStyles(activity.service.type)
                  const isSelected = selectedActivity?.id === activity.id
                  const hasParticipants = activity.participants.length > 0
                  const hasDate = !!activity.departure_date

                  return (
                    <div
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{activity.service.title}</p>
                            {activity.isNew && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                                Nuevo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                            >
                              {formatServiceType(activity.service.type)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.participants.length} pax
                            </span>
                            {!hasParticipants && (
                              <span className="text-xs text-red-500">Sin participantes</span>
                            )}
                            {!hasDate && (
                              <span className="text-xs text-red-500">Sin fecha</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(
                              parseFloat(activity.service.reference_price || '0') *
                                activity.participants.length
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveActivity(activity.id)
                            }}
                            className="p-1 rounded hover:bg-red-100"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Buscador */}
          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            <h3 className="font-semibold mb-4" style={{ color: '#085f24' }}>
              Agregar Actividad
            </h3>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Buscar actividad..."
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingServices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span className="text-gray-500">Cargando...</span>
                </div>
              ) : availableServices.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No hay más actividades disponibles</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-600">Título</th>
                      <th className="text-left p-2 font-medium text-gray-600">Duración</th>
                      <th className="text-left p-2 font-medium text-gray-600">Precio</th>
                      <th className="text-left p-2 font-medium text-gray-600">Tipo</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableServices.map((service) => {
                      const typeStyles = getTypeStyles(service.type)
                      return (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{service.title}</td>
                          <td className="p-2 text-gray-600">{service.duration}</td>
                          <td className="p-2 font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(service.reference_price)}
                          </td>
                          <td className="p-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                            >
                              {formatServiceType(service.type)}
                            </span>
                          </td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              onClick={() => handleSelectService(service)}
                              style={{ backgroundColor: '#00bf35' }}
                            >
                              <Plus size={14} className="mr-1" />
                              Agregar
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="w-1/2 flex flex-col">
          {selectedActivity ? (
            <>
              {/* Header de actividad */}
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold" style={{ color: '#085f24' }}>
                    {selectedActivity.service.title}
                  </h2>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedActivity.service.duration}</span>
                  <span className="font-medium" style={{ color: '#00932c' }}>
                    {formatPrice(selectedActivity.service.reference_price)} / persona
                  </span>
                </div>
              </div>

              {/* Configuración */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Fechas */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar size={16} />
                    Fecha y Hora
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de inicio *</label>
                      <Input
                        type="date"
                        value={selectedActivity.departure_date}
                        onChange={(e) =>
                          handleActivityChange(selectedActivity.id, 'departure_date', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hora de salida</label>
                      <Input
                        type="time"
                        value={selectedActivity.departure_time}
                        onChange={(e) =>
                          handleActivityChange(selectedActivity.id, 'departure_time', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Participantes */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Users size={16} />
                      Participantes ({selectedActivity.participants.length})
                    </h3>
                    <Button variant="outline" size="sm" onClick={handleAddParticipant}>
                      <Plus size={14} className="mr-1" />
                      Nuevo Participante
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {participants.map((participant) => {
                      const isInActivity = selectedActivity.participants.includes(participant.id)
                      const isEditing = editingParticipant === participant.id

                      return (
                        <div key={participant.id}>
                          <div
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                              isInActivity
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() =>
                              handleToggleParticipantInActivity(selectedActivity.id, participant.id)
                            }
                          >
                            <input
                              type="checkbox"
                              checked={isInActivity}
                              onChange={() => {}}
                              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {participant.first_name || participant.last_name
                                    ? `${participant.first_name} ${participant.last_name}`.trim()
                                    : participant.name}
                                </span>
                                {participant.isContact && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                    Contacto
                                  </span>
                                )}
                                {participant.isNew && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                    Nuevo
                                  </span>
                                )}
                                {participant.isModified && !participant.isNew && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                    Modificado
                                  </span>
                                )}
                              </div>
                              {participant.email && (
                                <p className="text-xs text-gray-500">{participant.email}</p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingParticipant(isEditing ? null : participant.id)
                              }}
                              className="text-xs text-blue-600 hover:underline px-2"
                            >
                              {isEditing ? 'Cerrar' : 'Editar'}
                            </button>
                            {!participant.isContact && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveParticipant(participant.id)
                                }}
                                className="p-1 rounded hover:bg-red-100"
                              >
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            )}
                          </div>

                          {/* Formulario de edición */}
                          {isEditing && (
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg border-l-4 border-l-blue-500">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Nombre *</label>
                                  <Input
                                    value={participant.first_name}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'first_name', e.target.value)
                                    }
                                    placeholder="Nombre"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Apellido *</label>
                                  <Input
                                    value={participant.last_name}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'last_name', e.target.value)
                                    }
                                    placeholder="Apellido"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                                  <Input
                                    type="email"
                                    value={participant.email}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'email', e.target.value)
                                    }
                                    placeholder="email@ejemplo.com"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                                  <Input
                                    value={participant.phone_number}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'phone_number', e.target.value)
                                    }
                                    placeholder="+51 999 999 999"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Pasaporte</label>
                                  <Input
                                    value={participant.passport_number}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'passport_number', e.target.value)
                                    }
                                    placeholder="Número de pasaporte"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Fecha Nacimiento</label>
                                  <Input
                                    type="date"
                                    value={participant.birth_date}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'birth_date', e.target.value)
                                    }
                                    className="h-9"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs text-gray-500 mb-1">Nacionalidad</label>
                                  <select
                                    value={participant.nationality}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'nationality', e.target.value)
                                    }
                                    className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="">Seleccionar nacionalidad...</option>
                                    {countries.map((c) => (
                                      <option key={c.value} value={c.value}>
                                        {c.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Notas */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-medium mb-4">Notas de la Actividad</h3>
                  <textarea
                    value={selectedActivity.notes}
                    onChange={(e) =>
                      handleActivityChange(selectedActivity.id, 'notes', e.target.value)
                    }
                    placeholder="Notas especiales para esta actividad..."
                    className="w-full p-3 border rounded-md text-sm resize-none h-24"
                  />
                </div>
              </div>
            </>
          ) : (
            // Sin actividad seleccionada
            <div className="flex-1 flex flex-col bg-gray-50">
              <div className="p-6 bg-white border-b">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#085f24' }}>
                  Información General
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Válido hasta</label>
                    <Input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Notas generales</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notas de la cotización..."
                      className="w-full p-3 border rounded-md text-sm resize-none h-24"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#085f24' }}>
                  Resumen de Costos
                </h2>

                {activities.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No hay actividades</p>
                    <p className="text-sm mt-2">Busca y agrega actividades desde el panel izquierdo</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border p-4">
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex justify-between text-sm p-2 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <div>
                            <p className="font-medium">{activity.service.title}</p>
                            <p className="text-xs text-gray-500">
                              {activity.participants.length} participante(s)
                            </p>
                          </div>
                          <span className="font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(
                              parseFloat(activity.service.reference_price || '0') *
                                activity.participants.length
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr className="my-4" />

                    <div
                      className="p-4 rounded-lg flex justify-between items-center"
                      style={{ backgroundColor: '#edfff2' }}
                    >
                      <span className="font-semibold" style={{ color: '#085f24' }}>
                        TOTAL
                      </span>
                      <span className="text-2xl font-bold" style={{ color: '#00932c' }}>
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!hasChanges && (
                <div className="p-4 bg-white border-t text-center">
                  <p className="text-sm text-gray-400">
                    <Check size={16} className="inline mr-1" />
                    No hay cambios pendientes
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

