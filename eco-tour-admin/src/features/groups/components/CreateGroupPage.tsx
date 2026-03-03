import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateGroup } from '../hooks/useGroupMutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Users, Loader2, Save } from 'lucide-react'
export const CreateGroupPage = () => {
  const navigate = useNavigate()
  const createGroupMutation = useCreateGroup()
  const [contactInfo, setContactInfo] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const handleCreate = async () => {
    setSaving(true)
    try {
      const newGroup = await createGroupMutation.mutateAsync({
        contact_info: contactInfo || undefined,
        description: description || undefined,
      })
      navigate({ to: '/groups/$id', params: { id: newGroup.id } })
    } catch (err) {
      console.error('Error creating group:', err)
      alert('Error al crear el grupo')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <div className="flex items-center gap-4 mb-8">
        <a href="/groups" className="p-2 rounded-lg hover:bg-gray-200">
          <ArrowLeft size={24} />
        </a>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>Crear Nuevo Grupo</h1>
          <p className="text-gray-500 mt-1">Ingresa los datos del nuevo grupo</p>
        </div>
      </div>
      <div className="max-w-2xl">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#085f24' }}>
              <Users size={20} />
              Información del Grupo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_info">Información de Contacto</Label>
              <Input id="contact_info" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="mt-1" placeholder="Nombre del contacto principal" />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={4} placeholder="Descripción del grupo (opcional)" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <a href="/groups" className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition">Cancelar</a>
              <Button onClick={handleCreate} disabled={saving} style={{ backgroundColor: '#00bf35' }}>
                {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                Crear Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
