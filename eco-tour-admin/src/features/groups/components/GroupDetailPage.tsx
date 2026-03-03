import { useState } from 'react'
import { useGroup } from '../hooks/useGroups'
import { useUpdateGroup, useRemovePersonFromGroup, useAddPersonToGroup } from '../hooks/useGroupMutations'
import { usePersonsSummary } from '@/features/persons/hooks/usePersonsSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Users,
  Loader2,
  AlertCircle,
  Save,
  User,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Plus,
} from 'lucide-react'

interface Props {
  groupId: string
}

export const GroupDetailPage = ({ groupId }: Props) => {
  const { data: group, isLoading, error, refetch } = useGroup(groupId)
  const { data: allPersons = [] } = usePersonsSummary()
  const updateGroupMutation = useUpdateGroup(groupId)
  const removePersonMutation = useRemovePersonFromGroup()
  const addPersonMutation = useAddPersonToGroup()

  // Form states
  const [contactInfo, setContactInfo] = useState('')
  const [description, setDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removingPersonId, setRemovingPersonId] = useState<string | null>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [addingPerson, setAddingPerson] = useState(false)

  // Initialize form when group loads
  useState(() => {
    if (group) {
      setContactInfo(group.contact_info || '')
      setDescription(group.description || '')
    }
  })

  const handleStartEdit = () => {
    if (group) {
      setContactInfo(group.contact_info || '')
      setDescription(group.description || '')
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateGroupMutation.mutateAsync({
        contact_info: contactInfo || undefined,
        description: description || undefined,
      })
      setIsEditing(false)
      await refetch()
    } catch (err) {
      console.error('Error saving group:', err)
      alert('Error al guardar el grupo')
    } finally {
      setSaving(false)
    }
  }

  const handleRemovePerson = async (personId: string) => {
    if (!confirm('¿Eliminar esta persona del grupo?')) return

    setRemovingPersonId(personId)
    try {
      await removePersonMutation.mutateAsync({ groupId, personId })
      await refetch()
    } catch (err) {
      console.error('Error removing person:', err)
      alert('Error al eliminar la persona del grupo')
    } finally {
      setRemovingPersonId(null)
    }
  }

  const handleAddPerson = async () => {
    if (!selectedPersonId) {
      alert('Selecciona una persona')
      return
    }

    setAddingPerson(true)
    try {
      await addPersonMutation.mutateAsync({ groupId, personId: selectedPersonId })
      setShowAddPerson(false)
      setSelectedPersonId('')
      await refetch()
    } catch (err) {
      console.error('Error adding person:', err)
      alert('Error al agregar la persona al grupo')
    } finally {
      setAddingPerson(false)
    }
  }

  // Filter persons not already in group
  const availablePersons = allPersons.filter(
    (p) => !group?.person?.some((gp) => gp.id === p.id)
  )

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando grupo...</span>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error al cargar el grupo</p>
        <a href="/groups" className="mt-4 text-green-600 hover:underline">Volver al listado</a>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <a href="/groups" className="p-2 rounded-lg hover:bg-gray-200">
            <ArrowLeft size={24} />
          </a>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>
              {group.name}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#edfff2', color: '#00932c' }}
              >
                {group.total_people} personas
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Group Info Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Users size={20} />
                Información del Grupo
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} style={{ backgroundColor: '#00bf35' }}>
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label>Información de Contacto</Label>
                    <Input
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="mt-1"
                      placeholder="Nombre del contacto principal"
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="Descripción del grupo..."
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="font-medium">{group.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Personas</p>
                    <p className="font-medium">{group.total_people}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Contacto</p>
                    <p className="font-medium">{group.contact_info || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Descripción</p>
                    <p className="text-sm">{group.description || '-'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Persons Card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <User size={20} />
                Personas del Grupo ({group.person?.length || 0})
              </CardTitle>
              {!showAddPerson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPerson(true)}
                  className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
                >
                  <UserPlus size={16} />
                  Agregar Persona
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Person Form */}
              {showAddPerson && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-green-800">Agregar persona al grupo</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddPerson(false)
                          setSelectedPersonId('')
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
                        {addingPerson ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                      </Button>
                    </div>
                  </div>
                  <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar persona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePersons.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.first_name} {person.last_name} - {person.email || person.phone_number || 'Sin contacto'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availablePersons.length === 0 && (
                    <p className="text-xs text-gray-500">No hay más personas disponibles para agregar</p>
                  )}
                </div>
              )}

              {/* Persons List */}
              {group.person && group.person.length > 0 ? (
                <div className="space-y-3">
                  {group.person.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 bg-white border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User size={18} style={{ color: '#00932c' }} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {person.first_name} {person.last_name}
                            {person.is_generic && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                Temporal
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {person.email && (
                              <span className="flex items-center gap-1">
                                <Mail size={12} /> {person.email}
                              </span>
                            )}
                            {person.phone_number && (
                              <span className="flex items-center gap-1">
                                <Phone size={12} /> {person.phone_number}
                              </span>
                            )}
                            {person.nationality && (
                              <span className="px-2 py-0.5 rounded bg-gray-100">{person.nationality}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/persons/${person.id}`}
                          className="px-3 py-1 text-sm rounded border hover:bg-gray-50 transition"
                        >
                          Ver
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePerson(person.id)}
                          disabled={removingPersonId === person.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {removingPersonId === person.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <UserMinus size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User size={40} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No hay personas en este grupo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
                <Users size={20} />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700 mb-1">Total de Personas</p>
                <p className="text-3xl font-bold" style={{ color: '#00932c' }}>{group.total_people}</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <a
                  href="/groups"
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

