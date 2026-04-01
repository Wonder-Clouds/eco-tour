import { useState, useEffect, useCallback } from 'react'
import { useQuoteFullDetail } from '../hooks/useQuotes'
import {
  useUpdateQuote,
  useDeleteServiceQuotePerson,
  useUpdateServiceQuotePerson,
  useCreateServiceQuotePerson,
  useUpdatePerson,
  useUpdateGroup,
  useCreatePerson,
  useAddPersonToGroup,
  useRemovePersonFromGroup,
} from '../hooks/useQuoteMutations'
import { useServices } from '@/features/services/hooks/useServices'
import { useCountries } from '@/features/persons/hooks/useCountries'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuoteFullDetail, QuoteStatus } from '@/types/quote.type'
import { SummaryService, TypeService } from '@/types/service.type'
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
  AlertCircle,
} from 'lucide-react'

interface Props {
  quoteId: string
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador', bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' },
  { value: 'pending', label: 'Pendiente', bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  { value: 'approved', label: 'Aprobado', bg: '#edfff2', text: '#00932c', border: '#00bf35' },
  { value: 'rejected', label: 'Rechazado', bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
]

const getStatusStyles = (status: QuoteStatus) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status)
  return found || STATUS_OPTIONS[0]
}

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
  is_generic: boolean
}

interface ParticipantAssignment {
  participantId: string
  departure_date: string
  departure_time: string
  arrive_date: string
  arrive_time: string
  notes: string
  service_quote_person_id?: string
}

interface ActivityAssignment {
  id: string
  service: SummaryService
  defaultDepartureDate: string
  defaultDepartureTime: string
  defaultArriveDate: string
  defaultArriveTime: string
  defaultNotes: string
  participantAssignments: ParticipantAssignment[]
}

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

function hydrateFromQuote(quote: QuoteFullDetail): {
  participants: Participant[]
  activities: ActivityAssignment[]
  notes: string
  validUntil: string
  quoteStatus: QuoteStatus
  groupContactInfo: string
  groupDescription: string
} {
  const participants: Participant[] = (quote.persons_detail || []).map((p, idx) => ({
    id: p.id,
    tempId: p.id,
    name: p.full_name || (idx === 0 ? 'Contacto Principal' : `Pasajero #${idx}`),
    first_name: p.first_name || '',
    last_name: p.last_name || '',
    email: p.email || '',
    phone_number: p.phone_number || '',
    passport_number: p.passport_number || '',
    birth_date: p.birth_date || '',
    nationality: p.nationality || '',
    isContact: idx === 0,
    is_generic: p.is_generic ?? true,
  }))

  const activities: ActivityAssignment[] = (quote.services_detail || []).map((svc) => {
    const first = svc.persons_in_service[0]
    return {
      id: `svc-${svc.id}`,
      service: {
        id: svc.id,
        title: svc.title,
        type: svc.type as TypeService,
        departure_time: svc.departure_time,
        reference_price: String(svc.reference_price ?? ''),
        duration: `${svc.duration_value} ${svc.duration_unit}`,
      },
      defaultDepartureDate: first?.departure_date?.slice(0, 10) || '',
      defaultDepartureTime: first?.departure_time?.slice(0, 5) || svc.departure_time?.slice(0, 5) || '',
      defaultArriveDate: first?.arrive_date?.slice(0, 10) || '',
      defaultArriveTime: first?.arrive_time?.slice(0, 5) || '',
      defaultNotes: first?.notes || '',
      participantAssignments: svc.persons_in_service.map((ps) => ({
        participantId: ps.person_id,
        departure_date: ps.departure_date?.slice(0, 10) || '',
        departure_time: ps.departure_time?.slice(0, 5) || '',
        arrive_date: ps.arrive_date?.slice(0, 10) || '',
        arrive_time: ps.arrive_time?.slice(0, 5) || '',
        notes: ps.notes || '',
        service_quote_person_id: ps.service_quote_person_id,
      })),
    }
  })

  return {
    participants,
    activities,
    notes: quote.notes || '',
    validUntil: quote.valid_until || '',
    quoteStatus: quote.status,
    groupContactInfo: quote.group_info?.contact_info || '',
    groupDescription: quote.group_info?.description || '',
  }
}

export const QuoteEditPage = ({ quoteId }: Props) => {
  const { data: quote, isLoading, error, refetch } = useQuoteFullDetail(quoteId)
  const { data: services = [], isLoading: isLoadingServices } = useServices()
  const { data: countries = [] } = useCountries()

  const updateQuoteMutation = useUpdateQuote(quoteId)
  const updatePersonMutation = useUpdatePerson()
  const updateGroupMutation = useUpdateGroup()
  const updateServiceQuotePersonMutation = useUpdateServiceQuotePerson()
  const deleteServiceQuotePersonMutation = useDeleteServiceQuotePerson()
  const createServiceQuotePersonMutation = useCreateServiceQuotePerson()
  const createPersonMutation = useCreatePerson()
  const addPersonToGroupMutation = useAddPersonToGroup()
  const removePersonFromGroupMutation = useRemovePersonFromGroup()

  const [participants, setParticipants] = useState<Participant[]>([])
  const [participantsCount, setParticipantsCount] = useState(1)
  const [activities, setActivities] = useState<ActivityAssignment[]>([])
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<ActivityAssignment | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>('draft')
  const [groupContactInfo, setGroupContactInfo] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDeleteSqpIds, setPendingDeleteSqpIds] = useState<string[]>([])
  const [removedPersonIds, setRemovedPersonIds] = useState<string[]>([])

  const queueDeleteSqp = useCallback((id: string | undefined) => {
    if (!id) return
    setPendingDeleteSqpIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  useEffect(() => {
    if (!quote) return
    const h = hydrateFromQuote(quote)
    setParticipants(h.participants)
    setActivities(h.activities)
    setNotes(h.notes)
    setValidUntil(h.validUntil)
    setQuoteStatus(h.quoteStatus)
    setGroupContactInfo(h.groupContactInfo)
    setGroupDescription(h.groupDescription)
    setPendingDeleteSqpIds([])
    setRemovedPersonIds([])
    setSelectedActivity(null)
    setParticipantsCount(Math.max(1, h.participants.length))
  }, [quote?.id, quote?.updated_at])

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.type.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const availableServices = filteredServices.filter((s) => !activities.some((a) => a.service.id === s.id))

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
      is_generic: true,
    }
    setParticipants([...participants, newParticipant])
  }

  const hasPersistedPassengers = participants.some((p) => !p.isContact && !p.id.startsWith('temp-'))

  const handleGenerateParticipants = () => {
    if (hasPersistedPassengers) {
      alert(
        'Ya hay pasajeros guardados en esta cotización. Usa «Nuevo» para agregar más o la papelera para quitar pasajeros temporales.'
      )
      return
    }

    const contact = participants.find((p) => p.isContact)
    const newParticipants: Participant[] = contact ? [contact] : []

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
        is_generic: true,
      })
    }

    setParticipants(newParticipants)
    setActivities(
      activities.map((a) => ({
        ...a,
        participantAssignments: a.participantAssignments.filter((pa) =>
          newParticipants.some((np) => np.id === pa.participantId)
        ),
      }))
    )
    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        participantAssignments: selectedActivity.participantAssignments.filter((pa) =>
          newParticipants.some((np) => np.id === pa.participantId)
        ),
      })
    }
  }

  const handleRemoveParticipant = (participantId: string) => {
    const p = participants.find((x) => x.id === participantId)
    if (!p || p.isContact) return

    activities.forEach((a) => {
      const pa = a.participantAssignments.find((x) => x.participantId === participantId)
      if (pa?.service_quote_person_id) queueDeleteSqp(pa.service_quote_person_id)
    })

    setParticipants(participants.filter((x) => x.id !== participantId))
    setActivities(
      activities.map((a) => ({
        ...a,
        participantAssignments: a.participantAssignments.filter((pa) => pa.participantId !== participantId),
      }))
    )
    if (selectedActivity) {
      setSelectedActivity({
        ...selectedActivity,
        participantAssignments: selectedActivity.participantAssignments.filter(
          (pa) => pa.participantId !== participantId
        ),
      })
    }

    if (!participantId.startsWith('temp-')) {
      setRemovedPersonIds((prev) => (prev.includes(participantId) ? prev : [...prev, participantId]))
    }
  }

  const handleParticipantChange = (participantId: string, field: keyof Participant, value: string | boolean) => {
    setParticipants(
      participants.map((p) => {
        if (p.id !== participantId) return p
        const updated = { ...p, [field]: value }
        if (field === 'first_name' || field === 'last_name') {
          const firstName = field === 'first_name' ? (value as string) : p.first_name
          const lastName = field === 'last_name' ? (value as string) : p.last_name
          updated.name =
            `${firstName} ${lastName}`.trim() ||
            (p.isContact ? 'Contacto Principal' : `Pasajero #${participants.indexOf(p)}`)
        }
        return updated
      })
    )
  }

  const handleSelectService = (service: SummaryService) => {
    const newActivity: ActivityAssignment = {
      id: `new-${Date.now()}`,
      service,
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

  const handleActivityDefaultChange = (activityId: string, field: string, value: string) => {
    const updated = activities.map((a) => {
      if (a.id !== activityId) return a
      const updatedActivity = { ...a, [field]: value }
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
      const ua = updated.find((x) => x.id === activityId)
      if (ua) setSelectedActivity(ua)
    }
  }

  const handleToggleParticipantInActivity = (activityId: string, participantId: string) => {
    const activity = activities.find((a) => a.id === activityId)
    if (!activity) return

    const existingAssignment = activity.participantAssignments.find((pa) => pa.participantId === participantId)

    let newAssignments: ParticipantAssignment[]

    if (existingAssignment) {
      if (existingAssignment.service_quote_person_id) {
        queueDeleteSqp(existingAssignment.service_quote_person_id)
      }
      newAssignments = activity.participantAssignments.filter((pa) => pa.participantId !== participantId)
    } else {
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
      const ua = updated.find((x) => x.id === activityId)
      if (ua) setSelectedActivity(ua)
    }
  }

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
    const ua = updated.find((x) => x.id === activityId)
    if (selectedActivity?.id === activityId && ua) setSelectedActivity(ua)
  }

  const handleRemoveActivity = (activityId: string) => {
    const act = activities.find((a) => a.id === activityId)
    if (act) {
      act.participantAssignments.forEach((pa) => queueDeleteSqp(pa.service_quote_person_id))
    }
    setActivities(activities.filter((a) => a.id !== activityId))
    if (selectedActivity?.id === activityId) setSelectedActivity(null)
  }

  const calculateTotal = () => {
    return activities.reduce((sum, a) => {
      const pricePerPerson = parseFloat(a.service.reference_price || '0')
      return sum + pricePerPerson * a.participantAssignments.length
    }, 0)
  }

  const getContactName = () => {
    const contact = participants.find((p) => p.isContact)
    if (contact?.first_name || contact?.last_name) {
      return `${contact.first_name} ${contact.last_name}`.trim()
    }
    return ''
  }

  const canSubmit = () => {
    const contactName = getContactName()
    if (!contactName) return false
    if (activities.length === 0) return false
    return activities.every(
      (a) =>
        a.participantAssignments.length > 0 &&
        a.participantAssignments.every((pa) => pa.departure_date)
    )
  }

  const handleSubmit = async () => {
    if (isSubmitting || !quote?.group_info?.id) return
    if (!canSubmit()) {
      alert('Completa el contacto principal, actividades y fechas de salida de cada asignación.')
      return
    }

    setIsSubmitting(true)
    const uniqueDeletes = [...new Set(pendingDeleteSqpIds)]

    try {
      for (const id of uniqueDeletes) {
        await deleteServiceQuotePersonMutation.mutateAsync(id)
      }

      for (const rid of removedPersonIds) {
        await removePersonFromGroupMutation.mutateAsync({
          groupId: quote.group_info.id,
          personId: rid,
        })
      }

      await updateQuoteMutation.mutateAsync({
        notes: notes || undefined,
        valid_until: validUntil || undefined,
        status: quoteStatus,
      })

      await updateGroupMutation.mutateAsync({
        id: quote.group_info.id,
        data: {
          contact_info: groupContactInfo || undefined,
          description: groupDescription || undefined,
        },
      })

      const idMap: Record<string, string> = {}
      for (const p of participants) {
        if (!p.id.startsWith('temp-')) continue
        if (!p.first_name?.trim() || !p.last_name?.trim()) {
          throw new Error('Pasajeros nuevos: nombre y apellido son obligatorios.')
        }
        const created = await createPersonMutation.mutateAsync({
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email || undefined,
          phone_number: p.phone_number || undefined,
          passport_number: p.passport_number || undefined,
          birth_date: p.birth_date || undefined,
          nationality: p.nationality || undefined,
        })
        idMap[p.id] = created.id
        await addPersonToGroupMutation.mutateAsync({
          groupId: quote.group_info.id,
          personId: created.id,
        })
      }

      const resolveId = (id: string) => idMap[id] ?? id

      for (const p of participants) {
        const pid = resolveId(p.id)
        if (p.id.startsWith('temp-')) {
          await updatePersonMutation.mutateAsync({
            id: pid,
            data: {
              email: p.email || undefined,
              phone_number: p.phone_number || undefined,
              passport_number: p.passport_number || undefined,
              nationality: p.nationality || undefined,
              birth_date: p.birth_date || undefined,
              is_generic: p.is_generic,
            },
          })
        } else {
          await updatePersonMutation.mutateAsync({
            id: pid,
            data: {
              first_name: p.first_name || undefined,
              last_name: p.last_name || undefined,
              email: p.email || undefined,
              phone_number: p.phone_number || undefined,
              passport_number: p.passport_number || undefined,
              nationality: p.nationality || undefined,
              birth_date: p.birth_date || undefined,
              is_generic: p.is_generic,
            },
          })
        }
      }

      for (const activity of activities) {
        for (const pa of activity.participantAssignments) {
          const pid = resolveId(pa.participantId)
          if (pa.service_quote_person_id) {
            if (uniqueDeletes.includes(pa.service_quote_person_id)) continue
            await updateServiceQuotePersonMutation.mutateAsync({
              id: pa.service_quote_person_id,
              data: {
                departure_date: pa.departure_date || undefined,
                departure_time: pa.departure_time || undefined,
                arrive_date: pa.arrive_date || undefined,
                arrive_time: pa.arrive_time || undefined,
                notes: pa.notes || undefined,
              },
            })
          } else {
            if (!pa.departure_date) continue
            await createServiceQuotePersonMutation.mutateAsync({
              person_id: pid,
              service_id: activity.service.id,
              quote_id: quoteId,
              departure_date: pa.departure_date,
              departure_time: pa.departure_time || undefined,
              arrive_date: pa.arrive_date || undefined,
              arrive_time: pa.arrive_time || undefined,
              notes: pa.notes || undefined,
            })
          }
        }
      }

      setPendingDeleteSqpIds([])
      setRemovedPersonIds([])
      await refetch()
    } catch (err) {
      console.error('Error al guardar cotización:', err)
      alert(err instanceof Error ? err.message : 'Error al guardar la cotización')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando cotización...</span>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error al cargar la cotización</p>
        <a href="/quotes" className="mt-4 text-green-600 hover:underline">
          Volver al listado
        </a>
      </div>
    )
  }

  const statusStyle = getStatusStyles(quoteStatus)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fafafa' }}>
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/quotes" className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#085f24' }}>
                Editar Cotización
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">
                  Misma vista que al crear: actividades a la izquierda, participantes y fechas a la derecha
                </p>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                    borderColor: statusStyle.border,
                  }}
                >
                  {statusStyle.label}
                </span>
                <span className="text-xs text-gray-400">v{quote.version}</span>
                <a href={`/quotes/${quoteId}`} className="text-xs text-green-600 hover:underline">
                  Ver ficha
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-xs text-gray-500">Total (estimado)</p>
              <p className="text-xl font-bold" style={{ color: '#00932c' }}>
                {formatPrice(calculateTotal())}
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
              style={{
                backgroundColor: canSubmit() && !isSubmitting ? '#00bf35' : '#9ca3af',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contacto Principal</label>
              <Input value={getContactName()} placeholder="Se actualiza desde el panel derecho" className="bg-white" readOnly />
            </div>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: '#085f24' }}>
                Actividades ({activities.length})
              </h2>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay actividades</p>
                <p className="text-sm">Busca y agrega actividades abajo</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.map((activity) => {
                  const typeStyles = getTypeStyles(activity.service.type)
                  const isSelected = selectedActivity?.id === activity.id
                  const hasParticipants = activity.participantAssignments.length > 0
                  const allHaveDates = activity.participantAssignments.every((pa) => pa.departure_date)

                  return (
                    <div
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
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
                            <span className="text-xs text-gray-500">{activity.participantAssignments.length} pax</span>
                            {!hasParticipants && <span className="text-xs text-red-500">Sin participantes</span>}
                            {hasParticipants && !allHaveDates && (
                              <span className="text-xs text-red-500">Faltan fechas</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: '#00932c' }}>
                            {formatPrice(
                              parseFloat(activity.service.reference_price || '0') * activity.participantAssignments.length
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

        <div className="w-1/2 flex flex-col">
          {selectedActivity ? (
            <>
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold" style={{ color: '#085f24' }}>
                    {selectedActivity.service.title}
                  </h2>
                  <button onClick={() => setSelectedActivity(null)} className="p-2 rounded-lg hover:bg-gray-100">
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

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                          handleActivityDefaultChange(selectedActivity.id, 'defaultDepartureDate', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hora de salida</label>
                      <Input
                        type="time"
                        value={selectedActivity.defaultDepartureTime}
                        onChange={(e) =>
                          handleActivityDefaultChange(selectedActivity.id, 'defaultDepartureTime', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de llegada</label>
                      <Input
                        type="date"
                        value={selectedActivity.defaultArriveDate}
                        onChange={(e) =>
                          handleActivityDefaultChange(selectedActivity.id, 'defaultArriveDate', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hora de llegada</label>
                      <Input
                        type="time"
                        value={selectedActivity.defaultArriveTime}
                        onChange={(e) =>
                          handleActivityDefaultChange(selectedActivity.id, 'defaultArriveTime', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Notas por defecto</label>
                    <Input
                      value={selectedActivity.defaultNotes}
                      onChange={(e) =>
                        handleActivityDefaultChange(selectedActivity.id, 'defaultNotes', e.target.value)
                      }
                      placeholder="Notas para nuevos participantes..."
                    />
                  </div>
                </div>

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

                  {!hasPersistedPassengers && (
                    <div className="flex gap-2 items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={participantsCount}
                          onChange={(e) => setParticipantsCount(Number(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm">Participantes</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleGenerateParticipants}>
                        Generar
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {participants.map((participant) => {
                      const assignment = selectedActivity.participantAssignments.find(
                        (pa) => pa.participantId === participant.id
                      )
                      const isInActivity = !!assignment
                      const isEditing = editingParticipant === participant.id

                      return (
                        <div key={participant.id} className="border rounded-lg overflow-hidden">
                          <div
                            className={`flex items-center gap-3 p-3 transition ${isInActivity ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isInActivity}
                              onChange={() =>
                                handleToggleParticipantInActivity(selectedActivity.id, participant.id)
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
                                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Líder</span>
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
                                  <label className="block text-xs text-gray-500 mb-1">Fecha salida *</label>
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
                                  <label className="block text-xs text-gray-500 mb-1">Hora salida</label>
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
                                  <label className="block text-xs text-gray-500 mb-1">Fecha llegada</label>
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
                                  <label className="block text-xs text-gray-500 mb-1">Hora llegada</label>
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

                          {isEditing && (
                            <div className="p-4 bg-blue-50 border-t border-l-4 border-l-blue-500">
                              <p className="text-xs font-medium text-blue-700 mb-3">Datos personales</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Nombre</label>
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
                                  <label className="block text-xs text-gray-500 mb-1">Apellido</label>
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
                                    placeholder="Email"
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
                                    placeholder="Teléfono"
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
                                    placeholder="Pasaporte"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Nacionalidad</label>
                                  <select
                                    value={participant.nationality}
                                    onChange={(e) =>
                                      handleParticipantChange(participant.id, 'nationality', e.target.value)
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
            <div className="flex-1 flex flex-col bg-gray-50">
              <div className="p-6 bg-white border-b">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#085f24' }}>
                  Información General
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-quote-status">Estado</Label>
                      <Select
                        value={quoteStatus}
                        onValueChange={(v: QuoteStatus) => setQuoteStatus(v)}
                      >
                        <SelectTrigger id="edit-quote-status" className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-quote-valid">Válido hasta</Label>
                      <Input
                        id="edit-quote-valid"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {/* <div>
                    <Label htmlFor="edit-group-contact">Información de contacto (grupo)</Label>
                    <Input
                      id="edit-group-contact"
                      value={groupContactInfo}
                      onChange={(e) => setGroupContactInfo(e.target.value)}
                      className="mt-1"
                      placeholder="Texto de contacto del grupo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-group-desc">Descripción del grupo</Label>
                    <textarea
                      id="edit-group-desc"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="Descripción del grupo..."
                      className="w-full p-3 border rounded-md text-sm resize-none h-20 mt-1"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Notas de la cotización</label>
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
                    Completa el contacto principal, agrega actividades con participantes y fechas individuales, luego
                    guarda
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
