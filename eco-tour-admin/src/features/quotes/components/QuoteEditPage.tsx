import { useState, useEffect } from 'react'
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
} from '../hooks/useQuoteMutations'
import { useServicesFull } from '@/features/services/hooks/useServices'
import { usePersonsSummary } from '@/features/persons/hooks/usePersonsSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuoteStatus } from '@/types/quote.type'
import {
  ArrowLeft,
  Users,
  Package,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
  User,
  Save,
  AlertCircle,
  Trash2,
  Plus,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Edit3,
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

const formatPrice = (price?: string | number) => {
  if (price === undefined || price === null) return '$0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numPrice)
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    group: 'Grupal',
    private: 'Privado',
    arbitrary: 'Arbitrario',
  }
  return types[type] || type
}

const getTypeColor = (type: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    group: { bg: '#edfff2', text: '#00932c' },      // Verde
    private: { bg: '#fef2f2', text: '#dc2626' },    // Rojo
    arbitrary: { bg: '#fef3c7', text: '#d97706' },  // Ámbar
  }
  return colors[type] || { bg: '#f3f4f6', text: '#374151' }
}

// Form data types
interface QuoteFormData {
  notes: string
  valid_until: string
  status: QuoteStatus
}

interface GroupFormData {
  contact_info: string
  description: string
}

interface PersonFormData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  passport_number: string
  nationality: string
  is_generic: boolean
}

interface ServiceFormData {
  service_quote_person_id: string
  departure_date: string
  departure_time: string
  arrive_date: string
  arrive_time: string
  notes: string
}

export const QuoteEditPage = ({ quoteId }: Props) => {
  const { data: quote, isLoading, error, refetch } = useQuoteFullDetail(quoteId)
  const { data: services = [] } = useServicesFull()
  const { data: existingPersons = [] } = usePersonsSummary()

  // Mutations
  const updateQuoteMutation = useUpdateQuote(quoteId)
  const updatePersonMutation = useUpdatePerson()
  const updateGroupMutation = useUpdateGroup()
  const updateServiceQuotePersonMutation = useUpdateServiceQuotePerson()
  const deleteServiceQuotePersonMutation = useDeleteServiceQuotePerson()
  const createServiceQuotePersonMutation = useCreateServiceQuotePerson()
  const createPersonMutation = useCreatePerson()
  const addPersonToGroupMutation = useAddPersonToGroup()

  // Form States
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    notes: '',
    valid_until: '',
    status: 'draft',
  })

  const [groupForm, setGroupForm] = useState<GroupFormData>({
    contact_info: '',
    description: '',
  })

  const [personsForm, setPersonsForm] = useState<PersonFormData[]>([])
  const [servicesForm, setServicesForm] = useState<ServiceFormData[]>([])

  // UI States
  const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set())

  // Add service state
  const [addingToPersonId, setAddingToPersonId] = useState<string | null>(null)
  const [newServiceData, setNewServiceData] = useState({
    service_id: '',
    departure_date: '',
    departure_time: '',
    arrive_date: '',
    arrive_time: '',
    notes: '',
  })

  // Add person state
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [addPersonMode, setAddPersonMode] = useState<'new' | 'existing'>('new')
  const [selectedExistingPersonId, setSelectedExistingPersonId] = useState('')
  const [newPersonData, setNewPersonData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    passport_number: '',
    nationality: '',
  })

  // Loading states
  const [savingQuote, setSavingQuote] = useState(false)
  const [savingGroup, setSavingGroup] = useState(false)
  const [savingPersonId, setSavingPersonId] = useState<string | null>(null)
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)
  const [addingService, setAddingService] = useState(false)
  const [addingPerson, setAddingPerson] = useState(false)

  // Initialize form data when quote loads
  useEffect(() => {
    if (quote) {
      setQuoteForm({
        notes: quote.notes || '',
        valid_until: quote.valid_until || '',
        status: quote.status,
      })

      setGroupForm({
        contact_info: quote.group_info?.contact_info || '',
        description: quote.group_info?.description || '',
      })

      const persons: PersonFormData[] = quote.persons_detail?.map((p) => ({
        id: p.id,
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        email: p.email || '',
        phone_number: p.phone_number || '',
        passport_number: p.passport_number || '',
        nationality: p.nationality || '',
        is_generic: p.is_generic ?? true,
      })) || []
      setPersonsForm(persons)

      const allServices: ServiceFormData[] = []
      quote.persons_detail?.forEach((p) => {
        p.services?.forEach((s) => {
          allServices.push({
            service_quote_person_id: s.service_quote_person_id,
            departure_date: s.departure_date || '',
            departure_time: s.departure_time?.slice(0, 5) || '',
            arrive_date: s.arrive_date || '',
            arrive_time: s.arrive_time?.slice(0, 5) || '',
            notes: s.notes || '',
          })
        })
      })
      setServicesForm(allServices)

      // Expand all persons by default
      const allPersonIds = new Set(quote.persons_detail?.map(p => p.id) || [])
      setExpandedPersons(allPersonIds)
    }
  }, [quote])

  // ==================== SAVE HANDLERS ====================

  const handleSaveQuote = async () => {
    setSavingQuote(true)
    try {
      await updateQuoteMutation.mutateAsync({
        notes: quoteForm.notes || undefined,
        valid_until: quoteForm.valid_until || undefined,
        status: quoteForm.status,
      })
      await refetch()
    } catch (err) {
      console.error('Error saving quote:', err)
      alert('Error al guardar la cotización')
    } finally {
      setSavingQuote(false)
    }
  }

  const handleSaveGroup = async () => {
    if (!quote?.group_info?.id) return
    setSavingGroup(true)
    try {
      await updateGroupMutation.mutateAsync({
        id: quote.group_info.id,
        data: {
          contact_info: groupForm.contact_info || undefined,
          description: groupForm.description || undefined,
        },
      })
      await refetch()
    } catch (err) {
      console.error('Error saving group:', err)
      alert('Error al guardar el grupo')
    } finally {
      setSavingGroup(false)
    }
  }

  const handleSavePerson = async (personId: string) => {
    const personData = personsForm.find((p) => p.id === personId)
    if (!personData) return

    setSavingPersonId(personId)
    try {
      await updatePersonMutation.mutateAsync({
        id: personId,
        data: {
          first_name: personData.first_name || undefined,
          last_name: personData.last_name || undefined,
          email: personData.email || undefined,
          phone_number: personData.phone_number || undefined,
          passport_number: personData.passport_number || undefined,
          nationality: personData.nationality || undefined,
          is_generic: personData.is_generic,
        },
      })
      await refetch()
    } catch (err) {
      console.error('Error saving person:', err)
      alert('Error al guardar la persona')
    } finally {
      setSavingPersonId(null)
    }
  }

  const handleSaveService = async (serviceQuotePersonId: string) => {
    const serviceData = servicesForm.find((s) => s.service_quote_person_id === serviceQuotePersonId)
    if (!serviceData) return

    setSavingServiceId(serviceQuotePersonId)
    try {
      await updateServiceQuotePersonMutation.mutateAsync({
        id: serviceQuotePersonId,
        data: {
          departure_date: serviceData.departure_date || undefined,
          departure_time: serviceData.departure_time || undefined,
          arrive_date: serviceData.arrive_date || undefined,
          arrive_time: serviceData.arrive_time || undefined,
          notes: serviceData.notes,
        },
      })
      await refetch()
    } catch (err) {
      console.error('Error saving service:', err)
      alert('Error al guardar el servicio')
    } finally {
      setSavingServiceId(null)
    }
  }

  const handleDeleteService = async (serviceQuotePersonId: string) => {
    if (!confirm('¿Eliminar este servicio de la persona?')) return

    setDeletingServiceId(serviceQuotePersonId)
    try {
      await deleteServiceQuotePersonMutation.mutateAsync(serviceQuotePersonId)
      await refetch()
    } catch (err) {
      console.error('Error deleting service:', err)
      alert('Error al eliminar el servicio')
    } finally {
      setDeletingServiceId(null)
    }
  }

  const handleAddService = async (personId: string) => {
    if (!newServiceData.service_id || !newServiceData.departure_date) {
      alert('Selecciona un servicio y fecha de salida')
      return
    }

    setAddingService(true)
    try {
      await createServiceQuotePersonMutation.mutateAsync({
        person_id: personId,
        service_id: newServiceData.service_id,
        quote_id: quoteId,
        departure_date: newServiceData.departure_date,
        departure_time: newServiceData.departure_time || undefined,
        arrive_date: newServiceData.arrive_date || undefined,
        arrive_time: newServiceData.arrive_time || undefined,
        notes: newServiceData.notes || undefined,
      })
      setAddingToPersonId(null)
      setNewServiceData({
        service_id: '',
        departure_date: '',
        departure_time: '',
        arrive_date: '',
        arrive_time: '',
        notes: '',
      })
      await refetch()
    } catch (err) {
      console.error('Error adding service:', err)
      alert('Error al agregar el servicio')
    } finally {
      setAddingService(false)
    }
  }

  const handleAddPerson = async () => {
    if (!quote?.group_info?.id) {
      alert('No hay grupo asociado a esta cotización')
      return
    }

    setAddingPerson(true)
    try {
      let personId: string

      if (addPersonMode === 'existing') {
        if (!selectedExistingPersonId) {
          alert('Selecciona una persona')
          setAddingPerson(false)
          return
        }
        personId = selectedExistingPersonId
      } else {
        if (!newPersonData.first_name || !newPersonData.last_name) {
          alert('Nombre y apellido son requeridos')
          setAddingPerson(false)
          return
        }

        const newPerson = await createPersonMutation.mutateAsync({
          first_name: newPersonData.first_name,
          last_name: newPersonData.last_name,
          email: newPersonData.email || undefined,
          phone_number: newPersonData.phone_number || undefined,
          passport_number: newPersonData.passport_number || undefined,
          nationality: newPersonData.nationality || undefined,
        })
        personId = newPerson.id
      }

      await addPersonToGroupMutation.mutateAsync({
        groupId: quote.group_info.id,
        personId: personId,
      })

      setShowAddPerson(false)
      setNewPersonData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        passport_number: '',
        nationality: '',
      })
      setSelectedExistingPersonId('')
      setAddPersonMode('new')

      await refetch()
    } catch (err) {
      console.error('Error adding person:', err)
      alert('Error al agregar la persona')
    } finally {
      setAddingPerson(false)
    }
  }

  // ==================== FORM UPDATE HANDLERS ====================

  const updatePersonForm = (personId: string, field: keyof PersonFormData, value: string | boolean) => {
    setPersonsForm((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, [field]: value } : p))
    )
  }

  const updateServiceForm = (serviceId: string, field: keyof ServiceFormData, value: string) => {
    setServicesForm((prev) =>
      prev.map((s) => (s.service_quote_person_id === serviceId ? { ...s, [field]: value } : s))
    )
  }

  const getServiceForm = (serviceQuotePersonId: string) => {
    return servicesForm.find((s) => s.service_quote_person_id === serviceQuotePersonId)
  }

  const getPersonForm = (personId: string) => {
    return personsForm.find((p) => p.id === personId)
  }

  const togglePerson = (personId: string) => {
    const newExpanded = new Set(expandedPersons)
    if (newExpanded.has(personId)) {
      newExpanded.delete(personId)
    } else {
      newExpanded.add(personId)
    }
    setExpandedPersons(newExpanded)
  }

  // ==================== LOADING / ERROR ====================

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
        <a href="/quotes" className="mt-4 text-green-600 hover:underline">Volver al listado</a>
      </div>
    )
  }

  const statusStyle = getStatusStyles(quote.status)

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <a href={`/quotes`} className="p-2 rounded-lg hover:bg-gray-200">
            <ArrowLeft size={24} />
          </a>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>
              Editar Cotización
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-600">{quote.contact_info}</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
              >
                {statusStyle.label}
              </span>
              <span className="text-sm text-gray-500">v{quote.version}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold" style={{ color: '#00932c' }}>{formatPrice(quote.total_price)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">

          {/* ==================== QUOTE CARD ==================== */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <DollarSign size={20} />
                Datos de la Cotización
              </CardTitle>
              <Button
                onClick={handleSaveQuote}
                disabled={savingQuote}
                size="sm"
                style={{ backgroundColor: '#00bf35' }}
              >
                {savingQuote ? <Loader2 className="animate-spin mr-1" size={16} /> : <Save size={16} className="mr-1" />}
                Guardar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-status">Estado</Label>
                  <Select
                    value={quoteForm.status}
                    onValueChange={(v: QuoteStatus) => setQuoteForm((prev) => ({ ...prev, status: v }))}
                  >
                    <SelectTrigger id="quote-status" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quote-valid">Válido hasta</Label>
                  <Input
                    id="quote-valid"
                    type="date"
                    value={quoteForm.valid_until}
                    onChange={(e) => setQuoteForm((prev) => ({ ...prev, valid_until: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="quote-notes">Notas</Label>
                <Textarea
                  id="quote-notes"
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="mt-1"
                  placeholder="Notas de la cotización..."
                />
              </div>
            </CardContent>
          </Card>

          {/* ==================== GROUP CARD ==================== */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Users size={20} />
                Información del Grupo
              </CardTitle>
              <Button
                onClick={handleSaveGroup}
                disabled={savingGroup}
                size="sm"
                style={{ backgroundColor: '#00bf35' }}
              >
                {savingGroup ? <Loader2 className="animate-spin mr-1" size={16} /> : <Save size={16} className="mr-1" />}
                Guardar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Grupo</Label>
                  <Input value={quote.group_info?.name || ''} disabled className="mt-1 bg-gray-100" />
                </div>
                <div>
                  <Label>Total Personas</Label>
                  <Input value={quote.group_info?.total_people || 0} disabled className="mt-1 bg-gray-100" />
                </div>
              </div>
              <div>
                <Label htmlFor="group-contact">Información de Contacto</Label>
                <Input
                  id="group-contact"
                  value={groupForm.contact_info}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, contact_info: e.target.value }))}
                  className="mt-1"
                  placeholder="Nombre del contacto principal"
                />
              </div>
              <div>
                <Label htmlFor="group-desc">Descripción</Label>
                <Textarea
                  id="group-desc"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="mt-1"
                  placeholder="Descripción del grupo..."
                />
              </div>
            </CardContent>
          </Card>

          {/* ==================== PERSONS & SERVICES ==================== */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <User size={20} />
                Personas y Servicios ({quote.persons_detail?.length || 0})
              </CardTitle>
              {!showAddPerson && (
                <Button
                  onClick={() => setShowAddPerson(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
                >
                  <UserPlus size={16} />
                  Agregar Persona
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Person Form */}
              {showAddPerson && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <UserPlus size={18} />
                      Agregar Persona al Grupo
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddPerson(false)
                          setNewPersonData({
                            first_name: '',
                            last_name: '',
                            email: '',
                            phone_number: '',
                            passport_number: '',
                            nationality: '',
                          })
                          setSelectedExistingPersonId('')
                        }}
                        disabled={addingPerson}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddPerson}
                        disabled={addingPerson}
                        style={{ backgroundColor: '#00bf35' }}
                      >
                        {addingPerson ? (
                          <Loader2 className="animate-spin mr-1" size={16} />
                        ) : (
                          <Plus size={16} className="mr-1" />
                        )}
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Mode selector */}
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="addPersonMode"
                        checked={addPersonMode === 'new'}
                        onChange={() => setAddPersonMode('new')}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm">Crear nueva persona</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="addPersonMode"
                        checked={addPersonMode === 'existing'}
                        onChange={() => setAddPersonMode('existing')}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-sm">Usar persona existente</span>
                    </label>
                  </div>

                  {addPersonMode === 'new' ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Nombre *</Label>
                        <Input
                          value={newPersonData.first_name}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, first_name: e.target.value }))}
                          className="mt-1"
                          placeholder="Nombre"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Apellido *</Label>
                        <Input
                          value={newPersonData.last_name}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, last_name: e.target.value }))}
                          className="mt-1"
                          placeholder="Apellido"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input
                          type="email"
                          value={newPersonData.email}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Teléfono</Label>
                        <Input
                          value={newPersonData.phone_number}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, phone_number: e.target.value }))}
                          className="mt-1"
                          placeholder="+51 999 999 999"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Pasaporte</Label>
                        <Input
                          value={newPersonData.passport_number}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, passport_number: e.target.value }))}
                          className="mt-1"
                          placeholder="Número de pasaporte"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Nacionalidad</Label>
                        <Input
                          value={newPersonData.nationality}
                          onChange={(e) => setNewPersonData((prev) => ({ ...prev, nationality: e.target.value }))}
                          className="mt-1"
                          placeholder="PE, US, CO..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-xs">Seleccionar persona existente</Label>
                      <Select
                        value={selectedExistingPersonId}
                        onValueChange={setSelectedExistingPersonId}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Seleccionar persona..." />
                        </SelectTrigger>
                        <SelectContent>
                          {existingPersons
                            .filter((p) => !quote.persons_detail?.some((pd) => pd.id === p.id))
                            .map((person) => (
                              <SelectItem key={person.id} value={person.id}>
                                {person.first_name} {person.last_name} - {person.email || person.phone_number || 'Sin contacto'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Persons List */}
              {quote.persons_detail?.map((person) => {
                const personData = getPersonForm(person.id)
                const isExpanded = expandedPersons.has(person.id)

                return (
                  <div key={person.id} className="border rounded-lg overflow-hidden">
                    {/* Person Header */}
                    <button
                      onClick={() => togglePerson(person.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User size={18} style={{ color: '#00932c' }} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{person.full_name}</p>
                          <p className="text-xs text-gray-500">
                            {person.services_count} servicio(s) - Total: {formatPrice(person.total_cost)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {person.is_generic && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">Temporal</span>
                        )}
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t">
                        {/* Person Editable Fields */}
                        <div className="p-4 bg-gray-50 border-b">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-700">Datos de la persona</h5>
                            <Button
                              onClick={() => handleSavePerson(person.id)}
                              disabled={savingPersonId === person.id}
                              size="sm"
                              style={{ backgroundColor: '#00bf35' }}
                            >
                              {savingPersonId === person.id ? (
                                <Loader2 className="animate-spin mr-1" size={16} />
                              ) : (
                                <Save size={16} className="mr-1" />
                              )}
                              Guardar
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Nombre</Label>
                              <Input
                                value={personData?.first_name || ''}
                                onChange={(e) => updatePersonForm(person.id, 'first_name', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Apellido</Label>
                              <Input
                                value={personData?.last_name || ''}
                                onChange={(e) => updatePersonForm(person.id, 'last_name', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Email</Label>
                              <Input
                                type="email"
                                value={personData?.email || ''}
                                onChange={(e) => updatePersonForm(person.id, 'email', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Teléfono</Label>
                              <Input
                                value={personData?.phone_number || ''}
                                onChange={(e) => updatePersonForm(person.id, 'phone_number', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Pasaporte</Label>
                              <Input
                                value={personData?.passport_number || ''}
                                onChange={(e) => updatePersonForm(person.id, 'passport_number', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Nacionalidad</Label>
                              <Input
                                value={personData?.nationality || ''}
                                onChange={(e) => updatePersonForm(person.id, 'nationality', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          {/* Temporal/Real Switch */}
                          <div className="flex items-center justify-between mt-3 p-3 bg-white rounded-lg border">
                            <div>
                              <Label className="text-sm font-medium">Estado de la persona</Label>
                              <p className="text-xs text-gray-500">
                                {personData?.is_generic ? 'Temporal (pasajero genérico)' : 'Real (datos confirmados)'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Temporal</span>
                              <Switch
                                checked={!personData?.is_generic}
                                onCheckedChange={(checked) => updatePersonForm(person.id, 'is_generic', !checked)}
                              />
                              <span className="text-xs text-gray-500">Real</span>
                            </div>
                          </div>
                        </div>

                        {/* Services Section */}
                        <div className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-700">Servicios asignados:</p>
                            {addingToPersonId !== person.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAddingToPersonId(person.id)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <Plus size={14} className="mr-1" /> Agregar Servicio
                              </Button>
                            )}
                          </div>

                          {/* Add Service Form */}
                          {addingToPersonId === person.id && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-green-800">Agregar nuevo servicio</p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAddingToPersonId(null)}
                                    disabled={addingService}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddService(person.id)}
                                    disabled={addingService}
                                    style={{ backgroundColor: '#00bf35' }}
                                  >
                                    {addingService ? <Loader2 className="animate-spin mr-1" size={16} /> : <Plus size={16} className="mr-1" />}
                                    Agregar
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-3">
                                  <Label className="text-xs">Servicio</Label>
                                  <Select
                                    value={newServiceData.service_id}
                                    onValueChange={(v) => {
                                      const selectedService = services.find((s) => s.id === v)
                                      setNewServiceData((prev) => ({
                                        ...prev,
                                        service_id: v,
                                        departure_time: selectedService?.departure_time
                                          ? selectedService.departure_time.slice(0, 5)
                                          : prev.departure_time,
                                      }))
                                    }}
                                  >
                                    <SelectTrigger className="w-full mt-1">
                                      <SelectValue placeholder="Seleccionar servicio..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {services.map((s) => {
                                        const typeColor = getTypeColor(s.type)
                                        return (
                                          <SelectItem key={s.id} value={s.id}>
                                            <div className="flex items-center gap-2">
                                              <span
                                                className="px-1.5 py-0.5 rounded text-xs font-medium"
                                                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                                              >
                                                {getTypeLabel(s.type)}
                                              </span>
                                              <span>{s.title}</span>
                                              <span className="text-gray-500">- {formatPrice(s.reference_price)}</span>
                                              {s.departure_time && (
                                                <span className="text-xs text-gray-400">({s.departure_time.slice(0, 5)})</span>
                                              )}
                                            </div>
                                          </SelectItem>
                                        )
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Fecha Salida *</Label>
                                  <Input
                                    type="date"
                                    value={newServiceData.departure_date}
                                    onChange={(e) => setNewServiceData((prev) => ({ ...prev, departure_date: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Hora Salida</Label>
                                  <Input
                                    type="time"
                                    value={newServiceData.departure_time}
                                    onChange={(e) => setNewServiceData((prev) => ({ ...prev, departure_time: e.target.value }))}
                                    className="mt-1"
                                    placeholder="Auto-cargado del servicio"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Fecha Llegada</Label>
                                  <Input
                                    type="date"
                                    value={newServiceData.arrive_date}
                                    onChange={(e) => setNewServiceData((prev) => ({ ...prev, arrive_date: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Hora Llegada</Label>
                                  <Input
                                    type="time"
                                    value={newServiceData.arrive_time}
                                    onChange={(e) => setNewServiceData((prev) => ({ ...prev, arrive_time: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-xs">Notas</Label>
                                  <Input
                                    value={newServiceData.notes}
                                    onChange={(e) => setNewServiceData((prev) => ({ ...prev, notes: e.target.value }))}
                                    className="mt-1"
                                    placeholder="Notas adicionales..."
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Service List */}
                          {person.services?.map((service) => {
                            const serviceData = getServiceForm(service.service_quote_person_id)
                            const typeColor = getTypeColor(service.service_type)

                            return (
                              <div
                                key={service.service_quote_person_id}
                                className="p-4 bg-white border rounded-lg space-y-3"
                              >
                                {/* Service Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Package size={18} className="text-gray-400" />
                                    <div>
                                      <p className="font-medium">{service.service_name}</p>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span
                                          className="px-2 py-0.5 rounded"
                                          style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                                        >
                                          {getTypeLabel(service.service_type)}
                                        </span>
                                        <span className="font-semibold" style={{ color: '#00932c' }}>
                                          {formatPrice(service.individual_cost)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => handleSaveService(service.service_quote_person_id)}
                                      disabled={savingServiceId === service.service_quote_person_id}
                                      size="sm"
                                      style={{ backgroundColor: '#00bf35' }}
                                    >
                                      {savingServiceId === service.service_quote_person_id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                      ) : (
                                        <Save size={16} />
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteService(service.service_quote_person_id)}
                                      disabled={deletingServiceId === service.service_quote_person_id}
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                      {deletingServiceId === service.service_quote_person_id ? (
                                        <Loader2 className="animate-spin" size={16} />
                                      ) : (
                                        <Trash2 size={16} />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Service Editable Fields */}
                                <div className="grid grid-cols-4 gap-3">
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Calendar size={12} /> Fecha Salida
                                    </Label>
                                    <Input
                                      type="date"
                                      value={serviceData?.departure_date || ''}
                                      onChange={(e) => updateServiceForm(service.service_quote_person_id, 'departure_date', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Clock size={12} /> Hora Salida
                                    </Label>
                                    <Input
                                      type="time"
                                      value={serviceData?.departure_time || ''}
                                      onChange={(e) => updateServiceForm(service.service_quote_person_id, 'departure_time', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Calendar size={12} /> Fecha Llegada
                                    </Label>
                                    <Input
                                      type="date"
                                      value={serviceData?.arrive_date || ''}
                                      onChange={(e) => updateServiceForm(service.service_quote_person_id, 'arrive_date', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs flex items-center gap-1">
                                      <Clock size={12} /> Hora Llegada
                                    </Label>
                                    <Input
                                      type="time"
                                      value={serviceData?.arrive_time || ''}
                                      onChange={(e) => updateServiceForm(service.service_quote_person_id, 'arrive_time', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="col-span-4">
                                    <Label className="text-xs">Notas del servicio</Label>
                                    <Input
                                      value={serviceData?.notes || ''}
                                      onChange={(e) => updateServiceForm(service.service_quote_person_id, 'notes', e.target.value)}
                                      className="mt-1"
                                      placeholder="Notas adicionales..."
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                          {person.services?.length === 0 && (
                            <p className="text-gray-400 text-sm italic">Sin servicios asignados</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <DollarSign size={20} />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Total de la Cotización</p>
                <p className="text-3xl font-bold" style={{ color: '#00932c' }}>{formatPrice(quote.total_price)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Users size={20} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-2xl font-bold">{quote.persons_detail?.length || 0}</p>
                  <p className="text-xs text-gray-500">Personas</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Package size={20} className="mx-auto mb-1 text-gray-400" />
                  <p className="text-2xl font-bold">{quote.cost_summary?.total_services || 0}</p>
                  <p className="text-xs text-gray-500">Servicios</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <a
                  href={`/quotes/${quoteId}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Ver Detalle Completo
                </a>
                <a
                  href="/quotes"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition"
                  style={{ backgroundColor: '#00bf35' }}
                >
                  Volver al Listado
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

