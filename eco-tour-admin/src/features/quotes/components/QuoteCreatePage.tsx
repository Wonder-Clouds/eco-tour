import { useState } from 'react'
import { useServices } from '@/features/services/hooks/useServices'
import { useCountries } from '@/features/persons/hooks/useCountries'
import { useBulkCreateQuote } from '../hooks/useQuoteMutations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BulkServiceInput } from '@/types/quote.type'
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
  Clock,
  User,
} from 'lucide-react'

// Tipos
interface Participant {
  id: string
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
}

// Cada participante en una actividad tiene su propia fecha y hora
interface ParticipantAssignment {
  participantId: string
  departure_date: string
  departure_time: string
  arrive_date: string
  arrive_time: string
  notes: string
}

interface ActivityAssignment {
  id: string
  service: SummaryService
  defaultDepartureDate: string
  defaultDepartureTime: string
  defaultArriveDate: string
  defaultArriveTime: string
  defaultNotes: string
  // Cada participante con sus propias fechas/horas
  participantAssignments: ParticipantAssignment[]
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

export const QuoteCreatePage = () => {
  const { data: services = [], isLoading: isLoadingServices } = useServices()
  const { data: countries = [] } = useCountries()
  const bulkCreateMutation = useBulkCreateQuote()

  // Estado - Participantes
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'contact',
      tempId: 'contact',
      name: 'Contacto Principal',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      passport_number: '',
      birth_date: '',
      nationality: '',
      isContact: true,
    },
  ])

  const [participantsCount, setParticipantsCount] = useState(1)

  const handleGenerateParticipants = () => {
    const newParticipants: Participant[] = [
      participants[0], // mantener contacto
    ]

    for (let i = 1; i < participantsCount; i++) {
      newParticipants.push({
        id: `temp-${Date.now()}-${i}`,
        tempId: `temp-${i}`,
        name: `Pasajero #${i}`,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        passport_number: '',
        birth_date: '',
        nationality: '',
        isContact: false,
      })
    }

    setParticipants(newParticipants)
  }

  // Estado - Actividades asignadas
  const [activities, setActivities] = useState<ActivityAssignment[]>([])

  // Estado - UI
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<ActivityAssignment | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtrar servicios
  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.type.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  // Filtrar servicios que NO están ya agregados
  const availableServices = filteredServices.filter(
    (s) => !activities.some((a) => a.service.id === s.id)
  )

  // Agregar participante
  const handleAddParticipant = () => {
    const newNum = participants.length
    const newParticipant: Participant = {
      id: `temp-${Date.now()}`,
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
    }
    setParticipants([...participants, newParticipant])
  }

  // Eliminar participante
  const handleRemoveParticipant = (participantId: string) => {
    if (participantId === 'contact') return
    setParticipants(participants.filter((p) => p.id !== participantId))
    // Eliminar este participante de todas las actividades
    setActivities(
      activities.map((a) => ({
        ...a,
        participantAssignments: a.participantAssignments.filter(
          (pa) => pa.participantId !== participantId
        ),
      }))
    )
    // Actualizar selectedActivity si está activa
    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        participantAssignments: selectedActivity.participantAssignments.filter(
          (pa) => pa.participantId !== participantId
        ),
      })
    }
  }

  // Actualizar participante
  const handleParticipantChange = (participantId: string, field: keyof Participant, value: string) => {
    setParticipants(
      participants.map((p) => {
        if (p.id !== participantId) return p
        const updated = { ...p, [field]: value }
        if (field === 'first_name' || field === 'last_name') {
          const firstName = field === 'first_name' ? value : p.first_name
          const lastName = field === 'last_name' ? value : p.last_name
          updated.name = `${firstName} ${lastName}`.trim() || (p.isContact ? 'Contacto Principal' : `Pasajero #${participants.indexOf(p)}`)
        }
        return updated
      })
    )
  }

  // Seleccionar actividad (servicio)
  const handleSelectService = (service: SummaryService) => {
    console.log(service)
    const newActivity: ActivityAssignment = {
      id: `activity-${Date.now()}`,
      service: service,

      defaultDepartureTime: service.departure_time || '',

      defaultDepartureDate: '',
      defaultArriveDate: '',
      defaultArriveTime: '',
      defaultNotes: '',
      participantAssignments: [],
    }

    setActivities([...activities, newActivity])
    setSelectedActivity(newActivity)
  }

  // Actualizar campos por defecto de la actividad
  const handleActivityDefaultChange = (activityId: string, field: string, value: string) => {
    const updated = activities.map((a) => {
      if (a.id !== activityId) return a

      const updatedActivity = { ...a, [field]: value }

      // 🔥 aplicar automáticamente a todos
      updatedActivity.participantAssignments = updatedActivity.participantAssignments.map((pa) => ({
        ...pa,
        departure_date: field === 'defaultDepartureDate' ? value : pa.departure_date,
        departure_time: field === 'defaultDepartureTime' ? value : pa.departure_time,
        arrive_date: field === 'defaultArriveDate' ? value : pa.arrive_date,
        arrive_time: field === 'defaultArriveTime' ? value : pa.arrive_time,
        notes: field === 'defaultNotes' ? value : pa.notes,
      }))

      return updatedActivity
    })

    setActivities(updated)

    if (selectedActivity?.id === activityId) {
      const updatedActivity = updated.find((a) => a.id === activityId)
      if (updatedActivity) setSelectedActivity(updatedActivity)
    }
  }

  // Toggle participante en actividad (con fechas individuales)
  const handleToggleParticipantInActivity = (activityId: string, participantId: string) => {
    const activity = activities.find((a) => a.id === activityId)
    if (!activity) return

    const existingAssignment = activity.participantAssignments.find(
      (pa) => pa.participantId === participantId
    )

    let newAssignments: ParticipantAssignment[]

    if (existingAssignment) {
      // Remover participante
      newAssignments = activity.participantAssignments.filter(
        (pa) => pa.participantId !== participantId
      )
    } else {
      // Agregar participante con valores por defecto de la actividad
      newAssignments = [
        ...activity.participantAssignments,
        {
          participantId,
          departure_date: activity.defaultDepartureDate,
          departure_time: activity.defaultDepartureTime,
          arrive_date: activity.defaultArriveDate,
          arrive_time: activity.defaultArriveTime,
          notes: activity.defaultNotes,
        },
      ]
    }

    const updated = activities.map((a) =>
      a.id === activityId ? { ...a, participantAssignments: newAssignments } : a
    )
    setActivities(updated)

    if (selectedActivity?.id === activityId) {
      setSelectedActivity({ ...selectedActivity, participantAssignments: newAssignments })
    }
  }

  // Actualizar asignación de un participante en una actividad
  const handleParticipantAssignmentChange = (
    activityId: string,
    participantId: string,
    field: keyof ParticipantAssignment,
    value: string
  ) => {
    const updated = activities.map((a) => {
      if (a.id !== activityId) return a
      return {
        ...a,
        participantAssignments: a.participantAssignments.map((pa) =>
          pa.participantId === participantId ? { ...pa, [field]: value } : pa
        ),
      }
    })
    setActivities(updated)

    if (selectedActivity?.id === activityId) {
      const updatedActivity = updated.find((a) => a.id === activityId)
      if (updatedActivity) {
        setSelectedActivity(updatedActivity)
      }
    }
  }

  // Aplicar valores por defecto a todos los participantes de una actividad
  const handleApplyDefaultsToAll = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId)
    if (!activity) return

    const updated = activities.map((a) => {
      if (a.id !== activityId) return a
      return {
        ...a,
        participantAssignments: a.participantAssignments.map((pa) => ({
          ...pa,
          departure_date: a.defaultDepartureDate,
          departure_time: a.defaultDepartureTime,
          arrive_date: a.defaultArriveDate,
          arrive_time: a.defaultArriveTime,
          notes: a.defaultNotes,
        })),
      }
    })
    setActivities(updated)

    const updatedActivity = updated.find((a) => a.id === activityId)
    if (selectedActivity?.id === activityId && updatedActivity) {
      setSelectedActivity(updatedActivity)
    }
  }

  // Eliminar actividad
  const handleRemoveActivity = (activityId: string) => {
    setActivities(activities.filter((a) => a.id !== activityId))
    if (selectedActivity?.id === activityId) {
      setSelectedActivity(null)
    }
  }

  // Calcular total
  const calculateTotal = () => {
    return activities.reduce((sum, a) => {
      const pricePerPerson = parseFloat(a.service.reference_price || '0')
      return sum + pricePerPerson * a.participantAssignments.length
    }, 0)
  }

  // Obtener nombre del contacto
  const getContactName = () => {
    const contact = participants.find((p) => p.isContact)
    if (contact?.first_name || contact?.last_name) {
      return `${contact.first_name} ${contact.last_name}`.trim()
    }
    return ''
  }

  // Validar
  const canSubmit = () => {
    const contactName = getContactName()
    if (!contactName) return false
    if (activities.length === 0) return false
    // Cada actividad debe tener al menos un participante con fecha de salida
    return activities.every(
      (a) =>
        a.participantAssignments.length > 0 &&
        a.participantAssignments.every((pa) => pa.departure_date)
    )
  }

  // Submit
  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    const servicesData: BulkServiceInput[] = []

    for (const activity of activities) {
      for (const pa of activity.participantAssignments) {
        const participant = participants.find((p) => p.id === pa.participantId)
        if (!participant) continue

        // Determinar el person_temp_id según el API
        let personTempId: string | Record<string, string>

        if (participant.isContact) {
          // Contacto principal - enviar "contact" y los datos en contact_info del bulk
          personTempId = 'contact'
        } else if (participant.first_name && participant.last_name) {
          // Participante con datos - enviar objeto con datos
          personTempId = {
            first_name: participant.first_name,
            last_name: participant.last_name,
            email: participant.email || '',
            phone_number: participant.phone_number || '',
            passport_number: participant.passport_number || '',
            nationality: participant.nationality || '',
          }
        } else {
          // Participante temporal - enviar tempId
          personTempId = participant.tempId
        }

        servicesData.push({
          service_id: activity.service.id,
          person_temp_id: personTempId as string,
          departure_date: pa.departure_date,
          departure_time: pa.departure_time || undefined,
          arrive_date: pa.arrive_date || undefined,
          arrive_time: pa.arrive_time || undefined,
          notes: pa.notes || undefined,
        } as BulkServiceInput)
      }
    }

    // Obtener datos del contacto principal
    const contact = participants.find((p) => p.isContact)

    try {
      const newQuote = await bulkCreateMutation.mutateAsync({
        contact_info: {
          first_name: contact?.first_name || '',
          last_name: contact?.last_name || '',
          email: contact?.email || '',
          phone_number: contact?.phone_number || '',
          passport_number: contact?.passport_number || '',
          nationality: contact?.nationality || '',
        } as unknown as string,
        notes: notes || undefined,
        valid_until: validUntil || undefined,
        services: servicesData,
      })

      console.log('Cotización creada:', newQuote)

      if (newQuote?.id) {
        window.location.replace(`/quotes/${newQuote.id}`)
      } else {
        window.location.replace('/quotes')
      }
    } catch (error) {
      console.error('Error al crear cotización:', error)
      alert('Error al crear la cotización')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fafafa' }}>
      {/* Header Fijo */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/quotes" className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#085f24' }}>
                Nueva Cotización
              </h1>
              <p className="text-sm text-gray-500">Selecciona actividades y asigna participantes con fechas individuales</p>
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
              disabled={!canSubmit() || isSubmitting || bulkCreateMutation.isPending}
              style={{
                backgroundColor: canSubmit() && !isSubmitting ? '#00bf35' : '#9ca3af',
              }}
            >
              {isSubmitting || bulkCreateMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Crear Cotización
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Panel Izquierdo */}
        <div className="w-1/2 border-r bg-white flex flex-col">
          {/* Info del grupo */}
          <div className="p-4 border-b">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacto Principal
              </label>
              <Input
                value={getContactName()}
                placeholder="Se actualiza automáticamente"
                className="bg-white"
                readOnly
              />
            </div>
          </div>

          {/* Actividades seleccionadas */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: '#085f24' }}>
                Actividades ({activities.length})
              </h2>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay actividades agregadas</p>
                <p className="text-sm">Busca y selecciona actividades abajo</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.map((activity) => {
                  const typeStyles = getTypeStyles(activity.service.type)
                  const isSelected = selectedActivity?.id === activity.id
                  const hasParticipants = activity.participantAssignments.length > 0
                  const allHaveDates = activity.participantAssignments.every(
                    (pa) => pa.departure_date
                  )

                  return (
                    <div
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.service.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                            >
                              {formatServiceType(activity.service.type)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.participantAssignments.length} pax
                            </span>
                            {!hasParticipants && (
                              <span className="text-xs text-red-500">Sin participantes</span>
                            )}
                            {hasParticipants && !allHaveDates && (
                              <span className="text-xs text-red-500">Faltan fechas</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(
                              parseFloat(activity.service.reference_price || '0') *
                              activity.participantAssignments.length
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

          {/* Buscador de actividades */}
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
                  <p className="text-sm">Todas las actividades ya fueron agregadas</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-600">Título</th>
                      <th className="text-left p-2 font-medium text-gray-600">Duración</th>
                      <th className="text-left p-2 font-medium text-gray-600">Precio Ref.</th>
                      <th className="text-left p-2 font-medium text-gray-600">Tipo</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableServices.map((service) => {
                      const typeStyles = getTypeStyles(service.type)
                      return (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <p className="font-medium">{service.title}</p>
                          </td>
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

        {/* Panel Derecho - Configuración de Actividad */}
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
                {/* Valores por defecto */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar size={16} />
                      Valores por defecto
                    </h3>
                    {selectedActivity.participantAssignments.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyDefaultsToAll(selectedActivity.id)}
                        className="text-xs"
                      >
                        Aplicar a todos
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de salida</label>
                      <Input
                        type="date"
                        value={selectedActivity.defaultDepartureDate}
                        onChange={(e) =>
                          handleActivityDefaultChange(
                            selectedActivity.id,
                            'defaultDepartureDate',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hora de salida</label>
                      <Input
                        type="time"
                        value={selectedActivity.defaultDepartureTime}
                        onChange={(e) =>
                          handleActivityDefaultChange(
                            selectedActivity.id,
                            'defaultDepartureTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de llegada</label>
                      <Input
                        type="date"
                        value={selectedActivity.defaultArriveDate}
                        onChange={(e) =>
                          handleActivityDefaultChange(
                            selectedActivity.id,
                            'defaultArriveDate',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hora de llegada</label>
                      <Input
                        type="time"
                        value={selectedActivity.defaultArriveTime}
                        onChange={(e) =>
                          handleActivityDefaultChange(
                            selectedActivity.id,
                            'defaultArriveTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Notas por defecto</label>
                    <Input
                      value={selectedActivity.defaultNotes}
                      onChange={(e) =>
                        handleActivityDefaultChange(
                          selectedActivity.id,
                          'defaultNotes',
                          e.target.value
                        )
                      }
                      placeholder="Notas para nuevos participantes..."
                    />
                  </div>
                </div>

                {/* Participantes */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Users size={16} />
                      Participantes ({selectedActivity.participantAssignments.length})
                    </h3>
                    <Button variant="outline" size="sm" onClick={handleAddParticipant}>
                      <Plus size={14} className="mr-1" />
                      Nuevo
                    </Button>
                  </div>

                  <div className="flex gap-2 items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={participantsCount}
                        onChange={(e) => setParticipantsCount(Number(e.target.value))}
                        className="w-15"
                      />
                      <span>Participantes</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleGenerateParticipants}>
                      Generar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {participants.map((participant) => {
                      const assignment = selectedActivity.participantAssignments.find(
                        (pa) => pa.participantId === participant.id
                      )
                      const isInActivity = !!assignment
                      const isEditing = editingParticipant === participant.id

                      return (
                        <div key={participant.id} className="border rounded-lg overflow-hidden">
                          {/* Header del participante */}
                          <div
                            className={`flex items-center gap-3 p-3 transition ${isInActivity ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isInActivity}
                              onChange={() =>
                                handleToggleParticipantInActivity(
                                  selectedActivity.id,
                                  participant.id
                                )
                              }
                              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                <span className="font-medium">
                                  {participant.first_name || participant.last_name
                                    ? `${participant.first_name} ${participant.last_name}`.trim()
                                    : participant.name}
                                </span>
                                {participant.isContact && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                    Líder
                                  </span>
                                )}
                              </div>
                              {!participant.first_name && !participant.last_name && (
                                <p className="text-xs text-gray-400">Sin datos personales</p>
                              )}
                            </div>
                            <button
                              onClick={() => setEditingParticipant(isEditing ? null : participant.id)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {isEditing ? 'Cerrar' : 'Editar datos'}
                            </button>
                            {!participant.isContact && (
                              <button
                                onClick={() => handleRemoveParticipant(participant.id)}
                                className="p-1 rounded hover:bg-red-100"
                              >
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            )}
                          </div>

                          {/* Fechas individuales del participante (si está en la actividad) */}
                          {isInActivity && assignment && (
                            <div className="p-3 bg-gray-50 border-t space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <Clock size={12} />
                                  Fechas y horas individuales
                                </span>
                                {!assignment.departure_date && (
                                  <span className="text-xs text-red-500">* Fecha requerida</span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Fecha salida *
                                  </label>
                                  <Input
                                    type="date"
                                    value={assignment.departure_date}
                                    onChange={(e) =>
                                      handleParticipantAssignmentChange(
                                        selectedActivity.id,
                                        participant.id,
                                        'departure_date',
                                        e.target.value
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Hora salida
                                  </label>
                                  <Input
                                    type="time"
                                    value={assignment.departure_time}
                                    onChange={(e) =>
                                      handleParticipantAssignmentChange(
                                        selectedActivity.id,
                                        participant.id,
                                        'departure_time',
                                        e.target.value
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Fecha llegada
                                  </label>
                                  <Input
                                    type="date"
                                    value={assignment.arrive_date}
                                    onChange={(e) =>
                                      handleParticipantAssignmentChange(
                                        selectedActivity.id,
                                        participant.id,
                                        'arrive_date',
                                        e.target.value
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Hora llegada
                                  </label>
                                  <Input
                                    type="time"
                                    value={assignment.arrive_time}
                                    onChange={(e) =>
                                      handleParticipantAssignmentChange(
                                        selectedActivity.id,
                                        participant.id,
                                        'arrive_time',
                                        e.target.value
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Notas</label>
                                <Input
                                  value={assignment.notes}
                                  onChange={(e) =>
                                    handleParticipantAssignmentChange(
                                      selectedActivity.id,
                                      participant.id,
                                      'notes',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Notas para este participante..."
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                          )}

                          {/* Formulario de edición de datos personales */}
                          {isEditing && (
                            <div className="p-4 bg-blue-50 border-t border-l-4 border-l-blue-500">
                              <p className="text-xs font-medium text-blue-700 mb-3">Datos personales</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Nombre</label>
                                  <Input
                                    value={participant.first_name}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        participant.id,
                                        'first_name',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Nombre"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Apellido</label>
                                  <Input
                                    value={participant.last_name}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        participant.id,
                                        'last_name',
                                        e.target.value
                                      )
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
                                    placeholder="Email"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
                                  <Input
                                    value={participant.phone_number}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        participant.id,
                                        'phone_number',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Teléfono"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Pasaporte</label>
                                  <Input
                                    value={participant.passport_number}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        participant.id,
                                        'passport_number',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Pasaporte"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Nacionalidad
                                  </label>
                                  <select
                                    value={participant.nationality}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        participant.id,
                                        'nationality',
                                        e.target.value
                                      )
                                    }
                                    className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="">Seleccionar...</option>
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
              </div>
            </>
          ) : (
            // Sin actividad seleccionada - Mostrar resumen e info
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

              {/* Resumen de costos */}
              <div className="p-6 flex-1">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#085f24' }}>
                  Resumen de Costos
                </h2>

                {activities.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No hay actividades</p>
                    <p className="text-sm mt-2">
                      Busca y agrega actividades desde el panel izquierdo
                    </p>
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
                              {activity.participantAssignments.length} participante(s)
                            </p>
                          </div>
                          <span className="font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(
                              parseFloat(activity.service.reference_price || '0') *
                              activity.participantAssignments.length
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

              {!canSubmit() && (
                <div className="p-4 bg-white border-t text-center">
                  <p className="text-sm text-gray-400">
                    Completa el contacto, agrega actividades con participantes y fechas individuales
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

